import { COMMANDS, stopAllSounds } from './functions.js';
let is_localStorage_allowed = false;
let last_sc_line = -1; //0-based
//臨時に関数間を超えて実行する。
let do_inaninstant = false;
let SCENARIO = [];
let current_display = "index";
let jump_target = null;
export let sc_var = {};
let scline_counter = [];
export let audioCtx = null;
let WfTDA_global = false; // 「続きを読む」の待機状態かどうかのフラグ Waiting for Text Display Adjustment: セリフの表示調整待ち
let remainingText = ""; // はみ出した残りの文章を保持する変数

console.log("engine.js起動")

export const ASSETS = {
	"html": {},
	"imgs": {},
	"audio": {},
	"css": {},
	"svg": {}
};
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
            const response = await fetch(originalUrl);
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

    const res = await fetch(path);

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
    const htmlList = await fetch("ASSETScontents_html.txt").then(r => r.text());
    const htmlItems = htmlList.trim().split("\n").map(line => {
        const [path, version] = line.split("|");
        return { path, version };
    });
    const updateHTML = makeProgressUpdater(htmlItems.length);
    for (const item of htmlItems) {
        await loadOneFile(db, "html", item.path, item.version, updateHTML);
    }
	// CSS
	const cssList = await fetch("ASSETScontents_css.txt").then(r => r.text());
	const cssItems = cssList.trim().split("\n").map(line => {
		const [path, version] = line.split("|");
		return { path, version };
	});
	const updateCSS = makeProgressUpdater(cssItems.length);
	for (const item of cssItems) {
		await loadOneFile(db, "css", item.path, item.version, updateCSS);
	}
    // IMAGE
    const imgList = await fetch("ASSETScontents_image.txt").then(r => r.text());
    const imgItems = imgList.trim().split("\n").map(line => {
        const [path, version] = line.split("|");
        return { path, version };
    });
    const updateIMG = makeProgressUpdater(imgItems.length);
    for (const item of imgItems) {
        await loadOneFile(db, "image", item.path, item.version, updateIMG);
    }
    // AUDIO
    const audioList = await fetch("ASSETScontents_audio.txt").then(r => r.text());
    const audioItems = audioList.trim().split("\n").map(line => {
        const [path, version] = line.split("|");
        return { path, version };
    });
    const updateAudio = makeProgressUpdater(audioItems.length);
    for (const item of audioItems) {
        await loadOneFile(db, "audio", item.path, item.version, updateAudio);
    }
	// SVG
	const svgList = await fetch("ASSETScontents_svg.txt").then(r => r.text());
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
//シナリオファイル1ファイルロード
const loadOneScenario = async (db, path, version) => {
    const dbData = await dbGet(db, "scenario", path);
    if (dbData && dbData.version === version) {
        return dbData.data;
    }
    const text = await fetch(path).then(r => r.text());
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
    const list = await fetch("ASSETScontents_scenario.txt?202605102355").then(r => r.text());
    const lines = list.trim().split("\n");
    const tasks = lines.map(async (line) => {
        if (!line.trim()) return [];
        const [path, version] = line.trim().split("|");
        const text = await loadOneScenario(db, path, version);
        return parseScenario(text); 
    });
    const parsedResults = await Promise.all(tasks);
    return parsedResults.flat();
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
    sc_var = {};
	WfTDA_global = false;
	remainingText = "";
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
function changeCssSvgUrl(TargetId, TargetVar, AssetsName) {
	const svgDataUrl = getSvgUrlFromASSETS(AssetsName);
	const elemen = document.querySelector(`#${TargetId}`);
	if (elemen) {
		elemen.style.setProperty(TargetVar, svgDataUrl);
	}
}
function changeCssImgUrl(TargetId, TargetVar, AssetsName) {
	const ImgUrl = ASSETS.imgs[AssetsName];
	const elemen = document.querySelector(`#${TargetId}`);
	if (elemen) {
		elemen.style.setProperty(TargetVar, `url(${ImgUrl})`);
	}
}
function changeImgSrc(id, Type, path) {//Typeは"img"/"svg"
	const Target = document.getElementById(id);
	if (Type === "svg") {
		let svgText = ASSETS.svg[path];
		if (!svgText.includes('xmlns="http://www.w3.org/2000/svg"')) {
			svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
		}
		const blob = new Blob([svgText], { type: 'image/svg+xml' });
		Target.src = URL.createObjectURL(blob);
	} else if (Type === "img") Target.src = ASSETS.imgs[path];
}
/*
//localStorageの許可を取得 実行順序1
document.getElementById("localStorage_accept").addEventListener('click', async () => {
	is_localStorage_allowed = true;
	localStorage.setItem("is_localStorage_allowed", "true");
	await first_display_change();
	});
document.getElementById('localStorage_not_accept').addEventListener('click', async () => {
	is_localStorage_allowed = false;
	await first_display_change();
});

//ローカルストレージが有効だったら変数を更新する:実行順序2
if (localStorage.getItem("is_localStorage_allowed") == "true") {
	is_localStorage_allowed = true;
	await first_display_change();
}
*/
// engine.js
//実行順序1
const initEngine = async () => {
    const isAllowed = localStorage.getItem("is_localStorage_allowed") === "true";

    if (isAllowed) {
        // パターンA: すでに許可があるなら即実行
        is_localStorage_allowed = true;
        await first_display_change();
    } else {
        // パターンB: 許可がないならボタンにイベントを登録
        const acceptBtn = document.getElementById("localStorage_accept");
        const rejectBtn = document.getElementById("localStorage_not_accept");

        // ボタンがHTMLに存在するかチェック（念のため）
        if (acceptBtn && rejectBtn) {
            acceptBtn.addEventListener('click', async () => {
                is_localStorage_allowed = true;
                localStorage.setItem("is_localStorage_allowed", "true");
                await first_display_change();
            });

            rejectBtn.addEventListener('click', async () => {
                is_localStorage_allowed = false;
                await first_display_change();
            });
        }
    }
};

//最初の画面遷移, body_contents移植
async function loadBody(url) {
	if (ASSETS.html[url] == undefined) {
		const res = await fetch(url);
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
//最初の画面遷移, body_contents移植
async function first_display_change() {
	clearDispExp();
	//scファイル読み取り
	if (current_display === "index") {
		document.getElementById("forusertonoticeloading").textContent = "データの読み込み中です";
		document.getElementById("localStorage_accept").setAttribute("disabled", true);
		document.getElementById("localStorage_not_accept").setAttribute("disabled", true);
		SCENARIO = await loadAndParse();
		document.getElementById("loadprogress").style.display = "block";
		await setASSETS();
	}
	
	loadBody("HTML/title/maintitle.html").then(bodyContent => {
		document.getElementById("body_contents").innerHTML = bodyContent;
		changeCSS("", "css/style.css");
		changeCSS("", "css/title.css");
		/*
		const newLink = document.createElement('link');
		newLink.rel = 'stylesheet';
		newLink.href = '/css/title.css';
		document.head.appendChild(newLink);
		//あればmaindisplay.cssを削除
		const linkToDelete = document.querySelector('link[href="/css/maindisplay.css"]');
		if (linkToDelete) {
		  linkToDelete.remove();
		}
		*/
		changeCSS("css/maindisplay.css", "css/title.css");
		//画像をASSETSより適応
		//document.getElementById("titlelogo").src = ASSETS.imgs["material/other_materials/mainlogo.png"];
		changeImgSrc("titlelogo", "img", "material/other_materials/mainlogo.png");
		changeImgSrc("pendant", "svg", "material/other_materials/pendant.svg");
		changeCssImgUrl("titlebg", "--titlebg-url", "material/back_image/title_default.jpg");
		//ローカルストレージに途中までのデータがあったら「途中からストーリーを再開する」ボタンを設置
		const last_saved_scenario = Number(localStorage.getItem("last_sc_line") || -1);
		if (last_saved_scenario > 0 || last_sc_line > 0) {
			if (SCENARIO.length-1 <= last_sc_line || SCENARIO.length-1 <= last_saved_scenario) {
				//最後まで行ったとき
				document.getElementById("ini_storybuttonL").classList.add('hidden');
				document.getElementById("seq_storybutton").classList.add('hidden');
				document.getElementById("endingbutton").classList.remove('hidden');
				document.getElementById("solvingbutton").classList.remove('hidden');
				document.getElementById("methodbutton").classList.remove('hidden');
				document.getElementById("recordbutton").classList.remove('hidden');
				document.getElementById("ini_storybuttonS").classList.remove('hidden');
			} else {
				//途中までやっているとき
				document.getElementById("ini_storybuttonL").classList.add('hidden');
				document.getElementById("seq_storybutton").classList.remove('hidden');
				document.getElementById("endingbutton").classList.add('hidden');
				document.getElementById("solvingbutton").classList.remove('hidden');
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
			document.getElementById("solvingbutton").classList.remove('hidden');
			document.getElementById("methodbutton").classList.remove('hidden');
			document.getElementById("recordbutton").classList.add('hidden');
			document.getElementById("ini_storybuttonS").classList.add('hidden');
		}
		//各タイトル画面のボタンに対してイベントリスナーを設定する
		const ini_story = async () => {
			const last = localStorage.getItem("last_sc_line");
			if (last && last !== "-1") {
				const ok = confirm("ゲームが最初からスタートします。\nデータは復元できません。\n最初からスタートしますか？");
				if (!ok) return;
			}
			await resetScenarioData();
			last_sc_line = -1;
			localStorage.setItem("last_sc_line", "-1");
			await display_change_toStory();
		}
		const seq_story = async () => {
			if (last_saved_scenario > last_sc_line) {
				last_sc_line = last_saved_scenario;
			}
			await display_change_toStoryContinue(last_saved_scenario);
		}
		const ending_story = async () => alert("エンディングが表示されます(未実装)")
		const solving_story = async () => alert("謎解きモードになります(未実装)")
		const method_story = async () => alert("操作方法が表示されます(未実装)")
		const record_story = async () => alert("あらすじが表示されます(未実装)")
		document.getElementById("ini_storybuttonL").addEventListener('click', ini_story);
		document.getElementById("seq_storybutton").addEventListener('click', seq_story);
		document.getElementById("endingbutton").addEventListener('click', ending_story);
		document.getElementById("solvingbutton").addEventListener('click', solving_story);
		document.getElementById("methodbutton").addEventListener('click', method_story);
		document.getElementById("recordbutton").addEventListener('click', record_story);
		document.getElementById("ini_storybuttonS").addEventListener('click', ini_story);
		current_display = "title";
	});
	
}
const end_of_scenario = () => alert("シナリオの終わりです");
//ストーリーモードへの画面遷移
async function display_change_toStory() {
		current_display = "story";
		const bodyContent = await loadBody("HTML/maindisplay/maindisplay.html");
		document.getElementById("body_contents").innerHTML = bodyContent;
		changeCSS("css/title.css", "css/maindisplay.css");
		changeCssSvgUrl("textframe", "--textframe-url", "material/frame/text_frame.svg");
		changeCssSvgUrl("mainmenublock", "--mainmenublock-url", "material/frame/menu_frame.svg");
		//各タイトル画面のボタンに対してイベントリスナーを設定する
		document.getElementById("mainmenubutton").addEventListener('click', async () => {
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
				document.getElementById("contentdiv").classList.remove('is_open');
				await first_display_change();
			};
			//メニュー画面
			const bodyContent = await loadBody("HTML/maindisplay/menu.html");
			document.getElementById("contentdiv").innerHTML = bodyContent;
			document.getElementById("contentdiv").classList.add('is_open');
			document.getElementById("backdisplaybutton").addEventListener('click', async () => {
				document.getElementById("contentdiv").classList.remove('is_open');
				document.getElementById("contentdiv").innerHTML = "";
			});
			document.getElementById("setting").addEventListener('click', async () => {
				window.alert("設定を開く～\nけど未実装～");
			});
			document.getElementById("backtotitle").addEventListener('click', gotoTitle);
		});
		//バックログ(探偵ログ)
		document.getElementById("backlogbutton").addEventListener('click', async () => {
			window.alert("探偵ログを表示")
			
		});
		//進むボタンで次のsc実施
		document.getElementById("nextbutton").addEventListener("click", () => {
			document.getElementById("nextbutton").disabled = true;
			if (last_sc_line+1 < SCENARIO.length) {
				last_sc_line++;
				let returned_index = do_scenario(last_sc_line); //do_scenarioは最後にやった0-basedの行番号を返す
				last_sc_line = returned_index;
				localStorage.setItem("last_sc_line", String(last_sc_line));
			} else {
				end_of_scenario();
			}
			
			document.getElementById("nextbutton").disabled = false;
		});
		//最初のシナリオを表示する
		if (!(Number(localStorage.getItem("last_sc_line") || -1) >= 0)) {
			//do_inaninstant = true;
			let returned_index = do_scenario(0);
			last_sc_line = returned_index;
			localStorage.setItem("last_sc_line", String(last_sc_line));
			//do_inaninstant = false;
		}
}

async function display_change_toStoryContinue(lss) {
	current_display = "continue";
	await display_change_toStory();
	//シーン切り替え
	do_inaninstant = true;
	for (let i = 0; i < lss; i++) {
		let returned_index = do_scenario(i);
		i = returned_index;
		last_sc_line = i;
		localStorage.setItem("last_sc_line", String(last_sc_line));
	}
	do_inaninstant = false;
	last_sc_line = do_scenario(lss);
	localStorage.setItem("last_sc_line", String(last_sc_line));
}

//指定の行番号を探して実行する
function do_scenario(num) {
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
		//console.log("テキスト表示可能領域高さ: ", dispable_text_height);
		/*
		while ((p.scrollHeight + marginTopP) > (parent.clientHeight + marginBottomParent) && p.textContent.length > 0) {
			console.log("親要素:", parent.clientHeight + marginBottomParent, ", テキスト:", p.scrollHeight + marginTopP, ", テキスト長さ:", p.textContent.length);
			p.textContent = p.textContent.slice(0, -1);
		}
		*/
		while ((p.scrollHeight + marginTopP) > dispable_text_height && p.textContent.length > 0) {
			console.log("テキスト表示可能領域高さ:", dispable_text_height, ", テキスト:", p.scrollHeight + marginTopP, ", テキスト長さ:", p.textContent.length);
			p.textContent = p.textContent.slice(0, -1);
		}
		
		const visibleText = p.textContent;
		const hiddenText = fullText.slice(visibleText.length);
		console.log("\n表示:", visibleText, ", 非表示:", hiddenText);
		document.getElementById("mainmenubutton").disabled = false;
		if (hiddenText !== "") {
			remainingText = hiddenText; // グローバル変数に退避
            document.getElementById("nextbutton").textContent = "続きを読む";
			return true; 
		} else {
			remainingText = "";
            document.getElementById("nextbutton").textContent = "次へ";
			return false;
		}
	}
	///-------------------------------------------
    let index = num;// numは0-based
	let WfTDA_inside = false;
	const LIMIT = SCENARIO.length * 1000;
	let returning_index = num - 1;

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

		while (true) {
			const [funcName, args] = SCENARIO[index];
			const commandFunc = COMMANDS[funcName];

			if (typeof commandFunc === "function") {
				const [code, value] = commandFunc(args);
			
				if (!scline_counter[index]) scline_counter[index] = 0;
				scline_counter[index]++;
				if (scline_counter[index] > LIMIT) {
					console.error("無限ループの可能性があります。停止します。");
					returning_index = SCENARIO.length; // 存在しない行番号
					break;
				}
				
				// setvar 系の保存
				if (code === 10 || code === 11) {
					saveScVarToDB();
				}
				// ジャンプ
				if (code === 2) {
					index = value; // 0-based
					continue;
				}
				// 次へ
				if (code === 1 || code === 11) {
					index++;
					continue;
				}
				//テキスト(セリフ)
				if (!do_inaninstant && code === 30) {
					WfTDA_global = adjustTextDisplay();
					if (!WfTDA_global) returning_index = index;
					WfTDA_inside = false;
				}
				if (code === 31) {
					WfTDA_inside = true;
					continue;
				}
				// 停止
				returning_index = index;
				break;
			} else {
				console.error(`命令 '${funcName}' は COMMANDS に定義されていません。`);
				break; 
			}
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

// 実行
initEngine();