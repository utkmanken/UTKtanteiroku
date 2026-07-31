const processIndent = (line, indentStack) => {
    const tokens = [];

    // 空行は無視
    if (/^\s*$/.test(line)) return tokens;

    const match = line.match(/^( *)/);
    const spaces = match[1].length;

    if (spaces % 4 !== 0) {
        throw new Error("Indent must be multiples of 4 spaces");
    }

    const indent = spaces / 4;
    const current = indentStack[indentStack.length - 1];

    if (indent > current) {
        indentStack.push(indent);
        tokens.push({ type: "INDENT" });
    } else if (indent < current) {
        while (indentStack[indentStack.length - 1] > indent) {
            indentStack.pop();
            tokens.push({ type: "DEDENT" });
        }
    }

    return tokens;
}
const isTripleQuoteStart = (line) => line.trim().startsWith('"""');
/*const readTripleString = (lines, startIndex) => {
    let content = "";
    let i = startIndex;

    // 最初の """ を除去
    let line = lines[i].trim().slice(3);

    while (true) {
        const endIndex = line.indexOf('"""');
        if (endIndex !== -1) {
            content += line.slice(0, endIndex);
            break;
        }
        content += line + "\n";
        i++;
        line = lines[i];
    }

    return {
        token: { type: "STRING", value: content },
        nextIndex: i + 1
    };
}
*/ //202605130041削除
const removeBaseIndent = (line, baseIndent) => {
    // 行頭のスペースを取得
    const match = line.match(/^( *)/);
    const spaces = match ? match[1].length : 0;

    // baseIndent 以上なら削る
    if (spaces >= baseIndent) {
        return line.slice(baseIndent);
    }
    return line; // それより浅い場合はそのまま
};
/*
const readTripleString = (lines, startIndex) => {
    let content = "";
    let i = startIndex;

    // 最初の """ を除去
    let firstLine = lines[i];
    const baseIndent = firstLine.match(/^( *)/)[1].length; // say ブロック内のインデント
    let line = firstLine.trim().slice(3); // """ の後ろ

    // 最初の行に文字があれば追加
    if (line.length > 0) content += line + "\n";

    i++;

    while (i < lines.length) {
        let raw = lines[i];

        // 終了 """ を探す
        const endIndex = raw.indexOf('"""');
        if (endIndex !== -1) {
            // 終了行の前の部分だけ取る
            let before = raw.slice(0, endIndex);

            // インデント削除
            before = removeBaseIndent(before, baseIndent);

            content += before;
            break;
        }

        // 通常行
        let trimmed = removeBaseIndent(raw, baseIndent);
        content += trimmed + "\n";

        i++;
    }

    return {
        token: { type: "STRING", value: content },
        nextIndex: i + 1
    };
};
*/ //202605132339削除
const readTripleString = (lines, startIndex) => {
    let content = "";
    let i = startIndex;

    // 最初の """ を除去
    let firstLine = lines[i];
    const baseIndent = firstLine.match(/^( *)/)[1].length;
    let line = firstLine.trim().slice(3);

    // 最初の行に文字があれば追加（改行は付けない）
    if (line.length > 0) content += line;

    i++;

    while (i < lines.length) {
        let raw = lines[i];

        // 終了 """ を探す
        const endIndex = raw.indexOf('"""');
        if (endIndex !== -1) {
            // 終了行の前の部分だけ取る
            let before = raw.slice(0, endIndex);
            before = removeBaseIndent(before, baseIndent);

            // もし content が空でなければ改行を追加してから最後の行を追加
            if (content.length > 0 && before.length > 0) {
                content += "\n" + before;
            } else if (before.length > 0) {
                content += before;
            }

            break;
        }

        // 通常行
        let trimmed = removeBaseIndent(raw, baseIndent);

        // content が空でなければ改行を追加
        if (content.length > 0) {
            content += "\n";
        }
        content += trimmed;

        i++;
    }

    return {
		token: { type: "STRING", value: content },
		nextIndex: i + 1,
		needsNewline: true
	};
};
const removeComment = (line) => line.replace(/#.*/, "");
const jpChar = "\\u3041-\\u3096\\u30A1-\\u30FA\\u4E00-\\u9FAF\\u3005";
const splitIntoParts = (line) => {
	const regex = new RegExp(
		//`("""[\\s\\S]*?"""|"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|==|!=|>=|<=|\\+=|\\-=|\\*=|\\/=|%=|->|[+\\-*/%^=!:()<>\\[\\]]|-?\\d+(?:\\.\\d+)?|[A-Za-z_${jpChar}][A-Za-z0-9_${jpChar}]*|\\s+)`,
		`("""[\\s\\S]*?"""|"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|\\|\\||&&|==|!=|>=|<=|\\+=|\\-=|\\*=|\\/=|%=|->|[+\\-*/%^=!:()<>\\[\\]]|-?\\d+(?:\\.\\d+)?|[A-Za-z_${jpChar}][A-Za-z0-9_${jpChar}]*|\\s+)`,
		"g"
	);
    const m = line.match(regex);
    if (!m) return [];
    return m.filter(x => !/^\s+$/.test(x));
	//return m;
};
const JP_RANGE = "\\u3041-\\u3096\\u30A1-\\u30FA\\u4E00-\\u9FAF\\u3005";
const classifyToken = (part) => {
	const identRegex = new RegExp(
        `^[A-Za-z_${JP_RANGE}][A-Za-z0-9_${JP_RANGE}]*$`
    );
    if (/^"""[\s\S]*?"""$/.test(part)) {
        return { type: "STRING", value: part.slice(3, -3) };
    }
    if (/^"([^"\\]|\\.)*"$/.test(part)) {
        return { type: "STRING", value: part.slice(1, -1) };
    }
    if (/^-?\d+(\.\d+)?$/.test(part)) {
        return { type: "NUMBER", value: Number(part) };
    }
    if (/^(==|!=|>=|<=|>|<)$/.test(part)) {
        return { type: "OPERATOR", value: part };
    }
    if (/^(\+=|\-=|\*=|\/=|%=)$/.test(part)) {
        return { type: "OPERATOR", value: part };
    }
    if (/^[+\-*/%]$/.test(part)) {
        return { type: "OPERATOR", value: part };
    }
    if (/^[+\-*/%^!]$/.test(part)) {
		return { type: "OPERATOR", value: part };
	}
	if (part === "||" || part === "&&") {
        return { type: "OPERATOR", value: part };
    }
	if (part === "->") return { type: "ARROW" };
    if (part === "=") return { type: "EQUAL" };
    if (part === ":") return { type: "COLON" };
    if (part === "(") return { type: "LPAREN" };
    if (part === ")") return { type: "RPAREN" };
	if (part === '[') return { type: "LBRACKET" };
	if (part === ']') return { type: "RBRACKET" };

    /*
	if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) {
        return { type: "IDENT", value: part };
    }
	*/
	if (identRegex.test(part)) {
		return { type: "IDENT", value: part };
	}
    throw new Error("Unknown token: " + part);
}


