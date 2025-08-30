

*qr4start

[hide_message]

[stop_bgcamera wait=false]
[cm]

[wait time=200]

;[show_skip]

;[show_auto]


[show_skip]



;背景表示

[bg storage="qrbk003_01.jpg" time="200" wait="false"]

[show_place text="図書室前"]

[wait time="800"]

[hide_place]

[bg storage="qrbk003_02.jpg"]

[show_message]

[show_menu]




[chara_show name="kabura" face="B01" left="-720" top="216" layer="2"]

[anim name="kabura" time="800" left="150"]

#kabura:B01
司書の日野さんは本の虫で、[t1]いつも図書室に……[t2]

[chara_show name="aya" left="-400" top="216" face="DGR" layer="1"]

[chara_move name="aya" left="40" time="6000" anim="true" wait="false"]

[wa]

#kabura:B09
あれ。[t2]閉まってる?[p]


#kabura:B11
もしかして日野さんって、[t1]宇高祭の時はいなかったり[p]


#aya
あら、[t2]また漫画を勧めに来てくれたの?[p]
 

#kabura:B04
うびゃあああ!!?[p]

[chara_hide name="aya" time="500" wait="false" layer="1"] 

[reset1 name="kabura"]

#kabura:B09
ひ、[t2]日野さん![t2]いつの間に?[p]

[ranime1 name="aya" face="rD01"]

#aya:rD01
今日はこの部屋で古書販売とうちわ販売をしてて・・・


#aya:rD09
[t2]もしかして驚かせちゃった?[p]


#kabura:B13
驚きましたよ![t2]まるで気配が無かった[p]


#aya:rD10
ごめんね。[t2]昔から人に気づかれないタイプなの[p]


#aya:rD09
カブラくんに、[t1]あなたは・・・[t2]


#aya:rD03
校外の人ね?[t2]


#aya:rD01
宇高の子たちの名前は全員覚えてるもの[p]


#kabura:B04
今年赴任してきたばっかりなのに!?[t2]すごい！[p]


#aya:rD06
ふふ、[t1]これでも先生ですから。[t2]それでその子はカブラくんのお友達?[p]


#kabura:B01
ワトソンくんはさっき見つけた俺の助手です。[t2]


#kabura:B08
俺は今日名探偵なので[p]


#aya:rD05
探偵・・?[t2]


#aya:rD01
よくは分からないけど、[t1]なんだかまた楽しそうなことを始めたみたいね。[p]


#aya:rD06
初めまして、助手さん。[t2]司書の日野といいます。[p]


#aya:rD01
それで探偵さんは、[t1]私にどんな御用なのかしら[p]


#kabura:B14
漫研で展示してた絵が昨日盗まれたんです。[t2]俺たちは犯人を探すために色々と情報を集めてて、[t1]

日野さんにも昨日のことを聞きたくて来ました[p]


#aya:rD03
盗まれた・・・⁉[t2]


#aya:rD10
そう。[t2]蓮水先生が今朝忙しそうにしてたのは、[t1]そういうことだったのね[p]


#aya:rD11
・・・もしかして[t2]・・本当だったのかしら[t3][p]


#shujinnkou
・・・何かあるのか?[p]


#aya:rD08
とても素敵な絵だったから残念だわ。[p]


#aya:rD01
それで、[t1]わざわざここまで来たってことは、[t1]私も容疑者なのかしら[p]


#kabura:B04
さ、察しが良すぎる![t2]まさか犯人⁉[p]


#aya:rD06
ふふ。[t2]いいえ。


#aya:rD01
[t2]ミステリ小説をよく読むから何となく分かっただけよ。[p]


#aya:rD03
それに、私にはアリバイがあるから。[p]


#aya:rD03
今回の古書販売には私の私物も出したんだけど、[t1]

量が多くて昨日の昼過ぎに図書委員の皆に、[t1]学校までの運搬を手伝ってもらったの。[p]


#aya:rD01
でも予定より遅くなって校舎が施錠されてたから、[t1]職員玄関に置いて帰ったわ。[p]

だから昨日のうちに絵を盗む事はできない。[p]


#aya:rD07
ここにいる皆に聞けばすぐ確認は取れるわ。[p]


#kabura:B15
なるほど。[t2]ちょっと待っててくれワトソンくん。[p]


[keyframe name="shunshutu"]

[frame p="0%"]

[frame p="50%" x="*-720"]

[frame p="100%" x="0"]

[endkeyframe]

[kanim name="kabura" keyframe="shunshutu" time="1500"]


#kabura:B14
中の図書委員に確認してきた。[t2]どうやら本当みたいだ。[p]

全員でグルってのは無理があるし、[t1]日野さんは犯人じゃなさそうだな。[p]


#kabura:B13
それじゃ次は化学部に向かおう。[p]


#aya:rD09
あら、もう行っちゃうの?[t2]


#aya:rD06
折角だし、うちわ一枚いかがかしら?[p]


