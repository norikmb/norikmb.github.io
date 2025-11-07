---
title: 'Arduino Uno でポケモンZAの作業を自動化する'
description: 'Arduino Uno を使ってポケモンZAの作業を自動化する方法を紹介します'
pubDate: "Sep 08 2025"
heroImage: "/blog/20251108.png"
---

## はじめに

ポケモンZAではモミジリサーチにおいてトレーナー戦で1000勝する必要があります。  
退屈なことは自動化しましょう。  
世の中では連射コントローラーなどを使って自動化する方法が広まっていますが、今回は Arduino Uno を使った自動化を行いました。  
Arduino Uno を使った自動化の方法は剣盾時代から存在しており、すでに多くの情報がネット上にありますが、2025年11月現在でも実施可能でしたので備忘録的に残しておきます。  
今回は剣盾環境初期に流行ったポッ拳コントローラーを詐称した自動化を試しましたが、最近はプロコンを詐称した自動化が主流みたいです。時代の流れは速いですね。

## 使ったもの

- Arduino Uno
- USBケーブル
- ジャンパーワイヤー（必要に応じて）

## Arduino UNOのセットアップ方法

1. USBケーブルをPCに接続します。
2. ジャンパーワイヤーなどで、リセットピンとグランドを一時的に接続し16u2をリセットします。
    - ピンはUSBコネクタの近くにあります。参考写真は公式サイト参考
   ![Arduino Uno 16u2 Reset Pin](https://docs.arduino.cc/static/839844facc52bdd7f609eb22c0d428bf/53639/Uno-front-DFU-reset.png)
3. デバイスマネージャーを開き、 不明なデバイスが認識されていることを確認します。
4. dfu-programmerをDLして展開します。0.9.0まではWindows版が提供されていました。
     - https://github.com/dfu-programmer/dfu-programmer/releases/download/v0.9.0/dfu-programmer-win-0.9.0.zip

5. デバイスマネージャーで「不明なデバイス」を選択し、ドライバーを更新します。

6. コンピュータを参照してドライバーソフトウェアを検索」から、先ほど展開したdfu-programmer-win-0.9.0のフォルダを指定します。

7. これでArduino UnoがDFUモードで認識され、Atmega16U2として認識されました。
    - 今後はUSBケーブルを接続する際に、リセットピンとグランドを一時的に接続し16u2をリセットするだけで、Atmega16U2として認識されます。

## プログラムの書き込み

1. AutoZAリポジトリをクローンし、READMEに従ってBuildします。
    - ※プログラムのBuildはWSL上で行い、書き込みはWindows上で行います。
    - ※プログラムは https://github.com/murufon/AutoRaid さんのものをベースに変更しました。

    ```shell
    git clone --recursive https://github.com/norikmb/AutoZA.git
    ```

2. Buildして作成した Joystick.hex を前の章で展開したdfu-programmer-win-0.9.0のフォルダにコピーし、dfu-programmerで書き込みます。

    ```shell
    .\dfu-programmer.exe ATmega16U2 erase
    .\dfu-programmer.exe ATmega16U2 flash Joystick.hex
    .\dfu-programmer.exe ATmega16U2 reset
    ```

3. 書き込みが完了したら、Arduino UnoをPCから取り外し、Nintendo Switchに接続します。

## 感想

学生時代ぶりにArduino UNO を引っ張ってきて遊びました。このArduino UNO は中学生の時に大須の電気屋で買ったものなので思い出深いです。


## 参考文献・サイト

- https://docs.arduino.cc/retired/hacking/software/DFUProgramming8U2/
- https://github.com/dfu-programmer/dfu-programmer
- https://note.com/rejipkmn/n/nb24194e9de69
- https://github.com/murufon/AutoRaid
