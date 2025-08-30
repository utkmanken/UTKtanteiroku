

*qr11start


[hide_message]

[stop_bgcamera wait=false]
[cm]

[wait time=200]

[show_skip]

;背景表示
[bg storage="qrbk012_01.jpg" time="200" wait="false"]

[show_place text="展示会場"]

[wait time="800"]

[hide_place]

[bg storage="qrbk012_02.jpg"]

[show_message]

[show_menu]

[jump target="*anime"]


#shujinnkou
何とか漫研部室らしきところにたどり着けた。[p]

柳さんからもらったコレの説明もされてないし。[p]

一体カブラさんは何を考えてるんだろう[p]

[anime1 name="kabura" layer="2"]


#kabura:B01
遅くなって悪かったなワトソンくん。[t2]


無事ここに辿り着けてて良かった。[p]

#kabura:B15
もうすぐ、あの人も来るはずだ。[p]


#shujinnkou
あの人?[p]


#kabura:B14
この事件の真犯人だ。[p]

さっきここに来るように伝えてきたんだ。[p]


#shujinnkou
![p]


#kabura:B14
複雑な上に証拠が少なくて、[t1]

俺たちには解けないんじゃないかとも思ったけど、[t1]むしろ逆だった。[p]

#kabura:B01
この事件は俺たちじゃないと解けなかったんだ。[p]


#shujinnkou
俺たちじゃないとって……[t2]僕は全然わからないままなんだけど……[p]


#kabura:B14
確かに犯人の行動は一見意味不明だ。[p]

でも、[t1]よく考えると犯人の行動がある1つの目的のために行われてることが分かる。[p]

#kabura:B08
まず、[t1]なぜ犯行は今日行われたんだろう?[p]

平日なら、[t1]こんな大騒動に発展する事はなかったはずだ。[p]



*loopstart1

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice1_1" text="外部犯だと思わせるため" width="600"]

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice1_2" text="愉快犯だから" width="600"]

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice1_3" text="時間が無かったから" width="600"]

[s]



*choice1_1

それなら犯人はもっと外部犯を装う工作をするべきだ。[t2]俺ですら内部犯なのはすぐわかったからな。[p]

[jump target="*loopstart1"]



*choice1_2
それにしてはこの事件には遊び心がないと思わないか?[p]

[jump target="*loopstart1"]


*choice1_3
その通り！[p]

[jump target="*loopend1"]



*loopend1

#kabura
俺は絵を展示する事を昨日の準備まで誰にも言って無かった。[p]

だから犯人は可能な限り早く絵を盗もうとして、[t1]このタイミングになったんだ。[p]

二つ目に、なぜ犯人はハッキングで研究データを閲覧できるようになってから絵を盗んだんだ?[p]


*loopstart2

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice2_1" text="念のため" width="600"]

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice2_2" text="ハッキングと絵を盗んだ理由は別だった" width="600"]

[s]


*choice2_1
#kabura
もっと合理的に行こうワトソンくん。[t2]君なら簡単なはずだ。[p]

[jump target="*loopstart2"]



*choice2_2
#kabura
その通り。俺たちは日誌や絵を研究データにたどり着くためのピースだと考えてた。[p]

でも、[t1]犯人にとってはそれそのものが必要だったんだ。[p]

[jump target="*loopend2"]



*loopend2


#kabura
研究データ、絵、日誌。[p]
これらを手に入れた犯人の目的とはなんだろうな。[p]


*loopstart3

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice3_1" text="僕たちへの嫌がらせ" width="600"]

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice3_2" text="絵の作者にまつわるものを集めること" width="600"]

[glink color="btn_07_black" font_color="FFFFFFFF" target="*choice3_3" text="さらに大きな暗号を解くため" width="600"]

[s]



*choice3_1
流石にそこまで誰かに嫌われてる訳無い……と思いたいな。[p]

[jump target="*loopstart3"]


*choice3_2
そう。この犯人は現存するあの作者の情報すべてを奪い去った訳だ。[p]

[jump target="*loopend3"]


*choice3_3
ここまでの情報すべてヒントに過ぎなかった的な?[p]

そういう力押しな展開は漫画ならネタ切れの証拠だぞワトソンくん。[p]

[jump target="*loopstart3"]




*loopend3

