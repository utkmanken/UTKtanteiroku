
*qr9start

[hide_message]

[stop_bgcamera wait=false]
[cm]

;背景表示
[bg storage="qrbk008_03.jpg" time="200" wait="false"]

[show_place text="文化部棟横"]

[wait time="800"]

[hide_place]

[bg storage="qrbk008_04.jpg"]

[show_message]

[show_menu]

[anime1 name="kabura" face="B01" layer="2"]

#kabura:B04
いた![t2]柳だ![p]

;[jump target="*test"]

[ranime1 name="mash" face="rE01" layer="2"] 

#mash:rE02
これはこれはカブラくん。[t2]お待ちしていましたよ?[p]

#mash:rE07
私たちの計画を止めに来たのですね?[p]


#kabura:B06
話が早いじゃないか。[t2]もう認めるんだな。[p]


#mash:rE09
今更隠しても仕方ありませんからね。[p]

#mash:rE07
それに、[t1]報告のおかげで準備は間に合いました。[p]

[move1 name="kabura"]

[rmove1 name="mash"]

;[image storage="barrel.png" left="180" top="216" layer="0" visible="true" width="360"]

[show_lends name="barrel" storage="barrel2.png"]


#kabura:B07
爆弾……![p]


#mash:rE01
随分な言い方ですね。[t2]私たちは目的を持った上でやっているのです。[p] 

#mash:rE09
あなたには賛成してもらえると思っていました。[p]


#kabura:B05
別にそういう面白そうな事する事自体には大賛成だよ![p]

でもなぁ……[t2]許可は取れよ![p]

そうすれば全方面丸く収まるんだよ![t2]高校生だろ![p]

[hide_lends name="barrel"]

[reset1 name="kabura"]

[reset1 name="mash"]


#shujinnkou
そ、[t1]その通りだけど1番説得力がない!![p]


#mash:rE10
貴方と問答をする気はありません。[t2]そこで見ていてください。[t2]

#mash:rE02
私たちの成果を![p]

;フォント大きく
"爆破用意!!"[p]
;【動くイラスト。爆破が終わるまで。2階から爆破を見る観客】

;【スマホのバイブレーション】

[chara_hide_all time="200" layer="2" wait="true"]

[hide_message]


[bg storage="qrbs1.jpg" time="500" wait="true"]

[bg storage="qrbs2.jpg" time="500" wait="true"]

[bg storage="qrbs3.jpg" time="500" wait="true"]

[bg storage="qrbs4.jpg" time="500" wait="true"]


[bg storage="qrbs5.jpg" time="500" wait="true"]

[image storage="chara_bst.png" left="0" top="700" layer="2" visible="true" width="720" name="kabs"]

[keyframe name="bst"]

    [frame p="0%"]

    [frame p="100%" x="70"]

[endkeyframe]


[kanim name="kabs" keyframe="bst" time="4000"]

[wa]

[show_message]

[free name="kabs" time="0" layer="2"]

[bg storage="qrbk008_05.jpg" time="200" wait="false"]

[chara_show name="mash" time="500" wait="false" layer="2" face="rE01" left="0" top="216"]

[chara_show name="kabura" time="500" wait="false" layer="2" face="B05" left="0" top="216"]


#shujinnkou
なんだこの……[t2]もこもこ⁉︎[p]


#mash:rE07
ははははははは!![t2]大成功だ![p]
特大"ゾウの歯磨き粉"![t2]長い間をかけて準備した甲斐がありました![p]

#kabura:B09
ぞ、[t1]ゾウの歯磨き粉⁉︎[p]

爆弾じゃなかったのか?[p]


#mash:rE10
はい?[p]

お2人は私たちの実験を止めに来たのではないのですか?[p]


#kabura:B07
??[p]

俺たちはお前が絵を盗んだんだと思って来たんだけど……[p]


#mash:rE11
どうやら何か食い違いがあるようですね。[t2]事情を教えてもらえますか?[p]


#kabura:B11
実はあの後あの日誌に——[p]

;【画面一瞬暗転】

[chara_hide_all time="700" layer="2" wait="false"]

[bg storage="qrbk011_02.jpg" time="1000" wait="false"]

[wait time="1200"]

[bg storage="qrbk008_06.jpg" time="700" wait="false"]

[chara_show name="mash" time="700" wait="false" layer="1" face="rE01" left="0" top="216"]

[chara_show name="kabura" time="700" wait="false" layer="2" face="B05" left="0" top="216"]

[wait time="700"]


#kabura:B14
って感じだ。[p]


#mash:rE01
全く。[t2]いくら私といえど、[t1]過酸化

アセトンを製造するほどバカではありませんよ。[p]


#kabura:B05
馬鹿……[p]


#mash:rE09
研究データのことも今初めて知りましたしね。[p]

