#!/usr/bin/env python3
"""Validate the Python coding-practice problems in site/content/problems/*.js.

1. Loads every problem file with Node (vm context with a stub CS.registerProblems).
2. Checks the schema: required fields, unique kebab-case ids, topic exists in sections.js,
   difficulty 1-3, at least 3 tests with at least 1 visible and 1 hidden, valid `match`/`files`.
3. Runs every model `solution` against every test with exactly the semantics the browser
   runner uses, and checks every one passes:
     - a fresh Python process per test, working directory containing exactly the problem's `files`;
     - builtins.input is replaced: each call returns the next line of test.input (split on "\\n";
       a trailing newline does not create an extra empty line); prompts are swallowed (not output);
       running out of lines raises EOFError;
     - program = solution + "\\n" + test.code (if present); 2-second time limit;
     - "lines" (default): stdout and expect split into lines, each rstripped, trailing empty lines
       dropped, then compared exactly; "contains": each non-empty expect line must appear in stdout,
       in order.
   An uncaught exception or a non-zero exit status fails the test.
4. If a `starter` is given, it must FAIL at least one test.

Run:  python3 scripts/check_problems.py              all problems
      python3 scripts/check_problems.py digit-sum    only the problems whose id contains "digit-sum"
Exit code 1 if anything fails.
"""
import json, os, re, subprocess, sys, pathlib, tempfile, time
from concurrent.futures import ThreadPoolExecutor

SITE = pathlib.Path(__file__).resolve().parent.parent / "site"
PROBLEM_DIR = SITE / "content" / "problems"
TIME_LIMIT = 2.0

NODE_SCRIPT = r"""
const vm = require("vm"), fs = require("fs"), path = require("path");
const site = process.env.SITE_ROOT;
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
const out = { topics: [], problems: [], errors: [] };
try {
  vm.runInContext(fs.readFileSync(path.join(site, "content", "sections.js"), "utf8"), ctx, { filename: "sections.js" });
  out.topics = ctx.CS.sections.flatMap((s) => s.topics.map((t) => t.id));
} catch (e) { out.errors.push("sections.js: " + e.message); }
const dir = path.join(site, "content", "problems");
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort() : [];
for (const f of files) {
  ctx.CS = ctx.CS || {};
  let current = f;
  ctx.CS.registerProblems = (list) => {
    if (!Array.isArray(list)) { out.errors.push(current + ": registerProblems expects an array"); return; }
    list.forEach((p, i) => out.problems.push({ file: current, index: i, p }));
  };
  try { vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f }); }
  catch (e) { out.errors.push(f + ": " + e.message); }
}
out.files = files;
console.log(JSON.stringify(out));
"""

# The wrapper that runs one program with input() patched. Kept in sync with the browser runner.
WRAPPER = r'''
import builtins, sys
prog_path, input_path = sys.argv[1], sys.argv[2]
with open(input_path, encoding="utf-8") as f:
    data = f.read()
lines = [] if data == "" else data.split("\n")
if data.endswith("\n"):
    lines.pop()
_it = iter(lines)
def _input(prompt=""):
    try:
        return next(_it)
    except StopIteration:
        raise EOFError("EOF when reading a line (the program asked for more input than the test provides)")
builtins.input = _input
with open(prog_path, encoding="utf-8") as f:
    src = f.read()
sys.argv = ["main.py"]
exec(compile(src, "main.py", "exec"), {"__name__": "__main__", "__builtins__": builtins})
'''

ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
PROBLEM_KEYS = {"id", "title", "topic", "difficulty", "task", "starter", "tests", "files", "match", "hints", "solution", "explain"}
REQUIRED = ["id", "title", "topic", "difficulty", "task", "tests", "hints", "solution", "explain"]
TEST_KEYS = {"name", "input", "code", "expect", "hidden"}
ALLOWED_IMPORTS = {"math", "random", "string"}


