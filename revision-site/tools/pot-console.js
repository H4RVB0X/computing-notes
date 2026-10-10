/* pot-console — faithful JavaScript port of the AQA 2027 Paper 1 skeleton program "Piles O' Tiles".
   The engine is a generator-based port: every Python input() becomes a `yield prompt`, so the same
   engine drives the on-page console and the headless differential tests (tool.engine.Session).
   All original bugs are reproduced on purpose; the optional toggles apply the model-answer fixes. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ Python helpers */
  function PyError(type, message) {
    this.pyType = type;
    this.message = message;
  }
  const MAX_SSIZE = 9223372036854775807n;
  const ndRe = /^\p{Nd}$/u;

  function pyRepr(s) {
    const q = s.indexOf("'") !== -1 && s.indexOf('"') === -1 ? '"' : "'";
    let out = "";
    for (const ch of s) {
      const c = ch.codePointAt(0);
      if (ch === "\\") out += "\\\\";
      else if (ch === q) out += "\\" + q;
      else if (ch === "\n") out += "\\n";
      else if (ch === "\r") out += "\\r";
      else if (ch === "\t") out += "\\t";
      else if (c < 0x20 || (c >= 0x7f && c < 0xa0)) out += "\\x" + c.toString(16).padStart(2, "0");
      else out += ch;
    }
    return q + out + q;
  }

  function digitValue(ch) {
    if (ch >= "0" && ch <= "9") return ch.charCodeAt(0) - 48;
    if (!ndRe.test(ch)) return -1;
    let cp = ch.codePointAt(0);
    let start = cp;
    while (ndRe.test(String.fromCodePoint(start - 1))) start--;
    return (cp - start) % 10;
  }

  /* int(s) for a str argument, base 10. Returns a Number, or a BigInt when it is too big to be exact. */
  function pyInt(s) {
    const bad = () => new PyError("ValueError", "invalid literal for int() with base 10: " + pyRepr(s));
    const t = s.replace(/^[\s\u001c-\u001f\u0085]+|[\s\u001c-\u001f\u0085]+$/gu, "").replace(/^﻿|﻿$/g, (m) => m);
    if (/﻿/.test(t)) throw bad();
    let i = 0;
    let neg = false;
    const chars = Array.from(t);
    if (chars[0] === "+" || chars[0] === "-") {
      neg = chars[0] === "-";
      i = 1;
    }
    if (i >= chars.length) throw bad();
    let digits = "";
    let prevUnderscore = true; // disallow a leading underscore
    for (; i < chars.length; i++) {
      const ch = chars[i];
      if (ch === "_") {
        if (prevUnderscore) throw bad();
        prevUnderscore = true;
        continue;
      }
      const d = digitValue(ch);
      if (d < 0) throw bad();
      digits += d;
      prevUnderscore = false;
    }
    if (prevUnderscore) throw bad();
    let v = BigInt(digits);
    if (neg) v = -v;
    if (v <= BigInt(Number.MAX_SAFE_INTEGER) && v >= -BigInt(Number.MAX_SAFE_INTEGER)) return Number(v);
    return v;
  }
  const num = (v) => (typeof v === "bigint" ? Number(v) : v);
  function norm(v) {
    if (typeof v === "bigint" && v <= BigInt(Number.MAX_SAFE_INTEGER) && v >= -BigInt(Number.MAX_SAFE_INTEGER)) return Number(v);
    return v;
  }
  function pyGet(list, i) {
    if (typeof i === "bigint") {
      if (i > MAX_SSIZE || i < -MAX_SSIZE - 1n) throw new PyError("IndexError", "cannot fit 'int' into an index-sized integer");
      i = Number(i);
    }
    if (i < 0) i += list.length;
    if (i < 0 || i >= list.length) throw new PyError("IndexError", "list index out of range");
    return list[i];
  }

  /* ------------------------------------------------------------------ classes from the skeleton */
  class Tile {
    constructor(S, P) { this._Symbol = S; this._Points = P; }
    GetPoints() { return this._Points; }
    GetSymbol() { return this._Symbol; }
  }
  class Player {
    constructor(N, S) { this._Name = N; this._Score = S; }
    GetScore() { return this._Score; }
    GetName() { return this._Name; }
    ChangeScore(Change) { this._Score += Change; }
  }
  class Pile {
    constructor(M, B) { this._Tiles = []; this._Max = M; this._Bonus = B; }
    Add(T) { if (this._Tiles.length < this._Max) this._Tiles.unshift(T); }
    GetSymbolOfTopTile() { return pyGet(this._Tiles, 0).GetSymbol(); }
    Remove() { const Temp = pyGet(this._Tiles, 0); this._Tiles.shift(); return Temp; }
    Empty() { return this._Tiles.length === 0; }
    GetNumberOfTiles() { return this._Tiles.length; }
    GetBonus() { return this._Bonus; }
    GetSaveString() {
      let Line = String(this._Bonus);
      for (const T of this._Tiles) Line += "," + T.GetSymbol() + "," + T.GetPoints();
      return Line;
    }
  }

  /* ------------------------------------------------------------------ the program */
  function Program(files, toggles, write) {
    const T = toggles || {};
    const print = (s, end) => write((s === undefined ? "" : String(s)) + (end === undefined ? "\n" : end));
    const self = { game: null, phase: "start", files: files };

    function LoadGame(FileName) {
      let Board = [], Players = [], Discard = [];
      let MaxScore = 0, WhoseTurn = 0, TurnsSinceMatch = 0;
      try {
        if (!Object.prototype.hasOwnProperty.call(files, FileName)) throw new PyError("FileNotFoundError", "[Errno 2] No such file or directory: " + pyRepr(FileName));
        const text = files[FileName].replace(/\r\n?/g, "\n");
        let pos = 0;
        const readline = () => {
          if (pos >= text.length) return "";
          const nl = text.indexOf("\n", pos);
          const line = nl === -1 ? text.slice(pos) : text.slice(pos, nl + 1);
          pos = nl === -1 ? text.length : nl + 1;
          return line;
        };
        let LineFromFile = readline();
        const BoardSize = num(pyInt(LineFromFile));
        for (let i = 1; i < BoardSize + 1; i++) {
          LineFromFile = readline();
          const Items = LineFromFile.split(",");
          const PileSize = Math.floor(Items.length / 2);
          const P = new Pile(PileSize, num(pyInt(Items[0])));
          for (let TileNo = Items.length - 2; TileNo > -1; TileNo -= 2) P.Add(new Tile(Items[TileNo], num(pyInt(Items[TileNo + 1]))));
          Board.push(P);
        }
        LineFromFile = readline();
        const NoOfPlayers = num(pyInt(LineFromFile));
        for (let i = 1; i < NoOfPlayers + 1; i++) {
          LineFromFile = readline();
          const Items = LineFromFile.split(",");
          Players.push(new Player(Items[0], num(pyInt(pyGet(Items, 1)))));
        }
        LineFromFile = readline();
        const Items = LineFromFile.split(",");
        for (let i = 0; i < Items.length - 1; i += 2) Discard.push(new Tile(Items[i], num(pyInt(Items[i + 1]))));
        MaxScore = num(pyInt(readline()));
        WhoseTurn = norm(pyInt(readline()));
        TurnsSinceMatch = num(pyInt(readline()));
      } catch (e) {
        if (!(e instanceof PyError)) throw e;
        print("File not loaded");
        return [false, Board, Players, Discard, MaxScore, WhoseTurn, TurnsSinceMatch];
      }
      return [true, Board, Players, Discard, MaxScore, WhoseTurn, TurnsSinceMatch];
    }

    class Game {
      constructor(B, P, D, WT, MS, TSM) {
        this.Board = B; this.Players = P; this.Discard = D; this.WhoseTurn = WT;
        this.MaxScore = MS; this.TurnsSinceMatch = TSM; this.GameOver = false;
        this.GridSize = Math.floor(Math.sqrt(this.Board.length));
      }
      *PlayGame() {
        while (this.GameOver === false) {
          let Choice = "";
          while (Choice !== "T") {
            this.DisplayMenu();
            Choice = yield* this.GetChoice();
            if (Choice === "B") this.DisplayBoard();
            else if (Choice === "D") this.DisplayDiscard();
            else if (Choice === "S") this.DisplayScores();
            else if (T.peek && Choice === "P") yield* this.Peek();
            else if (T.save && Choice === "V") yield* this.SaveGame();
          }
          const Pile1 = yield* this.ChoosePile();
          let Pile2 = yield* this.ChoosePile();
          while (Pile1 == Pile2) Pile2 = yield* this.ChoosePile(); // == compares Number/BigInt by value, like Python ints
          let Matched = false;
          this.TurnsSinceMatch += 1;
          const B = this.Board;
          if (pyGet(B, Pile1).Empty() === false && pyGet(B, Pile2).Empty() === false) {
            if (pyGet(B, Pile1).GetSymbolOfTopTile() === pyGet(B, Pile2).GetSymbolOfTopTile()) {
              this.TurnsSinceMatch = 0;
              Matched = true;
              const Tile1 = pyGet(B, Pile1).Remove();
              const Tile2 = pyGet(B, Pile2).Remove();
              this.Discard.push(Tile1);
              this.Discard.push(Tile2);
              let ScoreIncrease = 0;
              ScoreIncrease += Tile1.GetPoints() + Tile2.GetPoints();
              if (T.bonus) ScoreIncrease += pyGet(B, Pile1).GetBonus() + pyGet(B, Pile2).GetBonus();
              pyGet(this.Players, this.WhoseTurn).ChangeScore(ScoreIncrease);
              print(pyGet(this.Players, this.WhoseTurn).GetName() + ", you had two matching " + Tile1.GetSymbol() + " tiles; your score has increased by " + ScoreIncrease);
            } else {
              print("You did not find a matching pair.");
              print("The first pile you chose had a " + pyGet(B, Pile1).GetSymbolOfTopTile());
              print("The second pile you chose had a " + pyGet(B, Pile2).GetSymbolOfTopTile());
            }
          } else {
            print("You chose an empty pile");
          }
          print();
          if (T.extra && Matched) print(pyGet(this.Players, this.WhoseTurn).GetName() + " found a pair and takes another turn");
          else this.UpdateWhoseTurn();
          if (T.stalemate && this.TurnsSinceMatch >= 10) {
            print("No match in the last 10 turns - the game is over");
            this.GameOver = true;
          } else {
            this.GameOver = this.MaxScoreReached() || this.NoMoreTilesLeft();
          }
        }
        if (T.winner) {
          let HighScore = pyGet(this.Players, 0).GetScore();
          for (const P of this.Players) if (P.GetScore() > HighScore) HighScore = P.GetScore();
          const Winners = [];
          for (const P of this.Players) if (P.GetScore() === HighScore) Winners.push(P.GetName());
          if (Winners.length === 1) print(Winners[0] + " has won!");
          else print("It is a draw between " + Winners.join(" and ") + " on " + HighScore + " points");
        } else {
          if (pyGet(this.Players, 0).GetScore() > pyGet(this.Players, 1).GetScore()) print(pyGet(this.Players, 0).GetName() + " has won!");
          else if (pyGet(this.Players, 1).GetScore() > pyGet(this.Players, 0).GetScore()) print(pyGet(this.Players, 1).GetName() + " has won!");
        }
      }
      *Peek() {
        const CurrentPlayer = pyGet(this.Players, this.WhoseTurn);
        if (CurrentPlayer.GetScore() < 1) print("You need at least 1 point to peek");
        else {
          const PileNo = yield* this.ChoosePile();
          if (pyGet(this.Board, PileNo).Empty()) print("That pile is empty - no points taken");
          else {
            CurrentPlayer.ChangeScore(-1);
            print("The top tile is " + pyGet(this.Board, PileNo).GetSymbolOfTopTile());
          }
        }
      }
      *SaveGame() {
        const FileName = (yield "Enter filename to save to: ") + ".txt";
        if (/[\/\0]/.test(FileName)) throw new PyError("FileNotFoundError", "[Errno 2] No such file or directory: " + pyRepr(FileName));
        let s = this.Board.length + "\n";
        for (const P of this.Board) s += P.GetSaveString() + "\n";
        s += this.Players.length + "\n";
        for (const P of this.Players) s += P.GetName() + "," + P.GetScore() + "\n";
        let DiscardLine = "";
        for (const t of this.Discard) {
          if (DiscardLine !== "") DiscardLine += ",";
          DiscardLine += t.GetSymbol() + "," + t.GetPoints();
        }
        s += DiscardLine + "\n" + this.MaxScore + "\n" + this.WhoseTurn + "\n" + this.TurnsSinceMatch + "\n";
        files[FileName] = s;
        self.lastSaved = FileName;
        print("Game saved to " + FileName);
      }
      DisplayScores() {
        print();
        for (const P of this.Players) print(P.GetName() + ": has a score of " + P.GetScore());
        print();
      }
      DisplayMenu() {
        print(); print();
        print("MENU");
        print("B. Display the board");
        print("D. Display the discard");
        print("T. Take turn");
        print("S. Display scores");
        if (T.peek) print("P. Peek at a pile (costs 1 point)");
        if (T.save) print("V. Save game");
        print();
      }
      *GetChoice() {
        const prompt = () => pyGet(this.Players, this.WhoseTurn).GetName() + ", enter your choice: ";
        if (!T.menu) return yield prompt();
        const valid = ["B", "D", "T", "S"].concat(T.peek ? ["P"] : [], T.save ? ["V"] : []);
        let Choice = (yield prompt()).toUpperCase();
        while (valid.indexOf(Choice) === -1) {
          print("That is not a valid menu option");
          Choice = (yield prompt()).toUpperCase();
        }
        return Choice;
      }
      DisplayBoard() {
        for (let y = this.GridSize; y > 0; y--) {
          print(y + "|", "");
          for (let x = 1; x < this.GridSize + 1; x++) print(pyGet(this.Board, this.GetIndex(x, y)).GetNumberOfTiles(), "");
          print();
        }
        print("  ", "");
        for (let x = 1; x < this.GridSize + 1; x++) print("-", "");
        print();
        print("  ", "");
        for (let x = 1; x < this.GridSize + 1; x++) print(x, "");
        print();
      }
      DisplayDiscard() {
        print(); print();
        print("Discard: ", "");
        if (this.Discard.length === 0) print("Empty");
        else {
          print(this.Discard[0].GetSymbol(), "");
          let Count = 1;
          while (Count < this.Discard.length) {
            print(", " + this.Discard[Count].GetSymbol(), "");
            Count += 1;
          }
        }
        print(); print();
      }
      *ChoosePile() {
        let x = 0, y = 0;
        if (!T.validate) {
          x = pyInt(yield "Enter x coordinate: ");
          y = pyInt(yield "Enter y coordinate: ");
          return this.GetIndex(x, y);
        }
        let Valid = false;
        while (!Valid) {
          try {
            x = pyInt(yield "Enter x coordinate: ");
            y = pyInt(yield "Enter y coordinate: ");
            if (1 <= x && x <= this.GridSize && 1 <= y && y <= this.GridSize) Valid = true;
            else print("Coordinates must be between 1 and " + this.GridSize);
          } catch (e) {
            if (!(e instanceof PyError) || e.pyType !== "ValueError") throw e;
            print("Coordinates must be whole numbers");
          }
        }
        return this.GetIndex(x, y);
      }
      GetIndex(x, y) {
        if (typeof x === "bigint" || typeof y === "bigint") return norm(BigInt(x) - 1n + (BigInt(y) - 1n) * BigInt(this.GridSize));
        return x - 1 + (y - 1) * this.GridSize;
      }
      UpdateWhoseTurn() {
        const n = this.Players.length;
        if (n === 0) throw new PyError("ZeroDivisionError", "integer modulo by zero");
        if (typeof this.WhoseTurn === "bigint") this.WhoseTurn = norm((((this.WhoseTurn + 1n) % BigInt(n)) + BigInt(n)) % BigInt(n));
        else this.WhoseTurn = (((this.WhoseTurn + 1) % n) + n) % n;
      }
      NoMoreTilesLeft() {
        for (const P of this.Board) if (P.Empty() === false) return false;
        return true;
      }
      MaxScoreReached() {
        for (const P of this.Players) if (P.GetScore() >= this.MaxScore) return true;
        return false;
      }
    }

    function* Main() {
      let Board = [], Players = [], Discard = [];
      let TurnsSinceMatch = 0, WhoseTurn = 0, MaxScore = 10;
      const FILE_EXTENSION = ".txt";
      const FileName = (yield "Enter filename to load or just press Enter to play the default game: ") + FILE_EXTENSION;
      let UseDataFromFile = false;
      if (FileName !== FILE_EXTENSION) {
        [UseDataFromFile, Board, Players, Discard, MaxScore, WhoseTurn, TurnsSinceMatch] = LoadGame(FileName);
        if (UseDataFromFile === false) {
          print("Setting up default game");
          if (T.loadfix) {
            Board = []; Players = []; Discard = [];
            MaxScore = 10; WhoseTurn = 0; TurnsSinceMatch = 0;
          }
        }
      }
      if (UseDataFromFile === false) {
        Players.push(new Player("Player 1", 0));
        Players.push(new Player("Player 2", 0));
        for (let Count = 1; Count < 37; Count++) {
          const P = new Pile(3, 0);
          P.Add(new Tile("A", 1));
          P.Add(new Tile("B", 2));
          P.Add(new Tile("A", 1));
          Board.push(P);
        }
      }
      self.game = new Game(Board, Players, Discard, WhoseTurn, MaxScore, TurnsSinceMatch);
      self.phase = "play";
      yield* self.game.PlayGame();
      self.phase = "end";
      yield "";
    }
    self.gen = Main();
    return self;
  }

  /* A running program. write(text, kind) receives stdout ("out"), prompts ("prompt") and errors ("error"). */
  function Session(opts) {
    const write = opts.write || function () {};
    const prog = Program(opts.files, opts.toggles, (t) => write(t, "out"));
    const s = { finished: false, error: null, waiting: false, program: prog };
    function advance(val, err) {
      let r;
      s.waiting = false;
      try {
        r = err ? prog.gen.throw(err) : prog.gen.next(val);
      } catch (e) {
        s.finished = true;
        if (e instanceof PyError) {
          s.error = e;
          write("", "traceback");
          write(e.pyType + ": " + e.message, "error");
        } else {
          s.error = new PyError("InternalError", String((e && e.message) || e));
          write("Simulator error: " + s.error.message, "error");
        }
        return;
      }
      if (r.done) {
        s.finished = true;
        return;
      }
      s.waiting = true;
      write(r.value, "prompt");
    }
    s.start = () => advance(undefined);
    s.feed = (line) => { if (s.waiting) advance(String(line)); };
    s.eof = () => { if (s.waiting) advance(undefined, new PyError("EOFError", "EOF when reading a line")); };
    return s;
  }

  /* Run a whole scripted session and return the transcript in the same format as the Python harness. */
  function runScript(files, toggles, inputs) {
    let out = "", err = "";
    const s = Session({ files: Object.assign({}, files), toggles: toggles, write: (t, k) => { if (k === "error") err = t; else if (k !== "traceback") out += t; } });
    s.start();
    let i = 0;
    while (!s.finished) {
      if (i < inputs.length) s.feed(inputs[i++]);
      else s.eof();
    }
    return out + (err ? "\nSTDERR:" + err : "");
  }

  const GAME1 = "16\n2,A,1,E,1,H,3,J,2\n0,E,1,Q,4,K,4,J,2,J,2\n0,O,1,E,1,H,3\n0,O,1,E,1,H,3\n0,A,1,E,1,H,3\n0,A,1,H,1,H,3\n0,E,1,E,1,H,3\n0,A,1,Q,4,F,3\n0,U,1,E,1,H,3\n0,A,1,E,1,H,3\n4,U,5,E,1,K,4\n2,A,1,K,4,H,3\n0,A,1,E,1,K,1\n0,R,1,K,3,H,3\n0,R,1,F,3,K,7\n0,A,1,E,1,H,3\n2\nBoris,0\nPoppy,0\n\n15\n0\n0\n";

  const TOGGLES = [
    ["validate", "Validate coordinates (whole numbers, 1 to GridSize)"],
    ["menu", "Case-insensitive, validated menu choice"],
    ["winner", "Winner check works for draws and any number of players"],
    ["loadfix", "Failed load resets everything (fixes MaxScore = 0)"],
    ["extra", "Extra turn after finding a pair"],
    ["bonus", "Add both piles' bonus to the score"],
    ["stalemate", "Game ends after 10 turns without a match"],
    ["peek", "Menu option P: peek at a pile (costs 1 point)"],
    ["save", "Menu option V: save the game to a file"],
  ];

  /* ------------------------------------------------------------------ UI */
  CS.registerTool({
    id: "pot-console",
    title: "Piles O' Tiles console",
    section: "P",
    topic: "P.2",
    icon: "🀄",
    desc: "Play the AQA 2027 Paper 1 skeleton program in a Python-style console, see its internal state live, and switch on the practice modifications.",
    help: "This is a line-by-line JavaScript port of the **Piles O' Tiles** skeleton program, **bugs included**. Type into the input line and press **Enter**, exactly as you would at the Python prompt.\n\n- At the first prompt type `game1` to load the sample file, press Enter for the default game, or type any other name to see the *File not loaded* bug (MaxScore becomes 0, so the game ends after one turn).\n- The menu is case-sensitive, letters at the coordinate prompts crash the program with a `ValueError`, `x = 0` wraps round to the last pile, and a draw prints nothing. Predict, then try.\n- **Program state** shows the Python variables: each pile's `_Tiles` list (top tile first), `_Max` and `_Bonus`, the discard, the players and the `Game` attributes.\n- **Modifications** switch on model answers to the practice tasks. Changing them restarts the program.\n- **Game files** lets you write your own file (same format as `game1.txt`) and load it by name.",
    engine: { Session: Session, runScript: runScript, pyInt: pyInt, GAME1: GAME1, TOGGLES: TOGGLES },
    mount(el) {
      const h = CS.util.el;
      const files = { "game1.txt": GAME1 };
      const toggles = {};
      let session = null;
      const history = [];
      let histPos = 0;

      // ---- layout
      const controls = h("div", { class: "controls" });
      const restartBtn = h("button", { type: "button", class: "btn sm primary", text: "Restart program" });
      const clearBtn = h("button", { type: "button", class: "btn sm ghost", text: "Clear screen" });
      const quick = h("span", { class: "small muted", text: "Quick start:" });
      const qDefault = h("button", { type: "button", class: "btn sm", text: "Default game" });
      const qGame1 = h("button", { type: "button", class: "btn sm", text: "game1" });
      controls.append(restartBtn, clearBtn, quick, qDefault, qGame1);

      const term = h("div", { class: "pot-term", role: "log", "aria-live": "polite", "aria-label": "Program output", style: "background:var(--code-bg);color:var(--code-text);font-family:var(--font-mono);font-size:0.84rem;line-height:1.35;border-radius:10px;padding:10px 12px;height:420px;overflow:auto;white-space:pre;" });
      const screen = h("div");
      term.appendChild(screen);
      const inRow = h("form", { style: "display:flex;gap:6px;margin-top:6px;align-items:center" });
      const inBox = h("input", { type: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Program input (press Enter to submit)", placeholder: "type here, press Enter", style: "flex:1;min-width:0;font-family:var(--font-mono)" });
      const enterBtn = h("button", { type: "submit", class: "btn sm", text: "Enter ↵" });
      inRow.append(inBox, enterBtn);
      const status = h("div", { class: "stat-line" });
      const left = h("div", { style: "min-width:0" }, [term, inRow, status]);

      const statePanel = h("div", { class: "output", style: "white-space:normal;font-size:0.82rem;max-height:520px;overflow:auto" });
      const right = h("div", { style: "min-width:0" }, [h("div", { style: "font-weight:700;margin-bottom:6px", text: "Program state" }), statePanel]);
      const view = h("div", { class: "two-col" }, [left, right]);

      // modifications
      const modBox = h("details", { class: "collapse", style: "margin-top:12px" });
      modBox.appendChild(h("summary", { text: "Modifications (model answers) — all off = the real skeleton program" }));
      const modBody = h("div", { class: "collapse-body", style: "display:grid;gap:4px" });
      TOGGLES.forEach(([key, label]) => {
        const cb = h("input", { type: "checkbox" });
        cb.addEventListener("change", () => {
          toggles[key] = cb.checked;
          restart("Modification “" + label + "” " + (cb.checked ? "on" : "off") + ": program restarted.");
        });
        modBody.appendChild(h("label", { style: "display:flex;gap:8px;align-items:flex-start;font-size:0.88rem" }, [cb, h("span", { text: label })]));
      });
      modBox.appendChild(modBody);

      // files
      const fileBox = h("details", { class: "collapse", style: "margin-top:8px" });
      fileBox.appendChild(h("summary", { text: "Game files (load your own, view saved games)" }));
      const fileBody = h("div", { class: "collapse-body" });
      const fileList = h("div", { class: "stat-line" });
      const fname = h("input", { type: "text", value: "mygame", "aria-label": "File name (without .txt)", style: "width:140px" });
      const ftext = h("textarea", { rows: "10", spellcheck: "false", "aria-label": "File contents", style: "width:100%;font-family:var(--font-mono);font-size:0.82rem" });
      ftext.value = GAME1;
      const saveFile = h("button", { type: "button", class: "btn sm primary", text: "Save as file" });
      const loadNow = h("button", { type: "button", class: "btn sm", text: "Save and load it now" });
      const fileMsg = h("span", { class: "small" });
      const viewer = h("div", { class: "output", style: "display:none;margin-top:8px;max-height:260px;overflow:auto;white-space:pre" });
      fileBody.append(
        h("p", { class: "small muted", text: "Format: number of piles, one line per pile (bonus,symbol,points,… top tile first), number of players, one line per player (name,score), the discard line, MaxScore, WhoseTurn, TurnsSinceMatch." }),
        h("div", { class: "controls" }, [h("label", {}, ["Name ", fname, h("span", { text: ".txt" })]), saveFile, loadNow, fileMsg]),
        ftext,
        h("div", { style: "margin-top:8px;font-weight:600", text: "Files the program can open:" }),
        fileList,
        viewer
      );
      fileBox.appendChild(fileBody);

      el.append(controls, view, modBox, fileBox);

      // ---- terminal output
      function append(text, cls) {
        if (!text) return;
        const span = h("span", { text: text });
        if (cls) span.setAttribute("style", cls);
        screen.appendChild(span);
        term.scrollTop = term.scrollHeight;
      }
      function writer(t, kind) {
        if (kind === "out") append(t);
        else if (kind === "prompt") append(t, "color:#ffd479");
        else if (kind === "traceback") append("Traceback (most recent call last):\n  File \"skeleton.py\", …\n", "color:#ff9aa5");
        else if (kind === "error") append(t + "\n", "color:#ff7b86;font-weight:700");
        if (kind === "out" && session && session.program.lastSaved) {
          showFile(session.program.lastSaved);
          session.program.lastSaved = null;
          renderFiles();
        }
      }

      // ---- state panel
      function esc(s) { return CS.util.esc(String(s)); }
      function showStr(s) { return esc(JSON.stringify(String(s)).slice(1, -1)); }
      function renderState() {
        const p = session && session.program;
        const g = p && p.game;
        if (!g) {
          statePanel.innerHTML = "<div class='muted'>Main() is waiting for a filename. The Game object has not been created yet.</div>";
          return;
        }
        let html = "<div style='display:grid;grid-template-columns:auto 1fr;gap:2px 10px;font-family:var(--font-mono)'>";
        const kv = (k, v) => (html += "<span class='muted'>" + k + "</span><span>" + v + "</span>");
        kv("__GridSize", g.GridSize + " <span class='muted'>(int(sqrt(" + g.Board.length + ")))</span>");
        kv("__MaxScore", esc(g.MaxScore) + (g.MaxScore === 0 ? " <span class='err'>(bug: game ends after the first turn)</span>" : ""));
        kv("__WhoseTurn", esc(g.WhoseTurn));
        kv("__TurnsSinceMatch", esc(g.TurnsSinceMatch));
        kv("__GameOver", g.GameOver ? "True" : "False");
        html += "</div>";
        html += "<div style='margin-top:8px;font-weight:700'>__Players</div><ol start='0' style='margin:2px 0;padding-left:2.2em;font-family:var(--font-mono)'>";
        g.Players.forEach((pl, i) => {
          let turn = false;
          try { turn = pyGet(g.Players, g.WhoseTurn) === pl; } catch (e) { turn = false; }
          html += "<li" + (turn ? " style='font-weight:700'" : "") + ">" + showStr(pl._Name) + ": " + esc(pl._Score) + (turn ? " ◀ turn" : "") + "</li>";
        });
        html += "</ol>";
        html += "<div style='margin-top:6px'><b>__Discard</b> <span style='font-family:var(--font-mono)'>[" + g.Discard.map((t) => showStr(t._Symbol) + t._Points).join(", ") + "]</span></div>";
        html += "<div style='margin-top:8px;font-weight:700'>__Board <span class='muted' style='font-weight:400'>(tiles listed top first; index in brackets)</span></div>";
        const n = g.GridSize;
        if (n > 0) {
          html += "<div style='overflow-x:auto'><table style='border-collapse:collapse;font-family:var(--font-mono);font-size:0.78rem'>";
          for (let y = n; y > 0; y--) {
            html += "<tr><th style='padding:2px 4px'>" + y + "</th>";
            for (let x = 1; x <= n; x++) {
              const idx = x - 1 + (y - 1) * n;
              html += pileCell(g.Board[idx], idx);
            }
            html += "</tr>";
          }
          html += "<tr><th></th>";
          for (let x = 1; x <= n; x++) html += "<th style='padding:2px 4px'>" + x + "</th>";
          html += "</tr></table></div>";
        }
        if (g.Board.length > n * n) {
          html += "<div class='err' style='margin-top:6px'>" + (g.Board.length - n * n) + " pile(s) are outside the " + n + "×" + n + " grid and are never shown by DisplayBoard:</div><div style='display:flex;flex-wrap:wrap;gap:4px'>";
          for (let i = n * n; i < g.Board.length; i++) html += "<table style='border-collapse:collapse'><tr>" + pileCell(g.Board[i], i) + "</tr></table>";
          html += "</div>";
        }
        statePanel.innerHTML = html;
      }
      function pileCell(P, idx) {
        const tiles = P._Tiles.map((t, k) => "<div style='" + (k === 0 ? "font-weight:700" : "opacity:0.75") + "'>" + showStr(t._Symbol) + "<sub>" + esc(t._Points) + "</sub></div>").join("");
        return "<td style='border:1px solid var(--border);padding:3px 5px;vertical-align:top;min-width:44px;" + (P._Tiles.length ? "" : "opacity:0.5") + "'><div class='muted' style='font-size:0.68rem'>[" + idx + "] max " + esc(P._Max) + (P._Bonus ? " +" + esc(P._Bonus) : "") + "</div>" + (tiles || "<i>empty</i>") + "</td>";
      }

      // ---- files
      function renderFiles() {
        fileList.innerHTML = "";
        Object.keys(files).forEach((k) => {
          const b = h("button", { type: "button", class: "btn sm ghost", text: k });
          b.addEventListener("click", () => showFile(k));
          fileList.appendChild(b);
          fileList.appendChild(document.createTextNode(" "));
        });
      }
      function showFile(k) {
        viewer.style.display = "block";
        viewer.textContent = "── " + k + " ──\n" + files[k];
        fileBox.open = true;
      }
      function storeFile() {
        const n = fname.value.trim();
        if (!n || /[\/\\]/.test(n)) {
          fileMsg.className = "err small";
          fileMsg.textContent = "Enter a simple file name (no slashes).";
          return null;
        }
        const name = n.replace(/\.txt$/i, "") + ".txt";
        files[name] = ftext.value;
        fileMsg.className = "ok-text small";
        fileMsg.textContent = "Saved " + name + ". Type " + name.slice(0, -4) + " at the first prompt to load it.";
        renderFiles();
        return name.slice(0, -4);
      }
      saveFile.addEventListener("click", storeFile);
      loadNow.addEventListener("click", () => {
        const n = storeFile();
        if (n !== null) {
          restart();
          submit(n);
        }
      });

      // ---- running
      function updateStatus() {
        if (!session) return;
        if (session.finished) {
          status.innerHTML = session.error ? "<span class='err'>Program crashed with " + esc(session.error.pyType) + ".</span> Press Restart to run it again." : "<span class='ok-text'>Program finished.</span> Press Restart to run it again.";
          inBox.disabled = true;
          enterBtn.disabled = true;
        } else {
          const on = TOGGLES.filter(([k]) => toggles[k]).length;
          status.textContent = "Waiting for input (input() call). " + (on ? on + " modification(s) on." : "Unmodified skeleton program.");
          inBox.disabled = false;
          enterBtn.disabled = false;
        }
        renderState();
      }
      function restart(note) {
        screen.innerHTML = "";
        if (note) append("# " + note + "\n", "color:#8b93a7");
        session = Session({ files: files, toggles: Object.assign({}, toggles), write: writer });
        session.start();
        updateStatus();
      }
      function submit(line) {
        if (!session || session.finished) return;
        append(line + "\n", "color:#9fe0b5");
        if (line !== "") history.push(line);
        histPos = history.length;
        session.feed(line);
        updateStatus();
      }
      inRow.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = inBox.value;
        inBox.value = "";
        submit(v);
        inBox.focus();
      });
      inBox.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" && histPos > 0) { histPos--; inBox.value = history[histPos]; e.preventDefault(); }
        else if (e.key === "ArrowDown") { histPos = Math.min(history.length, histPos + 1); inBox.value = history[histPos] || ""; e.preventDefault(); }
      });
      restartBtn.addEventListener("click", () => restart());
      clearBtn.addEventListener("click", () => { screen.innerHTML = ""; });
      qDefault.addEventListener("click", () => { restart(); submit(""); });
      qGame1.addEventListener("click", () => { restart(); submit("game1"); });
      term.addEventListener("click", () => { if (!inBox.disabled && !window.getSelection().toString()) inBox.focus(); });

      renderFiles();
      restart();
    },
  });
})();
