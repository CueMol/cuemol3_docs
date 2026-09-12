# インストール

!!! warning "CueMol3 は開発版です"
    CueMol3 の配布物は GitHub の Releases から誰でもダウンロードできますが、
    **開発途上のバージョン**です。
    配布元を証明するコード署名 (Developer ID / Authenticode) と notarization は
    行っていないため、初回起動時に OS のセキュリティ警告が表示され、
    回避のための手動操作が必要になります。

    業務や論文作成で安定して使いたい場合は、**CueMol2 の安定版**をご利用ください。
    入手方法は [CueMol2 ドキュメントサイト](https://cuemol.github.io/cuemol2_docs/) にあります。

## 配布物の署名状況

| OS | 署名 | 起動時の警告 |
|---|---|---|
| macOS | **アドホック署名のみ** (`codesign --sign -`)。Developer ID 署名・notarization なし | Gatekeeper の警告が出ます → [回避手順](macos.md#初回起動時の警告を回避する) |
| Windows | なし (Authenticode 署名は今後の作業) | SmartScreen の警告が出ます → [回避手順](windows.md#初回実行時の警告を回避する) |
| Linux | なし | 警告はありません |

!!! info "アドホック署名では Gatekeeper は通りません"
    macOS の配布物にはビルド時にアドホック署名が付きます。これは Apple Silicon で
    アプリを起動可能にするために必要な処理 (署名のないバンドルは「壊れている」として
    拒否されます) であって、**配布元を証明するものではありません**。
    したがって Web からダウンロードした場合の Gatekeeper の警告は従来どおり表示されます。

## ダウンロード

CueMol3 の配布物は、GitHub の **Releases** ページで公開されています
(CueMol2 の配布物と同じリリースに並んでいます)。

- **[最新リリース](https://github.com/CueMol/cuemol2/releases/latest)** —
  ページ下部の **Assets** 欄から、ファイル名が `CueMol3-` で始まるものをダウンロードしてください
  (`cuemol2_...` で始まるファイルは CueMol2 の配布物です)
- **[リリース一覧・リリースノート](https://github.com/CueMol/cuemol2/releases)** —
  過去のバージョンのダウンロードと、リリースごとの詳細な変更点
  (要点だけを知りたい場合は → [更新履歴](../releases.md))

そのほか、開発版の入手経路として次の方法もあります。

- [GitHub リポジトリ](https://github.com/CueMol/cuemol2) の CI (`build2.yml`) が生成したアーティファクト
  (GitHub へのログインが必要)
- 自分でソースからパッケージをビルドする

## 配布物一覧

| OS | 配布物 (例: バージョン 2.3.14.525) | インストーラー形式 |
|---|---|---|
| macOS (Apple Silicon / arm64) | `CueMol3-2.3.14.525-macOS-arm64-Installer.dmg` | ディスクイメージ |
| Windows (x64) | `CueMol3-2.3.14.525-Windows-x64-Setup.exe` | NSIS ウィザード型インストーラー |
| Linux (x64) | `CueMol3-2.3.14.525-Linux-x64.AppImage` / `CueMol3-2.3.14.525-Linux-x64.deb` | AppImage / Debian パッケージ |

ファイル名には対象の OS と、4 桁のビルド番号を含むバージョンが入ります。
`Installer` / `Setup` が付いているものがインストーラーです。

!!! warning "x86-64 版は AVX2 対応の CPU を必要とします"
    Windows / Linux の x86-64 版は **AVX2** 命令を使ってビルドされています。
    対応するのは Intel Haswell / AMD Zen 以降 (おおむね 2013 年以降) の CPU です。
    これより古い CPU では、**分子表面を生成したときにアプリが異常終了します**。

    macOS (Apple Silicon) と ARM 版は影響を受けません。

## ファイルの関連付け

CueMol3 は、扱えるファイル形式 (`.qsc` / `.pdb` / `.cif` / `.mol2` / `.ccp4` など 16 種類) を
OS に登録します。macOS の「このアプリケーションで開く」、Windows のエクスプローラーの
「プログラムから開く」、Linux のファイルマネージャの "Open With" に CueMol3 が並びます。

登録は**候補としての登録**です。既定のアプリケーションを CueMol3 が奪うことはないため、
`.qsc` を CueMol2 で、`.pdb` を別のアプリケーションで開く設定はそのまま残ります。

Linux では `.deb` パッケージが関連付けを登録します。AppImage の場合は、お使いの
デスクトップ統合ツールに依存します。

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

動画エンコード (ffmpeg) と静電ポテンシャル計算 (APBS / PDB2PQR) は外部プログラムを使います。
配布物に同梱されている場合はそのまま使えますが、同梱されていないビルドでは
Settings で実行ファイルのパスを指定する必要があります。

レイトレーシングは内蔵の Umbreon で行うため、外部プログラムは不要です。

→ [外部ツールの設定](external-tools.md)

## アンインストール

| OS | 手順 |
|---|---|
| macOS | `/Applications/CueMol3.app` を削除 |
| Windows | 「アプリと機能 / プログラムの追加と削除」から CueMol3 をアンインストール |
| Linux (AppImage) | `.AppImage` ファイルを削除 |
| Linux (.deb) | `sudo apt remove cuemol3` などパッケージマネージャで削除 |
