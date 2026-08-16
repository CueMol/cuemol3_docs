# CueMol3

**CueMol3** (開発コードネーム *tritium*) は、生体高分子の立体構造を可視化するためのソフトウェアです。
CueMol2 の可視化エンジン (libcuemol2) をそのまま受け継ぎつつ、GUI を Electron + React で全面的に作り直しています。

![CueMol3 の画面例。メインウィンドウでクライオ電顕マップとリボンモデルを表示し、レンダリングウィンドウで Umbreon によるレイトレーシングを実行しているところ](assets/images/index/app-example.webp){ .on-glb }

!!! warning "現在のバージョンは開発版です"
    CueMol3 の配布物は [GitHub の Releases](https://github.com/CueMol/cuemol2/releases/latest)
    からダウンロードできますが、**開発途上のバージョン**です
    (→ [ダウンロード](install/index.md#ダウンロード))。
    実務で安定して使いたい場合は、CueMol2 の安定版
    ([CueMol2 ドキュメントサイト](https://cuemol.github.io/cuemol2_docs/)) をご利用ください。

## はじめての方へ

<div class="grid cards" markdown>

- :material-rocket-launch: **[はじめに](getting-started/index.md)**

    CueMol3 の概要、対応ファイル形式、動作環境、ライセンス。

- :material-download: **[インストール](install/index.md)**

    OS ごとの導入手順と、初回起動時の警告の回避方法。

- :material-application: **[画面構成](ui/index.md)**

    ウィンドウの各領域の名称と役割。

- :material-menu: **[メニューリファレンス](menu/index.md)**

    メニュー項目の一覧と、現在動作する / しない項目。

</div>

## CueMol2 を使っていた方へ

CueMol3 では GUI が大きく変わり、一部の機能が統合・改名・廃止されています。
何がどう変わったかは **[CueMol2 からの変更点](changes/index.md)** にまとめています。

- [最重要な変更点の要約](changes/index.md)
- [操作パラダイムの変更](changes/ui-paradigm.md) — モーダルダイアログ中心からの脱却
- [機能の統合・改名・廃止](changes/features.md) — 移動先・代替手段の対応表
- [開発状況と未実装機能](changes/status.md)

## 関連リンク

| リンク | 内容 |
|---|---|
| [GitHub Releases](https://github.com/CueMol/cuemol2/releases) | 配布物のダウンロードとリリースノート (→ [ダウンロード](install/index.md#ダウンロード)) |
| [CueMol2 ドキュメント](https://cuemol.github.io/cuemol2_docs/) | CueMol2 (安定版) のドキュメント。CueMol2 向けに凍結維持されています |
| [ギャラリー](https://cuemol.github.io/cuemol2_docs/en/Gallery/) | CueMol で作成された画像の作例 (CueMol2 サイト内) |
| [GitHub: CueMol/cuemol2](https://github.com/CueMol/cuemol2) | ソースコードリポジトリ (CueMol3 は `tritium/` 以下) |