#kabura:B15
え、研究データは奪われてないって?[p]

#kabura:B13
そう、[t1]そこがミソなんだよワトソンくん。[p]

#kabura:B14
ここまでの話をまとめるよ。[p]

犯人はハッキングで研究データを入手した[p]

でも、[t1]その後現れた絵や日誌は、[t1]内容を写したりせずにリスクを犯してわざわざ奪っている。[p]

すなわち、[t1]犯人はこれらの内容には興味がなく、[t1]その現物そのものを消したがっていたんだ。[p]

#kabura:B15
だが、[t1]データはプログラムで保護されていたから、[t1]それができなかった。[p]

そしてこの焦りようからして、[t1]これらの資料には犯人にとっては、[t1]不都合な真実が隠されていると推測できる。[p]

絵に深い関係があり、[t1]噂すら流れていない4ヶ月前の時点で、[t1]

パソコンやデータの事を知る事ができた人物はただ1人[p]

#kabura:B12
作者の親友だ。[p]

;動いら

#yuto:rG06
ずいぶんと盛り上がっているね。[p]

#kabura:B12
やっと来たか。[p]


[ranime1 name="yuto" face="rG01" layer="2"]

#yuto:rG04
話がある、[t2]って事だったけど……[p]


#kabura:B10
:
;変更するかも
:
あの後、[t1]絵の作者のファイルの作成日を見て気付いた事があるんですよ。[p]

絵の作者が親友とイヤリングを掘り出したのは、2011年3月6日の""日曜日""だ。[p]

#kabura:B06
だが、あなたはその日の下校中に2人を見かけたと言った[t2][p]

どうしてそんな嘘をついたんですか?[p]


#yuto:rG01
……おや、[t1]そうだったかい。[p]

昔の事だし勘違いしていたのかも知れないな。[p]

決して嘘を吐こうだなんて——[p]


#kabura:B12
しらを切りますか。[p]

俺は、[t1]葛葉のイヤリングを見た時の既視感の正体を、[t1]ずっと考えてた。[p]

そして、[t1]ついさっきようやく気付いた。[p]

[chara_hide_all time=200 layer="2"]

[layopt layer="0" visible="true"]

[image storage="photo1.png" layer="0" left="40" top="296" time="500" wait="false" visible="true"]


あなたが、[t1]去年の宇高祭の時、[t1]よく似たイヤリングを付けてたんだ。[p]


#yuto:rG05
…………[p]

[freeimage layer="0"]

[chara_show name="yuto" face="rG05" left="0" top="216" layer="2" wait="false"]

[chara_show name="kabura" face="B10" left="0" top="216" layer="2" wait="false"]


#kabura:B10
身内じゃユラが疑わないはずだ。[p]

あなたがこの事件すべての犯人だった。[p]

#kabura:B06
いや、[t1]この事件だけじゃないのかもな。[p]

あなたがここまでして過去の記録を消そうとしたのは、[t1]もしかしたらもっと大きな失敗を隠そうと——[p]


#yuto:rH01
ごちゃごちゃうるせぇよ。[p]


#kabura:B09
![p]


#yuto:rH02
はぁ。[p]
つまらない真実を伝えれば、[t1]探偵ごっこはやめると思ったんだけどな。[p]


#shujinnkou
!!?[p]

#yuto:rH05
容疑者に近づきすぎだよワトソン君[p]

#kabura:B05
てめぇっ![p]


#yuto:rH03
動くなよ。[p]

動けばお友達を殺す。[p]


#kabura:B04
![p]

#kabura:B05
なんでそこまでする![p]

あんたは……[t2]あなたと親友の間に、[t1]何があったんだ⁉[p]


#yuto:rH03
君こそ何を言っている。[p]

私がどんな人間かは、[t1]もう君は知ってるだろう?[p]

研究データにあんな仕掛けをしておいて白々しいんだよ。[p]


#kabura:B04
⁈[p]


#yuto:rH05
文章のプロテクトも予想外だったよ。[t2][p]

昔はあんなの無かったからね。[p]

こんな事なら、[t1]14年前に……シュウヤを殺した時に全部処分しておけば良かったよ。[p]


#kabura:B09
は…………[p]

#yuto:rH05
ああ勿論、[t1]君の推理の通りさ。[p]

#yuto:rH04
僕はあの日、[t1]彼を殺したんだ。[p]