しかし、[t1]もしその事を知っていれば

#mash:rE07
・・・ふふふ


#shujinnkou
?[p]


#mash:rE10
何はともあれ、[t1]私は絵を盗んでいません。[p]

この爆発は“ゾウの歯磨き粉”実験、[t1]要するにH2O2の急速分解による膨張現象です。[p]



#kabura:B15
ゾウの歯磨き粉……[t2]Youtubeで見た事あるけど、[t1]そんな予定聞いたことないぞ?[p]



#mash:rE09
企画案を出したら学校側に却下されましてね。[p]

無許可での実施なんですよ。[t2]観客の方々も直前に呼び集めました。[p]



#kabura:B07
無許可……[t2]だからあんなにコソコソしてたのか。[p]

#kabura:B15
でもさっき、[t1]俺たちを待ってたって……[p]



#mash:rE10
それは……[p]

;画面右in

[chara_hide name="mash" time="0" layer="1"]

[ranime1 name="kai" face="rF01" layer="2"]


#kai:rF02
いやー、[t1]お客さん大喜びだ。[t2]どっちの計画も上手くいって良かったよ。[p]

楽しかったね。[t2]マシロ、[t1]カブラくん。[p]



#kabura:B04
葛葉?? なんでお前がここに?[p]

[chara_hide name="kai" time="0" layer="2"]

[chara_show name="mash" time="0" layer="2" face="rE01" left="0" top="216"]

#mash:rE11
どういう事ですか葛葉くん。[p]

あなたが言ったのですよ。[t2]『蓮水先生に言われてカブラくんがこの計画を止めに来ている』と。[p]



#kabura:B04
は?[p]

[chara_hide name="mash" time="0" layer="2"]

[chara_show name="kai" time="0" layer="2" face="rF01" left="0" top="216"]


#kai:rF05
うん、[t1]普通に嘘だよ。[p]

カブラくんはマシロを疑ってるみたいだったから、[t1]こうすれば2人をぶつけられると思ったんだ。[p]

[chara_hide name="kai" time="0" layer="2"]

[chara_show name="mash" time="0" layer="2" face="rE01" left="0" top="216"]


#mash:rE01
何故そんなことを?[p]

[chara_hide name="mash" time="0" layer="2"]

[chara_show name="kai" time="0" layer="2" face="rF01" left="0" top="216"]

#kai:rF02
人助けだよ。[p]

マシロは邪魔の前に企画を始められる。[t2]カブラくんは犯人と対峙したような緊迫感を感じられる。[p]

友達2人に同時に協力したんだ。[p]



#shujinnkou
カブラさんが嫌う訳が分かった。[t2]この人とんでもなく独りよがりなんだ。[p]

[chara_hide name="kai" time="0" layer="2"]

[chara_show name="mash" time="0" layer="2" face="rE01" left="0" top="216"]

;（画面out）
#mash:rE01
貴方を計画班に入れたのは間違いだったかもしれませんね。[p]


#mash:rE02
しかし、[t1]企画は上手くいきましたし、[t1]私は忙しいのでこれで失礼します。[p]

残りはお二人の好きなように。[p]

[ranime2 name="mash"]

[ranime1 name="kai" face="rF01" layer="2"]

#kai:rF02
さ、[t1]カブラくん。[t2]次は何をする?[t2]

教えてくれれば僕ぁ全力で協力するよ。[p]


#kabura:B05
信用出来るかぁ![p]

#kabura:B07
いや、[t1]でも聞きたいことがあったんだ。[p]

お前、[t1]そのイヤリングをどこで手に入れた?[p]



#kai:rF05
教えても良いけど、[t1]どうして?[p]



#kabura:B15
それは俺たちの探してる絵の作者のイヤリングなんだよ。[p]

それがあれば作者の研究データを閲覧できる。[p]

#kabura:B12
柳が冤罪なのは分かったけど、[t1]まさかお前が真犯人なんじゃ……[p]



#kai:rF08
違う違う![t2]

#kai:rF06
これはひょうたん池のヘドロ掃除中に見つけて、[t1]オシャレだから洗って使う事にしたんだ。[p]

池の底から埋まってたのが出てきたんだと思うよ。[t2]動物の骨とかも落ちてたしね。[p] 

#kai:rF02
これはオシャレだったから洗ってそのまま使ってるの[p]


#kabura:B05
キタネー。[p]


#kabura:B15
でもイヤリングがなんでそんな所に……[p]

#kai:rF02
ところで、[t1]その様子からしてこれは随分大事なものみたいだね。[p]

#kai:rF04
もしこれを僕が持って逃げたりしたら、[t1]それも面白い展開なんじゃないかなぁ。[p]



#kabura:B04
んなっ⁉︎[p]


#kai:rF02
良し、[t1]決めた![p]