const tokenize = (source) => {
    const lines = source.split(/\r?\n/);
    const tokens = [];
    const indentStack = [0]; // 最初は0インデント

    let i = 0;
    while (i < lines.length) {
        let line = lines[i];

        // 1. インデント解析
        const indentTokens = processIndent(line, indentStack);
        tokens.push(...indentTokens);

        // 2. 複数行文字列チェック
        if (isTripleQuoteStart(line)) {
            const { token, nextIndex } = readTripleString(lines, i);
            tokens.push(token);
			tokens.push({ type: "NEWLINE" });
            i = nextIndex;
            continue;
        }

        // 3. コメント除去
        line = removeComment(line);

        // 4. トークン分割
        const parts = splitIntoParts(line);

        // 5. トークン種別判定
        for (const part of parts) {
            const t = classifyToken(part);
            if (t) tokens.push(t);
        }
		
		// 6. 空行は continue
		if (/^\s*$/.test(line)) {
			i++;
			continue;
		}

        // 7. 行末
        tokens.push({ type: "NEWLINE" });

        i++;
    }

    // 7. ファイル末尾の DEDENT
    while (indentStack.length > 1) {
        indentStack.pop();
        tokens.push({ type: "DEDENT" });
    }

    tokens.push({ type: "EOF" });
	console.log(tokens);
    return tokens;
}


//仮決定
/*
const peek = (offset = 0) => {
    return tokens[pos + offset];
}
const consume = (expectedType, expectedValue = null) => {
    const tok = peek();

    if (tok.type !== expectedType) {
        throw new Error(`Expected ${expectedType} but got ${tok.type}`);
    }

    if (expectedValue !== null && tok.value !== expectedValue) {
        throw new Error(`Expected ${expectedValue} but got ${tok.value}`);
    }

    pos++;
    return tok;
}
const parseExpression = () => {
    const tok = peek();

    if (tok.type === "NUMBER") {
        consume("NUMBER");
        return { type: "NumberLiteral", value: tok.value };
    }

    if (tok.type === "IDENT") {
        consume("IDENT");
        return { type: "VarRef", name: tok.value };
    }

    throw new Error("Invalid expression");
}


const parseSet = () => {
    consume("IDENT", "set");
    const varName = consume("IDENT").value;
    consume("EQUAL");
    const expr = parseExpression();
    consume("NEWLINE");

    return {
        type: "Set",
        var: varName,
        value: expr
    };
}



const parseProgram = (tokens) => {
    const body = [];
    while (!isEOF()) {
        const stmt = parseStatement();
        if (stmt) body.push(stmt);
    }
    return { type: "Program", body };
}
const parseStatement = () => {
    const tok = peek();

    if (tok.type === "IDENT") {
        switch (tok.value) {
            case "say": return parseSay();
            case "set": return parseSet();
            case "calc": return parseCalc();
            case "loop": return parseLoop();
            case "if": return parseIf();
            case "else": return parseElse();
            case "goto": return parseGoto();
            case "label": return parseLabel();
            case "console": return parseConsole();
        }
    }

    throw new Error("Unknown statement: " + tok.value);
}
*/
// 演算子の優先順位（binding power）
const BP = {
    "(": 90,

    "LBRACKET": 80,

    "CALL": 75,

    "+u": 70,
    "!u": 70,
	
	"^": 65,
    "-u": 62, //-2^3を-(2^3)として解釈するため
	
    "*": 60,
    "/": 60,
    "%": 60,

    "+": 50,
    "-": 50,

    ">": 40,
    "<": 40,
    ">=": 40,
    "<=": 40,

    "==": 30,
    "!=": 30,

    "&&": 20,
    "||": 10
};


//パーサー初期化用
let parse_tokens = [];
let pos = 0;

//次のトークンの内容確認
const peek = (offset = 0) => parse_tokens[pos + offset];

//トークンの消費
const consume = (expectedType, expectedValue = null) => {
    const tok = peek();

    if (tok.type !== expectedType) {
        throw new Error(`Expected ${expectedType} but got ${tok.type}`);
    }

    if (expectedValue !== null && tok.value !== expectedValue) {
        throw new Error(`Expected ${expectedValue} but got ${tok.value}`);
    }

    pos++;
    return tok;
};
function nextToken() {
    return parse_tokens[pos++] || null;
}

//isEOFの定義
const isEOF = () => peek().type === "EOF";
/*
function nud(token) {
    switch (token.type) {

        case "NUMBER":
            return {
                type: "NumberLiteral",
                value: token.value
            };

        case "STRING":
            return {
                type: "StringLiteral",
                value: token.value
            };

        case "IDENT":
            return {
                type: "VarRef",
                name: token.value
            };

        case "LPAREN":  // "("
            const expr = parseExpression(0);
            consume("RPAREN"); // ")"
            return expr;

        case "OPERATOR":
            // 単項演算子 (+ - !)
            if (token.value === "+" || token.value === "-" || token.value === "!") {
                const right = parseExpression(BP[token.value + "u"]);
                return {
                    type: "UnaryOp",
                    op: token.value,
                    value: right
                };
            }
            throw new Error("Unexpected operator in nud: " + token.value);

        default:
            throw new Error("Unexpected token in nud: " + token.type);
    }
}
function led(left, token) {

    // 二項演算子
    if (token.type === "OPERATOR") {
        const op = token.value;
        const bp = BP[op];
		const rightBp = (op === "^") ? bp - 1 : bp;
        const right = parseExpression(rightBp);
        return {
            type: "BinaryOp",
            op,
            left,
            right
        };
    }

    // 関数呼び出し（将来用）
    if (token.type === "LPAREN") {
        const args = [];

        if (peek().type !== "RPAREN") {
            do {
                args.push(parseExpression(0));
            } while (peek().type === "COMMA" && consume("COMMA"));
        }

        consume("RPAREN");

        return {
            type: "Call",
            callee: left,
            args
        };
    }

    // 配列アクセス（将来用）
    if (token.type === "LBRACKET") {
        const index = parseExpression(0);
        consume("RBRACKET");

        return {
            type: "Access",
            array: left,
            index
        };
    }

    throw new Error("Unexpected token in led: " + token.type);
}
*/
// nud を拡張してコンテキストを受け取る
function nud(token, stopTypes = [], allowWordOps = false) {
    switch (token.type) {
        case "NUMBER":
            return { type: "NumberLiteral", value: token.value };
        case "STRING":
            return { type: "StringLiteral", value: token.value };
        case "IDENT":
            return { type: "VarRef", name: token.value };
        case "LPAREN":
            // ここで括弧内も同じコンテキストでパースする
            const expr = parseExpression(0, ["RPAREN"].concat(stopTypes), allowWordOps);
            consume("RPAREN");
            return expr;
        case "OPERATOR":
            if (token.value === "+" || token.value === "-" || token.value === "!") {
                const right = parseExpression(BP[token.value + "u"], stopTypes, allowWordOps);
                return { type: "UnaryOp", op: token.value, value: right };
            }
            throw new Error("Unexpected operator in nud: " + token.value);
        default:
            throw new Error("Unexpected token in nud: " + token.type);
    }
}
// led も同様にコンテキストを受け取るようにする
function led(left, token, stopTypes = [], allowWordOps = false) {
    if (token.type === "OPERATOR") {
        const op = token.value;
        const bp = BP[op];
        const rightBp = (op === "^") ? bp - 1 : bp;
        // 右辺も同じコンテキストでパース
        const right = parseExpression(rightBp, stopTypes, allowWordOps);
        return { type: "BinaryOp", op, left, right };
    }

    if (token.type === "LPAREN") {
        const args = [];
        if (peek().type !== "RPAREN") {
            do {
                args.push(parseExpression(0, stopTypes, allowWordOps));
            } while (peek().type === "COMMA" && consume("COMMA"));
        }
        consume("RPAREN");
        return { type: "Call", callee: left, args };
    }

    if (token.type === "LBRACKET") {
        const index = parseExpression(0, stopTypes, allowWordOps);
        consume("RBRACKET");
        return { type: "Access", array: left, index };
    }

    throw new Error("Unexpected token in led: " + token.type);
}

