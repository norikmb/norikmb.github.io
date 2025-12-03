---
title: "GitLab の Dependency Proxy が記述された Dockerfile は Renovate で更新できない"
description: "CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX を使う Dockerfile を Renovate で更新したい"
pubDate: "Dec 02 2025"
heroImage: "/blog/20251202.png"
---

## はじめに

この記事は、[FUJITSU Advent Calendar 2025](https://qiita.com/advent-calendar/2025/fujitsu) 2日目の記事です。  

GitLab CI 上でイメージの取得元を Dependency Proxy経由するために、Dockerfile を次のように書くことがあります。

```dockerfile
ARG CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX=gitlab.com:443/norikmb/dependency_proxy/containers
FROM ${CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX}/python:3.12-slim
```

Dependency Proxy経由することで、以下のような利点があります。
- 速度向上・キャッシュ最適化: CI ごとに Dependency Proxy にキャッシュされるため、同じベースイメージの取得が高速化できる
- レート制限・外部依存の抑制: 公開レジストリのレート制限や一時的な障害の影響を受けにくい

参考: https://docs.gitlab.com/user/packages/dependency_proxy/#authenticate-within-cicd

## Renovate利用での課題

Dockerのタグの更新を自動化するためのツールとして [Renovate](https://github.com/renovatebot/renovate) があります。  
GitLab での導入方法は以下を参考にしてください。

参考: https://gitlab.com/renovate-bot/renovate-runner/

しかし、前提の話のように、Dockerfile 内のイメージ参照が変数でプレフィックスされていると、Renovate の標準の Dockerfile 解析ではベースイメージのタグ更新が検出されません。  
Renovate は Dependency Proxy を含む文字列全体を「レジストリ/イメージ」として解釈しに行くため、解決に失敗します。ログ例は次のとおりです。

```text
 WARN: Package lookup failures (repository=norikmb/dependency-proxy-for-container-images, branch=renovate/python-3.x)
       "warnings": [
         "Failed to look up docker package gitlab.com:443/norikmb/dependency_proxy/containers/python"
       ],
       "files": ["Dockerfile"]
```

## 暫定対処

本来であれば、Renovate から Dependency Proxy を解決したかったのですが、上手くいかなかったので暫定対応として以下で解決しました。  
次のように `renovate.json` を記述します。

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended"
  ],
  "registryAliases": {
    "gitlab.com:443/norikmb/dependency_proxy/containers": "mirror.gcr.io"
  },
  "regexManagers": [
    {
      "fileMatch": ["/(^|/|\\.)Dockerfile$/"],
      "matchStrings": [
        "FROM \\/$\\/{?CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX\\/}?/?(?<depName>.*?):(?<currentValue>.*?)\\s"
      ],
      "datasourceTemplate": "docker"
    }
  ]
}
```

ポイントは以下の通りです。
- `regexManagers`: 変数付き `FROM` 行から依存名（例: `python`）と現在のタグ（例: `3.12-slim`）を正規表現で抽出
  - `depName`: ベースイメージ名
  - `currentValue`: 現在のタグ
  - `datasourceTemplate: docker`: Docker イメージとしてバージョン取得・更新提案を行う指定
- `registryAliases`: 実ビルド時は Dependency Proxy を使い続けつつ、Renovate の解決時は別リポジトリ（ここでは `mirror.gcr.io`）を参照させる

また、今回の調査で初めて知ったのですが、Dockerfile の命名規則は <something>.Dockerfile が公式だそうです。

> Some projects may need distinct Dockerfiles for specific purposes. A common convention is to name these <something>.Dockerfile.

参考: https://docs.docker.com/build/concepts/dockerfile/#filename

## まとめ
GitLab の Dependency Proxy を利用した Dockerfile を Renovate で正しく更新するには、`regexManagers` と `registryAliases` を組み合わせて設定する必要がありました。  
文献が少なく、結構詰まったのでハマりポイントとしてメモしておきます。