ここからは探偵っぽく謎解き鬼ごっこにしよう。[p]

今から僕の出す謎解きが解けたらイヤリングをあげる。[p]

でも解けなかったら逃げさせてもらうよ。[t2]僕ぁ駆け足には自信あるからね。[p]

#kai:rF05
適当な紙とペンっと……[p]


#kabura:B05
ぐぐっ、[t1]なんてめんどくさい事を![p]

#kabura:B07
まいったぞワトソンくん。[t2]葛葉は思い込んだらテコでも考えを変えないんだ。[p]

でも犯人捜索にイヤリングは絶対に欲しい![p]

#kabura:B15
こうなったらその謎ってのを解くしかない![p]

*test

#kai:rF02
出来たよー。[p]

[chara_hide_all time="200" wait="true" layer="2"]

[bg storage="qrbk101_01.jpg" time="200" wait="false"]



#kabura:B04
な、[t1]なんだこれ?[p]


#kai:rF05
即興だから陸上競技にまつわる謎解きにしてみたんだ。[p]


#kabura:B05
じゃあ俺らには解けないだろ![t2]

[bg storage="qrbk008_03.jpg"]

[chara_show name="kai" time="500" wait="false" layer="2" face="rF01" left="0" top="216"]

[chara_show name="kabura" time="500" wait="false" layer="2" face="B05" left="0" top="216"]

#kabura:B11
くそー、[t1]どうすれば……[p]


;（画面右in）

#aya:rD03
色々と大変だったみたいね。[t2]2人とも。[p]

[ranime1 name="aya" face="rD01" layer="2"]

#kabura:B09
日野さん![p] 



#aya:rD01
大きな音が聞こえたから2人が心配で来たの。[p]
途中で柳くんと会って簡単に話は聞いたわ。[t2]

#aya:rD10
助けになりたかったのだけど——[p]


#kabura:B11
す、[t1]すみません。[t2]今ちょっとそれどころじゃなくて……[p]

実はかくかくしかじかで…….[p]



#aya:rD09
陸上競技の謎解き……[t2]それ、七種競技じゃないかしら[p]

#kabura:B15
七種競技？[p]

#aya:rD09
7つの種目を決まった順番で行う陸上競技よ[p]

おそらく上の数字は各種目の実施される順番ね[p]

#aya:rD07
必要そうな情報を書いておくわ[p]


[chara_hide_all time="200" wait="tarue" layer="2"]

[bg storage="qrbk101_02.jpg" time="200" wait="false"]



#kabura:B13
すごい！[p]

#kabura:B14
これならなんとか解けそうです[p]


#aya:rD06
良かった。[t2]色々と読んでいる甲斐があったわ。[p]



#kabura:B02
ワトソン君[t2]この謎解き[t1]さっきの柳のメモに似てないか？[p]
 
葛葉は柳の仲間だから[t1]同じアイデアを流用してるのかもしれない[p]

早速解いてみよう！[p]


*quiz_start

#
上部の欄に答えを記入しよう。


[edit name="f.answer" left="10" top="200" width="540" height="100" size="40" maxchars="3" initial="???"]


[button graphic="qrbut100.png" target="quizres" height="100"  y="200" x="490"]


[s]


*quizres

[commit name="f.answer"]

[cm]



[if exp="f.answer == 'eye'"]


[jump target="quizfin"]

[else]

#kai
ほんとうにそれでいいの?[p]

[jump target="quiz_start"]

[endif]



*quizfin

[bg storage="qrbk008_04.jpg" time="200" wait="false"]

[chara_show name="kai" time="500" wait="false" layer="2" face="rF01" left="0" top="216"]

[chara_show name="kabura" time="500" wait="false" layer="2" face="B05" left="0" top="216"]


#kai:rF02
お見事![p]

それじゃあ約束だから。[t2]はい、イヤリング。[p]



#kabura:B05
ったく。[t2]お前は毎度行動が極端なんだよ。[p]



#kai:rF05
でも、[t1]カブラくん楽しんでそうだったけど。[p]



#kabura:B06
…………ちょっとはな。[p]


#kabura:B13
さぁ、[t1]手掛かりも手に入った。[p]


#kabura:B14
宇高は備品を捨てずに放置することが多い。[t2]パソコンも日誌に書いてあったように、[t1]化学準備室にまだあるはずだ。[p]


#kabura:B15
途中で生物室に置いてきちゃった日誌を回収しておきたいし、[t1]行ってみよう。[p]


#

*qr9finish


[hide_menu]

[hide_message]

[show_qrmessage]

[chara_hide_all time="1000" layer="2"]

放送部室へ向かおう


[eval exp="sf.chaptercount = 9"]
;QRをみたかのチェック チェックポイントに1を足す


[jump storage="mainroute.ks" target="*camerapoint"]