/*
function parseExpression(bp = 0, stopTypes = [], allowWordOps = false) {
    // 1. まず前置処理（nud）で左側を読む
    let token = nextToken();
    let left = nud(token);

    // 2. 次のトークンを見て、優先順位が高ければ led で処理
    while (true) {
        const next = peek();

        // トークンが無い or 優先順位が低いなら終了
        if (!next) break;

        const op = next.value || next.type;
        const nextBp = BP[op];

        if (nextBp === undefined || nextBp <= bp) break;

        // 演算子を消費して led に渡す
        nextToken();
        left = led(left, next);
    }

    return left;
}
function parseExpression(bp = 0, stopTypes = [], allowWordOps = false) {
    // 1) 前置処理（nud）で左辺を読む
    let token = nextToken();
    let left = nud(token);

    // 2) ループで次のトークンを見て led を適用
    while (true) {
        const next = peek();
        if (!next) break;

        // 停止トークンに到達したら終了（例: COLON, NEWLINE, RPAREN など）
        if (stopTypes.includes(next.type)) break;

        // 次のトークンが演算子か、条件文で allowWordOps が true なら IDENT 'and'/'or' を演算子扱い
        let opTokenObj = null;

        if (next.type === "OPERATOR") {
            // 実際の OPERATOR トークンをそのまま使う
            opTokenObj = next;
        } else if (allowWordOps && next.type === "IDENT" && (next.value === "and" || next.value === "or")) {
            // IDENT 'and'/'or' を演算子として扱うため、消費して合成トークンを作る
            // まず消費
            nextToken(); // consume the IDENT token
            // 合成トークンを作る（led は token.type を参照するので OPERATOR にする）
            opTokenObj = { type: "OPERATOR", value: (next.value === "and" ? "&&" : "||") };
        } else {
            break;
        }

        // opTokenObj が OPERATOR であることを前提に優先度を調べる
        const op = opTokenObj.value;
        const nextBp = BP[op];
        if (nextBp === undefined || nextBp <= bp) {
            // もし優先度が足りなければ、消費した IDENT を戻す必要はない（既に peek のままなら消費していない）
            // ただし上の分岐で IDENT を消費して合成トークンを作った場合は既に消費済みなので何もしない
            break;
        }

        // consume operator token if not already consumed
        // (OPERATOR case: we haven't consumed it yet; IDENT case already consumed above)
        if (next.type === "OPERATOR") {
            nextToken(); // consume the actual operator token
        }

        // led expects a token object; pass opTokenObj
        left = led(left, opTokenObj);
    }

    return left;
}
*/
// parseExpression のシグネチャ（既にあるなら stopTypes, allowWordOps を受け取るように）
function parseExpression(bp = 0, stopTypes = [], allowWordOps = false) {
    // 1) 前置処理（nud）で左辺を読む
    let token = nextToken();
    let left = nud(token, stopTypes, allowWordOps); // ← ここでコンテキストを渡す

    // 2) ループで次のトークンを見て led を適用
    while (true) {
        const next = peek();
        if (!next) break;

        if (stopTypes.includes(next.type)) break;

        let opTokenObj = null;

        if (next.type === "OPERATOR") {
            opTokenObj = next;
        } else if (allowWordOps && next.type === "IDENT" && (next.value === "and" || next.value === "or")) {
            // consume IDENT and synthesize OPERATOR token
            nextToken();
            opTokenObj = { type: "OPERATOR", value: (next.value === "and" ? "&&" : "||") };
        } else {
            break;
        }

        const op = opTokenObj.value;
        const nextBp = BP[op];
        if (nextBp === undefined || nextBp <= bp) {
            // if we synthesized an OPERATOR from IDENT, we've already consumed it; nothing to rollback
            break;
        }

        // consume real OPERATOR token if not already consumed
        if (next.type === "OPERATOR") nextToken();

        // pass the same stopTypes/allowWordOps down to led
        left = led(left, opTokenObj, stopTypes, allowWordOps);
    }

    return left;
}
//def
const parseDef = () => {
    consume("IDENT", "def");

    const name = consume("IDENT").value;

    consume("LPAREN");
    const params = [];

    while (peek().type !== "RPAREN") {
        params.push(consume("IDENT").value);
    }

    consume("RPAREN");

    consume("COLON");
    consume("NEWLINE");
    consume("INDENT");

    const body = [];
    while (peek().type !== "DEDENT") {
        body.push(parseStatement());
    }

    consume("DEDENT");

    return {
        type: "FunctionDef",
        name,
        params,
        body
    };
};
//set
const parseSet = () => {
    consume("IDENT", "set");
    const varName = consume("IDENT").value;
    consume("EQUAL");
    const expr = parseExpression();

    let doNext = true;
    if (peek().type === "IDENT") {
        const flag = peek().value;
        if (flag === "do_next") {
            consume("IDENT", "do_next");
            doNext = true;
        } else if (flag === "stop") {
            consume("IDENT", "stop");
            doNext = false;
        }
    }

    consume("NEWLINE");

    return {
        type: "Set",
        var: varName,
        value: expr,
        doNext: doNext
    };
};
//calc
/*const parseCalc = () => {
    consume("IDENT", "calc");
    const varName = consume("IDENT").value;

    // ここで OPERATOR か EQUAL のどちらでも受け付ける
    let op = null;
    const next = peek();
    if (next.type === "OPERATOR") {
        op = consume("OPERATOR").value; // "+", "-", "*", "/", "%", "^", "&&" など
    } else if (next.type === "EQUAL") {
        consume("EQUAL");
        op = "="; // 特別扱い：代入（set と同等）
    } else {
        throw new Error("Expected OPERATOR or EQUAL but got " + next.type);
    }

    const expr = parseExpression();

    let doNext = true;
    if (peek().type === "IDENT") {
        const flag = peek().value;
        if (flag === "do_next") {
            consume("IDENT", "do_next");
            doNext = true;
        } else if (flag === "stop") {
            consume("IDENT", "stop");
            doNext = false;
        }
    }

    consume("NEWLINE");

    return {
        type: "Calc",
        var: varName,
        op: op,        // "=" または "+" 等
        value: expr,
        doNext: doNext
    };
};*/
const parseCalc = () => {
    consume("IDENT", "calc");
    const varName = consume("IDENT").value;

    // OPERATOR または EQUAL を受け付ける
    let rawOp = null;
    const next = peek();
    if (next.type === "OPERATOR") {
        rawOp = consume("OPERATOR").value; // 例: "+=", "+", "^" など
    } else if (next.type === "EQUAL") {
        consume("EQUAL");
        rawOp = "=";
    } else {
        throw new Error("Expected OPERATOR or EQUAL but got " + next.type);
    }

    // 正規化: "+=" -> "+" など。"=" は代入のまま
    let op = rawOp;
    if (typeof rawOp === "string" && rawOp.length > 1 && rawOp.endsWith("=")) {
        // 複合代入 (+=, -=, *=, /=, %=) を基本演算子に変換
        op = rawOp[0]; // "+=" -> "+"
    }

    const expr = parseExpression();

    let doNext = true;
    if (peek().type === "IDENT") {
        const flag = peek().value;
        if (flag === "do_next") {
            consume("IDENT", "do_next");
            doNext = true;
        } else if (flag === "stop") {
            consume("IDENT", "stop");
            doNext = false;
        }
    }

    consume("NEWLINE");

    return {
        type: "Calc",
        var: varName,
        op: op,        // "=" または "+" 等（正規化済み）
        rawOp: rawOp,  // オプション: 元の表記を残したければ保持
        value: expr,
        doNext: doNext
    };
};
//goto
const parseGoto = () => {
    consume("IDENT", "goto");
    const label = consume("IDENT").value;
    consume("NEWLINE");

    return {
        type: "Goto",
        label: label
    };
};
//label
const parseLabel = () => {
    consume("IDENT", "label");
    const name = consume("IDENT").value;
    consume("NEWLINE");

    return {
        type: "Label",
        name: name
    };
};
//console
const parseConsole = () => {
    consume("IDENT", "console");
    const expr = parseExpression();

    let doNext = true;

    // do_next / stop の判定
    if (peek().type === "IDENT") {
        const flag = peek().value;
        if (flag === "do_next") {
            consume("IDENT", "do_next");
            doNext = true;
        } else if (flag === "stop") {
            consume("IDENT", "stop");
            doNext = false;
        }
    }

    consume("NEWLINE");

    return {
        type: "Console",
        value: expr,
        doNext: doNext
    };
};
//say
const parseSay = () => {
    // say:
    consume("IDENT", "say");
    consume("COLON");
    consume("NEWLINE");
    consume("INDENT");

    // 1行目: mode
    const mode = consume("IDENT").value;
    consume("NEWLINE");

    // 2行目: text（STRING）
    const text = consume("STRING").value;
    consume("NEWLINE");

    // 3行目: charName:displayName
    const charName = consume("IDENT").value;
    consume("COLON");
    const displayName = consume("IDENT").value;
    consume("NEWLINE");

    // 4行目: option
    const option = consume("IDENT").value;
    consume("NEWLINE");

    consume("DEDENT");

    return {
        type: "say",
        mode,
        text,
        charName,
        displayName,
        option
    };
};
const parseLoop = () => {
    // loop
    consume("IDENT", "loop");

    // ループ変数名
    const varName = consume("IDENT").value;

    // =
    consume("EQUAL");

    // start（式）
    const start = parseExpression(0);

    // =>
    consume("ARROW");

    // end（式）
    const end = parseExpression(0);

    // :
    consume("COLON");
    consume("NEWLINE");
    consume("INDENT");

    // ブロック内の statements
    const body = [];
    while (peek().type !== "DEDENT") {
        body.push(parseStatement());
    }

    consume("DEDENT");

    return {
        type: "loop",
        var: varName,
        start,
        end,
        body
    };
};
const parseIf = () => {
    consume("IDENT", "if");

    // ★ 条件式を丸ごと Expression パーサーに任せる
    const condition = parseExpression(0, ["COLON"], true);

    consume("COLON");
    consume("NEWLINE");
    consume("INDENT");

    const trueBody = [];
    while (peek().type !== "DEDENT") {
        trueBody.push(parseStatement());
    }
    consume("DEDENT");

    let falseBody = null;

    if (peek().type === "IDENT" && peek().value === "else") {
        consume("IDENT", "else");
        consume("COLON");
        consume("NEWLINE");
        consume("INDENT");

        falseBody = [];
        while (peek().type !== "DEDENT") {
            falseBody.push(parseStatement());
        }
        consume("DEDENT");
    }

    return {
        type: "if",
        condition,
        trueBody,
        falseBody
    };
};


