import { COMMANDS, stopAllSounds, settingsJson } from './functions.js';
let is_localStorage_allowed = false;
let last_sc_line = -1; //0-based
let last_sc_line_inSummary = -1; //0-based
//臨時に関数間を超えて実行する。
export let do_inaninstant = false;
let SCENARIO = [];
let SCENARIO_ARGS = [];
export let current_display = "index";
let jump_target = null;
export let sc_var = {};
let scline_counter = [];
export let audioCtx = null;
let WfTDA_global = false; // 「続きを読む」の待機状態かどうかのフラグ Waiting for Text Display Adjustment: セリフの表示調整待ち
let remainingText = ""; // はみ出した残りの文章を保持する変数
//画像読み込み不全時の代替画像
export const errorImageUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIj4gICA8ZGVmcz4gICAgIDxwYXR0ZXJuIGlkPSJjaGVja2VyYm9hcmQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+ICAgICAgIDxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIvPiAgICAgICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRjAwRkYiLz4gICAgICAgPHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRjAwRkYiLz4gICAgIDwvcGF0dGVybj4gICA8L2RlZnM+ICAgPHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9InVybCgjY2hlY2tlcmJvYXJkKSIvPiA8L3N2Zz4=";
let ARASUZI = {};
let released_arasuzi = [];
export let camera_status = "prompt";
let backlog = [];//[番号, [キャラid, キャラ表示名], 本文]
let logoanim_flag = false;
export let summary_sc_var = {};
let record_summary_do_scenario = {}; //それぞれの話の振り返りでもっと思い出す時に再生するsc番号
let record_playback_num = 0;
let panZoomInstance = null;
let typewriter_flag = false;
let isChangingHTML = false; //ロゴアニメーション時に非同期にしてもロジックを崩さないため
let isAnimating = false;
let isAnimatingChecking = false;
let isAutoMode = false;
let isDoNext = false;
let isQrOrPuzzle = false;
let isOnScenario = false;
let isAllowedContentdivIsOpenRemove = true;
export let current_qr = "before_begin";
export let scanned_qr = [];
export let settings = {
	"typewriter": "normal",
	"automode": "normal",
};
const settings_choices = {
	"typewriter": ["immediately", "fast", "normal", "slow"],
	"automode": ["fast", "normal", "slow"]
}

let isdev = false;

const OriginalConsoleLog = console.log;
const OriginalConsoleWarn = console.warn;
const OriginalConsoleError = console.error;

console.log = function(...args) {
	OriginalConsoleLog.apply(console, args);
	if (isdev) {
		document.body.insertAdjacentHTML('afterbegin', `<p id="isdevconsole" style="color: #FFF">${args}</p>`);
		setTimeout(() => {
			const removecontent = document.getElementById("isdevconsole");
			if (removecontent) removecontent.remove();
		}, 1000);
	}
}
console.warn = function(...args) {
	OriginalConsoleWarn.apply(console, args);
	if (isdev) {
		document.body.insertAdjacentHTML('afterbegin', `<p id="isdevconsole" style="color: #FF0">${args}</p>`);
		setTimeout(() => {
			const removecontent = document.getElementById("isdevconsole");
			if (removecontent) removecontent.remove();
		}, 5000);
	}
}
console.error = function(...args) {
	OriginalConsoleError.apply(console, args);
	if (isdev) {
		document.body.insertAdjacentHTML('afterbegin', `<p id="isdevconsole" style="color: #F00">${args}</p>`);
		setTimeout(() => {
			const removecontent = document.getElementById("isdevconsole");
			if (removecontent) removecontent.remove();
		}, 10000);
	}
}

console.log("engine.js起動")

export const ASSETS = {
	"html": {},
	"imgs": {},
	"audio": {},
	"css": {},
	"svg": {}
};
export const changeIsOnScenario = (flag) => {
	isOnScenario = flag;
}
//アニメーションを管理して、全て長くなった段階でisAnimatingをfalseに変える
let animEndTime = 0;
let observerTimerId = null;
const AnimationObserver = () => {
	if (observerTimerId !== null) {
        clearInterval(observerTimerId);
        observerTimerId = null;
    }
	const timerId = setInterval(() => {
		//console.log("現在:", Date.now(), "チェック:", animEndTime);
        if (Date.now() >= animEndTime) {
            isAnimating = false; // 時刻を過ぎたらfalseに変える
			if (!typewriter_flag) {
				const nextbutton = document.getElementById("nextbutton");
				if (nextbutton) nextbutton.disabled = false;
			}
            clearInterval(timerId);
			observerTimerId = null;
            return;
        }
    }, 10);
}
export const animManager = (durationMs) => {
	const normalizedDurationMs = Number(durationMs);
	if (!Number.isFinite(normalizedDurationMs) || normalizedDurationMs <= 0) return;
	const boolean_isAnimating = isAnimating;
	const endTime = Date.now() + normalizedDurationMs;
	if (endTime > animEndTime) animEndTime = endTime;
	isAnimating = true;
	if (!boolean_isAnimating) AnimationObserver();
};
//functions.jsでcurrent_qrに変数代入するための関数
export function changeCurrentQr(value) {
	current_qr = value;
}
//動作を止めるsleep関数
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//サイトデータリセット関数
async function resetSiteAndReload() {
	// localStorage
	localStorage.clear();
	// sessionStorage
	sessionStorage.clear();
	// IndexedDB
	if (indexedDB.databases) {
		const dbs = await indexedDB.databases();
		await Promise.all(
		dbs
			.filter(db => db.name)
			.map(
			db =>
				new Promise(resolve => {
				const req = indexedDB.deleteDatabase(db.name);
				req.onsuccess = req.onerror = req.onblocked = () => resolve();
				})
			)
		);
	}
	// Cache Storage
	if ("caches" in window) {
		const keys = await caches.keys();
		await Promise.all(keys.map(key => caches.delete(key)));
	}
	// Service Worker
	if ("serviceWorker" in navigator) {
		const regs = await navigator.serviceWorker.getRegistrations();
		await Promise.all(regs.map(reg => reg.unregister()));
	}
	// Cookie (JavaScriptから見えるもの)
	document.cookie.split(";").forEach(cookie => {
		const name = cookie.split("=")[0].trim();
		// path=/
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
		// 現在のpath
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
	});
	// 少し待ってからリロード
	setTimeout(() => {
		const url = new URL(location.href);
		url.searchParams.delete("reset");
		location.replace(url.toString());
	}, 100);
}
/**
 * 指定した要素がDOMに出現するまで待つ（すでにあれば即座に返す）
 * @param {string} selector - 探したい要素のセレクタ（例: '#new-btn' や '.submit'）
 * @returns {Promise<Element>} - 見つかったDOM要素
 */
const waitForElement = (selector) => {
    return new Promise((resolve) => {
        // 1. 最初の一歩：すでに対象の要素が存在するかチェック
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element); // すでにあるなら、待たずに即終了！
        }
        // 2. まだない場合は、DOMの更新（描画）を待ちながらループする
        const check = () => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el); // 見つかったら終了
            } else {
                // まだなければ、次の描画タイミングで再チェック
                requestAnimationFrame(check);
            }
        };
        // ループを開始
        requestAnimationFrame(check);
    });
};
/**
 * 指定した要素の id が変化する、またはすでに特定の id になっているまで待機する関数
 * @param {Element|string} target - 監視するDOM要素、またはセレクター
 * @param {string|null} expectedId - 「もしすでにこのidだったら即座に完了する」という期待値 (省略可)
 * @param {number} timeout - タイムアウト時間(ミリ秒) - デフォルト10秒
 * @returns {Promise<string>} 確定したid
 */
function waitForIdChange(target, expectedId = null, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        if (!el) {
            return reject(new Error("waitForIdChange: 監視対象の要素が見つかりません。"));
        }

        const currentId = el.id;

        // 【追加】すでに期待する id になっていた場合、または指定がなくてすでにidが変わっていた場合は即座に解決
        if (expectedId !== null ? currentId === expectedId : false) {
            return resolve(currentId);
        }

        const oldId = currentId;
        let timer = null;

        const observer = new MutationObserver((mutations, obs) => {
            for (const mutation of mutations) {
                if (mutation.type === "attributes" && mutation.attributeName === "id") {
                    const newId = el.id;
                    
                    // 期待するidに変わった場合、または単にoldIdから変化した場合
                    const isTargetReached = expectedId !== null ? newId === expectedId : newId !== oldId;

                    if (isTargetReached) {
                        obs.disconnect();
                        if (timer) clearTimeout(timer);
                        resolve(newId);
                        break;
                    }
                }
            }
        });

        observer.observe(el, {
            attributes: true,
            attributeFilter: ["id"]
        });

        if (timeout > 0) {
            timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error("waitForIdChange: id の変更がタイムアウトしました。"));
            }, timeout);
        }
    });
}
//indexedDBの定義
const openAssetsDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ASSETS_DB", 4);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // HTML
            if (!db.objectStoreNames.contains("html")) {
                db.createObjectStore("html", { keyPath: "path" });
            }
			//CSS
			if (!db.objectStoreNames.contains("css")) {
				db.createObjectStore("css", { keyPath: "path" });
			}
            // 画像
            if (!db.objectStoreNames.contains("image")) {
                db.createObjectStore("image", { keyPath: "path" });
            }
            // 音声
            if (!db.objectStoreNames.contains("audio")) {
                db.createObjectStore("audio", { keyPath: "path" });
            }
			// シナリオファイル
            if (!db.objectStoreNames.contains("scenario")) {
                db.createObjectStore("scenario", { keyPath: "path" });
            }
			//scファイルに与える自由領域
			if (!db.objectStoreNames.contains("scenario_vars")) {
				db.createObjectStore("scenario_vars", { keyPath: "key" });
			}
			// svgファイル
			if (!db.objectStoreNames.contains("svg")) {
				db.createObjectStore("svg", { keyPath: "path" });
			}
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
//indexedDBからファイルを読み取り
const dbGet = (db, storeName, path) => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(path);

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
//indexedDBにファイル保存
const dbPut = (db, storeName, record) => {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(record);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}
/**
 * CSS文字列内の url() で指定されたフォントファイルを検出し、Base64に置き換える
 */
