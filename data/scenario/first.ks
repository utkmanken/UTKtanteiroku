


[title name="utktanteiroku"]
;タイトル決まったら変える

[stop_keyconfig]


;ティラノスクリプトが標準で用意している便利なライブラリ群
;コンフィグ、CG、回想モードを使う場合は必須
[call storage="tyrano.ks"]

;ゲームで必ず必要な初期化処理はこのファイルに記述するのがオススメ

;変数、その他マクロなど
[call storage="library.ks"]

;キャラクターの定義
[call storage="chara_list.ks"]

;メッセージボックスは非表示
@layopt layer="message" visible=false

;最初は右下のメニューボタンを非表示にする
[hidemenubutton]
;プラグイン
[plugin name="image_viewer"]

;タイトル画面へ移動
[jump storage="title.ks"]

[s]


