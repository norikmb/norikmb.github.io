---
title: "Ubuntuでパッケージを更新する"
description: ""
pubDate: "Apr 05 2024"
heroImage: "/blog/20240405.png"
---

### Why

Ubuntuはaptと呼ばれるパッケージ管理方法を用いている。  
そのためカーネルのバージョン管理もaptで行うことが可能。

[CVE-2024-1086](https://github.com/Notselwyn/CVE-2024-1086)が公開されていたので、個人の開発環境のカーネルのバージョンを確認した。

```sh
uname -r
5.15.0-52-generic
```

更新が必要そうなバージョンだった。  
[Ubuntuの公式](https://ubuntu.com/security/CVE-2024-1086)によると、5.15系では5.15.0-101で修正版がリリースされているらしい。

### What

Ubuntuでのパッケージを更新していく。

カーネル類は/bootに実体がある。  
更新前に/bootの容量を確認して十分な空き容量があるか確認する。

```sh
df -h
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           389M  1.5M  388M   1% /run
/dev/sda4        27G   15G   12G  57% /
tmpfs           1.9G     0  1.9G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/sda2       488M  373M   79M  83% /boot
tmpfs           389M  4.0K  389M   1% /run/user/1000
```

空き容量確保のため不要なパッケージを削除しておく。

```sh
sudo apt autoremove -y
```

カーネルと合わせて他のパッケージも更新する。

```sh
sudo apt update
sudo apt upgrade -y
```

不要なパッケージを削除する。

```sh
sudo apt autoremove -y
sudo apt autoclean -y
```

再起動

```sh
sudo reboot
```

脆弱性対応済みバージョンに更新できた。

```sh
uname -r
5.15.0-101-generic
```