//各行のパーサー
function parseStatement() {
    const tok = peek();

    if (tok.type === "IDENT") {
        switch (tok.value) {	
			case "def": return parseDef();
            case "say": return parseSay(); //ok
            case "set": return parseSet(); //ok
            case "calc": return parseCalc(); //ok
            case "loop": return parseLoop(); //ok
            case "if": return parseIf(); //ok
            case "else": return parseElse();
            case "goto": return parseGoto(); //ok
            case "label": return parseLabel(); //ok
            case "console": return parseConsole(); //ok
        }
    }

    throw new Error("Unknown statement: " + tok.value);
};

//Programのパーサー
const parseProgram = () => {
    const body = [];

    while (!isEOF()) {
        const stmt = parseStatement();
        if (stmt) body.push(stmt);
    }

    return { type: "Program", body };
};

//ASTを返す
const parse = (source) => {
    parse_tokens = tokenize(source);
    pos = 0;
    return parseProgram();
}
//Expressionパーサーテスター
function testExpression(input) {
    const tokens = tokenize(input);
    parse_tokens = tokens;
    pos = 0;

    const ast = parseExpression(0);

    return ast;
}
/////////////////////////////////////////////////////////////scコンパイラ
let labelCounter = 0;
function newLabel(prefix = "__L") {
  return `__L${++labelCounter}__`;
}

function backpatch(lines) {
	const labelToLine = {};
	let logicalLine = 0;

	  // 1) ラベル位置を記録（ラベル行は命令にカウントしない）
	  for (let i = 0; i < lines.length; i++) {
		const m = lines[i].match(/^(__L\d+__):$/);
		if (m) {
		  labelToLine[m[1]] = logicalLine + 1; // 1-based
		} else {
		  logicalLine++;
		}
	  }
      console.log("D labelToLine map:", labelToLine);
	  // 2) ラベル行を除去して命令のみの配列にする
	  const filtered = lines.filter(l => !/^__L\d+__:$/ .test(l));

	  // 3) sc_if と jumpto の引数だけ置換する（安全）
	  const final_ = filtered.map(line => {
		// sc_if の形式: sc_if <cond> <trueLabel> <falseLabel>
		if (/^\s*sc_if\s+/.test(line)) {
		  // split して最後の2つのトークンがラベルかもしれないので置換
		  const parts = line.split(/\s+/);
		  const len = parts.length;
		  // parts[0] = sc_if, parts[1] = condition, parts[len-2], parts[len-1] = labels
		  const tLabel = parts[len-2];
		  const fLabel = parts[len-1];
		  const tNum = labelToLine[tLabel];
		  const fNum = labelToLine[fLabel];
		  if (tNum === undefined || fNum === undefined) {
			throw new Error("Unknown label in sc_if: " + line);
		  }
		  // 再構成（条件はそのまま）
		  return parts.slice(0, len-2).join(" ") + " " + String(tNum) + " " + String(fNum);
		}

		// jumpto の形式: jumpto <label>
		if (/^\s*jumpto\s+/.test(line)) {
		  const parts = line.split(/\s+/);
		  const lbl = parts[1];
		  const num = labelToLine[lbl];
		  if (num === undefined) throw new Error("Unknown label in jumpto: " + line);
		  return "jumpto " + String(num);
		}

		// それ以外の行はそのまま（ラベル風文字列の誤置換を避ける）
		return line;
	  });
	  console.log("E finalLines after backpatch:", final_);
	  return final_;
}