const embedFontsAsBase64 = async (cssText) => {
    // url('...') や url("...") 内のパスを抽出する正規表現
    // 例: src: url('../fonts/font.woff2') format('woff2');
    const fontUrlRegex = /url\(['"]?([^'"]+\.(woff2|woff|ttf|otf))['"]?\)/g;
    
    let updatedCss = cssText;
    const matches = [...cssText.matchAll(fontUrlRegex)];

    for (const match of matches) {
        const originalUrl = match[1]; // 例: "../fonts/font.woff2"
        
        try {
            // パスから実際にフォントファイルをフェッチする
            const response = await fetch(originalUrl, { cache: 'no-store' });
            const blob = await response.blob();
            
            // BlobをBase64のDataURLに変換する
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // CSS内の該当するパスをBase64文字列に置換
            updatedCss = updatedCss.replace(originalUrl, base64Data);
        } catch (e) {
            console.error(`フォントのBase64変換に失敗しました: ${originalUrl}`, e);
        }
    }

    return updatedCss;
};
//ASSETSにロード
const loadToASSETS = async (storeName, path, data) => {
    if (storeName === "html") {
        ASSETS.html[path] = data;
    }
	if (storeName === "css") {
		const processedCss = await embedFontsAsBase64(data);
        const blob = new Blob([processedCss], { type: 'text/css' });
        ASSETS.css[path] = URL.createObjectURL(blob);
    }
    if (storeName === "image") {
        ASSETS.imgs[path] = URL.createObjectURL(data);
    }
    if (storeName === "audio") {
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
        ASSETS.audio[path] = new Audio(url);
    }
	if (storeName === "svg") {
		ASSETS.svg[path] = data;
	}
}
//プログレスバー更新
function makeProgressUpdater(total) {
    let count = 0;
    return function (path) {
        count++;
        document.getElementById("progress-bar")
            .setAttribute("width", 300 * (count / total));
        document.getElementById("loadprogress_discription").textContent = path;
    };
}
//1ファイルロード
const loadOneFile = async (db, storeName, path, version, updateProgress) => {
    const dbData = await dbGet(db, storeName, path);

    if (dbData && dbData.version === version) {
        await loadToASSETS(storeName, path, dbData.data);
        updateProgress(path);
        return;
    }

    const res = await fetch(path, { cache: 'no-store' });

    let data;
    if (storeName === "html" || storeName === "css" || storeName === "svg") {
        data = await res.text();
    } else if (storeName === "image") {
        data = await res.blob();
    } else if (storeName === "audio") {
        data = await res.arrayBuffer();
    }

    await dbPut(db, storeName, { path, version, data });
    await loadToASSETS(storeName, path, data);
    updateProgress(path);
}
//プリロード
async function setASSETS() {
    const db = await openAssetsDB();
    // HTML
    const htmlList = await fetch("ASSETScontents_html.txt", { cache: 'no-store' }).then(r => r.text());
    const htmlItems = htmlList.trim().split("\n").map(line => {
        const [path, version] = line.split("|");
        return { path, version };
    });
    const updateHTML = makeProgressUpdater(htmlItems.length);
    for (const item of htmlItems) {
        await loadOneFile(db, "html", item.path, item.version, updateHTML);
    }
	// CSS
	const cssList = await fetch("ASSETScontents_css.txt", { cache: 'no-store' }).then(r => r.text());
	const cssItems = cssList.trim().split("\n").map(line => {
		const [path, version] = line.split("|");
		return { path, version };
	});
	const updateCSS = makeProgressUpdater(cssItems.length);
	for (const item of cssItems) {
		await loadOneFile(db, "css", item.path, item.version, updateCSS);
	}
    // IMAGE
    const imgList = await fetch("ASSETScontents_image.txt", { cache: 'no-store' }).then(r => r.text());
    const imgItems = imgList.trim().split("\n").map(line => {
        const [path, version] = line.split("|");
        return { path, version };
    });
    const updateIMG = makeProgressUpdater(imgItems.length);
    for (const item of imgItems) {
        await loadOneFile(db, "image", item.path, item.version, updateIMG);
    }
    // AUDIO
    const audioList = await fetch("ASSETScontents_audio.txt", { cache: 'no-store' }).then(r => r.text());
    const audioItems = audioList.trim().split("\n").map(line => {
        const [path, version] = line.split("|");
        return { path, version };
    });
    const updateAudio = makeProgressUpdater(audioItems.length);
    for (const item of audioItems) {
        await loadOneFile(db, "audio", item.path, item.version, updateAudio);
    }
	// SVG
	const svgList = await fetch("ASSETScontents_svg.txt", { cache: 'no-store' }).then(r => r.text());
	const svgItems = svgList.trim().split("\n").map(line => {
		const [path, version] = line.split("|");
		return { path, version };
	});
	const updateSVG = makeProgressUpdater(svgItems.length);
	for (const item of svgItems) {
		await loadOneFile(db, "svg", item.path, item.version, updateSVG);
	}
	// sc_var
	const saved = await dbGet(db, "scenario_vars", "sc_var");
	sc_var = saved?.data ?? {};
}
//あらすじのパースと保存
async function arasuzi_load() {
	const p1 = fetch("scenario/arasuzi.txt", { cache: 'no-store' })
		.then(response => response.text())
		.then(text => {
			const lines = text.split("\n");
			for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;

			const firstSpaceIndex = trimmed.indexOf(" ");
			if (firstSpaceIndex === -1) continue;

			const idStr = trimmed.substring(0, firstSpaceIndex);
			const contentStr = trimmed.substring(firstSpaceIndex + 1);

			const id = Number(idStr);
			if (isNaN(id)) continue;

			const decodedContent = contentStr
				.replace(/\\n/g, "\n")
				.replace(/\\s/g, " ");

			ARASUZI[id] = decodedContent;
			}
			//すでに途中までやっていたらそこまでやる
			const last_saved_scenario = Number(localStorage.getItem("last_sc_line") || -1);
			//console.log(last_saved_scenario, "までに解放されるあらすじを解放します\nSCENARIOの長さ: ", SCENARIO.length);
			if (last_saved_scenario >= 0) {
				for (let i = 0; i < SCENARIO.length; i++) {
					if (SCENARIO[i] === "release_arasuzi") {
						const arasuzi_num = Number(SCENARIO_ARGS[i][1]);
						if (!Number.isInteger(arasuzi_num) || arasuzi_num < 1) {
							console.warn(`release_arasuzi: 保存済み進行から復元するあらすじ番号 '${SCENARIO_ARGS[i][1]}' が不正です。`);
						} else {
							if (!released_arasuzi.includes(arasuzi_num)) released_arasuzi.push(arasuzi_num);
							//console.log("あらすじが解放されました: ", arasuzi_num);
						}
					}
					if (i >= last_saved_scenario) break;
				}
			}
		})
		.catch(error => {
			console.error("arasuzi.txtの読み込みに失敗しました:", error);
		});
	const p2 = fetch("scenario/record_summary.txt", { cache: 'no-store' })
		.then(response => response.text())
		.then(text => {
			text.trim().split('\n').forEach(line => {
				const numbers = line.trim().split(/\s+/).map(Number);
				const id = numbers[0];
				const value = [numbers[1], numbers[2]];
				record_summary_do_scenario[id] = value;
			});
		})
		.catch(error => {
			console.error("record_summary.txtの読み込みに失敗しました:", error);
		});
	await Promise.all([p1, p2]);
}
//シナリオファイル1ファイルロード
const loadOneScenario = async (db, path, version) => {
    const dbData = await dbGet(db, "scenario", path);
    if (dbData && dbData.version === version) {
        return dbData.data;
    }
    const text = await fetch(path, { cache: 'no-store' }).then(r => r.text());
    await dbPut(db, "scenario", {
        path,
        version,
        data: text
    });
    return text;
}
//シナリオの―パース
const parseScenario = (text) => {
    return text
        .trim()
        .split("\n")
        .map(line => {
            const parts = line.trim().split(/\s+/);
            const cmd = parts[0];
            const args = parts.slice(1).map(arg =>
                arg.replace(/\\s/g, " ").replace(/\\n/g, "\n")
            );
            return [cmd, args];
        });
}
//シナリオファイルの読み込み
const loadAndParse = async () => {
    const db = await openAssetsDB();
    const list = await fetch("ASSETScontents_scenario.txt", { cache: 'no-store' }).then(r => r.text());
    const lines = list.trim().split("\n");
    const tasks = lines.map(async (line) => {
        if (!line.trim()) return [];
        const [path, version] = line.trim().split("|");
        const text = await loadOneScenario(db, path, version);
        return parseScenario(text); 
    });
    const parsedResults = await Promise.all(tasks);
    const flatResults = parsedResults.flat(); 

    return {
        SCENARIO_COMMANDS: flatResults.map(item => item[0]),
        SCENARIO_ARGS: flatResults.map(item => item[1])
    };
}
//sc_varのindexedDBへの保存
const saveScVarToDB = async () => {
    const db = await openAssetsDB();
    await dbPut(db, "scenario_vars", {
        key: "sc_var",
        data: sc_var ?? {}
    });
}
const resetScenarioData = async () => {
	const isstartedatqr1_flag = sc_var["isStartedAtQr1"];
    sc_var = {};
	if (isstartedatqr1_flag === 1) sc_var["isStartedAtQr1"] = 1;
	WfTDA_global = false;
	remainingText = "";
	released_arasuzi = [];
	backlog = [];
	scanned_qr = JSON.parse(localStorage.getItem("scanned_qr") ?? "[]");
	current_qr = "before_begin";
    const db = await openAssetsDB();
    await dbPut(db, "scenario_vars", {
        key: "sc_var",
        data: sc_var
    });
}
const clearDispExp = () => {
	document.body.classList.remove("vibrate-shake");
	stopAllSounds();
}
//svgへのURL発行
function convertSvgToDataUrl(svgText) {
    if (!svgText.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const base64 = btoa(unescape(encodeURIComponent(svgText)));
    return `url("data:image/svg+xml;base64,${base64}")`;
}
function getSvgUrlFromASSETS(svgNAME) {
	const svgText = ASSETS.svg[svgNAME];
	const url = convertSvgToDataUrl(svgText);
	return url;
}
export function changeCssSvgUrl(TargetId, TargetVar, AssetsName) {
    try {
        const svgDataUrl = getSvgUrlFromASSETS(AssetsName);
        const elemen = document.querySelector(`#${TargetId}`);
        
        if (!elemen) {
            console.warn(`指定されたIDの要素が見つかりません: ${TargetId}`);
            return;
        }

        if (!svgDataUrl) {
            console.error(`SVGアセットが見つかりません: ${AssetsName}`);
            // url() で囲む必要がある場合は `url("${errorImageUrl}")` のようにしてください
            elemen.style.setProperty(TargetVar, errorImageUrl);
            return;
        }

        // CSSプロパティに設定（url()で囲む必要がある場合は `url("${svgDataUrl}")` に変更してください）
        elemen.style.setProperty(TargetVar, svgDataUrl);

    } catch (error) {
        console.error("エラー:", error.message);
        console.error(error.stack);
        const elemen = document.querySelector(`#${TargetId}`);
        if (elemen) {
            elemen.style.setProperty(TargetVar, errorImageUrl);
        }
    }
}
function changeCssImgUrl(TargetId, TargetVar, AssetsName) {
    return new Promise((resolve) => {
        try {
            const ImgUrl = ASSETS.imgs[AssetsName];
            const elemen = document.querySelector(`#${TargetId}`);
            
            if (!elemen) {
                console.warn(`指定されたIDの要素が見つかりません: ${TargetId}`);
                resolve();
                return;
            }

            if (!ImgUrl) {
                console.error(`アセットが見つかりません: ${AssetsName}`);
                elemen.style.setProperty(TargetVar, `url(${errorImageUrl})`);
                resolve();
                return;
            }

            // 画像の読み込み（プリロード）を監視するためのオブジェクトを作成
            const img = new Image();

            img.onload = async () => {
                try {
                    // 可能ならデコード（描画準備）も完了させる
                    if (typeof img.decode === 'function') {
                        await img.decode().catch(() => {});
                    }
                } finally {
                    // 準備ができたらCSSに反映
                    elemen.style.setProperty(TargetVar, `url(${ImgUrl})`);
                    resolve();
                }
            };

            img.onerror = () => {
                console.error(`CSS画像の読み込みに失敗しました: ${AssetsName}`);
                elemen.style.setProperty(TargetVar, `url(${errorImageUrl})`);
                resolve();
            };

            // 読み込みを開始
            img.src = ImgUrl;

        } catch (error) {
            console.error("エラー:", error.message);
            console.error(error.stack);
            const elemen = document.querySelector(`#${TargetId}`);
            if (elemen) {
                elemen.style.setProperty(TargetVar, `url(${errorImageUrl})`);
            }
            resolve();
        }
    });
}
function changeImgSrc(id, Type, path) { // Typeは "img" / "svg"
    return new Promise((resolve, reject) => {
        try {
            const Target = document.getElementById(id);
            if (!Target) {
                throw new Error(`要素ID "${id}" が見つかりませんでした。`);
            }

            // 読み込み成功時の処理
            Target.onload = () => {
                resolve(Target);
            };

            // 読み込み失敗時の処理
            Target.onerror = (error) => {
                Target.src = errorImageUrl;
                reject(new Error(`画像の読み込みに失敗しました: ${path}`));
            };

            if (Type === "svg") {
                let svgText = ASSETS.svg[path];
                if (!svgText.includes('xmlns="http://www.w3.org/2000/svg"')) {
                    svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
                }
                const base64 = btoa(unescape(encodeURIComponent(svgText)));
                Target.src = `data:image/svg+xml;base64,${base64}`;
            } else if (Type === "img") {
                Target.src = ASSETS.imgs[path];
            }
        } catch (error) {
            console.error("エラー:", error.message);
            console.error(error.stack);
            const elemen = document.getElementById(id);
            if (elemen) {
                elemen.src = errorImageUrl;
            }
            reject(error);
        }
    });
}
function changeCssSvgUrlByClass(TargetClass, TargetVar, AssetsName) {
    try {
        const svgDataUrl = getSvgUrlFromASSETS(AssetsName);
        const elements = document.querySelectorAll(`.${TargetClass}`);
        
        if (!elements || elements.length === 0) {
            console.warn(`指定されたクラスの要素が見つかりません: .${TargetClass}`);
            return;
        }

        if (!svgDataUrl) {
            console.error(`SVGアセットが見つかりません: ${AssetsName}`);
            elements.forEach(elemen => {
                elemen.style.setProperty(TargetVar, `url(${errorImageUrl})`);
            });
            return;
        }

        elements.forEach(elemen => {
            if (elemen) {
                elemen.style.setProperty(TargetVar, svgDataUrl);
            }
        });

    } catch (error) {
        console.error("エラー:", error.message);
        console.error(error.stack);
        
        const elements = document.querySelectorAll(`.${TargetClass}`);
        if (elements) {
            elements.forEach(elemen => {
                elemen.style.setProperty(TargetVar, `url(${errorImageUrl})`);
            });
        }
    }
}
async function changeINNERsvg(targetid, assetsname) {
    return new Promise((resolve, reject) => {
        try {
            const target = document.getElementById(targetid);
            if (!target) {
                console.warn(`指定されたIDの要素が見つかりません: ${targetid}`);
                resolve();
                return;
            }

            const svgContent = ASSETS.svg[assetsname];
            if (!svgContent) {
                console.error(`SVGアセットが見つかりません: ${assetsname}`);
                resolve();
                return;
            }

            target.innerHTML = svgContent;
            resolve();
        } catch (error) {
            console.error("エラー:", error.message);
            console.error(error.stack);
            reject(error);
        }
    });
}
//スクリプトを動的に読み込む関数（Promiseを返す）
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // すでに読み込み済みの場合はスキップ
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}
//body_contentsの入れかえ
const changeBodyContents = async (bodyHTMLurl, removeCSSs, addCSSs, changeImgSrcList, changeCssImgUrlList, changeCssSvgUrlList, changeCssSvgUrlByClassList, changeINNERsvgList) => {
	isChangingHTML = true;
	const bodyHTML = await loadBody(bodyHTMLurl);
	const oldBody = document.getElementById("body_contents");
	const newBody = document.getElementById("body_contents_outdated");//取得時には逆の状態

	//チェック
	const oldClassList = oldBody.classList;
	if (!oldClassList.contains('body_contents_front') || oldClassList.contains('body_contents_back')) {
		console.warn("古いbody_contentsに異常なクラスリストが付与されています:", oldClassList);
		return;
	}
	const newClassList = newBody.classList;
	if(!newClassList.contains('body_contents_back') || newClassList.contains('body_contents_front')) {
		console.warn("新しいbody_contentsに異常なクラスリストが付与されています:", newClassList);
		return;
	}

	oldBody.id = "body_contents_outdated";
	newBody.id = "body_contents";
	newBody.innerHTML = bodyHTML;
	addCSSs.forEach((addCSS) => {changeCSS("", addCSS)});

	//画像等指定
	await Promise.all([
        ...changeImgSrcList.map(cIS => changeImgSrc(cIS[0], cIS[1], cIS[2])),
        ...changeCssImgUrlList.map(cCIU => changeCssImgUrl(cCIU[0], cCIU[1], cCIU[2])),
        ...changeCssSvgUrlList.map(cCSU => changeCssSvgUrl(cCSU[0], cCSU[1], cCSU[2])),
        ...changeCssSvgUrlByClassList.map(cCSUBC => changeCssSvgUrlByClass(cCSUBC[0], cCSUBC[1], cCSUBC[2])),
		...changeINNERsvgList.map(cIs => changeINNERsvg(cIs[0], cIs[1]))
	]);

	const images = newBody.querySelectorAll('img');
    const decodePromises = Array.from(images).map(img => {
        if (img.complete) {
            return img.decode().catch(() => {});
        } else {
            return new Promise((resolve) => {
                img.onload = () => img.decode().then(resolve).catch(resolve);
                img.onerror = resolve;
            });
        }
    });
	await Promise.all([
		Promise.all(decodePromises),
		document.fonts.ready
	]);
	newBody.getBoundingClientRect();

	newClassList.add('body_contents_front');
	newClassList.remove('body_contents_back');
	oldClassList.add('body_contents_back');
	oldClassList.remove('body_contents_front');

	oldBody.innerHTML = "";

	removeCSSs.forEach((removeCSS) => {changeCSS(removeCSS, "")});
	isChangingHTML = false;
}
//実行順序1
const initEngine = async () => {
	//if (location.search.includes("reset")) { //http://localhost:8000/?resetでリセット
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('reset')) {
		await resetSiteAndReload();
		return;
	}
	if (urlParams.get('noanim') === "true") {
		localStorage.setItem("is_localStorage_allowed", "true");
	}
	if (urlParams.get('isdev') === "true") isdev = true;
	if (urlParams.get('isSTT') === 'true') {
		console.log("開発者用スペースキークリック機能が有効です。");
		window.addEventListener('keydown', (event) => {
			if (event.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
				event.preventDefault();
				const targetX = window.innerWidth / 2;
				const targetY = window.innerHeight * 0.9;
				const targetElement = document.elementFromPoint(targetX, targetY);
				if (targetElement) {
					targetElement.click();
				}
			}
		});
	}
	if (urlParams.get('qr') === "6b86b273") {
		sc_var["isStartedAtQr1"] = 1;
		saveScVarToDB();
		urlParams.delete('qr');
        let newUrl = window.location.pathname;
        if (urlParams.toString()) {
            newUrl += '?' + urlParams.toString();
        }
        window.history.replaceState({}, document.title, newUrl);
	} else {
		sc_var["isStartedAtQr1"] = 0;
		saveScVarToDB();
	}

    const isAllowed = localStorage.getItem("is_localStorage_allowed") === "true";

    if (isAllowed) {
        // パターンA: すでに許可があるなら即実行
        is_localStorage_allowed = true;
        await first_display_change();
    } else {
        // パターンB: 許可がないならボタンにイベントを登録
        const acceptBtn = document.getElementById("indexedDB_accept");
		//アニメーションを表示するフラグ
		logoanim_flag = true;
        // ボタンがHTMLに存在するかチェック（念のため）
        if (acceptBtn) {
            acceptBtn.addEventListener('click', async () => {
                is_localStorage_allowed = true;
                localStorage.setItem("is_localStorage_allowed", "true");
                await first_display_change();
            });
        }
		//規約を下まで読む必要を付ける
		acceptBtn.setAttribute("disabled", true);
		const scrollElement = document.querySelector(".tarm");
		scrollElement.addEventListener('scroll', () => {
			const scrollTop = scrollElement.scrollTop;
			const clientHeight = scrollElement.clientHeight;
			const scrollHeight = scrollElement.scrollHeight;
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				acceptBtn.removeAttribute("disabled");
				acceptBtn.textContent = "同意して始める";
			}
		});
		//index.htmlのアニメーション
		{
			const frame = document.getElementById("load_frame");
			const container = document.getElementById("load_container");
			const message = document.getElementById("ini_message");

			console.log("アニメーション開始")
			frame.classList.add("fade_open")
			container.style.display = "none";
			message.style.display = "flex";

			setTimeout(() => {
			message.classList.add("fade_hide");
            }, 5000);

			setTimeout(() => {
			message.style.display = "none";
			container.classList.add("fade_open")
			container.style.display = "flex";
		    }, 8000);

			setTimeout(() => {
			container.classList.remove("fade_open")
		    }, 11000);
		}
    }
};

