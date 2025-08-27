

*qr1start

[cm]
[clearfix]
[start_keyconfig]
[show_skip]
[show_auto]

[wait time="200"]

;背景設定
[bg storage="qrbk001-01.png"]

;吹き出し表示
[show_message]
[cm]


[button name="role_button" role="backlog" graphic="pull1.png" left="0" top="0"]

#
ザワザワ。ガヤガヤ[p]

;主人公（画面左in）

#shujinnkou
これが宇高祭か。[t2]結構賑わってる。[t1][r]

あちこちにいろんな展示がされてるんだな。[p]

どれも面白そうだけど、これから何の展示を見に行こう?[p]


;漫研部員（怪獣のフードを被って）（画面右in）
;漫研部員登場
[chara_show name="kabura" left="720" top="216" face="rA15"]

[anim name="kabura" time="450" left="-720" ]

[wait time="450"]

[chara_mod name="kabura" face="rA14"]

[chara_move name="kabura" left="720" top="216" time="0"]

[anim name="kabura" time="150" left="-90"]


[image storage="mainf.png" left="0" top="0" layer="0"]

;スマホ振動
[font size=60 bold=true]
#kabura
ぐるぁぁぁあああァア![t1][p]
[resetfont]


#shujinnkou
!!?[p]


#kabura
漫画研究同好会の展示はこの奥でやってるよぐるぁぁああ![p]

[chara_move name="kabura" left="-150" top="216" time="0"]


#kabura:rA02
どうだこの美術部特製怪獣スーツ![t2]これで皆漫研に興味を……[p]


#kabura:rA08
ってあれ?[t2]引かれてる…?[p]


#kabura:rA13
おかしいな。[t2]こんなに漫画脳を刺激されるクオリティなのに。[t2]


#kabura:rA12
くそ〜[t2]無理を言ってユラに作ってもらって早朝から待機してるのに![p]


#shujinnkou
な、[t1]何だあの変な人。[t2]早く離れよ。[p]


#kabura:rA07
ええい、[t1]向こうから来ないならこっちからだ![p]


#kabura:rA11
そこの人![t1]漫画研究同好会の展示に興味ない⁉︎[p] 


#shujinnkou
!?[t2]話しかけられてしまった……[p]


#kabura:rA02
どうやらこの服に驚いてるようだな。[p]


#kabura:rA09
いいだろ。[t2]作ってもらったんだ。[t2]たんたらたーん。[p]


#kabura:rA10
それで、[t1]漫研の展示はどうかな?[t1] 

俺たち漫研と、[t1]美術部が普段の活動で作った作品を展示してるんだ。[p]

力作揃いだし、[t1]それに、俺の一押しも展示してるんだよ![p]


#kabura:rA11
行き先が決まって無いなら是非!![p]


#shujinnkou
宇高の生徒は変人が多いって聞いてたけど、[t1]本当だったようだ。[p]

でも確かに作品の展示は少し気になる。[p]

ものは試しだろうか……[t4]よしっ。[p]


#kabura:rA06
えっ、来てくれるって? [t1]いいねそう来なくっちゃ![p]


#kabura:rA10
展示場所は……[t2][r]


#kabura:rA07
あー……[t2][r]


#kabura:rA11
ええい面倒くさい![p]


#kabura:rA10
奥まった所にあるし、[t1]俺が付いてくよ。[p]


#kabura:rA09
道中にも色々あるから、[t1]軽く見ていってもいいかもな。[p]

俺なら終わるまで待つから気にしなくていいよ。[t2]どうせ一日暇だし……[p]


#kabura:rA06
あっ、[t1]忘れてた。


#kabura:rA10
[t2]自己紹介がまだだったよな。[p]


#kabura:rA01
俺は3年、[t1]漫画研究同好会会長の "芒カブラ" [p]


#shujinnkou
ススキ・・・あの植物の芒だろうか。[t2]ずいぶん変わった苗字だな。[p]


#kabura:rA11
よし、[t1]それじゃあ行こう![p]

【指示:漫研の展示会場に移動しよう】

*qr1finish

[cm]

[chara_hide_all time=1000 wait=true]

[hide_message]


;テストあとで消す
[jump storage="scene2.ks" target="*qr2start"]
;
[eval exp="sf.chaptercount = sf.chaptercount + 1"]
;QR1をみたかのチェック チェックポイントに1を足す


[bg storage=qrbk001-01.png]

[jump storage="mainroute.ks" target="*camerapoint"]