---
title: 'Renovate の落とし穴: GitLab.com のプライベートレジストリと minimumReleaseAge が効きにくい'
description: 'Renovate でプライベート GitLab レジストリを扱う際に気をつけたいポイントと、minimumReleaseAge が判定不能になるケースについてまとめます'
pubDate: 'Jul 25 2026'
heroImage: '/blog/no_image_logo.png'
---

## はじめに

Renovate は依存関係の更新を自動化するうえで非常に便利です。
一方で、GitLab のプライベートレジストリや Docker レジストリを扱う場合、思ったよりも挙動が複雑になることがあります。

特に、`minimumReleaseAge` を使って「新しいバージョンが出てから一定期間は待つ」という制御をしたい場合、プライベートレジストリでは期待どおりに動かないことがあります。

今回は、その代表例として「リリース時刻が取得できないため、`minimumReleaseAge` の判定ができない」というケースについて整理します。

## まず知っておきたい前提

Renovate では、依存関係の更新候補を評価する際に、各パッケージのリリース情報を参照します。
その中で `minimumReleaseAge` は、対象バージョンが公開されてからどれだけ時間が経っているかを見て、更新候補を制限する仕組みです。

しかし、プライベートレジストリでは、その情報が十分に揃っていないことがあります。

特に次のようなケースでは注意が必要です。

- Docker イメージのリリース時刻が取得できない
- パッケージレジストリ側で公開時刻を正しく取得できない
- 依存関係がある場合、関連するパッケージ側のメタデータまで参照できない

このような状況では、Renovate が `minimumReleaseAge` を厳密に評価できず、結果として期待よりも早く PR が作られてしまうことがあります。特に、プライベートパッケージとその依存関係でも同様に、メタデータ不足によって判定が難しくなります。

## 具体的な設定例

以下のような構成を考えてみます。

```js
module.exports = {
  hostRules: [
    {
      matchHost: 'gitlab.com',
      hostType: 'pypi',
      username: 'gitlab-ci-token',
      password: process.env.RENOVATE_TOKEN,
    },
    {
      matchHost: 'gitlab.com',
      hostType: 'gitlab',
      token: process.env.RENOVATE_TOKEN,
    },
    {
      matchHost: 'gitlab.com',
      hostType: 'docker',
      username: 'gitlab-ci-token',
      password: process.env.RENOVATE_TOKEN,
    },
  ],
  packageRules: [
    {
      matchDatasources: ['docker'],
      matchPackageNames: ['registry.gitlab.com/**'],
      minimumReleaseAge: '0 days',
    },
  ],
  minimumReleaseAge: '1 week',
};
```

この例では、プライベートレジストリから取得した Docker イメージについては、`minimumReleaseAge` を `0 days` として扱うようにしています。

## なぜこの対応が必要なのか

Renovate では、`minimumReleaseAge` が「そのパッケージが公開されてから一定期間待つ」というルールとして働きます。
一方で、プライベートレジストリの Docker イメージやパッケージでは、公開時刻が正しく取得できないことがあります。

その結果、Renovate は以下のような状態に陥りやすいです。

- ルール上は 1 週間待つ設定なのに、実際にはすぐ更新候補として扱われる
- 依存関係に関わるパッケージでも、評価元の情報が不足しているため判断不能になる
- 期待した通りに更新が遅延しないため、運用上の安全性が下がる

このようなケースでは、`minimumReleaseAge` を無効化するか、対象を明示的に `0 days` に寄せる判断が現実的です。

## 依存関係がある場合の注意点

さらに注意したいのが、依存関係がある場合です。

例えば、Docker イメージの更新に合わせて Python やその他のパッケージも更新対象になる場合、Renovate が各依存関係のメタデータを正しく解釈できないことがあります。
その結果、親子関係にある更新候補が一緒に扱われ、期待した通りの制御ができないことがあります。

このため、プライベートレジストリを使う場合は、次のような運用が有効です。

- `minimumReleaseAge` を対象パッケージにだけ適用する
- プライベートレジストリ由来の依存関係は `0 days` で扱う
- 重要な更新だけを個別にレビュー対象にする
- 変更が多い場合は、Renovate の PR を分割して管理する

## まとめ

Renovate は強力ですが、プライベート GitLab レジストリや Docker レジストリを使う場合には、いくつかの落とし穴があります。

特に、リリース時刻が取得できない環境では、`minimumReleaseAge` が正しく評価できないことがあります。
そのため、対象パッケージを明示的に `0 days` とするなど、運用側での調整が必要です。

この点を踏まえると、Renovate の設定は「理想的なルール」だけでなく、「実際に取得できるメタデータに合わせて調整する」ことが重要です。

もし今後、Renovate の設定を見直す機会があれば、まずは「プライベートレジストリ由来のパッケージは `minimumReleaseAge` の判定ができるか」を確認するところから始めると良いでしょう。