/*function opToCalc(op) {
    switch (op) {
        case "+": return "+=";
        case "-": return "-=";
        case "*": return "*=";
        case "/": return "/=";
        case "%": return "%=";
        case "^": return "^=";
        default:
            throw new Error("Unsupported operator: " + op);
    }
}*/
function opToCalc(op) {
    switch (op) {
        case "+": return "+";
        case "-": return "-";
        case "*": return "*";
        case "/": return "/";
        case "%": return "%";
        case "^": return "^";
        default:
            throw new Error("Unsupported operator: " + op);
    }
}
/*
function generateExpression(expr) {
    // 一時領域のルート
    const tempRoot = `program["expr#${++exprCounter}"]`;

    switch (expr.type) {

        case "NumberLiteral":
            return {
                code: [],
                result: expr.value
            };

        case "StringLiteral":
            return {
                code: [],
                result: `"${expr.value}"`
            };
        case "VarRef":
            return {
                code: [],
                result: expr.name
            };
			
        case "UnaryOp": {
            const inner = generateExpression(expr.value);
            const temp = `${tempRoot}["value"]`;

            const code = [
                ...inner.code,
                `setvar 1 ${temp} ${inner.result}`,
                `sc_calc 1 ${temp} ${opToCalc(expr.op)} 0`
            ];
            return { code, result: temp };
        }
		
        case "BinaryOp": {
            const left = generateExpression(expr.left);
            const right = generateExpression(expr.right);

            const leftTemp = `${tempRoot}["left"]`;
            const rightTemp = `${tempRoot}["right"]`;
            const resultTemp = `${tempRoot}["result"]`;
			
            const code = [
                // 左
                ...left.code,
                `setvar 1 ${leftTemp} ${left.result}`,
                // 右
                ...right.code,
                `setvar 1 ${rightTemp} ${right.result}`,
                // 自分
                `setvar 1 ${resultTemp} ${leftTemp}`,
                `sc_calc 1 ${resultTemp} ${opToCalc(expr.op)} ${rightTemp}`
            ];
            return { code, result: resultTemp };
        }
        default:
            throw new Error("Unknown expression type: " + expr.type);
    }
}
*/
let exprCounter = 0;
/*
function generateExpression(expr) {
    const temps = [];
    function gen(e) {
        const tempRoot = `expr#${++exprCounter}`;
        temps.push(tempRoot);
        switch (e.type) {
			case "NumberLiteral":
				return {
					code: [],
					result: String(e.value),   // ← ここを文字列化
					temps: []
				};

			case "VarRef":
				return {
					code: [],
					result: e.name,            // これは元から文字列
					temps: []
				};

			case "StringLiteral":
				return {
					code: [],
					result: `"${e.value}"`,    // 文字列として返す
					temps: []
				};
			
			case "Access": {
				// 1. object のコード生成
				const obj = generateExpression(e.object);

				// 2. key のコード生成
				const key = generateExpression(e.key);

				// 3. 新しい一時領域を作る
				const temp = newTemp(); // 例: "expr#7"

				// 4. アクセス結果を temp に格納
				const code = [
					...obj.code,
					...key.code,
					`setvar 1 program["${temp}"] program[${obj.result}][${key.result}]`
				];

				// 5. temps をまとめる
				const temps = [...obj.temps, ...key.temps, temp];

				return {
					code,
					result: `program["${temp}"]`,
					temps
				};
			}

            case "BinaryOp": {
                const left = gen(e.left);
                const right = gen(e.right);
                const leftTemp = `program["${tempRoot}"]["left"]`;
                const rightTemp = `program["${tempRoot}"]["right"]`;
                const resultTemp = `program["${tempRoot}"]["result"]`;
                const code = [
                    ...left.code,
                    ...right.code,
                    `setvar 1 ${leftTemp} ${left.result}`,
                    `setvar 1 ${rightTemp} ${right.result}`,
                    `setvar 1 ${resultTemp} ${leftTemp}`,
                    `sc_calc 1 ${resultTemp} ${opToCalc(e.op)} ${rightTemp}`
                ];
                return {
                    code,
                    result: resultTemp,
                    temps: [...left.temps, ...right.temps, tempRoot]
                };
            }
            default:
                throw new Error("Unknown expression type: " + e.type);
        }
    }
    return gen(expr);
}
*/
/*
function generateExpression(expr) {
    function gen(e) {
		if (!e) {
			console.error("gen called with undefined", new Error().stack);
			throw new Error("gen called with undefined node");
		}
        switch (e.type) {

            case "NumberLiteral":
                return {
                    code: [],
                    result: String(e.value),
                    temps: []
                };

            case "VarRef":
                return {
                    code: [],
                    result: e.name,
                    temps: []
                };

            case "StringLiteral":
                return {
                    code: [],
                    result: `"${e.value}"`,
                    temps: []
                };

            case "Access": {
                const obj = gen(e.object);
                const key = gen(e.key);

                const temp = newTemp();

                const code = [
                    ...obj.code,
                    ...key.code,
                    `setvar 1 program["${temp}"] program[${obj.result}][${key.result}]`
                ];

                return {
                    code,
                    result: `program["${temp}"]`,
                    temps: [...obj.temps, ...key.temps, temp]
                };
            }

            case "BinaryOp": {
                const left = gen(e.left);
                const right = gen(e.right);

                const temp = newTemp();
                const resultTemp = `program["${temp}"]`;

                const code = [
                    ...left.code,
                    ...right.code,
                    `setvar 1 ${resultTemp} ${left.result}`,
                    `sc_calc 1 ${resultTemp} ${opToCalc(e.op)} ${right.result}`
                ];

                return {
                    code,
                    result: resultTemp,
                    temps: [...left.temps, ...right.temps, temp]
                };
            }

            default:
                throw new Error("Unknown expression type: " + e.type);
        }
    }

    return gen(expr);
}
*/
function newTemp() {
    return `expr#${++exprCounter}`;
}

