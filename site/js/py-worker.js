/* =====================================================================
   py-worker.js — runs students' Python in a Web Worker with Pyodide
   (a background thread, so an infinite loop can be stopped without freezing the page)
   Message in:  { id, code, input, extra, files }   (one run)
   Messages out: { type: "ready" } once Python has loaded, then { type: "result", id, out, transcript, error }
   Test semantics match scripts/check_problems.py: input() reads the next line of `input` and its prompt
   is not part of the checked output; `extra` (a test's check code) runs after the program.
   ===================================================================== */
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
importScripts(PYODIDE + "pyodide.js");

const HARNESS = `
import sys, io, builtins, os, json, shutil, traceback

_CS_DIR = "/home/pyodide/run"

def _cs_where(lineno, n_src):
    return "line %d" % lineno if lineno <= n_src else "the test's check code"

def _cs_run(src, stdin_text, extra, files_json):
    os.chdir("/home/pyodide")
    shutil.rmtree(_CS_DIR, ignore_errors=True)
    os.makedirs(_CS_DIR)
    os.chdir(_CS_DIR)
    for name, text in json.loads(files_json).items():
        with open(name, "w") as f:
            f.write(text)
    lines = stdin_text.split("\\n") if stdin_text else []
    if stdin_text.endswith("\\n"):
        lines = lines[:-1]
    feed = iter(lines)
    out, transcript = io.StringIO(), io.StringIO()

    class Tee:
        def write(self, s):
            out.write(s)
            transcript.write(s)
            return len(s)
        def flush(self):
            pass

    def fake_input(prompt=""):
        transcript.write(str(prompt))
        try:
            v = next(feed)
        except StopIteration:
            raise EOFError("the program asked for more input than was given")
        transcript.write(v + "\\n")
        return v

    n_src = src.count("\\n") + 1
    program = src + ("\\n" + extra if extra else "")
    saved = sys.stdout, builtins.input
    sys.stdout, builtins.input = Tee(), fake_input
    error = ""
    try:
        exec(compile(program, "<your code>", "exec"), {"__name__": "__main__"})
    except SystemExit:
        pass
    except SyntaxError as e:
        error = "SyntaxError on %s: %s" % (_cs_where(e.lineno or 0, n_src), e.msg)
    except BaseException as e:
        frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "<your code>"]
        where = (" on " + _cs_where(frames[-1].lineno, n_src)) if frames else ""
        error = "%s%s: %s" % (type(e).__name__, where, e)
    finally:
        sys.stdout, builtins.input = saved
        os.chdir("/home/pyodide")
    return json.dumps({"out": out.getvalue(), "transcript": transcript.getvalue(), "error": error})
`;

const ready = loadPyodide({ indexURL: PYODIDE }).then((py) => {
  py.runPython(HARNESS);
  self.postMessage({ type: "ready" });
  return py;
});
ready.catch((err) => self.postMessage({ type: "failed", error: String(err) }));

self.onmessage = async (e) => {
  const m = e.data;
  const py = await ready;
  try {
    const res = JSON.parse(py.globals.get("_cs_run")(m.code, m.input || "", m.extra || "", JSON.stringify(m.files || {})));
    self.postMessage(Object.assign({ type: "result", id: m.id }, res));
  } catch (err) {
    self.postMessage({ type: "result", id: m.id, out: "", transcript: "", error: String(err) });
  }
};
