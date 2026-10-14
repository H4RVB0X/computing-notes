#!/usr/bin/env python3
"""Extract every ```python code block from the topic files and execute it.

Blocks that call input(), import unavailable modules, or are marked ```python nocheck
are skipped. A block whose last comment lines contain expected output like
"# 42" is not auto-compared (keep those as documentation), but any exception fails.\nIf a ```python block is immediately followed by an ```output block, stdout must match it\n(trailing spaces ignored; blocks using random are not compared).
Run:  python3 revision-site/dev/run_python_snippets.py [topic-id-filter]
"""
import re, subprocess, sys, pathlib, tempfile, os
ROOT = pathlib.Path(__file__).resolve().parent.parent
filt = sys.argv[1] if len(sys.argv) > 1 else ""
files = sorted((ROOT / "content" / "topics").glob("*.md.js"))
total = ok = skipped = 0
failures = []
for f in files:
    if filt and not f.name.startswith(filt): continue
    text = f.read_text(encoding="utf-8")
    for m in re.finditer(r"```python([^\n]*)\n([\s\S]*?)```(?:\s*```output[^\n]*\n([\s\S]*?)```)?", text):
        meta, code, expected = m.group(1).strip().lower(), m.group(2), m.group(3)
        total += 1
        if "nocheck" in meta or "input(" in code or "import tkinter" in code or "import pygame" in code:
            skipped += 1; continue
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False, dir=tempfile.gettempdir()) as tmp:
            tmp.write(code); path = tmp.name
        try:
            r = subprocess.run([sys.executable, "-I", path], capture_output=True, text=True, timeout=15, cwd=tempfile.gettempdir())
            if r.returncode != 0:
                failures.append((f.name, code.strip().split("\n")[0][:60], r.stderr.strip().split("\n")[-1][:300]))
            elif expected is not None and "random" not in code and [l.rstrip() for l in r.stdout.strip().splitlines()] != [l.rstrip() for l in expected.strip().splitlines()]:
                failures.append((f.name, code.strip().split("\n")[0][:60], "OUTPUT MISMATCH\n   expected: " + expected.strip()[:300].replace("\n", " | ") + "\n   actual:   " + r.stdout.strip()[:300].replace("\n", " | ")))
            else: ok += 1
        except subprocess.TimeoutExpired:
            failures.append((f.name, code.strip().split("\n")[0][:60], "TIMEOUT (infinite loop?)"))
        finally:
            os.unlink(path)
print(f"python blocks: {total}, ran OK: {ok}, skipped: {skipped}, failed: {len(failures)}")
for fn, first, msg in failures:
    print(f"FAIL {fn}: '{first}' -> {msg}")
sys.exit(1 if failures else 0)
