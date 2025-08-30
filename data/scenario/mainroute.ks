
*checkpoint1

[chara_config pos_mode = false]

[chara_config talk_focus="brightness" brightness_value="50"]

[chara_config ptext="chara_name_area"]

[chara_config pos_mode="false"]

[ptext name="chara_name_area" layer="message0" width="200" color="white" x="40" y="910" size="45" overwhite="true"]

[chara_config ptext="chara_name_area"]

[show_skip]
;-----------------------------------------------------------------
;各QRチェック 終わったら消す
[jump storage="scene6.ks" target="*qr6start"]
;-----------------------------------------------------------------
[jump storage="scene1.ks" target="*qr1start" cond="sf.chaptercount == 0"]


*camerapoint

[button graphic="mapbutton.png" target="mappoint" width="80" height="80" x="620" y="30"]

[bgcamera mode="back" fit=true qrcode="all" left=0 top=0 width=720 height=1280]
[qr_config qrcode="all"]
[s]


*mappoint
[image_viewer storage="map001.png" button_width="80" button_height="80"]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]





*qr2check
[jump storage="scene2.ks" target="*qr2start" cond="sf.chaptercount == 1"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]


*qr3check
[jump storage="scene3.ks" target="*qr3start" cond="sf.chaptercount == 2"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]


*qr4check
[jump storage="scene4.ks" target="*qr4start" cond="sf.chaptercount == 3"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]


*qr5check
[jump storage="scene5.ks" target="*qr5start" cond="sf.chaptercount == 4"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr6check
[jump storage="scene6.ks" target="*qr6start" cond="sf.chaptercount == 5"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr7check
[jump storage="scene7.ks" target="*qr7start" cond="sf.chaptercount == 6"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr8check
[jump storage="scene8.ks" target="*qr8start" cond="sf.chaptercount == 7"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr9check
[jump storage="scene9.ks" target="*qr9start" cond="sf.chaptercount == 8"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr10check
[jump storage="scene10.ks" target="*qr10start" cond="sf.chaptercount == 9"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr11check
[jump storage="scene11.ks" target="*qr11start" cond="sf.chaptercount == 10"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

*qr12check
[jump storage="scene12.ks" target="*qr12start" cond="sf.chaptercount == 11"]
ここに間違ったQRを読み込んだとき用のセリフを入れてください[t3]

[stop_bgcamera wait=false]

[jump target="*camerapoint"]

