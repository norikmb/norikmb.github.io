---
title: 'よく調べる Git コマンド'
description: ''
pubDate: 'Jan 20 2025'
heroImage: '/blog/20250120.png'
---

### Why

Gitのコマンドをすぐ忘れてよく調べるので備忘録。

### What

#### tig

- git の CUI クライアント

```sh
sudo apt install tig
```

- Git の履歴調べるときはだいたいこれ

```sh
tig # 確認終わったらqで閉じる
```

#### よく調べる Git コマンド

- 更新された main の内容を取り込む

    ```sh
    git rebase origin/main
    ```

- リモートの変更を信用して強制的に pull する

    ```sh
    git fetch origin [ブランチ名]
    git reset --hard origin/[ブランチ名]
    ```

- 直前のコミットを取り消す

    ```sh
    git reset --soft HEAD^
    ```

- 切るブランチを間違えてコミットを積み重ねたのを修正する
    - 例: 間違って master から切ってしまった feature/hoge ブランチを develop に移動する

        ```sh
        git rebase --onto develop master feature/hoge
        ```

- ファイル名の typo があったので修正する

    ```sh
    git mv [変更前のファイル名] [変更後のファイル名]
    ```

#### submodule

- submodule を更新する

    ```sh
    git submodule update --remote
    ```

- サブモジュールを特定のブランチのものに変更する

    ```sh
    git rm -f [サブモジュール名]
    rm -rf .git/modules/[サブモジュール名]
    git submodule add -b [ブランチ名] [リポジトリのURL] ./[サブモジュール名]
    ```
