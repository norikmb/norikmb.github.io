---
title: 'Windows Update が失敗する際の解決方法'
description: ''
pubDate: 'Jun 30 2025'
heroImage: '/blog/20250630.png'
---

### Why

Windows Update が失敗してアップデートができなくなったので対応した際の備忘録です。

今回は結局OSの再インストール（PCのリセット）で解決しましたが、今後のために対応方法をまとめておきます。

### What

#### 対応方法1: 現在のバージョンの Windows を再インストール

- 設定 > システム > 回復 > Windows Update で問題を解決する
- 参考:
  https://support.microsoft.com/ja-jp/windows/現在のバージョンの-windows-を再インストールして問題を修正する-497ac6da-7cac-4641-82a5-f50398d879a0

#### 対応方法2: Windows Update カタログから失敗するプログラムを指定してインストール

- 参考:
  https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/installing-updates-features-roles/download-updates-drivers-hotfixes-windows-update-catalog

#### 対応方法3: Windows Update エージェントをリセット

- 参考:
  https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/installing-updates-features-roles/additional-resources-for-windows-update

#### 対応方法4: DISM を使用して Windows Update の破損を修復する

- 参考:
  https://learn.microsoft.com/ja-jp/troubleshoot/windows-server/installing-updates-features-roles/fix-windows-update-errors

#### 対応方法5: PC をリセットする

- 設定 > システム > 回復 > このPCをリセット からPCをリセットするを選択
- 個人用ファイルの保持が選べるので、実施前に消えて困るファイルはユーザー配下に移動しておくこと
- 参考:
  https://support.microsoft.com/ja-jp/windows/pc-を初期状態に戻す-0ef73740-b927-549b-b7c9-e6f2b48d275e
