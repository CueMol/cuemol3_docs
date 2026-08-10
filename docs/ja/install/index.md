# インストール

!!! warning "CueMol3 は開発版です — 一般利用向けの配布ではありません"
    現在の CueMol3 の配布物は **すべて未署名** (コード署名 / notarization 未実施) で、
    **dev / internal 配布専用**です。初回起動時に OS のセキュリティ警告が表示され、
    回避のための手動操作が必要になります。

    業務や論文作成で安定して使いたい場合は、**CueMol2 の安定版**をご利用ください。
    入手方法は [CueMol2 ドキュメントサイト](https://cuemol.github.io/cuemol2_docs/) にあります。

## 入手方法

CueMol3 は現時点で一般公開のダウンロードページを持っていません。配布物は次のいずれかで入手します。

- 開発者から直接配布されたビルド
- [GitHub リポジトリ](https://github.com/CueMol/cuemol2) の CI (`build2.yml`) が生成したアーティファクト
- 自分でソースからパッケージをビルドする

## 配布物一覧

| OS | 配布物 | インストーラー形式 |
|---|---|---|
| macOS (Apple Silicon / arm64) | `CueMol3-<version>-arm64.dmg` | ディスクイメージ |
| Windows (x64) | `CueMol3-<version>-x64.exe` | NSIS ウィザード型インストーラー |
| Linux (x64) | `CueMol3-<version>-x64.AppImage` / `.deb` | AppImage / Debian パッケージ |

バージョン番号はソースの `QM_VERSION` から決まります。

## OS 別の手順

<div class="grid cards" markdown>

- :material-apple: **[macOS](macos.md)**

    dmg からのインストールと Gatekeeper 警告の回避。

- :material-microsoft-windows: **[Windows](windows.md)**

    NSIS インストーラーと SmartScreen 警告の回避。

- :material-linux: **[Linux](linux.md)**

    AppImage / .deb の導入。

</div>

## 外部ツール

レイトレーシング (POV-Ray)、動画エンコード (ffmpeg)、静電ポテンシャル計算 (APBS / PDB2PQR) は
外部プログラムを使います。配布物に同梱されている場合はそのまま使えますが、同梱されていないビルドでは
Settings で実行ファイルのパスを指定する必要があります。

→ [外部ツールの設定](external-tools.md)

## アンインストール

| OS | 手順 |
|---|---|
| macOS | `/Applications/CueMol3.app` を削除 |
| Windows | 「アプリと機能 / プログラムの追加と削除」から CueMol3 をアンインストール |
| Linux (AppImage) | `.AppImage` ファイルを削除 |
| Linux (.deb) | `sudo apt remove cuemol3` などパッケージマネージャで削除 |
