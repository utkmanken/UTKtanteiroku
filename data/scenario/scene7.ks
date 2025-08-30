

*qr7start

[hide_message]

[stop_bgcamera wait=false]
[cm]

[wait time=200]

[show_skip]

;背景表示
[bg storage="qrbk009_01.jpg" time="200" wait="false"]

[show_place text="正面入口"]

[wait time="800"]

[hide_place]

[bg storage="qrbk009_02.jpg"]

[show_message]

[show_menu]


[anime1 name="kabura" layer="2"]


#kabura:B15
ワトソンくん。[t2] 君はさっきの化学部の部長どう思った?[p]

#kabura:B12
俺はかなり怪しいと思うんだ。[t2]もしかしたら、犯人はあいつなのかもしれない。[p]


#shujinnkou
![p]


#kabura:B15
第一にアリバイがないってのが怪しい。[p]

第二に絵の噂を知ってたのも怪しい。[p] 

#kabura:B12
柳は肝心の財宝がもうない事を知らないから、[t1] 財宝目当てで盗んだってのはありそうな話じゃないか?[p]


#shujinnkou
確かにカブラさんの言うように気になる点は多い。[p] 

でも犯人ならあんなに平然と絵について話さないような気もする。[p] 

そこまでして手に入れたい何かが日誌にでも書いてあったのか……？[p]

何にせよ、[t1]具体的な推理にはまた何か情報が必要そうだ。[p]


#kabura:B01
情報か。[t2]確かにワトソンくんの言う通りだな。[t2]推理は後にしよう。[p]

#kabura:B14
さて、[t1]柳の話だとこの辺に荷物があるはずだけど……[t1]見た目とかはもらった紙に書いてあるのかな?[p]
;暗号のメモが表示される



[chara_hide_all time="200" wait="true" layer="2"]

[bg storage="qrbk101_01.jpg" time="200" wait="false"]




#kabura:B05
なんだこれ?[t1]間違った紙を渡されたのかな。[t3]

#kabura:B07
いや……[t1]もしかして、[t1]このメモ暗号になってるのか⁉︎

#kabura:B05
全く、[t1]なんでこんな面倒くさいことするんだ。[p]

#kabura:B01
しょうがない。[t2]ワトソンくん、[t1]一緒に解こう[p]

;暗号を解読し薬品の入った箱をスキャンしろ、と表示される。５つの箱に貼られたQRを読み込んでH2O2を見つける。ハズレの箱には陸上用具が入ってる


*mission_start

[cm]


#
左上のカメラのマークをタップして、薬品の入った箱のQRコードをスキャンしよう。[r]

バツのマークをタップすると暗号を確認できるぞ。


[button graphic="camerabutton.png" target="*camerapoint" width="100" height="100" x="40" y="256" layer="0" fix="false"]


[s]


*camerapoint

[cm]

[bgcamera mode="back" fit="true" qrcode="all" left="0" top="216" width="720" height="680"]

[button graphic="closebutton.png" target="mission_start" width="100" height="100" x="40" y="256" layer="1"]

[s]


;[jump target="*coke"]

*coke
[stop_bgcamera wait=false]

[cm]

これ、コーラだ。そこの自販機に補充する用か。[p]

どうやらどこかで推理が間違ったみたいだな。[t2]もう一度考えてみよう。[p]

[jump target="*mission_start"]

[s]


*chalk
[stop_bgcamera wait=false]

[cm]

ごほ、ごほっ。[t2]け、煙たい![t2]これ、チョークだ。[p]

どうやらどこかで推理が間違ったみたいだな。[t2]もう一度考えてみよう。[p]

[jump target="*mission_start"]

[s]


*shoes
[stop_bgcamera wait=false]

[cm]

これって靴?[t2]形からして運動部が使うやつみたいだな。[p]

なんにせよ、[t1]どこかで推理が間違ったみたいだ。[t2]もう一度考えてみよう。[t2]

[jump target="*mission_start"]

[s]

*candy
[stop_bgcamera wait=false]

[cm]

うわっ、[t1]この中全部飴玉か?どこかの部活の景品だな。[p]

どこかで推理が間違ったみたいだ。[t2]もう一度考えてみよう。[p]

……一つぐらいもらってもバレないかな?[p]

[jump target="*mission_start"]

[s]



*cake
[stop_bgcamera wait=false]

[cm]

[freeimage layer="0"]

[bg storage="qrbk009_02.jpg" time="200" wait="false"]

[chara_show name="kabura" time="500" wait="false" layer="2" face="B13" left="0" top="216"]


#kabura:B13
これ、[t1]薬品だ。[t2]よっしゃ。[t2]ワトソンくんのおかげで見つかったよ。[p]

#kabura:B15
H2O2……[t2]過酸化水素水だっけ。[t2]ああ、[t1]これって確かばく……[p]


#shujinnkou
ばく?[p]


#kabura:B06
あーいや、[t1]なんでも無い。[p]

#kabura:B08
ともかく色んな実験に使うらしいから、[t1]スライム作りにも使うのかもな～。[p]

周りのダンボールで隠れた位置に置いてあるから、[t1]見つけづらかったな。[p]

#kabura:B15
なんで柳はこんな所に薬品を置いといたんだろ[p]



[ranime1 name="kai" layer="2" face="rF11"]

#kai:rF11
あれー?[t2]君たち、[t1]そんな所で何してるの?[p]


#kabura:B05
ぐげげっ!く、[t1]葛葉!?[p]