//最初の画面遷移, body_contents移植
async function loadBody(url) {
	if (ASSETS.html[url] == undefined) {
		const res = await fetch(url, { cache: 'no-store' });
		ASSETS.html[url] = await res.text();
	}
	const parser = new DOMParser();
	const doc = parser.parseFromString(ASSETS.html[url], "text/html");
	return doc.body.innerHTML;
}
//cssファイルの変更
function changeCSS(deletePath, addPath) {
    if (deletePath && deletePath !== "") {
        const linkToDelete = document.querySelector(`link[data-original-href="${deletePath}"]`);
        if (linkToDelete) {
            linkToDelete.remove();
        }
    }
    if (addPath && addPath !== "") {
        const alreadyExists = document.querySelector(`link[data-original-href="${addPath}"]`);
        if (alreadyExists) {
            return; 
        }
        const blobUrl = ASSETS.css[addPath];
        if (blobUrl) {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = blobUrl;
            newLink.dataset.originalHref = addPath;
            document.head.appendChild(newLink);
        } else {
            console.error(`CSSがプリロードされていません: ${addPath}`);
        }
    }
}
const BACKLOG_HELPERS = (() => {
	let charaImageIconKeys = null;
	let charaImageIconKeySource = null;
	const getCharaNameFromCharaImageFolder = (folderName) => {
		const parts = String(folderName ?? "").split("_");
		if (parts.length <= 2) return parts.slice(1).join("_").toLowerCase();
		return parts.slice(1, -1).join("_").toLowerCase();
	}
	const getMainmenuIconKeys = () => Object.keys(ASSETS.imgs).reduce((keys, path) => {
		const match = path.match(/^material\/mainmenu_icon\/chara_icon_([^/.]+)\.jpg$/);
		if (match) keys.add(match[1]);
		return keys;
	}, new Set());
	const getCharaImageIconKeys = () => {
		if (charaImageIconKeySource === ASSETS.imgs && charaImageIconKeys !== null) return charaImageIconKeys;
		charaImageIconKeySource = ASSETS.imgs;
		const mainmenuIconKeys = getMainmenuIconKeys();
		const charaImageFolders = Object.keys(ASSETS.imgs).reduce((folders, path) => {
			const match = path.match(/^material\/chara_image\/([^/]+)\//);
			if (!match) return folders;
			const folderName = match[1];
			const folderNameLower = folderName.toLowerCase();
			if (folders.some(folder => folder.folderNameLower === folderNameLower)) return folders;
			const folderIconKey = folderName.split("_")[0];
			folders.push({
				folderNameLower,
				charaNameLower: getCharaNameFromCharaImageFolder(folderName),
				folderIconKey,
				existingIconKey: mainmenuIconKeys.has(folderIconKey) ? folderIconKey : null,
			});
			return folders;
		}, []);
		const iconKeyByCharaName = charaImageFolders.reduce((iconKeys, folder) => {
			if (folder.charaNameLower && folder.existingIconKey && !iconKeys[folder.charaNameLower]) iconKeys[folder.charaNameLower] = folder.existingIconKey;
			return iconKeys;
		}, {});
		charaImageIconKeys = charaImageFolders.map(folder => [
			folder.folderNameLower,
			folder.existingIconKey ?? iconKeyByCharaName[folder.charaNameLower] ?? folder.folderIconKey,
			folder.charaNameLower,
		]);
		return charaImageIconKeys;
	}
	const getIconKeyFromCharaImageFolder = (folderName, cachedCharaImageIconKeys) => {
		const folderNameLower = String(folderName ?? "").toLowerCase();
		const matchedFolder = cachedCharaImageIconKeys.find(([cachedFolderName]) => cachedFolderName === folderNameLower);
		if (matchedFolder) return matchedFolder[1];
		return String(folderName ?? "").split("_")[0];
	}
	const getCharaIconUrl = (charaId, cachedCharaImageIconKeys = getCharaImageIconKeys()) => {
		const iconKeys = [];
		const addIconKey = (key) => {
			const text = String(key ?? "").trim();
			if (!text || text === "None" || iconKeys.includes(text)) return;
			iconKeys.push(text);
		}
		const addIconKeyFromCharaImagePath = (path) => {
			const match = String(path ?? "").match(/(?:^|\/)material\/chara_image\/([^/]+)/);
			if (match) addIconKey(getIconKeyFromCharaImageFolder(match[1], cachedCharaImageIconKeys));
		}
		const charaIdText = String(charaId ?? "");
		const charaElement = document.getElementById(charaIdText);
		addIconKeyFromCharaImagePath(charaElement?.dataset?.dispImgSourcePath);
		if (charaIdText.includes("_")) addIconKey(charaIdText.slice(0, charaIdText.indexOf("_")));
		addIconKey(charaIdText);
		if (charaIdText && charaIdText !== "None") {
			const lowerCharaId = charaIdText.toLowerCase();
			cachedCharaImageIconKeys.some(([folderName, iconKey, charaName]) => {
				if (!folderName.includes(lowerCharaId) && !charaName.includes(lowerCharaId)) return false;
				addIconKey(iconKey);
				return true;
			});
		}
		for (const iconKey of iconKeys) {
			const iconUrl = ASSETS.imgs[`material/mainmenu_icon/chara_icon_${iconKey}.jpg`];
			if (iconUrl) return iconUrl;
		}
		return errorImageUrl;
	}
	return {
		getCharaImageIconKeys,
		getCharaIconUrl,
	};
})();
//最初の画面遷移, body_contents移植
async function first_display_change() {
	clearDispExp();
	//プリロードやscファイル読み取りなど、初期準備
	if (current_display === "index") {
		async function checkAndPreRequestCamera() {
			// getUserMediaのPromiseを追跡するための変数
			let mediaPromise = null;
			try {
				// 1. カメラを一瞬だけ起動（ダイアログが表示される）
				mediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
				const stream = await Promise.race([
				mediaPromise,
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error("timeout")), 15000)
				)
				]);
				// 成功時
				camera_status = "granted";
				stream.getTracks().forEach(track => track.stop());
				console.log("カメラ権限を取得しました。");
			} catch (error) {
				console.error("カメラ権限のエラー:", error);
				if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
				// ユーザーが明示的に「ブロック（拒否）」を押した場合
				alert("カメラの利用が拒否されました。ブラウザの設定からカメラを許可してください。");
				camera_status = "denied";
				} else if (error.message === "timeout") {
				camera_status = "prompt";
				// 安全対策：タイムアウト後にユーザーが遅れて「許可」を押した場合は即座に停止する
				if (mediaPromise) {
					mediaPromise.then(belatedStream => {
					console.log("タイムアウト後に許可されたため、ストリームを即座に停止します。");
					belatedStream.getTracks().forEach(track => track.stop());
					}).catch(() => {});
				}
				// 「再試行しますか？」の確認ダイアログを表示
				const retry = window.confirm(
					"カメラの確認に時間がかかっています。もう一度カメラの読み込みを試しますか？\n" +
					"（キャンセルした場合、QRコードの場面ではお近くの漫研部員を訪ねてください）"
				);
				if (retry) {
					// ユーザーが「OK」を押したら、自分自身をもう一度呼び出して再試行
					console.log("カメラ権限の取得を再試行します。");
					await checkAndPreRequestCamera();
				}
				} else {
					// カメラが物理的に繋がっていない、または別のアプリで占有されている場合
					alert("カメラが見つからないか、他のアプリで使用中の可能性があります。カメラが利用できない場合、QRコードの場面ではお近くの漫研部員を訪ねてください。");
					camera_status = "prompt";
				}
			}
		}
		document.getElementById("forusertonoticeloading").textContent = "データの読み込み中です";
		document.getElementById("indexedDB_accept").setAttribute("disabled", true);
		//カメラ権限の要求
		try {
			if (navigator.permissions?.query) {
				const permissionStatus = await navigator.permissions.query({ name: 'camera' });
				camera_status = permissionStatus.state;
			}
		} catch (error) {
			console.warn("カメラ権限状態の取得に失敗したため、通常の確認に進みます", error);
		}
		if (camera_status === "prompt") {
			window.alert(`このサイトはゲームの途中でQRコードを読み取る必要があるので、今からカメラの利用権限の取得を試行します。カメラの利用を許可してください。`);
			await checkAndPreRequestCamera();
		}
		{
			const result = await loadAndParse();
			SCENARIO = result.SCENARIO_COMMANDS;
			SCENARIO_ARGS = result.SCENARIO_ARGS;
		}
		const elements = document.querySelectorAll(".loadzikieru");
		elements.forEach(elemen => elemen.style.display = "none");
		document.getElementById("loadprogress").style.display = "block";
		document.getElementById("loadprogress_discription").textContent = "地図機能用モジュール読み込み中";
		await loadScript("js/map_zoom.js");
		document.getElementById("loadprogress_discription").textContent = "QRコードライブラリ読み込み中";
		await loadScript("js/html5-qrcode.min.js");
		await setASSETS();
		//あらすじの保存
		await arasuzi_load();
		//設定事項の確認
		settings.typewriter = localStorage.getItem('setting_typewriter');
		settings.automode = localStorage.getItem('setting_automode');
		if (!settings.typewriter || !settings.automode) {
			settings = {
				"typewriter": "normal",
				"automode": "normal"
			};
			localStorage.setItem('setting_typewriter', settings.typewriter);
			localStorage.setItem('setting_automode', settings.automode);
		}
	}
	//console.log("current_display: ", current_display);
	if (current_display !== "logoanim" && logoanim_flag === false) {
		await changeBodyContents(
			"HTML/title/maintitle.html",
			["css/index.css", "css/maindisplay.css"],
			["css/style_including_font.css", "css/settings.css", "css/title.css"],
			[
				["titlelogo", "img", "material/other_materials/mainlogo.png"],
				["pendant", "svg", "material/other_materials/pendant.svg"]
			],
			[["titlebg", "--titlebg-url", "material/back_image/title_default.jpg"]],
			[
				["cameraicon", "--cameraicon-url", "material/button/cameraicon.svg"],
				["codeicon", "--codeicon-url", "material/button/codeicon.svg"],
				["settingicon", "--settingicon-url", "material/button/settingicon.svg"]
			],
			[["title_smallbutton", "--title_smallbutton-url", "material/button/small_button.svg"]],
			[]
		);
	} else {
		const bodyContent = await loadBody("HTML/title/maintitle.html");
		document.getElementById("body_contents").innerHTML = bodyContent;
		changeCSS("css/index.css", "")
		changeCSS("", "css/style_including_font.css");
		changeCSS("", "css/settings.css");
		changeCSS("", "css/title.css");
		changeCSS("css/maindisplay.css", "css/title.css");
	}
	//最初のロゴアニメーションを表示
	let isinsidelogoanim = false;
	if (current_display === "logoanim" || logoanim_flag === true) {
		isinsidelogoanim = true;
		logoanim_flag = false;
		const logo_anim_js = async () => {
			const mainLogo = document.getElementById("mainlogotype_anim");
			const pendant = document.getElementById("pendant_anim");
			const titleLogo = document.getElementById("titlelogo_anim");
			const logoBase = document.getElementById("logo_base_anim");
			function logo_anim() {
				mainLogo.classList.add("logo_center_position");
				pendant.classList.add("pull");
				titleLogo.style.opacity = 0;
				//divに中心へワープするクラスを追加、紐を引くクラスを追加、ロゴの不透明度を0に
				pendant.addEventListener("animationend" , (e) =>{
					if (e.animationName === "pull"){
						titleLogo.classList.add("flash");
						pendant.classList.remove("pull");
					}
				});
				//紐を引くアニメーションがおわったら紐のクラスを削除、ロゴの点滅クラスを追加
				titleLogo.addEventListener("animationend" , (e) =>{
					if (e.animationName === "flash"){
						mainLogo.classList.add("move");
						titleLogo.classList.remove("flash");
					}
				});
				//点滅がおわったらロゴのクラスを削除、全体のdivの移動クラスを追加
				mainLogo.addEventListener("animationend" , (e) =>{
					if (e.animationName === "move"){
						mainLogo.classList.remove("move");
						mainLogo.classList.remove("logo_center_position");
						titleLogo.style.opacity = 1;
						//ロゴアニメーションを表示していたcontentdivの処分
						const checkInterval = setInterval(() => {
							// isChangingHTML が false になったかをチェック
							if (!isChangingHTML) {
								// 多重実行を防ぐため、即座にインターバルを停止
								clearInterval(checkInterval);
								document.getElementById("contentdiv").classList.remove('is_open');
								changeCSS("css/logo_anim.css", "");
								document.getElementById("contentdiv").innerHTML = "";
							}
						}, 50);
					}
				titleLogo.style.opacity = 1;
				//移動がおわったらdivのクラスを削除、ロゴののdivワープのクラスを削除、不透明度を100％に
				});
				//もし8500ms後にまだアニメーション部分が消えていなかったら強制的に消す
				setTimeout(() => {
					if (document.getElementById("mainlogotype_anim")) {
						alert("アニメーションでエラーが発生しました。\nアニメーションに非対応のブラウザである可能性があります。\n再読み込みします");
						//location.reload();
					}
				}, 8500);
			}
			logo_anim();
		}
		//const logo_body = await loadBody("HTML/title/logo_anim.html");
		loadBody("HTML/title/logo_anim.html").then(async (logo_body) => {
			const logo_div = await waitForElement('#contentdiv');
			//await sleep(10); //あとで waitForElement関数に変更する
			logo_div.innerHTML = logo_body;
			//ロゴに画像を表示
			changeCSS("", "css/logo_anim.css");
			changeImgSrc("pendant_anim", "svg", "material/other_materials/pendant.svg")
			changeImgSrc("titlelogo_anim", "img", "material/other_materials/mainlogo.png");
			logo_div.classList.add('is_open');
			logo_anim_js();
		});
	}
	//画像をASSETSより適応
	if (isinsidelogoanim) {
		changeImgSrc("titlelogo", "img", "material/other_materials/mainlogo.png");
		changeImgSrc("pendant", "svg", "material/other_materials/pendant.svg");
		changeCssImgUrl("titlebg", "--titlebg-url", "material/back_image/title_default.jpg");
		changeCssSvgUrlByClass("title_smallbutton", "--title_smallbutton-url", "material/button/small_button.svg");
		changeCssSvgUrl("cameraicon", "--cameraicon-url", "material/button/cameraicon.svg");
		changeCssSvgUrl("codeicon", "--codeicon-url", "material/button/codeicon.svg");
		changeCssSvgUrl("settingicon", "--settingicon-url", "material/button/settingicon.svg");
	}
	await waitForElement("#settingicon");
	const last_saved_scenario = Number(localStorage.getItem("last_sc_line") || -1);
	if (last_saved_scenario >= 0 || last_sc_line >= 0) {
		if (SCENARIO.length-1 <= last_sc_line || SCENARIO.length-1 <= last_saved_scenario) {
			//最後まで行ったとき
			document.getElementById("ini_storybuttonL").classList.add('hidden');
			document.getElementById("seq_storybutton").classList.add('hidden');
			document.getElementById("endingbutton").classList.remove('hidden');
			//謎解きモード廃止 document.getElementById("solvingbutton").classList.remove('hidden');
			document.getElementById("methodbutton").classList.remove('hidden');
			document.getElementById("recordbutton").classList.remove('hidden');
			document.getElementById("ini_storybuttonS").classList.remove('hidden');
			localStorage.setItem("is_cleared", "true");
		} else {
			//途中までやっているとき
			document.getElementById("ini_storybuttonL").classList.add('hidden');
			document.getElementById("seq_storybutton").classList.remove('hidden');
			document.getElementById("endingbutton").classList.add('hidden');
			//謎解きモード廃止　document.getElementById("solvingbutton").classList.remove('hidden');
			document.getElementById("methodbutton").classList.remove('hidden');
			document.getElementById("recordbutton").classList.remove('hidden');
			document.getElementById("ini_storybuttonS").classList.remove('hidden');
		}
	} else {
		//まだやっていないとき
		//続きからボタン, あらすじボタン, 下側の最初からボタンを非表示, 上部の最初からボタンを表示
		document.getElementById("ini_storybuttonL").classList.remove('hidden');
		document.getElementById("seq_storybutton").classList.add('hidden');
		document.getElementById("endingbutton").classList.add('hidden');
		//謎解きモード廃止　document.getElementById("solvingbutton").classList.remove('hidden');
		document.getElementById("methodbutton").classList.remove('hidden');
		document.getElementById("recordbutton").classList.add('hidden');
		document.getElementById("ini_storybuttonS").classList.add('hidden');
	}
	if (localStorage.getItem("is_cleared") === "true") changeCssImgUrl("titlebg", "--titlebg-url", "material/back_image/title_clear.jpg");
	//各タイトル画面のボタンに対してイベントリスナーを設定する
	const ini_story = async () => {
		const last = localStorage.getItem("last_sc_line");
		if (last && last !== "-1") {
			const ok = confirm("ゲームが最初からスタートします。\nデータは復元できません。\n最初からスタートしますか？");
			if (!ok) return;
		}
		localStorage.setItem("scanned_qr", "[]");
		localStorage.setItem("riddle_results", "{}");
		await resetScenarioData();
		last_sc_line = -1;
		localStorage.setItem("last_sc_line", "-1");
		isOnScenario = true;
		await display_change_toStory();
	}
	const seq_story = async () => {
		if (last_saved_scenario > last_sc_line) {
			last_sc_line = last_saved_scenario;
		}
		await display_change_toStoryContinue(last_saved_scenario);
	}
	const ending_story = async () => alert("エンディングが表示されます(未実装)")
	//謎解きモード廃止　const solving_story = async () => alert("謎解きモードになります(未実装)")
	const method_story = async () => {
		remainingText = "";
		WfTDA_global = false;
		console.log("current_display=", current_display);
		last_sc_line_inSummary = -1;
		record_playback_num = 0;
		//ゲーム画面の用意
		current_display = "method";
		summary_sc_var = {};
		isOnScenario = true;
		await display_change_toStory();
		//シーン切り替え
		do_inaninstant = true;
		for (let i = 0; i < record_summary_do_scenario[0][0]-1; i++) {
			let returned_index = await do_scenario(i);
			i = returned_index;
			last_sc_line_inSummary = i;
		}
		do_inaninstant = false;
		last_sc_line_inSummary = await do_scenario(record_summary_do_scenario[0][0]-1);
	}
	const record_summary_disp = async (arasuzi_num) => {
		const bodyContent = await loadBody("HTML/title/record_summary.html");
		record_playback_num = arasuzi_num;
		const arasuzi_target = document.getElementById("contentdiv");
		arasuzi_target.innerHTML = bodyContent;
		changeCssSvgUrl("log_title_button_inSummary", "--back_content-url", "material/button/back_button.svg");
		changeCssSvgUrlByClass("log_container", "--log_container-url", "material/back_image/book.svg");
		document.getElementById("log_title_button_inSummary").addEventListener('click', async () => {
			await record_story();
		});
		//何話目を表示中か表示
		document.getElementById("summary_title_number").textContent = `${arasuzi_num}話目`;
		//画像を表示
		const pict_1 = ASSETS.imgs[`material/record_pictures/${arasuzi_num}_1.jpg`] ?? errorImageUrl;
		const pict_2 = ASSETS.imgs[`material/record_pictures/${arasuzi_num}_2.jpg`] ?? errorImageUrl;
		document.getElementById("pictures_1").style.backgroundImage = `url(${pict_1})`;
		document.getElementById("pictures_2").style.backgroundImage = `url(${pict_2})`;
		//あらすじを表示
		document.getElementById("summary_box").textContent = ARASUZI[arasuzi_num];
		//もっと思い出すボタン
		document.getElementById("replay_story").addEventListener('click', async () => {
			remainingText = "";
			WfTDA_global = false;
			console.log("current_display=", current_display);
			last_sc_line_inSummary = -1;
			//ゲーム画面の用意
			summary_sc_var = {};
			current_display = "record_summary";
			isOnScenario = true;
			await display_change_toStory();
			//シーン切り替え
			do_inaninstant = true;
			for (let i = 0; i < record_summary_do_scenario[arasuzi_num][0]-1; i++) {
				let returned_index = await do_scenario(i);
				i = returned_index;
				last_sc_line_inSummary = i;
			}
			do_inaninstant = false;
			last_sc_line_inSummary = await do_scenario(record_summary_do_scenario[arasuzi_num][0]-1);
		});
	}
	const record_story = async () => {
		const bodyContent = await loadBody("HTML/title/record.html");
		const arasuzi_target = document.getElementById("contentdiv");
		arasuzi_target.innerHTML = bodyContent;
		changeCssSvgUrl("log_title_button", "--back_content-url", "material/button/back_button.svg");
		changeCssSvgUrlByClass("log_container", "--log_container-url", "material/back_image/book.svg");
		arasuzi_target.classList.add("is_open");
		const log_title_button = await waitForElement('#log_title_button');
		if (log_title_button) {
			log_title_button.addEventListener('click', async () => {
				arasuzi_target.classList.remove("is_open");
				arasuzi_target.innerHTML = "";
			});
		} else {
			console.warn("log_title_buttonのDOM構成が終わっていません: ", log_title_button);
		}
		//あらすじ表示ボタンの設置
		// log_buttonクラスを持つ要素をすべて取得
		document.querySelectorAll(".log_button").forEach(button => {
			// data-number属性の値を取得して数値に変換
			const number = Number(button.dataset.number);//1_based
			//それぞれに設定するイベントリスナー
			button.addEventListener("click", () => {
				console.log(`あらすじの${number}番目のボタンがクリックされました`);
				if (released_arasuzi.includes(number)) {
					console.log(`あらすじ${number}: ${ARASUZI[number]}`);
					record_summary_disp(number);
				} else {
					window.alert("まだ解放されていません!!");
				}
			});
		});
	}
	const disp_map = async () => {
		const map_div = document.getElementById("contentdiv");
		let map_div_inner = ASSETS.svg["material/map/map.svg"];
		map_div_inner += `<button id="map_backbutton" class="backbutton map_close"></button>`;
		map_div.innerHTML = map_div_inner;
		//マップピンチインなどの初期化
		map_div.classList.add('map');
		changeCssSvgUrl("map_backbutton", "--map_close-url", "material/button/close_button_round.svg");
		map_div.classList.add('is_open');
		setTimeout(() => {
			document.getElementById("map_backbutton").addEventListener('click', () => {
				map_div.outerHTML = `<div id="contentdiv" class="top"></div>`;
			});
			initMapZoom('#contentdiv', '#map_svg');
		}, 50);
	}
	const code_input = async () => {
		let code = window.prompt("コードを入力してください", "xxxxxxxx");
		const match = code ? code.match(/^(?:(lSlsl-)(\d+)|(cA-)([hiscHa])-(.+))$/) : null;

		let prefix = null;
		let numberPart = null;
		let cAType = null;
		let cAValue = null;

		if (match) {
			if (match[1]) {
				// lSlsl-パターンの場合
				prefix = match[1];
				numberPart = parseInt(match[2], 10);
			} else if (match[3]) {
				// cA-パターンの場合
				prefix = match[3];
				cAType = match[4];  // h, i, s, c, a のいずれか
				cAValue = match[5]; // その後の文字列
			}
		}
		//a9d42f7e = 保存されているindexedDBなどを破棄して強制再読み込み
		//logoanim = ロゴアニメーションの表示
		//lSlsn-${数字} = 続きから再生でこの番号(0-based)にする
		//cA-[h,H,i,s,c,a]-${文字列} = ASSETSの内容の確認
		switch (prefix || code) {
			case null:
				break;
			case "a9d42f7e":
				await resetSiteAndReload();
				break;
			case "logoanim":
				current_display = "logoanim";
				await first_display_change();
				break;
			case "lSlsl-":
				localStorage.setItem("last_sc_line", numberPart);
				location.reload();
				break;
			case "cA-":
				const contentdiv = document.getElementById("contentdiv");
				contentdiv.classList.add('is_open');
				let waitingtime = 0;
					try {
					switch (cAType) {
						case "h":
							waitingtime = 10000;
							contentdiv.innerHTML = await loadBody(cAValue);
							break;
						case "i":
							waitingtime = 5000;
							contentdiv.innerHTML = `<img src=${ASSETS.imgs[cAValue]} class="cAtestIMAGE"></img>`;
							break;
						case "a":
							break;
						case "s":
							waitingtime = 5000;
							contentdiv.innerHTML = ASSETS.svg[cAValue];
							break;
						case "H":
							waitingtime = 10000;
							contentdiv.textContent = ASSETS.html[cAValue];
							break;
						case "c":
							waitingtime = 10000;
							contentdiv.textContent = ASSETS.css[cAValue];
							break;
						default:
							console.log("引数が正しくありません");
							break;
					}
				} catch {
					waitingtime = 5000;
					console.error(cAValue, "がありません");
				}
				setTimeout(() => {
					contentdiv.classList.remove('is_open');
					contentdiv.innerHTML = "";
				}, waitingtime);
				break;
			default:
				window.alert("一致するコードがありません: ", code);
		}
	}
	const open_setting = async () => {
		const set_setting = (key, value) => {
			const elements = document.querySelectorAll(`.${key}`);
			elements.forEach(element => {
				element.classList.remove('button_selected');
			});
			const selectedButton = document.getElementById(`${key}-${value}`);
			selectedButton.classList.add('button_selected');
			settings[key] = value;
			localStorage.setItem(`setting_${key}`, value);
		}
		const setting_html = await loadBody("HTML/general/settings.html");
		const setting_div = document.getElementById("contentdiv");
		setting_div.innerHTML = setting_html;
		changeCssImgUrl("set_base", "--setbg-url", "material/back_image/general_display.jpg");
        changeCssSvgUrl("set_backbutton", "--back_content-url", "material/button/back_button.svg");
		setting_div.classList.add('is_open');
		document.getElementById("set_backbutton").addEventListener('click', () => {
			setting_div.classList.remove('is_open');
			setting_div.innerHTML = "";
		});
		//それぞれのボタン設定
		Object.entries(settings_choices).forEach(([key, array]) => {
			//その設定内容の現在のものを表示
			const current_value = settings[key];
			document.getElementById(`${key}-${current_value}`).classList.add('button_selected');
			array.forEach((value) => {
				//イベントリスナーの設定
				document.getElementById(`${key}-${value}`).addEventListener('click', () => {
					set_setting(key, value);
				});
			});
		});
	}
	//あらすじ振り返り用
	document.getElementById("ini_storybuttonL").addEventListener('click', ini_story);
	document.getElementById("seq_storybutton").addEventListener('click', seq_story);
	document.getElementById("endingbutton").addEventListener('click', ending_story);
	//謎解きモード廃止　document.getElementById("solvingbutton").addEventListener('click', solving_story);
	document.getElementById("methodbutton").addEventListener('click', method_story);
	document.getElementById("ini_storybuttonS").addEventListener('click', ini_story);
	document.getElementById("cameraicon").addEventListener('click', disp_map);
	document.getElementById("codeicon").addEventListener('click', code_input);
	document.getElementById("settingicon").addEventListener('click', open_setting);
	document.getElementById("recordbutton").addEventListener('click', () => {
		record_story();
	});	
	
	//振り返りのもっと思い出すから戻ってきたとき
	//console.log("振り返りから返ってきたかチェック", current_display);
	if (current_display === "record_summary") {
		isAllowedContentdivIsOpenRemove = false;
		current_display = "title";
		console.log("振り返りに戻ります")
		record_summary_disp(record_playback_num);
		document.getElementById("contentdiv").classList.add('is_open');
	}
	current_display = "title";
}
const end_of_scenario = async () => {
	alert("シナリオの終わりです");
	isOnScenario = false;
	last_sc_line = SCENARIO.length;
	if (is_localStorage_allowed) {
		localStorage.setItem("last_sc_line", String(last_sc_line));
	} else {
		if (window.confirm('localStorageが有効ではないためページを閉じるとデータが失われます。\nlocalStorageを有効にしますか？\n※メニューに戻ってもページを離れなければデータは失われません')) {
			is_localStorage_allowed = true;
			localStorage.setItem("is_localStorage_allowed", "true");
			localStorage.setItem("last_sc_line", String(last_sc_line));
		}
	}
	await first_display_change();
}
const return_to_record = async () => {
	alert("話の振り返りに戻ります");
	isOnScenario = false;
	await first_display_change();
}
//ストーリーモードへの画面遷移
async function display_change_toStory() {
		if (current_display !== "record_summary" && current_display !== "method") current_display = "story";
		//console.log("@display_change_toStory current_display:", current_display);
		await changeBodyContents(
			"HTML/maindisplay/maindisplay.html",
			["css/title.css"],
			["css/maindisplay.css"],
			[["name_frame", "svg", "material/frame/name_frame.svg"]],
			[],
			[
				["textframe", "--textframe-url", "material/frame/text_frame.svg"],
				["mainmenublock", "--mainmenublock-url", "material/frame/menu_frame.svg"],
				["mainmenubutton", "--mainmenubutton-url", "material/button/play_menu.svg"],
				["auto_mode_button", "--auto_mode_button-url", "material/button/play_auto_idle.svg"]
			],
			[],
			[["nextbutton", "material/other_materials/next_line.svg"]]
		);
		//各タイトル画面のボタンに対してイベントリスナーを設定する
		document.getElementById("mainmenubutton").addEventListener('click', async () => {
			isOnScenario = false;
			const closemenu = async () => {
				document.getElementById("contentdiv").classList.remove('is_open');
				document.getElementById("contentdiv").innerHTML = "";
				isOnScenario = true;
			};
			const gotoTitle = async () => {
				if (is_localStorage_allowed) {
					localStorage.setItem("last_sc_line", String(last_sc_line));
				} else {
					if (window.confirm('localStorageが有効ではないためページを閉じるとデータが失われます。\nlocalStorageを有効にしますか？\n※メニューに戻ってもページを離れなければデータは失われません')) {
						is_localStorage_allowed = true;
						localStorage.setItem("is_localStorage_allowed", "true");
						localStorage.setItem("last_sc_line", String(last_sc_line));
					}
				}
				await first_display_change();
				if (isAllowedContentdivIsOpenRemove) document.getElementById("contentdiv").classList.remove('is_open');
				else isAllowedContentdivIsOpenRemove = true;
			};
			const gotoRecord = async () => {
				await first_display_change();
				if (isAllowedContentdivIsOpenRemove) document.getElementById("contentdiv").classList.remove('is_open');
				else isAllowedContentdivIsOpenRemove = true;
			};
			const skip_logic = async () => {
				if (current_display === "record_summary" || current_display === "method") return; //万が一の防衛
				if (!window.confirm("ストーリーをスキップしますか")) return;
				skipButton.disabled = true;
				const current_sc = current_display !== "record_summary" && current_display !== "method" ? last_sc_line : last_sc_line_inSummary;
				const ExistScNum = SCENARIO.length - 1;
				let next_stop = ExistScNum;//この0-basedに次の表示すべきscが入る
				let index_s = 0;
				const stopping_funcName = ["end", "qr", "puzzle", "riddle"];
				while (current_sc + index_s <= ExistScNum) {
					if (stopping_funcName.includes(SCENARIO[current_sc + index_s])) {
						next_stop = current_sc + index_s;
						break;
					}
					index_s++;
				}
				//next_stopまで実行
				do_inaninstant = true;
				for (let i = current_sc + 1; i < next_stop; i++) {
					let returned_index = await do_scenario(i);
					i = returned_index;
					if (current_display !== "record_summary" && current_display !== "method") {
						last_sc_line = i;
						localStorage.setItem("last_sc_line", String(last_sc_line));
					} else {
						last_sc_line_inSummary = i;
					}
				}
				do_inaninstant = false;
				do_scenario(next_stop);//qr等はそのコマンドがすぐにreturnを返さないと予想: QRを読み込んだりしなきゃいけないから
			if (current_display !== "record_summary" && current_display !== "method") {
				last_sc_line = next_stop;
				localStorage.setItem("last_sc_line", String(last_sc_line));
			} else last_sc_line_inSummary = next_stop;
			closemenu();
			};
			//メニュー画面
			const bodyContent = await loadBody("HTML/maindisplay/menu.html");
			document.getElementById("contentdiv").innerHTML = bodyContent;
			changeCssSvgUrl("backdisplaybutton", "--display_close-url", "material/button/close_button_square.svg");
			if (current_display === "record_summary") {
				document.getElementById("backtotitle").innerHTML = '<div class="set_item_frame">話の振り返りに戻る</div>';
			}
			document.getElementById("contentdiv").classList.add('is_open');
			document.getElementById("backdisplaybutton").addEventListener('click', closemenu);
			document.getElementById("setting").addEventListener('click', async () => {
				const set_setting = (key, value) => {
					const elements = document.querySelectorAll(`.${key}`);
					elements.forEach(element => {
						element.classList.remove('button_selected');
					});
					const selectedButton = document.getElementById(`${key}-${value}`);
					selectedButton.classList.add('button_selected');
					settings[key] = value;
					localStorage.setItem(`setting_${key}`, value);
				}
				const setting_html = await loadBody("HTML/general/settings.html");
				const setting_div = document.getElementById("alertdiv");
				setting_div.innerHTML = setting_html;
				changeCssImgUrl("set_base", "--setbg-url", "material/back_image/general_display.jpg");
                changeCssSvgUrl("set_backbutton", "--back_content-url", "material/button/back_button.svg");
				setting_div.classList.add('is_open');
				document.getElementById("set_backbutton").addEventListener('click', () => {
					setting_div.classList.remove('is_open');
					setting_div.innerHTML = "";
				});
				//それぞれのボタン設定
				Object.entries(settings_choices).forEach(([key, array]) => {
					//その設定内容の現在のものを表示
					const current_value = settings[key];
					document.getElementById(`${key}-${current_value}`).classList.add('button_selected');
					array.forEach((value) => {
						//イベントリスナーの設定
						document.getElementById(`${key}-${value}`).addEventListener('click', () => {
							set_setting(key, value);
						});
					});
				});
			});
			document.getElementById("openmap").addEventListener('click', () => {
				//window.alert("地図を開く");
				const map_div = document.getElementById("alertdiv");
				let map_div_inner = ASSETS.svg["material/map/map.svg"];
				map_div_inner += `<button id="map_backbutton" class="backbutton map_close"></button>`;
				map_div.innerHTML = map_div_inner;
				//マップピンチインなどの初期化
				map_div.classList.add('map');
				changeCssSvgUrl("map_backbutton", "--map_close-url", "material/button/close_button_round.svg");
				map_div.classList.add('is_open');
				setTimeout(() => {
					document.getElementById("map_backbutton").addEventListener('click', () => {
						map_div.outerHTML = `<div id="alertdiv" class="top"></div>`;
					});
					initMapZoom('#alertdiv', '#map_svg');
				}, 50);
			});
			const skipButton = document.getElementById("skipbutton");
			if (isQrOrPuzzle) skipButton.disabled = true;
			if (current_display === "record_summary" || current_display === "method") skipButton.disabled = true;
			skipButton.addEventListener('click', skip_logic);
			document.getElementById("backtotitle").addEventListener('click', () => {
				if (current_display === "record_summary" || current_display === "method") gotoRecord(); 
				else gotoTitle();
			});
		});
		//バックログ(探偵ログ)
		document.getElementById("backlogbutton").addEventListener('click', async () => {
			isOnScenario = false;
			const bodyContent = await loadBody("HTML/maindisplay/backlog.html");
			document.getElementById("contentdiv").innerHTML = bodyContent;
			changeCssSvgUrl("backdisplaybutton", "--display_close-url", "material/button/close_button_square.svg");
			document.getElementById("contentdiv").classList.add('is_open');
			//戻るボタン
			document.getElementById("backdisplaybutton").addEventListener('click', async () => {
				document.getElementById("contentdiv").classList.remove('is_open');
				document.getElementById("contentdiv").innerHTML = "";
				isOnScenario = true;
			});
			const logDisp = document.getElementById("logDisplay")
			logDisp.innerHTML = '<div class="top_line"></div>'; //いったんリセット
			//backlogの中身でログリストを作る
			//console.log(backlog);
			if (backlog.length === 0) {//中身が何もなかったら
				logDisp.innerHTML = "<p>まだログがありません\nストーリーを進めてください</p>";
			} else {
				const backlogCharaImageIconKeys = BACKLOG_HELPERS.getCharaImageIconKeys();
				const getCharaIconUrlForBacklog = (charaId) => BACKLOG_HELPERS.getCharaIconUrl(charaId, backlogCharaImageIconKeys);
				for (const OneLog of backlog) {
					if (OneLog[1] === null) OneLog[1] = ["X_noname_returned", "名前の返り値がありませんでした"];
					const charaname = OneLog[1][1].replace(/<([^:>]+):[^>]*>/g, '$1');
					const charaimgurl = getCharaIconUrlForBacklog(OneLog[1][0]);
					/*
					try {
						charaimgurl = ASSETS.imgs[`material/mainmenu_icon/chara_icon_${OneLog[1][0].substring(0, OneLog[1][0].indexOf('_'))}.jpg`];
					} catch (error) {
						console.error("バックログアイコン読み込み: ", error);
						charaimgurl = errorImageUrl;
					}
					*/

					//<div class="top_line" data-backlog-chara="${OneLog[1][0]}"></div> は削除

					const newDiv = `
					    <div class="log_box" data-backlog-chara="${OneLog[1][0]}" id="${OneLog[0]}">
                            <div class="chara_icon" data-backlog-chara="${OneLog[1][0]}"><img class="chara_icon_img" data-backlog-chara="${OneLog[1][0]}" src="${charaimgurl}"/></div>
                            <div class="log_name" data-backlog-chara="${OneLog[1][0]}">${charaname}</div>
                            <div class="log_text" data-backlog-chara="${OneLog[1][0]}">${OneLog[2]}</div>
                            <div class="line" data-backlog-chara="${OneLog[1][0]}"></div>
                        </div>
					`;
					//logDisp.innerHTML = logDisp.innerHTML + newDiv;
					logDisp.insertAdjacentHTML('beforeend', newDiv);
				}
				document.getElementById("logDisplay").scrollTop = document.getElementById("logDisplay").scrollHeight;
			}
		});
		//オートモード
		const off_automode = () => {
			isAutoMode = false;
			changeCssSvgUrl("auto_mode_button", "--auto_mode_button-url", "material/button/play_auto_idle.svg");
			document.getElementById("nextbutton").removeEventListener("click", off_automode);
			document.getElementById("mainmenubutton").removeEventListener("click", off_automode);
			document.getElementById("backlogbutton").removeEventListener("click", off_automode);
			document.getElementById("textframe").removeEventListener("click", off_automode);
		}
		let automode_timeout = settingsJson.automode_time[settings.automode];
		document.getElementById("auto_mode_button").addEventListener('click', (e) => {
			e.stopPropagation();
			automode_timeout = settingsJson.automode_time[settings.automode];
			if (!isAutoMode) {
				isAutoMode = true;
				changeCssSvgUrl("auto_mode_button", "--auto_mode_button-url", "material/button/play_auto_running.svg");
				//他ボタンを押した時にもしisAutoModeだったらfalseにする
				document.getElementById("nextbutton").addEventListener("click", off_automode);
				document.getElementById("mainmenubutton").addEventListener("click", off_automode);
				document.getElementById("backlogbutton").addEventListener("click", off_automode);
				document.getElementById("textframe").addEventListener("click", off_automode);
				automode();
			}
			else off_automode();		
		});
		//進むボタンで次のsc実施
		const next_button_func = async (e) => {
			if (e && typeof e.stopPropagation === 'function') {
				e.stopPropagation();
			}//div#textframeへのクリックの伝播の防止
			//console.log("nextbutton current_display: ", current_display);
			document.getElementById("nextbutton").disabled = true;
			if (current_display !== "record_summary" && current_display !== "method") {
				if (last_sc_line+1 < SCENARIO.length) {
					last_sc_line++;
					let returned_index = await do_scenario(last_sc_line); //do_scenarioは最後にやった0-basedの行番号を返す
					last_sc_line = returned_index;
					localStorage.setItem("last_sc_line", String(last_sc_line));
				} else {
					isAutoMode = false;
					end_of_scenario();
				}
			} else {
				if (last_sc_line_inSummary+1 < record_summary_do_scenario[record_playback_num][1]) {
					last_sc_line_inSummary++;
					let returned_index = await do_scenario(last_sc_line_inSummary);
					last_sc_line_inSummary = returned_index;
				} else {
					isAutoMode = false;
					if (current_display === "record_summary") return_to_record();
					else {
						alert("タイトル画面へ戻ります");
						first_display_change();
					}
				}
			}
			if (!typewriter_flag && !isAnimating) {
				const nextButton = document.getElementById("nextbutton");
				if (nextButton) nextButton.disabled = false;

			}
		}
		document.getElementById("nextbutton").addEventListener("click", next_button_func);
		//オートモードの機能
		//タイプライタ―演出、アニメーションが終わり、次がdo_nextでもなくなるまで待つ
		const waitForFalse = async (checkInterval = 50) => {
			if (!typewriter_flag && !isDoNext && !isAnimating) return;
			return new Promise((resolve) => {
				const timer = setInterval(() => {
				if (!typewriter_flag && !isDoNext && !isAnimating) {
					clearInterval(timer);
					resolve();
				}
				}, checkInterval);
			});
		};
		const automode_stop_command = ["end", "qr", "puzzle", "riddle"];
		async function automode() {
			const index_in_automode = current_display !== "record_summary" && current_display !== "method" ? last_sc_line + 1 : last_sc_line_inSummary + 1;
			const functionname = SCENARIO[index_in_automode] ?? "end";
			if (automode_stop_command.includes(functionname)) {
				//停止時
				off_automode();
				next_button_func();//停止目的の画面を表示して停止
			} else {
				//実行時
				await waitForFalse();
				setTimeout(async () => {
					if (isAutoMode) {
						await next_button_func();
						automode();
					}
				}, automode_timeout);
			}
		}
		//最初のシナリオを表示する
		await sleep(10);
		if (!(Number(localStorage.getItem("last_sc_line") || -1) >= 0) && (current_display !== "record_summary" && current_display !== "method")) {
			//do_inaninstant = true;
			let returned_index = await do_scenario(0);
			last_sc_line = returned_index;
			localStorage.setItem("last_sc_line", String(last_sc_line));
			//do_inaninstant = false;
		}
}

