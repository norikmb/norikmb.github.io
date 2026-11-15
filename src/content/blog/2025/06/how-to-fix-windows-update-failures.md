---
title: 'Windows Update が失敗する際の解決方法'
description:
    'Windows Updateが失敗した際に調べた修復方法と、PCのリセットで解決した経緯をまとめます。'
pubDate: 'Jun 30 2025'
heroImage: '/blog/20250630.png'
---

### Why

Windows Update が失敗してアップデートができなくなったので対応した際の備忘録です。

今回はOSの再インストール（PCのリセット）で解決しました。調べた修復方法の参考リンクと、実際に解決した方法をまとめます。

### What

#### 修復方法の参考リンク

- [現在のバージョンの Windows を再インストールする](https://support.microsoft.com/ja-jp/windows/現在のバージョンの-windows-を再インストールして問題を修正する-497ac6da-7cac-4641-82a5-f50398d879a0)
- [Windows Update カタログから更新プログラムをダウンロードする](https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/installing-updates-features-roles/download-updates-drivers-hotfixes-windows-update-catalog)
- [Windows Update エージェントのリセット](https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/installing-updates-features-roles/additional-resources-for-windows-update)
- [DISM を使用して Windows Update の破損を修復する](https://learn.microsoft.com/ja-jp/troubleshoot/windows-server/installing-updates-features-roles/fix-windows-update-errors)

#### 実際に解決した方法: PC をリセットする

- 「設定」>「システム」>「回復」>「この PC をリセット」からリセットします。個人用ファイルを保持する選択肢もありますが、必要なファイルは事前にバックアップしてください。
- [PC を初期状態に戻す](https://support.microsoft.com/ja-jp/windows/pc-を初期状態に戻す-0ef73740-b927-549b-b7c9-e6f2b48d275e)
