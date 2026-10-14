/* =====================================================================
   highlight.js — tiny regex syntax highlighter (no dependencies)
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const esc = (s) => CS.util.esc(s);

  const KW = {
    python: "def return if elif else for while in not and or is None True False import from as class pass break continue try except finally raise with lambda yield global nonlocal assert del print input len range int str float bool list dict set tuple open".split(" "),
    pseudocode: "IF THEN ELSE ELSEIF ENDIF ENDFOR ENDWHILE WHILE FOR TO STEP NEXT REPEAT UNTIL DO OUTPUT INPUT RETURN SUBROUTINE ENDSUBROUTINE FUNCTION ENDFUNCTION PROCEDURE ENDPROCEDURE CONSTANT AND OR NOT XOR DIV MOD LEN POSITION SUBSTRING STRING_TO_INT STRING_TO_REAL INT_TO_STRING REAL_TO_STRING CHAR_TO_CODE CODE_TO_CHAR RANDOM_INT USERINPUT True False TRUE FALSE RECORD ENDRECORD CASE OF OTHERWISE ENDCASE CLASS ENDCLASS PRIVATE PUBLIC NEW TRY CATCH ENDTRY".split(" "),
    haskell: "let in where if then else case of do data type class instance import module deriving otherwise map filter foldl foldr foldl1 head tail null length reverse take drop zip sum product concat elem fst reverse show read".split(" "),
    sql: "SELECT FROM WHERE AND OR NOT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE PRIMARY KEY FOREIGN REFERENCES ORDER BY ASC DESC GROUP HAVING JOIN INNER LEFT RIGHT ON AS DISTINCT LIKE IN BETWEEN IS NULL VARCHAR CHAR INT INTEGER DATE DECIMAL FLOAT BOOLEAN TEXT DROP ALTER ADD COLUMN COUNT SUM AVG MIN MAX UNIQUE".split(" "),
    asm: "LDR STR ADD SUB MOV CMP B BEQ BNE BGT BLT AND ORR EOR MVN LSL LSR HALT".split(" "),
    js: "function return if else for while let const var new class this true false null undefined import export".split(" "),
    vb: "Dim As Integer String Boolean Double Decimal Char Date If Then Else ElseIf End Sub Function Return For To Next While Do Loop Until Console WriteLine ReadLine Structure Const Select Case New Module".split(" "),
    bnf: [],
    text: [],
  };
  KW.assembly = KW.asm;
  KW.javascript = KW.js;
  KW.output = [];

  function highlight(code, lang) {
    lang = (lang || "text").toLowerCase();
    if (!KW[lang] || lang === "text" || lang === "output") return esc(code);
    const kws = KW[lang];
    const ci = lang === "sql" || lang === "asm" || lang === "assembly";
    const kwSet = new Set(kws.map((k) => (ci ? k.toUpperCase() : k)));
    const commentRe = lang === "python" ? /#[^\n]*/y : lang === "haskell" ? /--[^\n]*/y : lang === "sql" ? /--[^\n]*/y : lang === "asm" || lang === "assembly" ? /;[^\n]*/y : lang === "js" || lang === "javascript" ? /\/\/[^\n]*|\/\*[\s\S]*?\*\//y : lang === "vb" ? /'[^\n]*/y : /(#|\/\/)[^\n]*/y;
    let out = "";
    let i = 0;
    const n = code.length;
    while (i < n) {
      const ch = code[i];
      // comment
      commentRe.lastIndex = i;
      let m = commentRe.exec(code);
      if (m && m.index === i) {
        out += '<span class="tok-comment">' + esc(m[0]) + "</span>";
        i += m[0].length;
        continue;
      }
      // string
      if (ch === '"' || ch === "'") {
        let j = i + 1;
        while (j < n && code[j] !== ch && code[j] !== "\n") {
          if (code[j] === "\\") j++;
          j++;
        }
        out += '<span class="tok-string">' + esc(code.slice(i, j + 1)) + "</span>";
        i = j + 1;
        continue;
      }
      // number
      m = /^(0b[01]+|0x[0-9a-fA-F]+|\d+(\.\d+)?)/.exec(code.slice(i, i + 40));
      if (m && !/[A-Za-z_]/.test(code[i - 1] || "")) {
        out += '<span class="tok-number">' + esc(m[0]) + "</span>";
        i += m[0].length;
        continue;
      }
      // identifier / keyword
      m = /^[A-Za-z_][A-Za-z0-9_']*/.exec(code.slice(i, i + 60));
      if (m) {
        const word = m[0];
        const key = ci ? word.toUpperCase() : word;
        if (kwSet.has(key)) out += '<span class="tok-keyword">' + esc(word) + "</span>";
        else if (/^[A-Z][A-Za-z0-9_]*$/.test(word) && (lang === "python" || lang === "js" || lang === "haskell")) out += '<span class="tok-type">' + esc(word) + "</span>";
        else out += esc(word);
        i += word.length;
        continue;
      }
      // operators
      m = /^(<-|←|->|→|==|!=|<=|>=|<>|\*\*|\/\/|[+\-*\/%=<>!&|^~:.,()[\]{}])/.exec(code.slice(i, i + 3));
      if (m) {
        out += '<span class="tok-op">' + esc(m[0]) + "</span>";
        i += m[0].length;
        continue;
      }
      out += esc(ch);
      i++;
    }
    return out;
  }
  CS.highlight = highlight;
})();
