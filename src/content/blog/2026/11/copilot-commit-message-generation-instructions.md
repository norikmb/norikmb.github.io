---
title: 'GitHub Copilot のコミットメッセージ生成にカスタムモデルを使う'
description:
    'コミットメッセージ生成で promptFiltered が発生する事例を紹介し、LiteLLM
    のカスタムエンドポイントを VS Code の utility model に設定する方法をまとめます。'
pubDate: 'Nov 11 2026'
heroImage: '/blog/20261115.png'
---

## はじめに

VS Code では、`github.copilot.chat.commitMessageGeneration.instructions`
を設定することで、コミットメッセージのAI生成にカスタム指示を適用できます。

```json
{
	"github.copilot.chat.commitMessageGeneration.instructions": [
		{
			"text": "Write in English."
		},
		{
			"text": "Write commit messages with the 'why' behind the change in mind."
		},
		{
			"text": "Follow https://www.conventionalcommits.org/ja/v1.0.0/."
		}
	]
}
```

ところが、GitHub
Copilot 側の設定変更の影響か、ある日突然コミットメッセージが生成されなくなりました。

調べてみると、同様の問題はすでに報告されています。

- [microsoft/vscode#316002](https://github.com/microsoft/vscode/issues/316002)
- [microsoft/vscode#316204](https://github.com/microsoft/vscode/issues/316204)

Issue によるとモデル側のコンテンツフィルターによる誤検知の可能性があり、暫定の解決策としてコミットメッセージ生成の指示を空にすることが挙げられています。何の解決にもなってねぇ...

```json
{
	"github.copilot.chat.commitMessageGeneration.instructions": []
}
```

## LiteLLM Proxy を用意して回避する

GiHub のデフォルトのモデルでは動作しないことが分かりました。

そこで、別のAIのエンドポイントを利用して、commitを作成してみることにしました。

`uv tool` で LiteLLMProxy をインストールし、systemd ユーザーサービスを作成します。

```ini
[Unit]
Description=LiteLLM Proxy

[Service]
EnvironmentFile=%h/.config/litellm/litellm.env
ExecStart=%h/.local/bin/litellm --config %h/.config/litellm/config.yaml --port 4000
Restart=on-failure

[Install]
WantedBy=default.target
```

VS Code のコマンドパレットから `Chat: Manage Language Models` を実行し、`Add Models` →
`Custom Endpoint` を選びます。表示名と LiteLLM の認証キーを入力し、API の種類は `Chat Completions`
を選びます。

作成された `chatLanguageModels.json` に、モデル設定を追加します。キーは `${input:litellmApiKey}`
としておくと、設定ファイルに直接記述せずに入力できます。

```json
[
	{
		"name": "LiteLLM",
		"vendor": "customendpoint",
		"apiKey": "${input:litellmApiKey}",
		"apiType": "chat-completions",
		"models": [
			{
				"id": "gemini",
				"name": "Gemini via LiteLLM",
				"url": "http://localhost:4000/v1/chat/completions",
				"toolCalling": false
			}
		]
	}
]
```

`settings.json` に `chat.utilitySmallModel`
を追加し、登録したモデルを指定します。カスタムエンドポイントの vendor が
`customendpoint`、モデル ID が `gemini` の場合は、次のようになります。

```json
{
	"chat.utilitySmallModel": "customendpoint/gemini"
}
```

## まとめ

Issue上がってから長いこと対応されていないことを考えると、人類はエージェントにcommitまでさせる人がほとんどで、commit名に拘る人はもうそんなに居ないのかもしれないですね。

## 参考

- [microsoft/vscode#316002](https://github.com/microsoft/vscode/issues/316002)
- [microsoft/vscode#316204](https://github.com/microsoft/vscode/issues/316204)
- [VS Code: AI language models](https://code.visualstudio.com/docs/agent-customization/language-models)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/ja/v1.0.0/)
- [LiteLLM Proxy Quick Start](https://docs.litellm.ai/docs/proxy/quick_start)
- [LiteLLM Gemini provider](https://docs.litellm.ai/docs/providers/gemini)
