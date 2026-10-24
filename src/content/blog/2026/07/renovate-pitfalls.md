---
title:
    'GitLabのパッケージレジストリやコンテナレジストリを利用時に Renovate の minimumReleaseAge
    を正しく判定させる'
description: 'Renovateでパッケージレジストリやコンテナレジストリを扱う際に気をつけるポイントをまとめます。'
pubDate: 'Jul 27 2026'
heroImage: '/blog/20260727.png'
---

## はじめに

Renovate では、`minimumReleaseAge`
を使って「新しいバージョンが出てから一定期間は待つ」という制御をすることで、サプライチェーン攻撃を抑制することができます。

ただし、GitLab の[パッケージレジストリ](https://docs.gitlab.com/ja-jp/user/packages/package_registry/)
や[コンテナレジストリ](https://docs.gitlab.com/ja-jp/user/packages/container_registry/)ではリリース時刻のメタ情報を付与していないため、`minimumReleaseAge`
が正しく評価されません。

## 解決策

自分で作成したプライベートなパッケージや Docker イメージについては、対象のパッケージに対して
`minimumReleaseAge` を `0 days`
として扱うことで、リリース時刻が取得できない問題を回避できます。実際に作成した Renovate の設定例は以下の通りです。

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

## 依存関係がある場合の注意点

例えば、`my-private-lib`内の Python のパッケージがある場合、そのパッケージが依存している別のパッケージの更新があった場合、Renovate はそれらを、GitLabのパッケージレジストリやコンテナレジストリのキャッシュから取得したリリース時刻をもとに、`minimumReleaseAge`
の判定を行います。その結果、親子関係にある更新候補が一緒に扱われ、期待した通りの制御ができないことがあります。

そのため、スクリプト等で、先に`my-private-lib`
内の Python のパッケージ一覧と番号を取得し、そのバージョンに合わせて動的に Renovate の設定を生成するなどの工夫が必要になる場合があります。