def norm_lines(s):
    lines = [l.rstrip() for l in s.split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return lines


def compare(actual, expect, match):
    if match == "contains":
        pos = 0
        for line in expect.split("\n"):
            line = line.rstrip()
            if not line:
                continue
            i = actual.find(line, pos)
            if i < 0:
                return False
            pos = i + len(line)
        return True
    return norm_lines(actual) == norm_lines(expect)


def clip(s, n=400):
    r = repr(s)
    return r if len(r) <= n else r[:n] + "... (%d characters)" % len(s)


def run_one(code, test, files, workroot):
    """Run `code` (+ test.code) for one test. Returns (passed, detail)."""
    program = code + ("\n" + test["code"] if test.get("code") else "")
    with tempfile.TemporaryDirectory(dir=workroot) as base:
        base = pathlib.Path(base)
        cwd = base / "cwd"; cwd.mkdir()
        for name, content in (files or {}).items():
            (cwd / name).write_text(content, encoding="utf-8")
        prog = base / "main.py"; prog.write_text(program, encoding="utf-8")
        inp = base / "input.txt"; inp.write_text(test.get("input", ""), encoding="utf-8")
        wrapper = base / "wrapper.py"; wrapper.write_text(WRAPPER, encoding="utf-8")
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONHASHSEED="0")
        try:
            r = subprocess.run([sys.executable, "-I", str(wrapper), str(prog), str(inp)], cwd=cwd,
                               capture_output=True, text=True, timeout=TIME_LIMIT, env=env)
        except subprocess.TimeoutExpired:
            return False, "timed out (over %.0f s)" % TIME_LIMIT
        if r.returncode != 0:
            return False, "error: " + (r.stderr.strip().split("\n")[-1] if r.stderr.strip() else "exit status %d" % r.returncode)
        if compare(r.stdout, test["expect"], test.get("match")):
            return True, ""
        return False, "wrong output\n        expected: %s\n        actual:   %s" % (clip("\n".join(norm_lines(test["expect"]))), clip("\n".join(norm_lines(r.stdout))))