#kai:rF03
あ、[t1]なんだ。[t2]カブラくんか![p]

そっちの君は他校のお友達かな?[p] 
初めまして。[t2]僕は3年の葛葉カイト。[p] 

陸上部の部長もやってたりするよ。[t2]よろしく[p]


#kabura:B11
に、[t1]逃げようワトソンくん![p]

俺はコイツが苦手なんだ![p]


#kai:rF12
もしかして友達くん、[t1]僕のこと警戒してる?[p] 

#kai:rF03
誤解しないで欲しいな。[t2]僕らは友達なんだ。[p]


#kai:rF11
先月ぐらいに、[t1]カブラくんがひょうたん池で爆破実験をしただろ?[p] 

#kai:rF12
実は宇高のひょうたん池の底は、[t1]ヘドロだらけで[t1] 
あの時、爆発でそのヘドロが辺りに飛び散っちゃったんだ[p]後始末が結構大変そうだから
僕ぁ掃除をちょっと手伝うことにした[t1]

#kai:rF03
それがきっかけでカブラくんと[t1]仲良くなれたんだ。[p]


#shujinnkou
?[t2] ただの良い人じゃないか。[t2]何をカブラさんは焦っているんだろう?[p]


#kabura:B05
勘違いするなよワトソンくん。[t2]協力どころの話じゃない。[p]

#kabura:B06
爆破の翌日の朝、[t1]俺が掃除に行った頃には、[t1]もうヘドロが跡形もなく片付いてたんだからな……[p]


#kabura:B05
こいつは人助けに快感を覚える変態なんだ。[p]


#kai:rF03
あっはは![t2]僕ぁ人助けが好きなだけだよ[p]


#kabura:B07
それだけ聞くと善人に聞こえるのがお前の恐ろしい所だよ。[p]


#shujinnkou
?[p]


#kai:rF12
それで、[t1]ここで何してたの?[t2]もしかして、[t1]また面白そうな事かい?[p]


#kabura:B07
本当はお前には言いたくないけど、[t1]一応お前も容疑者だからな……[p]


#kai:rF11
容疑者?[p]


#kabura:B15
実は——[p]

[chara_hide_all time="700" layer="2" wait="false"]

[bg storage="qrbk011_02.jpg" time="1000" wait="false"]

[wait time="1200"]

[bg storage="qrbk009_02.jpg" time="700" wait="false"]

[chara_show name="kai" time="700" wait="false" layer="2" face="rF01" left="0" top="216"]

[chara_show name="kabura" time="700" wait="false" layer="2" face="B05" left="0" top="216"]

[wait time="700"]



#kabura:B14
と、[t1]いうわけだ。[p]


#kai:rF03
盗まれた絵を追う名探偵か。[t2]カブラくんにピッタリじゃないか![p]

相変わらず最高に楽しそうなことを考えるね![p]


#kai:rF11
でもカブラくんにはまだ少し……[t2]不足かな。[p]


#kabura:B15
なんだって?[p]


#kai:rF03
いやいや、[t1]なんでもないよ。[p]


#kabura:B06
……ひとまずそういうことにしとくよ。[p]


#kabura:B14
それで、[t1]お前は昨日のアリバイはあるのか?[p]


#kai:rF12
んー……。

#kai:rF03
[t2]秘密![p]


#kabura:B04
⁉︎[p]


#kai:rF03
だって僕が今ペラペラ喋ってもつまんないじゃない。[p]

折角のミステリなら探偵を振り回す要素は多い方が良い![p]

僕ぁカブラくんが楽しめるように手伝いたいのさ![p]


#shujinnkou
なんだか……[t2]カブラさんのさっきからの態度の理由が、[t1]今ちょっと垣間見えた気がする。[p]


#kabura:B06
本当にいい性格してるよお前は。[p]


#kai:rF04
;（髪をかきあげてイヤリングが見える）

ははっ。[t2]ま、[t1]ひとまず、[t1]僕の事は置いておいて推理を頑張ってくれよカブラくん。[p]


#kabura:B15
ん、[t1]その耳の……[p]


#kai:rF07
あっ、[t2]やべやべっ。[t2]

#kai:rF06
2人とも今の内緒ね?[p] 

#kai:rF02
いくら宇高祭でも、[t1]先生に見つかったら没収されちゃうから。[p]

今日下ろしたてなのに早速没収は勘弁だよ。[p]


#kabura:B14
ああ。[t2]別にいいけど。[p]


#kai:rF02
ありがとう![t1]それじゃあまたね！[p]


#kabura:B05
ふう、[t2]やっと行ったか。[p]

#kabura:B07
あの口振りからしてまず犯人じゃなさそうだけど、[t1]あいつがこの学校で1番予測がつかないからな。[p]
関わりすぎないのが吉だ[p]


#kabura:B15
にしてもあのイヤリング……[t1]どこかで見た覚えがあるような気がするんだよな。[p] 

"長い爪の手と太陽"なんてデザイン、[t1]あんまり見かけないと思うんだけど。[p]

#kabura:B14
いや、[t1]まずは日誌が先だな[t2]。ワトソンくん[t1]、柳に会いに行くぞ![p]

#



*qr7finish


[hide_menu]

[hide_message]

[show_qrmessage]

[chara_hide_all time=1000 layer="2"]

生物室へ移動しよう


[eval exp="sf.chaptercount = 7"]
;QRをみたかのチェック チェックポイントに1を足す

[jump storage="mainroute.ks" target="*camerapoint"]