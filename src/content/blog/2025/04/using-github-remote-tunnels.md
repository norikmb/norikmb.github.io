---
title: 'GitHub Remote Tunnelsを使ってみる'
description: ''
pubDate: 'Apr 09 2025'
heroImage: '/blog/20250409.png'
---

### Why

GitHub Remote
Tunnels は GitHub の認証を用いてサーバー上の開発環境にリモートからアクセスできるようにする機能

- 同様の機能に RemoteSSH もあるが、SSH 用の FW を開けなくて良いのが特徴

- 参考: https://code.visualstudio.com/docs/remote/tunnels

### What

#### Remote Tunnels のセットアップ

以下を SSH 接続したサーバー上(開発環境サーバー)で実施します

1. curl でファイルを持ってくる

    ```shell
    kambe@ubuntu:~$ curl -Lk 'https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64' --output vscode_cli.tar.gz

      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100   162  100   162    0     0    196      0 --:--:-- --:--:-- --:--:--   196
    100 8783k  100 8783k    0     0  4048k      0  0:00:02  0:00:02 --:--:-- 11.8M
    ```

1. tar で展開する

    ```shell
    kambe@ubuntu:~$ tar -xf vscode_cli.tar.gz
    ```

1. /usr/local/bin/ に移動させる

    ```shell
    kambe@ubuntu:~$ rm /usr/local/bin/code
    rm: cannot remove '/usr/local/bin/code': No such file or directory
    kambe@ubuntu:~$ sudo mv code /usr/local/bin/code
    ```

1. 認証する。https://github.com/login/device にアクセㇲ

    ```shell
    kambe@ubuntu:~$ /usr/local/bin/code tunnel
    *
    * Visual Studio Code Server
    *
    * By using the software, you agree to
    * the Visual Studio Code Server License Terms (https://aka.ms/vscode-server-license) and
    * the Microsoft Privacy Statement (https://privacy.microsoft.com/en-US/privacystatement).
    *
    [2025-02-18 20:11:54] info error refreshing token: error requesting https://api.github.com/user: 401 {"message":"Bad credentials","documentation_url":"https://docs.github.com/rest","status":"401"}
    To grant access to the server, please log into https://github.com/login/device and use code xxx-xxx
    ```

1. 一旦 Ctrl ＋ C などで終了します。今後SSHのセッションが切れた後でも利用できるように Systemd ユーザーインスタンス を作成します。

    ```shell
    vim ~/.config/systemd/user/remote-tunnel.service
    ```

    remote-tunnel.service の中身

    ```
    [Unit]
    Description=GitHub Remote Tunnel
    After=network.target

    [Install]
    WantedBy=default.target

    [Service]
    Type=simple
    ExecStart=/usr/local/bin/code tunnel
    Restart=always
    ```

1. Systemd ユーザーインスタンス を起動します

    ```shell
    kambe@ubuntu:~$ systemctl --user daemon-reload
    kambe@ubuntu:~$ systemctl --user enable remote-tunnel.service
    Created symlink /home/kambe/.config/systemd/user/default.target.wants/remote-tunnel.service → /home/kambe/.config/systemd/user/remote-tunnel.service.
    kambe@ubuntu:~$  systemctl --user start remote-tunnel.service
    kambe@ubuntu:~$ systemctl --user status remote-tunnel.service
    ```

1. systemd のユーザーインスタンスを自動起動

    systemd のユーザーインスタンスはユーザーのセッションが閉じられた時に終了します。そのため以下を実行してセッションが開いてない時もユーザープロセスを実行し続けるようにします。

    ```shell
    loginctl enable-linger $USER
    ```

以下を VScode を起動する PC(ラップトップ PC など)で実施します

1. 拡張機能を Install
    - https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-server

1. 左タブの Remote Explorer からGitHubを選択して、作成した Tunnel へ接続する
