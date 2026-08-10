# Linux へのインストール

対象: **Linux (x64)**。配布物は `CueMol3-<version>-x64.AppImage` と `.deb` の 2 種類です。

## AppImage

インストール不要で単体で実行できます。

```sh
chmod +x CueMol3-<version>-x64.AppImage
./CueMol3-<version>-x64.AppImage
```

不要になったらファイルを削除するだけです。

!!! note "FUSE が必要な場合があります"
    AppImage の実行には FUSE が必要です。実行できない場合は、ディストリビューションのパッケージ
    (`libfuse2` など) を導入するか、`--appimage-extract-and-run` オプションを付けて実行してください。

## .deb パッケージ

Debian / Ubuntu 系では `.deb` を利用できます。

```sh
sudo apt install ./CueMol3-<version>-x64.deb
```

アンインストールはパッケージマネージャから行います。

```sh
sudo apt remove cuemol3
```

## 署名について

Linux の配布物は署名されていませんが、コード署名に起因する起動時の警告は出ません。
dev / internal 配布であり一般利用向けではない点は macOS / Windows と同じです。

## 外部ツールの設定

Linux 版の配布物には POV-Ray / ffmpeg / APBS・PDB2PQR は同梱されません。
これらを使う機能 (レイトレーシング、動画出力、静電ポテンシャル計算) を利用する場合は、
ディストリビューションのパッケージなどで別途導入し、Settings でパスを指定してください。

→ [外部ツールの設定](external-tools.md)
