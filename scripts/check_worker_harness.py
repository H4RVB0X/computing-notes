#!/usr/bin/env python3
"""Runs the Python harness from site/js/py-worker.js (the code that runs students' programs in the browser)
under real Python, so a broken edit to it fails CI instead of breaking code practice on the live site.

Checks: it parses; input() is fed line by line and prompts are left out of the checked output; check code
runs after the program; errors report the right line; exit(0) is fine and exit(1) fails; with eof_ok,
running out of input ends the program cleanly; files are provided.

Usage:  python3 scripts/check_worker_harness.py     (exit code 1 on failure)
"""
import json, os, pathlib, re, sys, tempfile

src = (pathlib.Path(__file__).resolve().parent.parent / "site" / "js" / "py-worker.js").read_text(encoding="utf-8")
m = re.search(r"const HARNESS = `(.*?)`;", src, re.S)
if not m:
    sys.exit("HARNESS not found in py-worker.js")
# evaluate the JS template literal's escapes exactly as the browser does (\\n is a real newline, \\\\ a backslash)
harness = re.sub(r"\\(.)", lambda e: {"n": "\n", "t": "\t"}.get(e.group(1), e.group(1)), m.group(1), flags=re.S)

os.chdir(tempfile.mkdtemp())
ns = {}
exec(compile(harness, "py-worker harness", "exec"), ns)
run = lambda code, stdin="", extra="", files=None, eof_ok=False: json.loads(ns["_cs_run"](code, stdin, extra, json.dumps(files or {}), eof_ok))

fails = 0
def check(name, got, want):
    global fails
    if got != want:
        fails += 1
        print(f"FAIL {name}: got {got!r}, want {want!r}")

r = run("n = int(input('How many? '))\nfor i in range(n):\n    print(i)", "3\n")
check("stdin and prompts", (r["out"], r["error"]), ("0\n1\n2\n", ""))
check("transcript shows prompt and input", r["transcript"].startswith("How many? 3\n"), True)
check("check code runs after the program", run("def f(x):\n    return x * 2", extra="print(f(21))")["out"], "42\n")
check("error line number", run("x = 1\ny = x / 0")["error"], "ZeroDivisionError on line 2: division by zero")
check("error in check code", "check code" in run("pass", extra="print(undefined_name)")["error"], True)
check("syntax error", run("print('a'")["error"].startswith("SyntaxError on line 1"), True)
check("exit(0) is fine", run("import sys\nprint('a')\nsys.exit(0)")["error"], "")
check("exit(1) fails", run("import sys\nsys.exit(1)")["error"], "The program exited with status 1")
check("running out of input fails", run("input()\ninput()", "x\n")["error"].startswith("EOFError"), True)
r = run("while True:\n    print(input('> '))", "a\nb\n", eof_ok=True)
check("eof_ok ends cleanly", (r["out"], r["error"]), ("a\nb\n", ""))
check("files are provided", run("print(open('d.txt').read().strip())", files={"d.txt": "hello\n"})["out"], "hello\n")
check("fresh state each run", run("print('x' in dir())")["out"], "False\n")

print(f"worker harness: {12 - fails}/12 checks passed")
sys.exit(1 if fails else 0)
