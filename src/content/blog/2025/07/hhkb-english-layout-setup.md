---
title: "HHKB 英語配列の設定"
description: ""
pubDate: "Jul 16 2025"
heroImage: "/blog/20250716.png"
---

### Why

普段日本語配列のキーボードを使っていましたが、英語配列を使ってみたくなったので、HHKB Professional HYBRID 英語配列／墨を購入しました。

Windows での設定方法をまとめておきます。

### What

#### Windows のキーボード設定を 英語配列に変更する

1. Windows の設定から「時刻と言語」→「言語と地域」→「言語」を開きます。

2. 日本語を選択し、3点リーダーをクリックして「言語のオプション」を選択します。

3. 「キーボード」から「キーボードレイアウト」→「レイアウトを変更する」を選択し、「英語キーボード101/102キー」を選択します。

4. 再起動します。

#### キーマップを変更する

https://happyhackingkb.com/jp/download/ から公式のキーマップ変更ツールをダウンロードできます。

DeleteよりもBackspaceをよく使うため、ツールを起動し、以下のように設定します。

| 元のキー | 新しいキー |
| -------- | ---------- |
| Delete   | Backspace  |

しかし、マクロ(ショートカットキー)の設定はできなかったので、PowerToys で設定することにしました。

#### PowerToys の Keyboard Manager で変更する

Microsoft Store から [PowerToys](https://apps.microsoft.com/detail/xp89dcgq3k6vld?hl=ja-JP&gl=JP) をインストールし、Keyboard Manager を有効にします。

Windowsキーが欲しいのでキーの再マップをクリックし、以下のように設定します。

| 元のキー | 新しいキー |
| -------- | ---------- |
| VK 235   | Win (Left)  |

「半角/全角」キーが欲しいので、ショートカットの再マップをクリックし、以下のように設定します。

| 元のキー | 新しいキー |
| -------- | ---------- |
| Ctrl + Space | VK 243 |

参考：https://kts.sakaiweb.com/virtualkeycodes.htm
