
[cm]

@clearstack
@wait time = 200

*start 


;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@jump target="gamestart"
;===============================


[bg storage="qrbk004_01.jpg"]

[image storage="pull1.png" width="640" layer="2" name="pull01" left="40" top="500" visible="true"]

[image storage="pull3.png" width="40" layer="1" name="pull03" left="650" top="610" visible="true"]


[keyframe name="pull"]

    [frame p="0%"]

    [frame p="70%" y="30"]

    [frame p="100%" y="0"]

[endkeyframe]

[wait time="1500"]


[kanim name="pull03" keyframe="pull" time="1500"]

[wa]

[changeimg name="pull01" storage="pull2.png"]

[wait time="500"]

[changeimg name="pull01" storage="pull1.png"]

[wait time="750"]

[changeimg name="pull01" storage="pull2.png"]



[keyframe name="ascent"]

    [frame p="0%"]

    [frame p="100%" y="-350"]

[endkeyframe]

[wait time="2000"]

[kanim name="pull03" keyframe="ascent" time="10000"]

[kanim name="pull01" keyframe="ascent" time="10000"]


[wa]


[bg storage="OP.png" time="1200" wait="true"]

[glink color="btn_07_black" font_color="FFFFFFFF" target="gamestart" text="捜査開始" width="600"　ｘ＝]



[s]

*gamestart
;一番最初のシナリオファイルへジャンプする

;タイトル画面を削除
[freeimage layer="1"]

[freeimage layer="2"]



[eval exp="sf.chaptercount = 0"]

[jump storage="mainroute.ks" target="*checkpoint1"]