def check_schema(p, where, topics, err, warn):
    for k in REQUIRED:
        if k not in p:
            err(f"{where}: missing required field '{k}'")
    for k in p:
        if k not in PROBLEM_KEYS:
            err(f"{where}: unknown field '{k}'")
    pid = p.get("id")
    if not isinstance(pid, str) or not ID_RE.match(pid):
        err(f"{where}: id {pid!r} must be lowercase kebab-case (a-z, 0-9, hyphens, no dots)")
    for k in ["title", "task", "solution", "explain"]:
        if k in p and (not isinstance(p[k], str) or not p[k].strip()):
            err(f"{where}: '{k}' must be a non-empty string")
    if "starter" in p and not isinstance(p["starter"], str):
        err(f"{where}: 'starter' must be a string")
    if p.get("topic") not in topics:
        err(f"{where}: topic {p.get('topic')!r} is not in sections.js")
    if p.get("difficulty") not in (1, 2, 3):
        err(f"{where}: difficulty must be 1, 2 or 3")
    if p.get("match", "lines") not in ("lines", "contains"):
        err(f"{where}: match must be 'lines' or 'contains'")
    files = p.get("files", {})
    if not isinstance(files, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in files.items()):
        err(f"{where}: files must map file names to strings")
    elif any("/" in k or "\\" in k or k.startswith(".") for k in files):
        err(f"{where}: file names must be plain names (no folders)")
    hints = p.get("hints")
    if not isinstance(hints, list) or not hints or not all(isinstance(h, str) and h.strip() for h in hints):
        err(f"{where}: hints must be a non-empty list of strings")
    tests = p.get("tests")
    if not isinstance(tests, list):
        err(f"{where}: tests must be a list"); return
    if len(tests) < 3:
        err(f"{where}: needs at least 3 tests (has {len(tests)})")
    names = set()
    for i, t in enumerate(tests):
        tw = f"{where} test {i + 1}"
        if not isinstance(t, dict):
            err(f"{tw}: must be an object"); continue
        for k in t:
            if k not in TEST_KEYS:
                err(f"{tw}: unknown field '{k}'")
        if not isinstance(t.get("name"), str) or not t["name"].strip():
            err(f"{tw}: needs a name")
        elif t["name"] in names:
            warn(f"{tw}: duplicate test name {t['name']!r}")
        else:
            names.add(t["name"])
        if not isinstance(t.get("expect"), str):
            err(f"{tw}: 'expect' must be a string")
        for k in ("input", "code"):
            if k in t and not isinstance(t[k], str):
                err(f"{tw}: '{k}' must be a string")
        if "hidden" in t and not isinstance(t["hidden"], bool):
            err(f"{tw}: 'hidden' must be true or false")
        if p.get("match", "lines") == "contains" and isinstance(t.get("expect"), str) and not t["expect"].strip():
            err(f"{tw}: an empty 'expect' always passes with match 'contains'")
    vis = sum(1 for t in tests if isinstance(t, dict) and not t.get("hidden"))
    hid = sum(1 for t in tests if isinstance(t, dict) and t.get("hidden"))
    if vis < 1: err(f"{where}: needs at least one visible test")
    if hid < 1: err(f"{where}: needs at least one hidden test")
    for src_name in ("solution", "starter"):
        src = p.get(src_name)
        if isinstance(src, str):
            for m in re.finditer(r"^\s*(?:import|from)\s+([A-Za-z_]\w*)", src, re.M):
                if m.group(1) not in ALLOWED_IMPORTS:
                    warn(f"{where}: {src_name} imports '{m.group(1)}' (check it exists in Pyodide and is needed)")
            try:
                compile(src, src_name, "exec")
            except SyntaxError as e:
                err(f"{where}: {src_name} has a syntax error: {e}")


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else ""
    res = subprocess.run(["node", "-e", NODE_SCRIPT], capture_output=True, text=True, env=dict(os.environ, SITE_ROOT=str(SITE)))
    if res.returncode != 0:
        print("node failed:", res.stderr[:2000]); sys.exit(1)
    data = json.loads(res.stdout.strip().splitlines()[-1])
    errors = list(data["errors"]); warnings = []
    err, warn = errors.append, warnings.append
    topics = set(data["topics"])
    if not data["files"]:
        print("No problem files found in", PROBLEM_DIR); sys.exit(1)

    seen = {}
    problems = []
    for entry in data["problems"]:
        p = entry["p"]
        where = f"{entry['file']}[{entry['index']}] {p.get('id', '?')}" if isinstance(p, dict) else f"{entry['file']}[{entry['index']}]"
        if not isinstance(p, dict):
            err(f"{where}: problem must be an object"); continue
        check_schema(p, where, topics, err, warn)
        pid = p.get("id")
        if pid in seen:
            err(f"{where}: duplicate id (also in {seen[pid]})")
        seen[pid] = entry["file"]
        problems.append((entry["file"], p))

    # Run solutions and starters.
    jobs = []
    for file, p in problems:
        if only and only not in str(p.get("id")):
            continue
        tests = p.get("tests") if isinstance(p.get("tests"), list) else []
        for i, t in enumerate(tests):
            if not isinstance(t, dict) or not isinstance(t.get("expect"), str):
                continue
            t = dict(t, match=p.get("match", "lines"))
            if isinstance(p.get("solution"), str):
                jobs.append(("solution", p, i, t))
            if isinstance(p.get("starter"), str):
                jobs.append(("starter", p, i, t))
    t0 = time.time()
    workroot = tempfile.mkdtemp(prefix="check_problems_")
    with ThreadPoolExecutor(max_workers=max(2, (os.cpu_count() or 2))) as ex:
        results = list(ex.map(lambda j: (j, run_one(j[1][j[0]], j[3], j[1].get("files"), workroot)), jobs))
    try:
        os.rmdir(workroot)
    except OSError:
        pass

    ran = sol_pass = 0
    starter_fail = {}
    for (kind, p, i, t), (ok, detail) in results:
        if kind == "solution":
            ran += 1
            if ok:
                sol_pass += 1
            else:
                err(f"{p['id']}: solution FAILS test {i + 1} ({t.get('name')}): {detail}")
        else:
            starter_fail.setdefault(p["id"], False)
            if not ok:
                starter_fail[p["id"]] = True
    for pid, failed in starter_fail.items():
        if not failed:
            err(f"{pid}: starter code passes every test (it must fail at least one)")

    # Summary.
    by_diff = {1: 0, 2: 0, 3: 0}; by_topic = {}; by_file = {}
    for file, p in problems:
        if p.get("difficulty") in by_diff: by_diff[p["difficulty"]] += 1
        by_topic[p.get("topic")] = by_topic.get(p.get("topic"), 0) + 1
        by_file[file] = by_file.get(file, 0) + 1
    ntests = sum(len(p["tests"]) for _, p in problems if isinstance(p.get("tests"), list))
    for w in warnings: print("WARN ", w)
    for e in errors: print("ERROR", e)
    print()
    print(f"Problems: {len(problems)} in {len(data['files'])} files  ({', '.join(f'{f} {n}' for f, n in sorted(by_file.items()))})")
    print(f"Difficulty: warm-up {by_diff[1]} · standard {by_diff[2]} · stretch {by_diff[3]}")
    def topic_key(t):
        a, _, b = str(t).partition(".")
        return (not a.isdigit(), int(a) if a.isdigit() else 0, a, int(b) if b.isdigit() else 0)
    print("Topics: " + ", ".join(f"{t} ×{n}" for t, n in sorted(by_topic.items(), key=lambda kv: topic_key(kv[0]))))
    print(f"Tests: {ntests} · solution runs passed {sol_pass}/{ran} · starters checked {len(starter_fail)} · {time.time() - t0:.1f}s")
    print(f"{len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
