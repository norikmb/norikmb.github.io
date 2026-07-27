---
title:
    'GitLabのパッケージレジストリやコンテナレジストリを利用時に Renovate の minimumReleaseAge
    を正しく判定させるための注意点'
description:
    'Renovate
    でパッケージレジストリやコンテナレジストリを扱う際に気をつけたいポイントと、minimumReleaseAge
    が判定不能になるケースについてまとめます'
pubDate: 'Jul 27 2026'
heroImage: '/blog/no_image_logo.png'
---

## はじめに

Renovate は依存関係の更新を自動化するうえで非常に便利です。特に、`minimumReleaseAge`
を使って「新しいバージョンが出てから一定期間は待つ」という制御をすることで、サプライチェーン攻撃を抑制することができます。

ただし、GitLab の
[パッケージレジストリ](https://docs.gitlab.com/ja-jp/user/packages/package_registry/) や
[コンテナレジストリ](https://docs.gitlab.com/ja-jp/user/packages/container_registry/)
を利用していると「リリース時刻が取得できないため、`minimumReleaseAge`
の判定ができない」というケースについて整理します。

## 解決策

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
			matchPackageNames: ['registry.gitlab.com/group/project/image'],
			minimumReleaseAge: '0 days',
		},
		{
			matchManagers: ['pep621'],
			matchPackageNames: ['my-private-lib'],
			minimumReleaseAge: '0 days',
		},
	],
	minimumReleaseAge: '1 week',
};
```

この例では、GitLabのパッケージレジストリやコンテナレジストリから取得した Docker イメージと、Python パッケージについて、`minimumReleaseAge`
を `0 days` として扱うことで、リリース時刻が取得できない問題を回避しています。

## 依存関係がある場合の注意点

利用するパッケージレジストリに依存関係がある場合は注意が必要です。

例えば、`my-private-lib`
内の Python のパッケージがある場合、そのパッケージが依存している別のパッケージの更新があった場合、Renovate はそれらを、GitLabのパッケージレジストリやコンテナレジストリのキャッシュから取得したリリース時刻をもとに、`minimumReleaseAge`
の判定を行います。その結果、親子関係にある更新候補が一緒に扱われ、期待した通りの制御ができないことがあります。

## まとめ

Renovate は強力ですが、プライベート GitLab レジストリや Docker レジストリを使う場合には、ハマりポイントが多数あります

特に、リリース時刻が取得できない環境では、`minimumReleaseAge`
が正しく評価できないことがあります。そのため、対象パッケージを明示的に `0 days`
とし、`allowedVersions` を指定するなど、運用側での調整が必要です。
