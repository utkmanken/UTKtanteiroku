disp_text 0 dialogue ああああああああああああああああああああああああああああああああああああああああああああああiueokakikukekosasisusesotachitutetonaninunenohahahahahahahahha\safe Z_test ABCD<EFG:えｆｇ> {}
dialogue 終了\n-----------------------長いテキストの続きを読む機能のテストぉぉぉぉぉぉぉぉぉぉぉぉおぉっぉぉぉおぉぉぉぉぉぉ nomal admin admin None
release_arasuzi 1 1
setvar 1 issue34_check["value"] "振り返りの値"
disp_text 0 dialogue issue34\s振り返り再生中の変数は${issue34_check["value"]}です。 Z_test Issue<振返:ふりかえり> {}
sc_calc 1 issue34_check["count"] + 2
disp_text 0 dialogue issue34\ssc_calc後の値は${issue34_check["count"]}です。 Z_test Issue<計算:けいさん> {}
setvar 1 issue34_check["flag"] "summary"
sc_if issue34_check["flag"]=="summary" 110 111
disp_text 0 dialogue issue34\ssc_ifはsummary側の値を読んでtrueになりました。 Z_test Issue<分岐:ぶんき> {}
debug_dispvar issue34_check 1 0
clearvar 1 issue34_check["value"] 3
disp_text 0 dialogue issue34\sclearvar後のvalueは${issue34_check["value"]}、countは${issue34_check["count"]}です。 Z_test Issue<削除:さくじょ> {}
setvar 1 issue34_check["value"] "本編の値"
disp_text 0 dialogue abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ Z_test <亜:aaaaaaaa>いうえおかきくけこ {}
disp_text 0 dialogue 僕がテスト用に文章を作ってあげたよ Z_test Chat<GPT:げーぺーてー> {}
disp_text 0 dialogue 今日は\s天気がいいね。\n散歩でも\sしようか。 Z_test 山田<太郎:たろう> {}
disp_text 0 dialogue この本は\s最後まで\s読むと\n意外な\s結末が\s待っているよ。 Z_test 佐藤<美咲:みさき> {}
disp_text 0 dialogue あの店の\sケーキは\n甘さ控えめで\sとても\sおいしいよ。 Z_test 高橋<一樹:かずき> {}
disp_text 0 dialogue 今日は\s少し\s疲れたから\n早めに\s休むことにする。 Z_test 伊藤<彩乃:あやの> {}
disp_text 0 dialogue この先は\s道が\s狭いから\n足元に\s気を付けて。 Z_test 鈴木<陽翔:はると> {}
disp_text 0 dialogue 明日の\s集合時間は\n朝\s八時だから\s遅れないでね。 Z_test 中村<遥香:はるか> {}
disp_text 0 dialogue ゆっくりで\s大丈夫。\n焦らず\s自分の\sペースで\s進もう。 Z_test 小林<蒼空:そら> {}
disp_text 0 dialogue 窓を\s開けると\n涼しい\s風が\s入ってきた。 Z_test 加藤<結衣:ゆい> {}
disp_text 0 dialogue 新しい\s仲間が\s増えると\nもっと\sにぎやかに\sなりそうだね。 Z_test 木村<蓮:れん> {}
disp_text 0 dialogue それじゃあ\s準備が\sできたら\n出発\sしよう！ Z_test 田中<咲良:さくら> {}
release_arasuzi 1 2
setvar 1 disp_text_test["message"] "SC_VAR展開成功"
disp_text 0 dialogue disp_text\s基本表示:${disp_text_test["message"]} Z_test 山田<太郎:たろう> {"color":"#ffdddd","fontWeight":"bold"}
disp_text 1 console console:${disp_text_test["message"]} None None {}
disp_text 0 textcontent 任意id表示\s<ruby>漢字<rt>かんじ</rt></ruby> None None {"fontStyle":"italic"}
disp_text 0 dialogue 名前あり任意id表示では、第七引数省略でもこのセリフ欄は残ります。 Z_test 確認<対象:たいしょう> {}
disp_text 0 nextbutton 名前あり維持 Z_test 表示<名:めい> {}
disp_text 0 dialogue 名前あり任意id表示でも、第七引数1なら次でセリフ欄が空になります。 Z_test 確認<対象:たいしょう> {}
disp_text 0 nextbutton 名前あり空欄化 Z_test 表示<名:めい> {} 1
disp_text 0 dialogue 任意id表示で名前なしの場合、次でセリフ欄が空になります。 Z_test 確認<対象:たいしょう> {}
disp_text 0 nextbutton 空欄化 None None {}
disp_text 0 dialogue 任意id表示でも第七引数0なら、このセリフ欄は残ります。 Z_test 確認<対象:たいしょう> {}
disp_text 0 nextbutton 維持 None None {} 0
disp_text 0 nextbutton 次へ None None {} 0
dispIMG 0 bg 1 material/back_image/library.jpg 0 0
disp_text 0 dialogue dispIMG\s背景即時表示のテストです。 Z_test 背景<表示:ひょうじ> {}
dispIMG 0 bg 1 material/back_image/chemistryclass.jpg 1 1
disp_text 0 dialogue dispIMG\s背景フェード変更のテストです。 Z_test 背景<変更:へんこう> {}
dispIMG 0 chara 1 material/chara_image/A_Kabura_webp/chara_A01.webp 1 0.5 kabura
disp_text 0 dialogue dispIMG\s立ち絵フェードインのテストです。 Z_test 立ち絵<表示:ひょうじ> {}
dispIMG 0 chara 1 material/chara_image/A_Kabura_webp/chara_A02.webp 0 0 kabura
disp_text 0 dialogue dispIMG\s立ち絵差分切り替えのテストです。 Z_test 立ち絵<差分:さぶん> {}
statusIMG 0 kabura {position:left,size:chara,duration:0}
disp_text 0 dialogue statusIMG\s左位置と標準サイズを即時適用するテストです。 Z_test 状態<変更:へんこう> {}
statusIMG 0 kabura {position:right,rotate:8,scale:1.1,duration:800,easing:ease-in-out}
disp_text 0 dialogue statusIMG\s右位置へ時間をかけて移動し、回転と拡大を行うテストです。 Z_test 状態<移動:いどう> {}
statusIMG 0 kabura {position:mid,flipX:1,brightness:80,zIndex:45,duration:500}
disp_text 0 dialogue statusIMG\s中央位置、左右反転、明度変更、重なり順変更のテストです。 Z_test 状態<反転:はんてん> {}
statusIMG 0 kabura {rotateX:25,rotateY:-25,perspective:800,duration:700,easing:ease-in-out}
disp_text 0 dialogue statusIMG\s3D回転のrotateXとrotateYを行うテストです。 Z_test 状態<三次元:さんじげん> {}
statusIMG 0 kabura {rotateX:0,rotateY:0,rotate:0,scale:1,brightness:100,duration:500}
disp_text 0 dialogue statusIMG\s3D回転と拡大を戻すテストです。 Z_test 状態<復帰:ふっき> {}
statusIMG 0 kabura {opacity:0.4,blur:3,saturate:40,duration:600}
disp_text 0 dialogue statusIMG\s透明度、ぼかし、彩度変更を行うテストです。 Z_test 状態<効果:こうか> {}
usIMG 0 kabura {brightness:1.5,saturate:1.5,duration:600}stat
disp_text 0 dialogue statusIMG\s明度と彩度の1.5を1.5%として扱うテストです。 Z_test 状態<低下:ていか> {}
statusIMG 0 kabura {opacity:1,filter:None,flipX:0,duration:600}
disp_text 0 dialogue statusIMG\s透明度とフィルター、左右反転を戻すテストです。 Z_test 状態<解除:かいじょ> {}
dispIMG 0 chara 0 None 1 0.5 kabura
disp_text 0 dialogue dispIMG\s立ち絵フェードアウトのテストです。 Z_test 立ち絵<非表示:ひひょうじ> {}
qr
disp_text 0 dialogue disp_text\sフェードインのテストです。 Z_test 表示<確認:かくにん> {"fadeIn":1,"fadeInDuration":0.8}
disp_text 0 dialogue 次の任意id表示で、セリフ欄と名前がフェードアウトして空になります。 Z_test 表示<確認:かくにん> {}
disp_text 0 nextbutton フェードアウト None None {"fadeOut":1,"fadeOutDuration":0.8} 1
dispIMG 0 chara 1 material/chara_image/A_Kabura_webp/chara_A01.webp 0 0 kabura
dispIMG 0 chara 1 material/chara_image/E_Mashiro_webp/chara_E01.webp 0 0 mashiro
dispIMG 0 chara 1 material/chara_image/B_Kabura_webp/chara_B01.webp 0 0 kabura
disp_text 0 dialogue バックログアイコンはB_Kabura_webpの立ち絵でもAのアイコンを使用するテストです。 kabura カブラ {}
disp_text 0 textcontent 二人の立ち絵位置を調整します。 None None {"ids":{"kabura":{"left":"25%","top":"","bottom":"0","width":"45%"},"mashiro":{"left":"50%","width":"45%"}}} 0
disp_text 0 dialogue カブラが話しているので、真白側が暗くなります。 kabura カブラ {}
disp_text 0 dialogue 真白が話しているので、カブラ側が暗くなります。 mashiro 真白 {}
disp_text 0 nextbutton 任意idかつ名前なしではデフォルトで全員暗くなります kabura None {} 0
disp_text 0 nextbutton 任意idでは自動暗転しません None None {"dimInactiveChara":0} 0
disp_text 0 dialogue status_text\s本文全体の色変更、拡大、揺れのテストです。 Z_test 演出<確認:かくにん> {}
status_text 0 dialogue {color:#ff99ff,scale:1.12,shake:1,duration:600,easing:ease-in-out}
disp_text 0 dialogue status_text\s名前欄の色変更と拡大のテストです。 Z_test 演出<名前:なまえ> {}
status_text 0 name {color:#99ddff,scale:1.15,duration:500}
disp_text 0 dialogue status_text\s<span\sid="status_text_part">一部文字</span>だけ色変更、拡大、揺れを行うテストです。 Z_test 演出<一部:いちぶ> {}
status_text 0 status_text_part {color:#ffff66,scale:1.3,shake:6,shakeDuration:500,duration:500}
status_text 0 dialogue {color:white,scale:1,shake:0,duration:300}
status_text 0 name {color:white,scale:1,duration:300}
disp_text 0 dialogue effect_screen\s画面全体フェードのテストです。 Z_test 画面<効果:こうか> {}
effect_screen 0 {type:fade,color:black,opacity:0.45,duration:500}
disp_text 0 dialogue 画面全体に暗いフェードがかかります。 Z_test 画面<暗転:あんてん> {}
effect_screen 0 {type:clear,duration:400}
disp_text 0 dialogue effect_screen\sフラッシュ、シェイク、カラーフィルタ、スライド、ワイプのテストです。 Z_test 画面<効果:こうか> {}
effect_screen 0 {type:flash,color:white,opacity:0.9,duration:300}
effect_screen 0 {type:shake,amount:8,duration:500,count:1}
effect_screen 0 {type:filter,brightness:80,blur:1,saturate:60,duration:500}
disp_text 0 dialogue 画面全体にカラーフィルタがかかります。 Z_test 画面<色調:しきちょう> {}
effect_screen 0 {type:clear,duration:300}
effect_screen 0 {type:slide,direction:left,distance:4%,duration:500}
effect_screen 0 {type:wipe,direction:right,color:black,opacity:0.8,duration:500}
disp_text 0 dialogue add_html\sHTML要素追加のテストです。 Z_test HTML<追加:ついか> {}
add_html 0 dialogue beforeend <span\sid="add_html_test"\sstyle="color:#66ffcc;font-weight:bold;">SCから追加したHTML要素</span>
add_html 0 add_html_test beforeend <ruby>漢字<rt>かんじ</rt></ruby>
status_text 0 add_html_test {color:#ffcc66,scale:1.15,duration:300}
end