function generateExpression(rootExpr) {
    function gen(e) {
        if (!e) {
            console.error("gen called with undefined", new Error().stack);
            throw new Error("gen called with undefined node");
        }

        switch (e.type) {

            case "NumberLiteral":
                return {
                    code: [],
                    result: String(e.value),
                    temps: []
                };

            case "VarRef":
                return {
                    code: [],
                    result: e.name,
                    temps: []
                };

            case "StringLiteral":
                return {
                    code: [],
                    result: `"${e.value}"`,
                    temps: []
                };
			
			case "Access": {
				const objNode = e.object ?? e.array;
				const keyNode = e.key ?? e.index;
				const obj = gen(objNode);
				const key = gen(keyNode);

				const temp = newTemp();

				const isTempObj = /^program\["expr#\d+"\]$/.test(obj.result);
				const rhs = isTempObj
					? `program[${obj.result}][${key.result}]`
					: `${obj.result}[${key.result}]`;

				// ここで必ず doNext=1 にする（式側は一時を生かす）
				const code = [
					...obj.code,
					...key.code,
					`setvar 1 program["${temp}"] ${rhs}`
				];

				return {
					code,
					result: `program["${temp}"]`,
					temps: [...obj.temps, ...key.temps, temp]
				};
			}


            case "BinaryOp": {
                const left = gen(e.left);
                const right = gen(e.right);

                const temp = newTemp();
                const resultTemp = `program["${temp}"]`;

                const code = [
                    ...left.code,
                    ...right.code,
                    `setvar 1 ${resultTemp} ${left.result}`,
                    `sc_calc 1 ${resultTemp} ${opToCalc(e.op)} ${right.result}`
                ];

                return {
                    code,
                    result: resultTemp,
                    temps: [...left.temps, ...right.temps, temp]
                };
            }

            case "UnaryOp": {
				if (e.op !== "!") {
					if (e.op === "+") {
						const val = gen(e.value);
						const temp = newTemp();
						const resultTemp = `program["${temp}"]`;
						return {
							code: [
								...val.code,
								`setvar 1 ${resultTemp} ${val.result}`
							],
							result: resultTemp,
							temps: [...val.temps, temp]
						};
					}
					if (e.op === "-") {
						const val = gen(e.value);
						const temp = newTemp();
						const resultTemp = `program["${temp}"]`;
						return {
							code: [
								...val.code,
								`setvar 1 ${resultTemp} 0`,
								`sc_calc 1 ${resultTemp} - ${val.result}`
							],
							result: resultTemp,
							temps: [...val.temps, temp]
						};
					}	 
				} else {
					const val = gen(e.value);
					const temp = newTemp();
					const resultTemp = `program["${temp}"]`;

					const L_true = newLabel("T");
					const L_false = newLabel("F");
					const L_end = newLabel("E");

					const code = [
						...val.code,
						`setvar 1 ${resultTemp} 0`,
						`sc_if ${val.result}==0 ${L_true} ${L_false}`,
						`${L_true}:`,
						`setvar 1 ${resultTemp} 1`,
						`jumpto ${L_end}`,
						`${L_false}:`,
						`setvar 1 ${resultTemp} 0`,
						`${L_end}:`
					];

					return {
						code,
						result: resultTemp,
						temps: [...val.temps, temp]
					};
				}
            }

            default:
                throw new Error("Unknown expression type: " + e.type);
        }
    }

    return gen(rootExpr);
}
/*
function generateProgram(node) {
    return node.body
        .map(stmt => generate(stmt))  // 各ステートメントを生成
        .join("\n");                  // 改行でつなぐ
}
*/
function generateProgram(node) {
  // ラベルカウンタをリセット（毎回新しいプログラムを生成する想定）
  labelCounter = 0;
  exprCounter = 0; // もし exprCounter もリセットしたいなら

  // 各ステートメントを生成して行単位で平坦化する
  const allLines = [];
  for (const stmt of node.body) {
    const out = generate(stmt); // generate は文字列を返す前提
	console.log("B generate(stmt) output for", stmt.type, ":\n", out);
    if (!out) continue;
    const lines = out.split(/\r?\n/);
    for (const l of lines) allLines.push(l);
  }
  console.log("C allLines before backpatch:", allLines);
  // backpatch を通す（sc_if/jumpto の引数だけ置換）
  const finalLines = backpatch(allLines);
  // 最終出力を改行で結合して返す
  console.log("F final program text:\n", finalLines.join("\n"));
  return finalLines.join("\n")+"\nend";
}

function generateConsole(node) {
    const doNextFlag = node.doNext ? 1 : 0;
    const text = node.value.value; // StringLiteral の中身

    return `disp_text ${doNextFlag} console ${text} None None []`;
}
/*
function generateSet(node) {
    const expr = generateExpression(node.value);
    const doNextFlag = node.doNext ? 1 : 0;

    const assign = `setvar 1 ${node.var} ${expr.result}`;

    const cleanup = expr.temps.map(t => `clearvar ${doNextFlag} program["${t}"] 2`);

    return [...expr.code, assign, ...cleanup].join("\n");
}
*/