#aya:rD13
それに助手さんの方は、[t1]まだ何か聞きたい事がありそうよ。[p]


#shujinnkou
![p]

「さっきから目ざとい人だ。[t2]それともカブラさんが鈍感なだけだろうか。[p]

なんにせよ、[t1]さっきのことを聞いてみよう。」[p]


#aya:rD09
私がさっき言ったことは何か……?[p]


#aya:rD03
あら。[t2]声に出しちゃってたのね。[p]


#kabura
確かに言われてみれば![t2]さすが俺の見込んだワトソンくんだ![p]


#aya:rD03
……実は、数日前から宇高の教職員の間である噂が流れてるの。[p]


#aya:rD10
ただ、[t1]ちょっと現実離れしてて……[t2]


#aya:rD01
でも、そうね。[t2]念のため話しておこうかしら。[p]

*testt

[chara_hide_all time="200" wait="true" layer="2"]

[chara_hide_all time="200" wait="true" layer="1"]

[bg storage="qrbkAAA_01.jpg"]

[keyframe name="omake"]

[frame p="0%"]

[frame p="100%" y="*1500"]

[endkeyframe]



あの絵の作者は、[t1]今から10年以上前にこの学校に在籍してた生徒らしいの。[p]

その子は長い歴史を持つ宇高でも類を見ない天才だった。[p]

でも同時にとても変わっていて、[t1]イタズラ好きだったらしいの。[p]

校舎を全て赤く塗りたくったり、窓を割って回ったり。[p]

[image storage="omaketens.png" layer="0" visible="true" width="720" name="tens" left="0" top="-300"] 

[kanim name="tens" keyframe="omake" time="17000"]

授業中に消えて2ヶ月も行方をくらましたこともあったらしいわ。[p]

[bg storage="qrbk003_02.jpg"]

[chara_show name="aya" time="500" wait="false" layer="2" face="rD01" left="0" top="216"]

[chara_show name="kabura" time="500" wait="false" layer="2" face="B05" left="0" top="216"]



#kabura:B05
と、[t1]とんでもないやつだ・・・[p]


#shujinnkou
カブラさんも大概なのでは、[t1]とは言わないでおこう。[p]


#aya:rD07
他にも、[t1]所属していた化学部の薬品を無許可で持ち出したりもして、[p]

遂には2年生の春に失踪してしまい、[t1]それ以来学校側とは音信不通らしいわ。[p]


#kabura:B03
天才の失踪……[t2]悪の秘密組織とか関わってないかな〜[p]


#aya:rD04
うーん、[t1]元から放浪癖があったみたいだからどうかしらね。[p]


#aya:rD07
そしてここからが本題なのだけど……[p]


#mobtch
日野先生。[t2]少しいいですか?

[p]全職員に至急会議室に集まるようにと、今連絡がありまして……[p]


#aya:rD03
え……![t2]わかりました。[p]


#aya:rD10
ごめんなさい2人とも。[t2]急用ができちゃった。[t2]しばらく戻れなさそうだから……[p]


#aya:rD01
2人とも、[t1]あそこにダンボールが置いてあるでしょ?[p]


[chara_mod name="kabura" face="A01" time="0"]

[move1 name="kabura"]

[rmove1 name="aya"]


[show_lends storage="books1.png" name="books"]

[wa]
  



#aya:rD01
あれは陳列時に傷が見つかって販売をやめた本なのだけど、[t1]あの中に丁度いい本があるの。[p]


#aya:rD07
カブラくんなら、[t1]読めば分かるはず……[p]


#aya:rD01
タイトルは忘れてしまったけど……[t1]白薊って人が書いたミステリ小説。[p]


元は図書室の本で、分類番号が貼ってあるから大丈夫[p]

[hide_lends name="books"]

[reset1 name="aya"]

[reset1 name="kabura"]



#kabura:B09
ど、どういうことですか⁇[p]


#aya:rD06
2人ならきっと見つけられるわ。[t2]頑張って、[t1]名探偵さん達。[p]

[ranime2 name="aya"]

#shujinnkou
行ってしまった……。[t2]題名のわからない本を探すだなんて、[t1]どうすればいいのだろうか?[p]


#kabura:B07
分類番号……


#kabura:B13
あ![t2]閃いた![p]


#kabura:B14
図書室とかの本には、[t1]ジャンルと作者の名前を元に三桁の番号とアルファベットが振られてるんだ。[p]

白薊って作者名がわかってれば、[t1]振られてる分類番号もわかるはず。[p]


#kabura:B13
お、丁度あそこに分類表も貼ってある。[p]


#kabura:B02
よっしゃ早速探してみよう![p]



*mission_start

[cm]


#
左上のカメラのマークをタップして、本についているQRコードをスキャンしよう。[r]

バツのマークをタップすると前の画面にもどれるぞ。


