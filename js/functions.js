/*
	returnについて
	return [num, data];
	num:
		0 ボタン待ち
		1 次に進む
		2 dataが0-basedの次に実行する行番号
		10 sc_varを保存してボタン待ち
		11 sc_varを保存して次に進む
	関数一覧:
		sc_if:
			第一引数 条件式 変数、[true/false]、数値、==,!=,>=,<=,>,<を利用可能
			第二引数 条件式がtrueのときに実行する行番号(1-based)
			第三引数 条件式がfalseのときに実行する行番号(1-based)
			return [2, result ? trueLine : falseLine]
		jumpto:
			第一引数 次に実行する行番号(1-based)
			return [2, Number(args[0]) - 1]
		setvar:
			第一引数 do_nextフラグ[0/1]
			第二引数 設定する変数名(変数名、配列内アクセス、辞書内アクセス)
			第三引数 代入する値("文字列"、数値、配列[]、辞書{}、変数名、配列内アクセス、辞書内アクセス)
			return [11, null] / [10, null];
		sc_calc:
			第一引数 do_nextフラグ[0/1]
			第二引数 計算に使う変数(変数名、配列内アクセス、辞書内アクセス)
			第三引数 演算子(+,-,*,/,%,^)
			第四引数 計算に使う変数または値など(変数名、配列内アクセス、辞書内アクセス、"文字列(+=のみ)"、数値)
			return [11, null] / [10, null]
		dialogue:
			注意: テスト用関数。disp_textへ統合
			第一引数 内容
			第二引数 nomal/html
			第三引数 内部キャラ名
			第四引数 表示キャラ名
			第五引数 補助オプション
			return [0, null]
		debug_dispvar: //パス 今ある内容を消すかどうか do_next
			注意: テスト用関数。disp_textへ統合
			第一引数 表示変数のパス
			第二引数 表示中の内容を消す[0/1]
			第三引数 do_nextフラグ[0/1]
			return [1, null] / [0, null]
		dispIMG:
			第一引数 do_nextフラグ
			第二引数 適応先id
				bg 背景
				chara キャラクター立ち絵
			第三引数 1:表示/0:非表示
			return [1, null] / [0, null]
		statusIMG:
			第一引数 do_nextフラグ
			第二引数 適応先id
				bg 背景
				chara キャラクター立ち絵
			第三引数 ASSETS.以降のパス(svg["~~~~"]など)
			第四引数 x軸方向親要素に対する相対座標(%)
			第五引数 y軸方向親要素に対数相対座標(%)
			第六引数 x軸方向親要素に対する相対サイズ(%)
			第七引数 y軸方向親要素に対する相対サイズ(%)
			return [1, null] / [0, null]
		sympleBGchange:
			注意: テスト用関数。dispIMGへ統合
			第一引数 画像パス(ASSETS.img内)
			第二引数 画像を表示するか[0/1]
			第三引数 画像を消すか[0/1]
			第四引数 do_nextフラグ[0/1]
			return [1, null] / [0, null]
		console_dispvar:
			注意: テスト用関数。disp_textへ統合
			第一引数 変数パス
			第二引数 do_nextフラグ[0/1]
			return [1, null] / [0, null]
		clear_scline_counter:
			引数なし
			return [1, null]
		disp_text:
			第一引数 do_nextフラグ
			第二引数 表示場所[dialogue/console/その他は表示場所のid]
			第三引数 表示内容(${sc_varの中のパス}でその変数内のデータを文字列に変換したもの、エスケープされてない<は次の>までをhtml要素として扱う。これには対応する</～>が必要となる)
			第四引数 スタイル設定名(デフォルト値はNone)
			第五引数 表示名(""で囲む。""なしNoneは表示名を表示しない)<漢字:ルビ>でルビを表現
			×第六引数 [表示内容に含めたhtml要素のid,適応したいstyle要素]のリスト
			第六引数 {設定項目:値}
		parallel:
			第一引数 do_nextフラグ[0/1]
			第二引数 行番号/funcName(args)
			第三引数 行番号/funcName(args)
		clearvar:
			第一引数 do_nextフラグ
			第二引数 変数パス
			第三引数 設定:
				1:再帰的に下層をundefinedに置き換え(辞書のキーは残す)
				2:変数自体の削除(その下層の変数も)->配列は消した分詰められる
				3:最外層のみundefinedに置き換え
		vibration:
			第一引数 do_nextフラグ
			第二引数 持続時間[s]
		jsRun:
			第一引数 do_nextフラグ
			第二引数 jsスクリプト
		end:
			引数なし
			return [1, null]
*/
import { sc_var, ASSETS } from './engine.js';
let audioCtx = null;
export function stopAllSounds() {
    if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.suspend();
    }
}
function setvar_logical({ path, value }) {// path: ["a", 1, "key", ...] value: 代入する値
    if (typeof sc_var !== "object" || sc_var === null) {
        sc_var = {};
    }
	if (typeof value === "object" && value.varRef) {
		const path = parseSetvarPath(value.varRef);
		value = GetValueFromsc_var(path);
	}
    let current = sc_var;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        if (current[key] === undefined) {
            current[key] = (typeof nextKey === "number") ? [] : {};
        }
        if (Array.isArray(current[key]) && typeof nextKey === "string") {
			console.log(`${current}が辞書に置換されました`);
            current[key] = {};  // 辞書に上書き
        }
        if (!Array.isArray(current[key]) && typeof nextKey === "number") {
            const newArr = [];
			console.log(`${current}が配列に置換されました`);
            current[key] = newArr;  // 配列に上書き
        }
        current = current[key];
    }
    const lastKey = path[path.length - 1];
    current[lastKey] = value;
    return true;
}
function parseSetvarPath(raw) { //a[1]["key"][2] → ["a", 1, "key", 2]
    const path = [];
    const first = raw.split("[")[0];
    path.push(first);
    const regex = /\[(.*?)\]/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
        const token = match[1];

        if (/^\d+$/.test(token)) {
            path.push(Number(token));
            continue;
        }
        if (/^".*"$/.test(token)) {
            path.push(token.slice(1, -1));
            continue;
        }
        path.push(token);
    }
    return path;
}
function parseSetvarValue(raw) {
    if (/^".*"$/.test(raw)) {
        return raw.slice(1, -1);
    }
    if (/^-?\d+(\.\d+)?$/.test(raw)) {
        return Number(raw);
    }
    if (/^\[.*\]$/.test(raw)) {
        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }
    if (/^\{.*\}$/.test(raw)) {
        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }
    if (/^[A-Za-z_]/.test(raw)) {
        return { varRef: raw };
    }
    return raw;
}
function GetValueFromsc_var(path) { // path: ["a", 1, "key"]
    if (typeof sc_var !== "object" || sc_var === null) {
        return undefined;
    }
    let current = sc_var;
    for (let i = 0; i < path.length; i++) {
        const key = path[i];

        if (current[key] === undefined) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}

export const COMMANDS = {
	sc_if: (args) => {
		const condition = args[0];
		const trueLine = Number(args[1]) - 1;
		const falseLine = Number(args[2]) - 1;

		const match = condition.match(/(.+?)(==|!=|>=|<=|>|<)(.+)/);
		const leftKey = match[1].trim();
		const op = match[2];
		const rightRaw = match[3].trim();

		const left = sc_var[leftKey];
		const right = isNaN(rightRaw)
			? sc_var[rightRaw] ?? rightRaw.replace(/"/g, "")
			: Number(rightRaw);

		let result = false;
		switch (op) {
			case "==": result = (left == right); break;
			case "!=": result = (left != right); break;
			case ">":  result = (left >  right); break;
			case "<":  result = (left <  right); break;
			case ">=": result = (left >= right); break;
			case "<=": result = (left <= right); break;
		}

		return [2, result ? trueLine : falseLine];
	},
	jumpto: (args) => [2, Number(args[0]) - 1],
	setvar: (args) => { //args = [do_next_flag, left_raw, right_raw]
		const doNextFlag = Number(args[0]);
		const leftRaw = args[1];
		const rightRaw = args[2];
		const path = parseSetvarPath(leftRaw);
		const value = parseSetvarValue(rightRaw);
		setvar_logical({ path, value });
		return doNextFlag === 1 ? [11, null] : [10, null];
	},
	sc_calc: (args) => { // args = [do_next, left_raw, operator, right_raw]
		const doNextFlag = Number(args[0]);
		const leftRaw = args[1];
		const operator = args[2];
		const rightRaw = args[3];
		const leftPath = parseSetvarPath(leftRaw);
		let rightValue;
		if (/^-?\d+(\.\d+)?$/.test(rightRaw)) {
			rightValue = Number(rightRaw);
		} else {
			const rightPath = parseSetvarPath(rightRaw);
			rightValue = GetValueFromsc_var(rightPath);
		}
		let leftValue = GetValueFromsc_var(leftPath);
		if (leftValue === undefined) {
			leftValue = 0;
		}
		if (typeof rightValue !== "number" || isNaN(rightValue)) {
			console.warn("sc_calc: 計算に使う引数が文字列/リスト/辞書/未定義だったため、計算は行われませんでした。");
			return doNextFlag === 1 ? [11, null] : [10, null];
		}
		let result;
		switch (operator) {
			case "+":
				result = leftValue + rightValue;
				break;
			case "-":
				result = leftValue - rightValue;
				break;
			case "*":
				result = leftValue * rightValue;
				break;
			case "/":
				if (rightValue === 0) {
					console.warn("sc_calc: 0 で割ることはできません。計算は行われませんでした。");
					return doNextFlag === 1 ? [11, null] : [10, null];
				}
				result = leftValue / rightValue;
				break;
			case "%":
				if (rightValue === 0) {
					console.warn("sc_calc: 0 で割ることはできません（剰余）。計算は行われませんでした。");
					return doNextFlag === 1 ? [11, null] : [10, null];
				}
				result = leftValue % rightValue;
				break;
			case "^":
				result = leftValue ** rightValue;
				break;
			default:
				console.warn(`sc_calc: 未対応の演算子 '${operator}' が指定されました。`);
				return doNextFlag === 1 ? [11, null] : [10, null];
		}
		setvar_logical({ path: leftPath, value: result });
		return doNextFlag === 1 ? [11, null] : [10, null];
	},
	dialogue: (args) => { //未完成->テスト用
		if (args[1] === "html") {
			document.getElementById("textcontent").innerHTML = args[0];
		} else {
			document.getElementById("textcontent").textContent = args[0];
		}
		return [30, null];
	},
	debug_dispvar: (args) => { //パス 今ある内容を消すかどうか do_next
		const varName = args[0];
		let content = "";
		if (sc_var[varName] === undefined) {
			content = `<pre>${varName} is undefined</pre>`;
		} else {
			content = `<pre>${varName} = ${JSON.stringify(sc_var[varName], null, 2)}</pre>`;
		}
		const debugArea = document.getElementById("textcontent");
		if (debugArea) {
			if (args[1] === "1") {
				debugArea.innerHTML = "";
			}
			debugArea.innerHTML += content;
		}
		return args[2] === "1" ? [31, null] : [30, null];
	},
	dispIMG: (args) => { //do_nextフラグ 適応先id 1:表示/0:非表示
		const disp_id = args[1];
		return args[0] === "1" ? [31, null] : [30, null];
		//未完成
	},
	statusIMG: (args) => { //do_nextフラグ 適応先id ASSETS.以降のパス(svg["~~~~"]など) x軸方向親要素に対する相対座標(%) y軸方向親要素に対数相対座標(%) x軸方向親要素に対する相対サイズ(%) y軸方向親要素に対する相対サイズ(%)
		const disp_id = args[1];
		const match = args[2].match(/^([a-zA-Z0-9_]+)\["([^"]+)"\]$/);
		if (match) {
			const [img_type, key] = [match[1], match[2]];
		}
		if (disp_id === "bg") {
			const elemen = document.querySelector("#gamebg");
			if (elemen) {
				if (img_type === "svg") {
					elemen.style.setProperty("--gamebg-url", ASSETS.svg[key]);
				} else {
					elemen.style.setProperty("--gamebg-url", ASSETS.imgs[key]);
				}
			}
		} else if (disp_id === "chara") {
			
		} else {
			//未完成
		}
		return args[0] === "1" ? [1, null] : [0, null];
		//未完成
	},
	sympleBGchange: (args) => { //テスト用 パス つける[0/1] 消す[0/1] do_next
		const obj = document.getElementById("gamebg");
		if (args[1] === "1") {
			obj.style.width = "calc(100vh * 9 / 16)";
			obj.style.height = "70%";
			obj.innerHTML = `<img src="${ASSETS.imgs[args[0]]}" style="width: calc(100vh * 9 / 16); height: 100%;"/>`;
		}
		if (args[2] === "1") {
			obj.innerHTML = "";
		}
		return args[3] === "1" ? [1, null] : [0, null];
	},
	console_dispvar: (args) => { //パス do_nextフラグ->テスト用
		const pathString = args[0]
		try {
			// パスを配列に変換（例: "a[1][\"x\"]" → ["a", 1, "x"]）
			const path = parseSetvarPath(pathString);
			const value = GetValueFromsc_var(path);
			console.log(`${pathString} =`, value);
		} catch (e) {
			console.warn(`console_dispvar: パス解析に失敗しました → ${pathString}`, e);
		}
		return args[1] === "1" ? [1, null] : [0, null];
	},
	clear_scline_counter: (args) => {
		scline_counter = [];
		return [1, null];
	},
	disp_text: (args) => { 
			//第一引数 do_nextフラグ
			//第二引数 表示場所[dialogue/console/その他は表示場所のid]
			//第三引数 表示内容(${sc_varの中のパス}でその変数内のデータを文字列に変換したもの、エスケープされてない<は次の>までをhtml要素として扱う。これには対応する</～>が必要となる)
			//第四引数 スタイル設定名(デフォルト値はNone)
			//第五引数 表示名(""で囲む。""なしNoneは表示名を表示しない)
			//×第六引数 [表示内容に含めたhtml要素のid,適応したいstyle要素]のリスト
			//第六引数 一番上を見る
		//
		const replaceTemplateText = (Text_rtt) => {
			const regex = /(\\\$\{. +?\})|\$\{(.+?)\}/g;
			const result = Text_rtt.replace(regex, (match, p1, p2) => {
				if (p1) {
				// \${...} だった場合は、何もせずそのままの文字列（match）を返す
				return match; 
				}
				if (p2) {
				// ${...} だった場合は、関数を使って値を取得し、その値で置き換える
				const path = parseSetvarPath(p2); // p2 には ${} の中身（iなど）が入っている
				const value = GetValueFromsc_var(path);
				return value;
				}
			});
			return result;
		}
		
		const apply_setting_text = (setting) => {
			//設定を適応するだけの関数内関数
		}
		
		const do_next_flag = args[0] === "1";
		//consoleはここで表示して出ていく
		let disp_area;
		if (args[1] === "console") {
			const disp_content = replaceTemplateText(args[2]);
			console.log(disp_content);
			return args[0] === "1" ? [1, null] : [0, null];
		} else if (args[1] === "dialogue") {
			disp_area = document.getElementById("textcontent");
		} else {
			disp_area = document.getElementById(args[1]);
		}
		const disp_content = replaceTemplateText(args[2]);
		disp_area.innerHTML = disp_content;
		
		if (args[3] !== "None") apply_setting_text(args[3]);
		if (args[4] !== "None") { //名前のルビ
			let text = args[4];
			let convertedText = text.replace(/<([^>:]+):([^>]+)>/g, '<ruby>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>');
			document.getElementById("charaname").innerHTML = convertedText;
		}
		if (args[1] === "dialogue") return args[0] === "1" ? [31, null] : [30, null];
		return args[0] === "1" ? [1, null] : [0, null];
		////////////////途中
	},
	/*
			第一引数 do_nextフラグ
			第二引数 表示場所[dialogue/console/その他は表示場所のid]
			第三引数 表示内容(${sc_varの中のパス}でその変数内のデータを文字列に変換したもの、エスケープされてない<は次の>までをhtml要素として扱う。これには対応する</～>が必要となる)
			第四引数 スタイル設定名(デフォルト値はNone)
			第五引数 表示名(""で囲む。""なしNoneは表示名を表示しない)
			第六引数 上を見る
	*/
	clearvar: (args) => {
		const do_next = args[0]; // "1" または "0"
		const rawPath = args[1]; // 例: 'a[5]["b"]'
		const setting = args[2]; // "1", "2", "3"
		const pathKeys = parseSetvarPath(rawPath);
		if (!pathKeys || pathKeys.length === 0) {
			return do_next === "1" ? [11, null] : [10, null];
		}
		let current = sc_var;
		for (let i = 0; i < pathKeys.length - 1; i++) {
			const key = pathKeys[i];
			if (current === null || typeof current !== 'object') {
				// 途中のパスが存在しない場合は終了
				return do_next === "1" ? [11, null] : [10, null];
			}
			current = current[key];
		}
		const targetKey = pathKeys[pathKeys.length - 1];
		if (current === null || typeof current !== 'object') {
			return do_next === "1" ? [11, null] : [10, null];
		}

		const setUndefinedRecursive = (obj) => {
			if (obj === null || typeof obj !== 'object') return;
			
			for (const k in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, k)) {
					if (obj[k] !== null && typeof obj[k] === 'object') {
						setUndefinedRecursive(obj[k]);
					} else {
						obj[k] = undefined;
					}
				}
			}
		};

		if (setting === "1") {
			const targetValue = current[targetKey];
			if (targetValue !== null && typeof targetValue === 'object') {
				setUndefinedRecursive(targetValue);
			} else {
				current[targetKey] = undefined;
			}
		} else if (setting === "2") {
			if (Array.isArray(current)) {
				current.splice(Number(targetKey), 1);
			} else {
				delete current[targetKey];
			}
		} else if (setting === "3") {
			current[targetKey] = undefined;
		}

		return do_next === "1" ? [11, null] : [10, null];
	},
	/*
	vibration: (args) => {
		// 1. 本物のバイブレーションを試みる（Android用）
		if (navigator.vibrate) {
			navigator.vibrate(Number(args[1])*1000);
		}

		// 2. 視覚的なバイブレーション（iPhone/PC用）
		const target = document.body;
		
		// すでにクラスがついていたら一旦リセット（連続タップ対策）
		target.classList.remove("vibrate-shake");
		
		// 改めてクラスを付与して揺らす reflow（再レンダリング）
		void target.offsetWidth; 
		target.classList.add("vibrate-shake");

		// 指定時間が経ったら揺れを止める
		setTimeout(() => {
			target.classList.remove("vibrate-shake");
		}, Number(args[1])*1000);
		return args[0] === "1" ? [11, null] : [10, null];
	}, */
	vibration: (args) => {
		const durationMs = Number(args[1]) * 1000; // 秒をミリ秒に変換

		// 1. 本物のバイブレーションを試みる（Android用）
		if (navigator.vibrate) {
			navigator.vibrate(durationMs);
		}

		// 2. 視覚的なバイブレーション（iPhone/PC用）
		const target = document.body;
		target.classList.remove("vibrate-shake");
		void target.offsetWidth; // reflow
		target.classList.add("vibrate-shake");

		setTimeout(() => {
			target.classList.remove("vibrate-shake");
		}, durationMs);

		//  3. 疑似バイブレーション音を鳴らす（iPhone/PC用）
		try {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (AudioContextClass) {
				// まだ初期化されていなければ作成
				if (!audioCtx) {
					audioCtx = new AudioContextClass();
				}
				// Safari対策：一時停止状態なら再開させる
				if (audioCtx.state === 'suspended') {
					audioCtx.resume();
				}

				// 音源ノードとボリュームノードの作成
				const oscillator = audioCtx.createOscillator();
				const gainNode = audioCtx.createGain();

				oscillator.type = 'triangle';       // スマホ内蔵スピーカーでも聞こえやすい三角波
				oscillator.frequency.value = 90;    // バイブ特有の「ブー」という重低音（90Hz）

				const startTime = audioCtx.currentTime;
				const endTime = startTime + (durationMs / 1000);

				// 音量設定（鳴り始めは大きく、終わり際にプツッとならないよう一瞬でフェードアウト）
				//gainNode.gain.setValueAtTime(0.8, startTime);
				//gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
				const startVibTime = audioCtx.currentTime;
				const durationSec = durationMs / 1000; // ミリ秒を秒に変換
				const endVibTime = startTime + durationSec;
				// ※もし全体の長さが0.1秒より短い場合は、全体の1割の時間をフェードアウトに充てる安全弁付き
				const fadeDuration = Math.min(0.1, durationSec * 0.1); 
				const fadeStartTime = endTime - fadeDuration; // フェードアウトを開始する時間

				// --- 音量のタイムラインを設定 ---

				// 1. 鳴り始め：音量を 0.8 にセット
				gainNode.gain.setValueAtTime(0.8, startVibTime);

				// 2. フェードアウト開始直前まで：音量 0.8 をがっちりキープ！
				gainNode.gain.setValueAtTime(0.8, fadeStartTime);

				// 3. 最後のコンマ数秒：一気に 0 まで滑らかに減衰（linearRampを使用）
				// exponentialRampは0にできない仕様（エラーになる）があるため、完全に消音するなら linearRamp が確実
				gainNode.gain.linearRampToValueAtTime(0.0, endVibTime);
				// 配線して再生・停止予約
				oscillator.connect(gainNode);
				gainNode.connect(audioCtx.destination);
				
				oscillator.start(startTime);
				oscillator.stop(endTime); // ここで指定秒数後に止まるよう予約される（非同期）
			}
		} catch (e) {
			console.error("Web Audio API の再生に失敗しました:", e);
		}

		return args[0] === "1" ? [11, null] : [10, null];
	},
	jsRun: (args) => {
		try {
        	// 新しい関数オブジェクトを作って即座に実行する
        	const fn = new Function(args[1]);
			console.log(fn());
		} catch (error) {
			console.error("実行エラー:", error);
		}
		return args[0] === "1" ? [11, null] : [10, null]
	},
	end: (args) => [0, null]
};
