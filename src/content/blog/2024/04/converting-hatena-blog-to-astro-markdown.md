---
title: "はてなブログからエクスポートした記事をAstro Blog用のマークダウン形式に変換する"
description: ""
pubDate: "Apr 17 2024"
heroImage: "/blog/20240417.png"
---

### Why

はてなブログで作成した過去の記事データをAstroを使った個人のブログに移行したい。

### What

はてなブログの記事データはMT形式のtxtファイルとして出力される。

- 参考: [記事データをエクスポート（バックアップ）する](https://help.hatenablog.com/entry/export)

AstroのBlogテンプレートでは/src/content/blog以下のマークダウン形式のファイルをページとして扱うことができる。

- 参考: [Markdown と MDX](https://docs.astro.build/ja/guides/markdown-content/)

エクスポートした hoge.export.txt ファイルを/src/content/blog以下の.mdファイル群に変換するPythonのスクリプトを作成した。

```py
import os

def convert_article(input_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    articles = []
    current_article = []

    for line in lines:
        if line.strip() == '--------':
            if current_article:
                articles.append(current_article.copy())
                current_article.clear()
        else:
            current_article.append(line)

    if current_article:
        articles.append(current_article)

    for article in articles:
        basename = ""
        categories = []
        author = ""
        title = ""
        date = ""
        image = ""
        body = ""
        for line in article:
            if line.startswith('AUTHOR:'):
                author = line.split(': ')[1].strip()
            elif line.startswith('TITLE:'):
                title = line.split(': ')[1].strip()
            elif line.startswith('BASENAME:'):
                basename = line.split(': ')[1].strip().replace('/', '-')
            elif line.startswith('DATE:'):
                date = line.split(': ')[1].strip()
            elif line.startswith('CATEGORY:'):
                category = line.split(': ')[1].strip()
                categories.append(category)
            elif line.startswith('IMAGE:'):
                image = line.split(': ')[1].strip()
            elif line.startswith('-----'):
                pass
            elif line.startswith('STATUS:'):
                pass
            elif line.startswith('ALLOW COMMENTS:'):
                pass
            elif line.startswith('CONVERT BREAKS:'):
                pass
            elif line.startswith('BODY:'):
                pass
            else:
                body += line
        image = image or '""'
        content = "---\n" + f"author: {author}\n" + f"title: {title}\n" + f"pubDate: {date}\n" + f"category: {categories}\n" + f"heroImage: {image}\n" + "---\n" + body
        dirname = os.path.dirname(basename)
        if dirname:
            os.makedirs("src/content/blog"+dirname, exist_ok=True)
        with open(f"src/content/blog/{basename}.md", 'w', encoding='utf-8') as f:
            f.write(content)

convert_article('hoge.export.txt')
```