async function display_change_toStoryContinue(lss) {
	current_display = "continue";
	await display_change_toStory();
	await resetScenarioData();
	//シーン切り替え
	isOnScenario = true;
	do_inaninstant = true;
	for (let i = 0; i < lss; i++) {
		let returned_index = await do_scenario(i);
		i = returned_index;
		last_sc_line = i;
		localStorage.setItem("last_sc_line", String(last_sc_line));
	}
	do_inaninstant = false;
	last_sc_line = await do_scenario(lss);
	localStorage.setItem("last_sc_line", String(last_sc_line));
}

//指定の行番号を探して実行する
async function do_scenario(num) {
	///----------関数内関数------------------------
	function adjustTextDisplay() {
		const parent = document.getElementById("textbox");
		const p = document.getElementById("textcontent");
		
		const fullText = p.textContent;
		//const parentStyle = window.getComputedStyle(parent);
		//const marginBottomParent = parseFloat(parentStyle.marginBottom) || 0;
		const pStyle = window.getComputedStyle(p);
		const marginTopP = parseFloat(pStyle.marginTop) || 0;
		
		document.getElementById("mainmenubutton").disabled = true;
		//表示可能領域
		const frame = document.getElementById("maindisplaybase");
		const dispable_text_height = (frame.clientHeight * 0.3515625) - (frame.clientWidth * 0.14);
		//↑変更が必要かもしれない: maindisplay.cssの変更
		//console.log("テキスト表示可能領域高さ: ", dispable_text_height);
		while ((p.scrollHeight + marginTopP) > dispable_text_height && p.textContent.length > 0) {
			//console.log("テキスト表示可能領域高さ:", dispable_text_height, ", テキスト:", p.scrollHeight + marginTopP, ", テキスト長さ:", p.textContent.length);
			p.textContent = p.textContent.slice(0, -1);
		}
		
		const visibleText = p.textContent;
		const hiddenText = fullText.slice(visibleText.length);
		//console.log("\n表示:", visibleText, ", 非表示:", hiddenText);

		//タイプライタ―演出
		//文字ごとにspanを設定
		const text_typewriter = async () => {
			typewriter_flag = true;
			document.getElementById("nextbutton").disabled = true;
			let charIndex = 1;
            const delayDict = {}; // 例: { "char-5": 1000 }
            let tempCharCount = 0;
            const regex = /\\\\(\d+)\\\\|\\(\d+)\\/g;
            
            let cleanedText = "";
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(visibleText)) !== null) {
                // マッチするまでの通常のテキスト部分を処理
                const normalPart = visibleText.substring(lastIndex, match.index);
                for (let i = 0; i < normalPart.length; i++) {
                    tempCharCount++;
                }
                cleanedText += normalPart;

                if (match[1]) {
                    // \\10000\\ のようなエスケープの場合
                    let escapedStr = `\\${match[1]}\\`;
                    for (let i = 0; i < escapedStr.length; i++) {
                        tempCharCount++;
                    }
                    cleanedText += escapedStr;
                } else if (match[2]) {
                    // \1000\ のような制御文字の場合
                    let nextCharId = `char-${tempCharCount}`;
                    delayDict[nextCharId] = parseInt(match[2], 10);
                }

                lastIndex = regex.lastIndex;
            }

            // 残りのテキスト部分を処理
            const remainingPart = visibleText.substring(lastIndex);
            for (let i = 0; i < remainingPart.length; i++) {
                tempCharCount++;
            }
            cleanedText += remainingPart;

            // p.textContentを制御文字削除後のものに差し替える
            p.textContent = cleanedText;
            // ----------------------------------------------------
			function buildWrappedNode(node) {
				if (node.nodeType === Node.TEXT_NODE) {
				// テキストノードの場合：1文字ずつspanにしてFragmentに詰める
				const fragment = document.createDocumentFragment();
				const text = node.nodeValue;
				for (let i = 0; i < text.length; i++) {
					const span = document.createElement('span');
					span.id = `char-${charIndex++}`;
					span.classList.add(`char-wait`);
					span.textContent = text[i];
					fragment.appendChild(span);
				}
				return fragment;
				} else if (node.nodeType === Node.ELEMENT_NODE) {
				// 要素ノード（span等）の場合：要素をクローンし、子要素を再帰処理する
				const clone = node.cloneNode(false); // 属性（classやstyle）を維持したまま要素を複製
				for (const child of node.childNodes) {
					clone.appendChild(buildWrappedNode(child));
				}
				return clone;
				}
				return node.cloneNode(true);
			}
			const newFragment = document.createDocumentFragment();
			for (const child of p.childNodes) {
				newFragment.appendChild(buildWrappedNode(child));
			}
			p.replaceChildren(newFragment);
			//タイプライタ―演出の実行
			typewriter_flag = true;
			//テキストフレームがクリックされたときにタイプライターを終わる
			function textframe_end_typewriter() {
				typewriter_flag = false;
				document.getElementById("nextbutton").disabled = false;
				const char_elements = document.querySelectorAll(".char-wait");
				char_elements.forEach((char_element) => {
					char_element.classList.remove('char-wait');
				});
			}
			const interval = settingsJson.typewriterInterval[settings.typewriter];
			const fadetime = settingsJson.typewriterFade[settings.typewriter];
			document.getElementById("textframe").addEventListener('click', textframe_end_typewriter, { once: true });
			//他ボタンの対策
			document.getElementById("mainmenubutton").addEventListener('click', textframe_end_typewriter, {capture: true, once: true});
			//document.getElementById("auto_mode_button").addEventListener('click', textframe_end_typewriter, {once: true});//タイプライターflagのチェックを優先
			document.getElementById("backlogbutton").addEventListener('click', textframe_end_typewriter, {capture: true, once: true});
			for (let char_num = 1; char_num < charIndex; char_num++) {
				const charID = `char-${char_num}`;
				const char_elm = document.getElementById(charID);
				char_elm.style.setProperty('--fadetime-ms', `${fadetime}ms`);
				char_elm.classList.add('char-is-visible');
				if (!typewriter_flag) break;
				// 辞書に登録されている場合は遅延時間を加算
                let currentInterval = interval;
                if (delayDict[charID]) {
                    currentInterval += delayDict[charID];
                }
                await sleep(currentInterval);
				if (!typewriter_flag) break;
			}
			typewriter_flag = false;
			document.getElementById("nextbutton").disabled = false;
		}
		if (settings.typewriter !== "immediately") text_typewriter();
		else {
			const p_element = document.getElementById("textcontent");
			const new_p = p_element.textContent.replace(/(^|[^\\])\\\d+\\/g, '$1');
			const new_p_2 = new_p.replace(/\\\\(\d+)\\\\/g, "\\$1\\");
			p_element.textContent = new_p_2;
		}

		document.getElementById("mainmenubutton").disabled = false;
		if (hiddenText !== "") {
			remainingText = hiddenText; // グローバル変数に退避
            //document.getElementById("nextbutton").textContent = "続きを読む";
			return true; 
		} else {
			remainingText = "";
            //document.getElementById("nextbutton").textContent = "次へ";
			return false;
		}
	}
	const waitForFalse = async (checkInterval = 50) => {
		if (!typewriter_flag && isOnScenario) return;
		return new Promise((resolve) => {
			const timer = setInterval(() => {
			if (!typewriter_flag && isOnScenario) {
				clearInterval(timer);
				resolve();
			}
			console.log("typewriter_flag:", typewriter_flag, ", isOnScenario:", isOnScenario);
			}, checkInterval);
		});
	};
	///-------------------------------------------
    let index = num;// numは0-based
	let WfTDA_inside = false;
	const LIMIT = SCENARIO.length * 1000;
	let returning_index = num - 1;
	const contentDivClassList = document.getElementById("contentdiv").classList;

	if (WfTDA_global) {
		const p = document.getElementById("textcontent");
		p.textContent = remainingText;
		const hasOverflow = adjustTextDisplay();
		if (hasOverflow) {
			return returning_index;
		} else {
			WfTDA_global = false;
            return returning_index;
		}
	}
	try {
		while (true) {
			await waitForFalse();
			const funcName = SCENARIO[index];
			const args = SCENARIO_ARGS[index];
			const commandFunc = COMMANDS[funcName];

			if (funcName === "qr" || funcName === "puzzle" || funcName === "riddle") isQrOrPuzzle = true;
			else isQrOrPuzzle = false;

			if (typeof commandFunc === "function") {
				const [code_original, value] = await commandFunc(args);
				let code = code_original;

				if (!scline_counter[index]) scline_counter[index] = 0;
				scline_counter[index]++;
				if (scline_counter[index] > LIMIT) {
					console.error("無限ループの可能性があります。停止します。");
					returning_index = SCENARIO.length; // 存在しない行番号
					break;
				}

				if (code_original !== -1 && code_original & 1) {
					if (!do_inaninstant && contentDivClassList.contains('is_open')) {
						code = code_original - 1;
						isDoNext = false;
					}
					else isDoNext = true;
				}
				else isDoNext = false;

				// setvar 系の保存
				if (code === 10 || code === 11) {
					if (current_display !== "record_summary" && current_display !== "method") saveScVarToDB();
				}
				// ジャンプ
				if (code === 2) {
					index = value; // 0-based
					continue;
				}
				// 次へ
				if (code === 1 || code === 11) {
					if (current_display !== "story" && current_display !== "record_summary" && current_display !== "method") {
						returning_index = index;
						break;
					}
					index++;
					continue;
				}
				//テキスト(セリフ)
				if ((code === 30 || code === 31) && current_display !== "record_summary" && current_display !== "method") backlog.push([backlog.length, value, document.getElementById("textcontent").textContent]);//[番号, [キャラid, キャラ名], 本文]
				if (do_inaninstant && (code === 30 || code === 31)) {
					//const nextButton = document.getElementById("nextbutton");
					//if (nextButton) nextButton.textContent = "次へ";
					WfTDA_global = false;
					remainingText = "";
				}
				if (!do_inaninstant && code === 30) {
					WfTDA_global = adjustTextDisplay();
					if (!WfTDA_global) returning_index = index;
					WfTDA_inside = false;
				}
				if (code === 31) {
					if (current_display !== "story" && current_display !== "record_summary" && current_display !== "method") {
						returning_index = index;
						break;
					}
					WfTDA_inside = true;
					index++;
					continue;
				}
				//あらすじの開放
				if (code === 40 || code === 41) {
					if (current_display !== "record_summary" && current_display !== "method") {
						const arasuzi_num = Number(value);
						if (!Number.isInteger(arasuzi_num) || arasuzi_num < 1) {
							console.warn(`release_arasuzi: 解放するあらすじ番号 '${value}' が不正です。`);
						} else if (!released_arasuzi.includes(arasuzi_num)) released_arasuzi.push(arasuzi_num);
					}
					if (code === 41) {
						if (current_display !== "story" && current_display !== "record_summary" && current_display !== "method") {
							returning_index = index;
							break;
						}
						index++;
						continue;
					}
				}
				//バックログの削除
				if (code === 50 || code === 51) {
					backlog = [];
					if (code === 51) {
						if (current_display !== "story" && current_display !== "record_summary" && current_display !== "method") {
							returning_index = index;
							break;
						}
						index++;
						continue;
					}
				}
				//終了処理
				if (code === -1) {
					end_of_scenario();
					returning_index = SCENARIO.length;
					break;
				}
				// 停止
				returning_index = index;
				break;
			} else {
				console.error(`命令 '${funcName}' は COMMANDS に定義されていません。`);
				returning_index = index;
				break; 
			}
		}
	} catch (error) {
		console.error("エラー:", error.message);
		console.error("エラー発生時のindex:", index);
		console.error("スタックトレース:", error.stack);
		returning_index = index;
	}
	if (WfTDA_inside) {
		const hasOverflow = adjustTextDisplay();
		if (hasOverflow) {
			return returning_index;
		} else {
			WfTDA_global = false;
			return index;
		}
	}
	return returning_index;
}
//エラーのチェック
function showErrorOnScreen(text) {
    const overlay = document.getElementById("alertdiv");
	if (!overlay) return;

    // 画面を表示状態にする
    overlay.style.display = "block";

    // ログを追加していく（過去のエラーも残るようにする）
    overlay.textContent += text + "\n\n";
    
    // 通常のコンソールにも一応出しておく
    console.error(text);

	//自動リロード
	alert(`予期しないエラー\n${text}\nが発生しました。リロードします。何度もエラーが起こる場合、お近くの漫研部員にお伝えください`);
	location.reload();
}

// 1. 通常のエラー
window.onerror = function (message, source, lineno, colno, error) {
    const errorSource = String(source ?? "");
    if (errorSource.includes("html5-qrcode.min.js")) {
        console.error(`[Error] ${message}\nat ${source} (line ${lineno})`);
        return true;
    }
    showErrorOnScreen(`[Error] ${message}\nat ${source} (line ${lineno})`);
    return true;
};

// 2. 非同期（Promise）のエラー
window.addEventListener("unhandledrejection", (event) => {
    showErrorOnScreen(`[Promise Reject] ${event.reason}`);
});
// 実行
initEngine();