//set
/*
function generateSet(node) {
    const expr = generateExpression(node.value);
    const doNextFlag = node.doNext ? 1 : 0;
    const assign = `setvar ${doNextFlag} ${node.var} ${expr.result}`;
    const match = expr.result.match(/expr#\d+/);
    const finalTemp = match ? match[0] : null;
    const cleanupOthers = expr.temps
        .filter(t => t !== finalTemp)
        .map(t => `clearvar 1 program["${t}"] 2`);
    const cleanupFinal = finalTemp
        ? [`clearvar ${doNextFlag} program["${finalTemp}"] 2`]
        : [];
    return [
        ...expr.code,
        assign,
        ...cleanupOthers,
        ...cleanupFinal
    ].join("\n");
}
*/
function generateSet(node) {
    const expr = generateExpression(node.value);
    const doNextFlag = node.doNext ? 1 : 0;

    const temps = expr.temps || [];

    // 代入の doNext は「一時変数があるなら強制的に 1」にする
    // （一時が無ければ node.doNext を使う）
    const assignDoNext = temps.length ? 1 : doNextFlag;
    const assign = `setvar ${assignDoNext} ${node.var} ${expr.result}`;

    if (temps.length === 0) {
        // 一時変数が無い場合は代入だけ（stop/do_next は assign に反映済み）
        return [
            ...expr.code,
            assign
        ].join("\n");
    }

    // 一時変数がある場合
    const finalTemp = temps[temps.length - 1];

    // 先頭から最後の一つ手前までは clearvar 1（即解放）
    const cleanupOthers = temps
        .slice(0, Math.max(0, temps.length - 1))
        .map(t => `clearvar 1 program["${t}"] 2`);

    // 最後の clearvar のみ node.doNext を使う（stop のときは 0）
    const cleanupFinal = [`clearvar ${doNextFlag} program["${finalTemp}"] 2`];

    return [
        ...expr.code,
        assign,
        ...cleanupOthers,
        ...cleanupFinal
    ].join("\n");
}
//calc
/*function generateCalc(node) {
    // node: { type: "Calc", var, op, rawOp?, value, doNext }
    const expr = generateExpression(node.value); // { code, result, temps }
    const doNextFlag = node.doNext ? 1 : 0;

    // 代入形式（calc x = expr）なら setvar を出す
    if (node.op === "=") {
        const code = [
            ...expr.code,
            `setvar ${doNextFlag} ${node.var} ${expr.result}`
        ];

        // temps をクリア（expr.temps に含まれる一時を消す）
        for (const t of expr.temps) {
            code.push(`clearvar ${doNextFlag} program["${t}"] 2`);
        }

        return code.join("\n");
    }

    // それ以外は演算（+= 等は parse で op を "+" に正規化済み）
    const opSym = opToCalc(node.op); // op は "+", "-", "*", "/", "%", "^" のいずれか

    const code = [
        ...expr.code,
        `sc_calc ${doNextFlag} ${node.var} ${opSym} ${expr.result}`
    ];

    for (const t of expr.temps) {
        code.push(`clearvar ${doNextFlag} program["${t}"] 2`);
    }

    return code.join("\n");
}*/
function generateCalc(node) {
    // node: { type: "Calc", var, op, value, doNext }
    const expr = generateExpression(node.value); // { code: [...], result, temps: [...] }
    const doNextFlag = node.doNext ? 1 : 0;
    const intermediateFlag = 1; // 式展開中は常に 1

    const temps = expr.temps || [];
    const out = [];

    // 1) expr.code の中間命令はすべて intermediateFlag に正規化して追加
    for (const line of expr.code) {
        if (/^\s*setvar\s+\d+\s+/.test(line)) {
            out.push(line.replace(/^\s*setvar\s+\d+/, `setvar ${intermediateFlag}`));
        } else if (/^\s*sc_calc\s+\d+\s+/.test(line)) {
            out.push(line.replace(/^\s*sc_calc\s+\d+/, `sc_calc ${intermediateFlag}`));
        } else if (/^\s*clearvar\s+\d+\s+/.test(line)) {
            out.push(line.replace(/^\s*clearvar\s+\d+/, `clearvar ${intermediateFlag}`));
        } else {
            out.push(line);
        }
    }

    // 2) 最終命令: "=" は代入、そうでなければ sc_calc
    if (node.op === "=") {
        // set と同じルール: 一時があれば assignDoNext = 1、なければ node.doNext を使う
        const assignDoNext = temps.length ? 1 : doNextFlag;
        out.push(`setvar ${assignDoNext} ${node.var} ${expr.result}`);
    } else {
        // 演算（+= 等は parse で "+" に正規化済み）
        const opSym = opToCalc(node.op);

        // set と同じルールを適用：一時があれば最終更新は 1、なければ node.doNext を使う
        const updateDoNext = temps.length ? 1 : doNextFlag;
        out.push(`sc_calc ${updateDoNext} ${node.var} ${opSym} ${expr.result}`);
    }

    // 3) temps のクリア：最後の一つだけ doNextFlag、それ以外は intermediateFlag
    for (let i = 0; i < temps.length; i++) {
        const t = temps[i];
        const flag = (i === temps.length - 1) ? doNextFlag : intermediateFlag;
        out.push(`clearvar ${flag} program["${t}"] 2`);
    }

    return out.join("\n");
}
//if
// 比較演算子の集合
const COMP_OPS = new Set(["==", "!=", ">=", "<=", ">", "<"]);
const LOGICAL_OPS = new Set(["&&", "||"]);
// condNode を受け取り、条件評価に必要なコード行と
// sc_if に渡す「条件表現」を返すヘルパー
/*
function buildConditionForIf(condNode) {
    // 1) 比較 BinaryOp はそのまま left<op>right を作る
    if (condNode.type === "BinaryOp" && COMP_OPS.has(condNode.op)) {
        const left = generateExpression(condNode.left);
        const right = generateExpression(condNode.right);
        const preCode = [...(left.code||[]), ...(right.code||[])];
        const temps = (left.temps||[]).concat(right.temps||[]);
        const condExpr = `${left.result}${condNode.op}${right.result}`;
        return { preCode, condExpr, temps };
    }

    // 2) UnaryOp('!') の特別扱い
    if (condNode.type === "UnaryOp" && condNode.op === "!") {
        const inner = condNode.value;

        // a) 内部が単純（VarRef / NumberLiteral）なら直接 condExpr を作る（sc_if を一つに）
        if (inner.type === "VarRef" || inner.type === "NumberLiteral") {
            const innerExpr = (inner.type === "VarRef") ? inner.name : String(inner.value);
            // condExpr は "inner==0"（!inner が真のとき true）
            return { preCode: [], condExpr: `${innerExpr}==0`, temps: [] };
        }

        // b) 内部が複雑なら内部だけ展開して innerResult==0 を使う
        const innerExpr = generateExpression(inner); // {code, result, temps}
        const preCode = innerExpr.code || [];
        const temps = innerExpr.temps || [];
        const condExpr = `${innerExpr.result}==0`;
        return { preCode, condExpr, temps };
    }

    // 3) それ以外（普通の式）は exprResult != 0 を条件にする
    const expr = generateExpression(condNode);
    const preCode = expr.code || [];
    const temps = expr.temps || [];
    const condExpr = `${expr.result}!=0`;
    return { preCode, condExpr, temps };
}
*/
// preCode の行先頭のフラグを 1 に正規化するユーティリティ
function normalizePreCodeLines(lines) {
    return (lines || []).map(l => l.replace(/^(setvar|sc_calc|clearvar)\s+\d+/, m => m.replace(/\d+/, "1")));
}

// 子の結果を「必ず condExpr に変換する」ヘルパ（可能なら condExpr を返す）
function ensureCondExpr(res) {
    // res: { preCode, condExpr, temps, trueLabel, falseLabel }
    if (res.condExpr != null) {
        // 既に condExpr がある -> そのまま
        return res;
    }
    // condExpr が無い（preCode に sc_if 等が入っている）場合、
    // 真偽を表す一時変数を作る方法もあるが簡潔にするため、
    // ここでは新しい condExpr を作るための一時変数を生成する実装は避ける。
    // 呼び出し側で preCode と trueLabel/falseLabel を直接扱う方針にする。
    return res;
}