#kabura:B06
………は、[t1]はは。[p]

そこまでの……[t3]マジかよ。[p]


#yuto:rH05
絵の作者・・・[t2]シュウヤは私の親友だった。[p]

そして、[t1]本物の天才だった。[p]

その才能に気づいてる人間は誰もいなかったけどね。[p]

日に日に高度になる彼の理論を理解するため、[t1]必死に勉強したのもいい思い出だ。[p]

私にはそれまで何も無かった。[p]

何もかもが平凡。[p]

欠けたものも無いからこそ、[t1]それを嘆くことすら許されない誇りのない人生。[p]

そこに彼が飛び込んできた。[p]

私だけの宝物ができたんだ。[p]

しかも彼は1人では生きていけなかった。[p]

私が必要だったんだ。[p]

幸福だった。[p]


#yuto:rH03
だが、2年の春ごろ。[p]

しばらく姿を見せないと思っていると、[t1]君たちが日誌で読んだようにシュウヤは私に誕生日プレゼントをくれたんだ。[p]

初めは嬉しかった。[p]

だが彼が自分の研究を売却した事を知って、[t1]吐き気がした[p]

彼にもう私の援助はいらない。[p]

#yuto:rH04
その上、[t1]彼の才能をまもなく世界が見つけてしまう。[p]

焦りと不安に苛まれ、[t1]気づけば私は彼を締め殺していたんだ。[p]


#kabura:B07
・・・なんで笑ってるんだ[p]

#yuto:rH04

なぜ?[p]

あの日、[t1]彼は私の中で永遠になったんだ![p]

死体を池に沈め、[t1]彼の家にあった研究の全てを破棄した。[p]

その直後の大地震の騒ぎで、[t1]美術室に隠しておいた絵を無くしたのは想定外だったけど・・・[p]

彼の家庭環境や放浪癖と相まって、[t1]結果的に彼の捜索はされなかった、

殺害現場の白亜館は、[t1]立ち入りが制限されるようになって結果オーライさ。[p]

君が絵をどこからか持って来た時は、[t1]シュウヤの才能が露見しかねないと、[t1]

心底肝を冷やしたが、[p]

前向きに考えれば絵を確実に処分できる機会になったよ。[p]

ありがとう、芒くん。[p]


#shujinnkou
葛葉さんのイヤリングが池にあったのは、[t1]死体ごと捨てられたからだったのか。[p]

まさか同時に見つかった動物の骨って……[p]

歪んでいる……[p]

この人は異常だ……[p]


#kabura:B12
その口ぶりからして俺たちを見逃す気はないみたいだな……[p]


#yuto:rH05
もちろん。[p]

シュウヤの才能を知るのは私だけじゃないと。[p]

でも君は逃げられない[p]

どれだけ優秀だろうと、[t1]君は優しい子だ。[p]

大切な助手を見捨てられないだろ?[p]

君の探偵録はバッドエンドでお終いさ。[p]


#kabura:B12
・・・いいや[t2][p]

#kabura:B02
あんたは分かってないね[p]

探偵ってのは、[t1]追い詰められてからが本領なんだ。[p]

#kabura:B08
ワトソンくん![p]

柳から貰ったアレだ![p]

叩きつけろ![p]


#yuto:rH03
!?[p]

*anime

;【爆破から虫眼鏡ぶん殴りまで動イラ】

[hide_message]

[chara_hide_all layer="2" time="2"]

[bg storage="attackbk01.jpg" time="0"]

[keyframe name="attack"]

[frame p="0%" x="0" rotate="50deg"]

[frame p="100%"  x="0" rotate="0deg"]

[endkeyframe]

[image storage="attackfg01.png" layer="0" visible="true" width="720" left="0" top="0" time="0" wait="false" name="hand"] 

[kanim name="hand" keyframe="attack" time="3000" easing="ease"] 

[wa]

;50deg[changeimg name="hand" storage="attackfg02.png"]

[changeimg name="hand" storage="attackfg02.png" ]

[wait time="500"]

[free name="hand" layer="0"]

[bg storage="attackbk02.jpg" time="500" wait="true"]

[bg storage="attackbk03.jpg" time="500" wait="true"]

[bg storage="attackbk04.jpg" time="500" wait="true"]