[button graphic="camerabutton.png" target="*camerapoint" width="100" height="100" x="40" y="256" layer="0" fix="false"]


[s]


*camerapoint

[cm]

[bgcamera mode="back" fit="true" qrcode="all" left="0" top="216" width="720" height="680"]

[button graphic="closebutton.png" target="mission_start" width="100" height="100" x="40" y="256" layer="1"]

[s]


;[jump target="*coke"]

*book532
[stop_bgcamera wait="false"]

[cm]

これは…..機械工作?[t2]うーん。ミステリとは程遠いな。[p]

でも作者のイニシャルは合ってる。[t2]もう一度表をよく見てみよう。[p]

[jump target="*mission_start"]

[s]


*book428
[stop_bgcamera wait=false]

[cm]

これは…..物理学?[t2]難しい言葉ばっかりで頭が痛くなりそう…。[p]

作者とイニシャルも全然違う。[t2]落ち着いてもう一回考え直してみよう。[p]

[jump target="*mission_start"]

[s]


*book913R
[stop_bgcamera wait=false]

[cm]
あ、日本の小説だ![t2]でもなんかミステリっぽく無いな……[t1]って、[t2]作者のイニシャルが違う![p]

惜しいぞワトソンくん!もうちょっとだ。[t2]


[jump target="*mission_start"]

[s]


*book953
[stop_bgcamera wait=false]

[cm]

んん?[t2]これ日本語じゃ無いよな。[p]

白薊って明らかに名字だし、[t1]この本じゃなさそうだな。[p]

もう一度表をよく見てみよう。[p]


[jump target="*mission_start"]

[s]


*book221
[stop_bgcamera wait=false]

[cm]

これは……歴史書?[t2]史実は小説より奇なり、だ[p]
けど今は役に立たないな。[t2]もう一度表をよく見てみよう。[p]

[jump target="*mission_start"]


[s]
*book915
[stop_bgcamera wait=false]

[cm]

あ、[t1]これっぽい……って、[t1]これ日記?[p]

うーん、小説ではなかったか。[p]

もう一度表をよく見てみよう。[p]


[jump target="*mission_start"]

[s]


*book913S
[stop_bgcamera wait="false"]

[cm]

[freeimage layer="0"]

[bg storage="qrbk003_02.jpg" time="200" wait="false"]

[chara_show name="kabura" time="500" wait="false" layer="2" face="B13" left="0" top="216"]


#kabura:B07
この本の番号は……913のS……[t2]


#kabura:B13
よし、[t1]完璧だ![t2]早速内容を見てみよう[p]


;【司書の言っていた本を見つけてQRをスキャンしよう、と表示される】


#
パラパラ…[t2][er]


#kabura:B15
フムフム、[p]


#
パタン…[t2][er]


#kabura:B14
よしっ、大体わかった[p]


#shujinnkou
!!?[p]


#kabura:B10
ふふん。[t2]驚いたな。[p]


#kabura:B08
俺は昔から毎日何冊も漫画を読んでたから、[t1]どんな本でも高速で読めるって特技があるんだ。[p]


#shujinnkou
す、すごい……[p]


#kabura:B14
日野さんが言いたかったのは、[t1]多分このストーリー自体が噂の内容と似てるってことだ[p]


#kabura:B02
ストーリーの通りなら、[t1]盗まれた絵の模様や色には、[t1]

財宝の隠し場所をしめす暗号が組み込まれている[p]


#shujinnkou
財宝⁉[p]


#kabura:B13
すごいよな、[t1]ワトソンくん![p]

財宝だ![t2]いよいよ本格的にミステリめいてきた![p]


#kabura:B06
流石に金銀宝石って訳ないけど……[t2]絵に暗号ってだけで十分唆られる[p]


#kabura:B01
こうなると盗まれた絵と作者についての噂を、[t1]もっと知る必要がありそうだ[p]


#kabura:B13
財宝の場所が分かれば犯人を待ち伏せできるかも![p]


#kabura:B14
何か案はない?[t2]ワトソンくん。[p]


#shujinnkou
うーん。[t2]そう言われても直ぐには思いつかない。[t2]ここまでの情報で何か……[t3]そうだ![p]


#kabura:B15
予定通り化学室に行く?[p]


#kabura:B13
……なるほど![t2]確かに日野さんは、[t1]『天才は化学部に所属していた』[t1]って言ってたな![p]

そんなぶっ飛んだやつなら何か資料が残ってるかもしれない[p]

容疑者の化学部部長にも話を聞けるし一石二鳥だ[p]


#kabura:B14
それじゃ化学部に向かおう![p]




*qr4finish

[cm]

[hide_menu]

[hide_message]

[show_qrmessage]

[chara_hide name="kabura" time="1000" layer="2"] 

化学室へ移動しよう



[eval exp="sf.chaptercount = 4"]
;QRをみたかのチェック チェックポイントに1を足す

[jump storage="mainroute.ks" target="*camerapoint"]