---
title: 'GitLab Package Registry 利用時に、uv の exclude-newer を設定する'
description:
    'uv の exclude-newer の詳細と、GitLab Package Registry
    など、未対応のレジストリで躓くポイント・回避策を紹介'
pubDate: 'Apr 05 2026'
heroImage: '/blog/20260405.png'
---

### はじめに

2026年3月、npm の axios やセキュリティスキャナ Trivy の GitHub
Actions など、サプライチェーン攻撃が立て続けに発生しました。こうした攻撃への防御策としてパッケージマネージャーのクールダウン設定が注目されています。

Python では、パッケージ管理ツールである uv において、 `exclude-newer`
オプションを使うことで、特定の日時以降にリリースされたパッケージを依存解決の候補から除外できるようになります。

### 躓きポイント

`exclude-newer` を自分のプロジェクトにも導入しようとしたところ、GitLab Package
Registry から取得しているプライベートパッケージが原因でエラーになりました。

調べてみると、`exclude-newer` の動作は
[PEP 700 の `upload-time` フィールド](https://peps.python.org/pep-0700/)に依存しています。

2026年4月時点ではGitLab Package Registry は、JSON
API 自体が未サポートです。（[gitlab#581770](https://gitlab.com/gitlab-org/gitlab/-/work_items/581770)）

つまり、`upload-time` が提供されていないパッケージは利用不可能として扱われるため、`exclude-newer`
を有効にすると、パッケージの解決が失敗するというのが原因でした。

### 回避策

`exclude-newer-package` で `false` を指定することで、特定のパッケージに対して `exclude-newer`
の制約を無効化できます。

GitLab Package
Registry は基本的には独自に管理されているプライベートなレジストリだと思うので、`exclude-newer`
の対象外にしてしまっても問題ないケースが多と思います。

```toml
[tool.uv]
exclude-newer = "1 week"
exclude-newer-package = { my-private-lib = false }
```

### 今後の動向

この問題は uv の Issue でも活発に議論されています。（[astral-sh/uv#12449](https://github.com/astral-sh/uv/issues/12449)）

また、GitLab 側でも PEP 700 準拠の JSON
API サポートが Issue として起票されています。（[gitlab#581770](https://gitlab.com/gitlab-org/gitlab/-/work_items/581770)）GitLab のUI上では、パッケージのアップロード日時は表示されており、データ自体は存在しているようなので、API 対応が進めば、この問題は解消されるのではないかと思います。

## 参考

- [サプライチェーン攻撃から身を守るために最低限設定しておきたいこと](https://zenn.dev/dely_jp/articles/supply-chain-kowai)
- [uv - Dependency cooldowns](https://docs.astral.sh/uv/concepts/resolution/#dependency-cooldowns)
- [PEP 700 – Additional Fields for the Simple API for Package Indexes](https://peps.python.org/pep-0700/)
- [GitLab: Python Package Registry should support the modern JSON format](https://gitlab.com/gitlab-org/gitlab/-/work_items/581770)
- [uv#12449: exclude-newer should have an extra flag to allow it to skip over packages that don't have publish date information](https://github.com/astral-sh/uv/issues/12449)
