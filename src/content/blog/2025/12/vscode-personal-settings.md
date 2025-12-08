---
title: 'VS Code の個人設定紹介'
description: 'VS Code の個人設定、おススメの拡張機能を紹介'
pubDate: 'Dec 07 2025'
heroImage: '/blog/20251207.png'
adventCalendarYear: '2025'
---

## はじめに

インターンシップの受け入れ時や、社内のLT会で話題になったので、自分の VS
Code の個人設定についてまとめてみます。

言語関連の設定はプロジェクト単位のLinterやFormatterに任せることが多いため、主にエディタ全般の設定に絞って紹介します。

ついでに会社のアドベントカレンダーが埋まっていなかったので、この記事で埋めることにしました。

アドベントカレンダーについては、昨年度の記事にもまとめているので、よければそちらもご覧ください。

https://kambe.dev/blog/2024/12/posting-to-multiple-advent-calendars/

## Settings.json の内容

VS Code の左下にある設定アイコンから、`Settings` を選択します。その後、右上のOpen Settings
(JSON)` アイコンをクリックすると、設定ファイルが開きます。

### フォント設定

```json
{
	// カラーテーマ。Nordの拡張機能が必要。会社では導入してない
	"workbench.colorTheme": "Nord",
	// Gitの設定
	"git.autofetch": true,
	"git.confirmSync": false,
	// フォルダを開く際に新しいウィンドウで開く
	"window.openFoldersInNewWindow": "on",
	// 不要なオススメの拡張機能を毎回通知しないようにする
	"extensions.ignoreRecommendations": true,
	// ファイル保存周りの設定
	"files.refactoring.autoSave": false,
	"files.insertFinalNewline": true,
	"files.autoSave": "afterDelay",
	"editor.formatOnSave": true,
	"editor.formatOnType": true,
	"editor.formatOnPaste": true,
	// 以下は保存時に行末の空白を自動削除できるが、後述の拡張機能であるTrailing Spaces でも対応可
	// "files.trimTrailingWhitespace": true
	// Copilotの設定。プレーンテキストにとりあえずクレデンシャルコピペするとかはよくやりがちなので、細かく設定
	"github.copilot.enable": {
		"*": false,
		"plaintext": false,
		"scminput": false,
		"properties": false,
		"markdown": true,
		"typescript": true,
		"python": true,
		"dockercompose": true,
		"yaml": true,
		"terraform": true,
		"json": true,
		"jinja": true
	},
	"github.copilot.nextEditSuggestions.enabled": true,
	// VS Code の Git 画面のコミット時に Copilot Chat を使ってコミットメッセージを生成する設定
	"github.copilot.chat.commitMessageGeneration.instructions": [
		{
			"text": "必ず英語で記述してください"
		},
		{
			"text": "https://www.conventionalcommits.org/ja/v1.0.0/ に従ってください"
		}
	],
	// Copilot Chat のリクエスト数の上限設定（デフォルト20）
	"chat.agent.maxRequests": 100,
	// Code Spell Checker 拡張機能の設定
	"cSpell.autoFormatConfigFile": true
}
```

## おススメの拡張機能

### Nord

カラーテーマ拡張機能。

https://marketplace.visualstudio.com/items?itemName=arcticicestudio.nord-visual-studio-code

### Trailing Spaces

空白の可視化を支援する拡張機能。

https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces

### Zenkaku

全角スペースを可視化する拡張機能。

https://marketplace.visualstudio.com/items?itemName=mosapride.zenkaku

### TODO Highlight

TODO コメントを強調表示する拡張機能。

https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight

### GitHub Copilot

いわずもがな

https://marketplace.visualstudio.com/items?itemName=GitHub.copilot

### Code Spell Checker

スペルチェックを行う拡張機能。

https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