// 再帰的で安全な実装
function buildConditionForIf(condNode) {
    // 戻り値:
    // { preCode: [...], condExpr: string|null, temps: [...], trueLabel?: string, falseLabel?: string }

    // 1) 比較演算子
    if (condNode.type === "BinaryOp" && COMP_OPS.has(condNode.op)) {
        const left = generateExpression(condNode.left);
        const right = generateExpression(condNode.right);
        const preCode = normalizePreCodeLines([...(left.code||[]), ...(right.code||[])]);
        const temps = (left.temps||[]).concat(right.temps||[]);
        const condExpr = `${left.result}${condNode.op}${right.result}`;
        return { preCode, condExpr, temps };
    }

    // 2) 論理演算子 (短絡評価) — 子を再帰的に処理して、必ず自分の L_true/L_false を使う
    if (condNode.type === "BinaryOp" && LOGICAL_OPS.has(condNode.op)) {
        const op = condNode.op; // "&&" or "||"

        // 再帰で左・右を取得（子は preCode/condExpr のどちらかを返す）
        const leftRes = buildConditionForIf(condNode.left);
        const rightRes = buildConditionForIf(condNode.right);

        // 自分専用の true/false/check ラベルを作る（衝突しない）
        const L_true = newLabel();
        const L_false = newLabel();
        const L_check = newLabel();

        const pre = [];

        // --- 左側のコードを追加 ---
        if (leftRes.preCode && leftRes.preCode.length) pre.push(...leftRes.preCode);

        // 左が condExpr を持つ場合は直接 sc_if を出す
		if (leftRes.condExpr != null) {
			if (op === "||") {
				// A || B: if A true -> true, else check B
				pre.push(`sc_if ${leftRes.condExpr} ${L_true} ${L_check}`);
			} else {
				// A && B: if A true -> check B, else -> false
				// ここでは condExpr をそのまま使い、true/false の順序で表現する
				pre.push(`sc_if ${leftRes.condExpr} ${L_check} ${L_false}`);
			}
		} else {
            // leftRes は preCode ベースで trueLabel/falseLabel を返す想定
            // leftRes.trueLabel/falseLabel が存在することを期待する
            // leftRes の trueLabel に到達したら全体の L_true に飛ばすようにする
            // leftRes の falseLabel に到達したら L_check に落ちるようにする
            // そのため、leftRes.preCode の末尾にラベル調整用のジャンプを入れる

            // 安全策: leftRes が trueLabel/falseLabel を返していない場合はエラーにする
            if (!leftRes.trueLabel || !leftRes.falseLabel) {
                throw new Error("buildConditionForIf: child logical node must provide trueLabel/falseLabel when condExpr is null");
            }

            // leftRes の trueLabel に到達したら L_true に飛ばす
            pre.push(`${leftRes.trueLabel}:`);
            pre.push(`jumpto ${L_true}`);
            // leftRes の falseLabel に到達したら L_check に落ちる
            pre.push(`${leftRes.falseLabel}:`);
            // fallthrough to L_check (we will emit L_check: next)
        }

        // --- 右側の評価は L_check から ---
        pre.push(`${L_check}:`);
        if (rightRes.preCode && rightRes.preCode.length) pre.push(...rightRes.preCode);

        if (rightRes.condExpr != null) {
            // 右が condExpr を持つなら直接 sc_if を出す（true->L_true, false->L_false）
            pre.push(`sc_if ${rightRes.condExpr} ${L_true} ${L_false}`);
        } else {
            // 右が preCode ベースなら rightRes.trueLabel/rightRes.falseLabel を使う
            if (!rightRes.trueLabel || !rightRes.falseLabel) {
                throw new Error("buildConditionForIf: child logical node must provide trueLabel/falseLabel when condExpr is null");
            }
            // rightRes.trueLabel に到達したら L_true、falseLabel に到達したら L_false
            pre.push(`${rightRes.trueLabel}:`);
            pre.push(`jumpto ${L_true}`);
            pre.push(`${rightRes.falseLabel}:`);
            pre.push(`jumpto ${L_false}`);
        }

        // 合成 temps
        const temps = (leftRes.temps || []).concat(rightRes.temps || []);

        // 返す（condExpr は null、preCode に短絡展開済みコード、trueLabel/falseLabel を返す）
        return { preCode: normalizePreCodeLines(pre), condExpr: null, temps, trueLabel: L_true, falseLabel: L_false };
    }

    // 3) UnaryOp('!') の最適化
    if (condNode.type === "UnaryOp" && condNode.op === "!") {
        const inner = condNode.value;
        if (inner.type === "VarRef" || inner.type === "NumberLiteral") {
            const innerExpr = inner.type === "VarRef" ? inner.name : String(inner.value);
            return { preCode: [], condExpr: `${innerExpr}==0`, temps: [] };
        }
        const innerExpr = generateExpression(inner);
        return { preCode: normalizePreCodeLines(innerExpr.code || []), condExpr: `${innerExpr.result}==0`, temps: innerExpr.temps || [] };
    }

    // 4) それ以外: 式を評価して result!=0 を条件にする
    const expr = generateExpression(condNode);
    return { preCode: normalizePreCodeLines(expr.code || []), condExpr: `${expr.result}!=0`, temps: expr.temps || [] };
}
/*
function generateIf(node) {
    // node: { type: "if", condition, trueBody:[], falseBody:[]|null }
    const { preCode, condExpr, temps } = buildConditionForIf(node.condition);
    const out = [];

    // 1) 条件評価の前処理（中間命令はすべて doNext=1 に正規化）
    for (const line of preCode) {
        if (/^\s*setvar\s+\d+\s+/.test(line)) {
            out.push(line.replace(/^\s*setvar\s+\d+/, `setvar 1`));
        } else if (/^\s*sc_calc\s+\d+\s+/.test(line)) {
            out.push(line.replace(/^\s*sc_calc\s+\d+/, `sc_calc 1`));
        } else if (/^\s*clearvar\s+\d+\s+/.test(line)) {
            out.push(line.replace(/^\s*clearvar\s+\d+/, `clearvar 1`));
        } else {
            out.push(line);
        }
    }

    // 2) ラベル生成
    const L_true = newLabel();
    const L_false = newLabel();
    const L_end = newLabel();

    // sc_if の形式: sc_if <condExpr> <trueLine> <falseLine>
    out.push(`sc_if ${condExpr} ${L_true} ${L_false}`);

    // 3) true ブロック
    out.push(`${L_true}:`);
    // 条件で使った temps はここで解放（即解放）
    for (const t of temps) {
        out.push(`clearvar 1 program["${t}"] 2`);
    }
    for (let i = 0; i < node.trueBody.length; i++) {
        const stmt = node.trueBody[i];
        const code = generate(stmt);
        out.push(...code.split("\n"));
    }
    // trueBody の最後が doNext=true なら falseBody をスキップして end へ
    const lastTrue = node.trueBody.length ? node.trueBody[node.trueBody.length - 1] : null;
    if (lastTrue && lastTrue.doNext) {
        out.push(`jumpto ${L_end}`);
    }

    // 4) false ブロック
    out.push(`${L_false}:`);
    // 再度 temps を解放（true 側と同様に即解放）
    for (const t of temps) {
        out.push(`clearvar 1 program["${t}"] 2`);
    }
    if (node.falseBody) {
        for (let i = 0; i < node.falseBody.length; i++) {
            const stmt = node.falseBody[i];
            const code = generate(stmt);
            out.push(...code.split("\n"));
        }
        // falseBody の最後が doNext=true なら fallthrough（end に到達）
    }

    // 5) end ラベル
    out.push(`${L_end}:`);

    return out.join("\n");
}
*/
function generateIf(node) {
    const res = buildConditionForIf(node.condition);
    const out = [];

    // 1) preCode があればそのまま追加（中間命令は既に正規化済み）
    if (res.preCode && res.preCode.length) {
        out.push(...res.preCode);
    }

    // 2) condExpr があるなら通常の sc_if を出す。true/false ラベルは新規生成。
    let L_true = res.trueLabel || newLabel();
    let L_false = res.falseLabel || newLabel();
    const L_end = newLabel();

    if (res.condExpr != null) {
        out.push(`sc_if ${res.condExpr} ${L_true} ${L_false}`);
    } else {
        // condExpr == null の場合、buildConditionForIf が既に出力した preCode に
        // sc_if と true/false ラベルを含めているので L_true/L_false are from res
        L_true = res.trueLabel;
        L_false = res.falseLabel;
        // nothing to push here (preCode already contains sc_if)
    }

    // 3) true block
    out.push(`${L_true}:`);
    // 条件で使った temps を解放（即解放）
    for (const t of (res.temps || [])) {
        out.push(`clearvar 1 program["${t}"] 2`);
    }
    for (const stmt of node.trueBody) {
        out.push(...generate(stmt).split("\n"));
    }
    const lastTrue = node.trueBody.length ? node.trueBody[node.trueBody.length - 1] : null;
    if (lastTrue && lastTrue.doNext) {
        out.push(`jumpto ${L_end}`);
    }

    // 4) false block
    out.push(`${L_false}:`);
    for (const t of (res.temps || [])) {
        out.push(`clearvar 1 program["${t}"] 2`);
    }
    if (node.falseBody) {
        for (const stmt of node.falseBody) {
            out.push(...generate(stmt).split("\n"));
        }
    }

    // 5) end
    out.push(`${L_end}:`);
    return out.join("\n");
}
function generate(node) {
    switch (node.type) {

        case "Program":
            return generateProgram(node);

        case "Console":
            return generateConsole(node);

        case "Set":
            return generateSet(node);
			
		case "Calc":
			return generateCalc(node);
			
		case "if":
			return generateIf(node);

        // 他のノードは後で追加

        default:
            throw new Error("Unknown node type: " + node.type);
    }
}

