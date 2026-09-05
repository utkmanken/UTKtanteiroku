import base64
import os
import re


def generate_css_variants(css_path, root_dir):
  with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

  # url(...) を探す正規表現
  pattern = re.compile(
      r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', re.IGNORECASE
  )

  # 1. Base64埋め込み用のコンテンツを作成する関数
  def replace_for_embedded(match):
    font_url = match.group(1)
    if font_url.startswith("data:"):
      return match.group(0)

    clean_url = font_url.lstrip("/")
    if clean_url.startswith("./"):
      clean_url = clean_url[2:]

    font_path = os.path.normpath(os.path.join(root_dir, clean_url))

    if os.path.exists(font_path):
      ext = os.path.splitext(font_path)[1].lower()
      mime_type = "font/ttf"
      if ext == ".otf":
        mime_type = "font/otf"
      elif ext == ".woff":
        mime_type = "font/woff"
      elif ext == ".woff2":
        mime_type = "font/woff2"

      with open(font_path, "rb") as font_file:
        encoded_data = base64.b64encode(font_file.read()).decode("utf-8")

      data_uri = f"data:{mime_type};charset=utf-8;base64,{encoded_data}"
      return f'url("{data_uri}")'
    else:
      print(f"警告: フォントファイルが見つかりませんでした: {font_path}")
      return match.group(0)

  # 2. フォント読み込みを空（または無効なURL）にする関数
  def replace_for_no_font(match):
    font_url = match.group(1)
    if font_url.startswith("data:"):
      return match.group(0)

    # url() の中身を空にする（あるいはブラウザがエラーを出さないように空文字やダミーにする）
    # ここでは空の url("") に置き換えます
    return 'url("")'

  # それぞれのCSSコンテンツを生成
  css_embedded = pattern.sub(replace_for_embedded, css_content)
  css_no_font = pattern.sub(replace_for_no_font, css_content)

  # 保存先パス
  css_dir = os.path.dirname(css_path)
  output_included = os.path.join(css_dir, "style_including_font.css")
  output_no_font = os.path.join(css_dir, "style_no_font.css")

  # ファイル書き出し
  with open(output_included, "w", encoding="utf-8") as f:
    f.write(css_embedded)
  print(f"保存完了: {output_included}")

  with open(output_no_font, "w", encoding="utf-8") as f:
    f.write(css_no_font)
  print(f"保存完了: {output_no_font}")


if __name__ == "__main__":
  root_dir = os.path.dirname(os.path.abspath(__file__))
  target_css = os.path.join(root_dir, "css", "style.css")

  if os.path.exists(target_css):
    generate_css_variants(target_css, root_dir)
  else:
    print(f"エラー: CSSファイル '{target_css}' が見つかりません。")