[bg storage="attackbk05.jpg" time="500" wait="true"]


[bg storage="attackbk06.jpg" time="1000" wait="true"]


[bg storage="attackbk07.jpg" time="1000" wait="true"]



[keyframe name="attack1"]

[frame p="0%" x="0"]

[frame p="100%"  x="-120"]

[endkeyframe]

[keyframe name="attack2"]

[frame p="0%" x="0"]

[frame p="100%"  x="120"]

[endkeyframe]

[image storage="attackfg03.png" layer="0" visible="true" width="720" left="0" top="0" time="0" wait="false" name="atkab"] 


[image storage="attackfg04.png" layer="0" visible="true" width="720" left="0" top="0" time="0" wait="false" name="atyuto"] 


[kanim name="atkab" keyframe="attack2" time="2000"]

[kanim name="atyuto" keyframe="attack1" time="2000"]

[wait time="1500"]


[bg storage="qrbk012_02.jpg"]

[show_message]

[chara_show name="yuto" face="rI04" left="0" top="216" layer="2" wait="false" time="200"]

[chara_show name="kabura" face="B10" left="0" top="216" layer="2" wait="false" time="200"]




#kabura:B10
どうだ、特製ミニチュア象の歯磨き粉爆弾![p]

残りの材料で万が一の時のために柳に作ってもらったんだ。[p]

熱くてビビったろ![p]

#shujinnkou
そんな物騒な物を説明無しで渡さないでよ!![p]

#yuto:rI04
ぐ・・・立てない……[p]

#kabura:B10
漫画の資料集めで、[t1]人を無力化できる殴り方は知ってるからな。[p]

#kabura:B12
しばらくはマトモに動けないぞ。[p]

今回のことは全部警察に伝えさせてもらう![p]
もう終わりだ。[p]

絵を返してくれ。[p]


#yuto:rI05
伝える……?[p]

嫌だっ、[t1]やめろ、やめてくれ![p]

シュウヤの事は言わないでくれっ![p]


#kabura:B12
はぁ?[p]

それより絵は——[p]


#yuto
シュウヤは……私だけの……だってそうじゃなくなったら、[t1]私はなぜ彼を……



#kabura:B07
……もしかして、[t1]本当は殺す気は無かった……殺した事を後悔してるのか?



#yuto
……



#kabura:B12
……殺した意味を無理につけてもあんたの友達はきっと喜ばない

自分の後悔と向き合って生きてください。[t2]蓮水先生。[t2]この事件の後も、[t1]人生は続くんですから



#yuto
……



;【画面一瞬暗転、[t1]#yuto:r問画面退場】



#kabura:A01
;（画面左in）
行ったか。[t2]通報は俺が後でしておくよ[p]
これで事件はついに解決した訳だ。[t2]本当に……色々あった。[t2]

#kabura:A09
ここまで来れたのはワトソンくんがいたおかげだ。[t2]本当にありがとう！[t2]


#kabura:A06
え、[t1]助けてくれたからお互い様？[p]

#kabura:A11
えへへ、[t1]ありがとな[p]

#kabura::A13
今回は運もよかったな。[t2]俺は蓮水先生の殺人までは気づかなかったのに、[t1]先生がなぜか自白してくれた。[t2]パソコンの仕掛けとか保護がどうとか言ってたけど……もう分からないな

あれ？[t2]あの机の上にあるのって[t1]なくなった日誌じゃないか？[p]

#kabura:A12
やっぱり盗んだのは蓮水先生だったのか[p]


#shujinnkou
あれ?



#kabura:A01
どうしたワトソンくん。[t2]裏表紙に名前?



*ttsstt

;【日誌の裏表紙を表示。[t2]白薊シュウヤ】

[chara_hide_all time="200" wait="true" layer="2"]

[bg storage="backpage.png"]


#kabura



ホントだ[t2]急いでたから・・・[t1]
……え。[t2]この苗字って……[p]



;【最初の展示会場に向かえと表示される】

*qr11finish


[hide_menu]

[hide_message]

[show_qrmessage]

[chara_hide_all time="1000" layer="2"]

展示会場の空白の絵の裏側を見てみよう


[eval exp="sf.chaptercount = 11 "]
;QR1をみたかのチェック チェックポイントに1を足す

[jump storage="mainroute.ks" target="*camerapoint"]