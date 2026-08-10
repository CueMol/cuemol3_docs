# 機能の統合・改名・廃止

CueMol2 にあった機能が CueMol3 のどこに移ったか、あるいはなくなったかの一覧です。

## 改名・移動された機能

機能自体は残っていますが、名前や置き場所が変わったものです。

| CueMol2 | CueMol3 | 備考 |
|---|---|---|
| Rendering &gt; POV-Ray rendering... | **Rendering &gt; Image rendering...** | バックエンド (Umbreon / POV-Ray) はレンダリングウィンドウ内で選ぶため、メニューは出力の種類を表す名前になりました → [レンダリングウィンドウ](../ui/rendering-window.md) |
| Rendering &gt; Animation rendering... | **Rendering &gt; Movie rendering...** | 同じレンダリングウィンドウの動画モードになりました |
| Tools &gt; Mol bond editor... | ツールパレットの **Add Bond** ツール | モーダルダイアログから、3D ビューを直接クリックする方式に変わりました → [ツールバーとツールパレット](../ui/toolbar-tools.md) |
| Edit &gt; Options (プリファレンスウィンドウ) | **Settings** タブ | モーダルではなくコンテンツ領域のタブとして開きます。macOS では Preferences... |
| レンダラ種類ごとのプロパティダイアログ | **プロパティインスペクタ** | ダイアログを廃し、常設パネルでのライブ編集になりました → [プロパティインスペクタ](../ui/inspector.md) |
| カラーメニューのプリセット | **カラーピッカーの Palette パネル** | グレースケール + 色相ごとのバリエーションとして統合されました |
| Paint 設定のダイアログ | **Color パネルの Paint 表** | 表のセルを直接編集する形になりました → [サイドパネル](../ui/side-panels.md) |
| オブジェクト削除のダイアログ | **シーンツリーの Delete** | 選択式で削除対象を指定する専用ダイアログは廃止されました |
| File &gt; New Window | **File &gt; New Tab** | 下記「廃止された機能」も参照 |

## 廃止された機能 (代替手段あり)

| CueMol2 の機能 | 廃止の理由 | 代替手段 |
|---|---|---|
| File &gt; New Window | 1 つのバックエンドを共有する構造上、複数の OS ウィンドウを開けないため | **File &gt; New Tab** でタブを追加してください |
| Window &gt; Show/Hide Topbar | CueMol3 の画面構成に対応しないため | ツールバーは常時表示です |
| Window &gt; Clear log contents | 同上 | Output パネルのログはアプリ再起動でクリアされます |
| Window &gt; Restore default panel location | 同上 | パネルの構成はアクティビティバーで切り替えます |
| Tools &gt; MSMS による分子表面生成 | 外部 MSMS バイナリを使う経路は使われていなかったため | **Tools &gt; Mol surface generation...** (内蔵の SES 生成) をお使いください |
| 選択パネルの階層型エディタ (Hierarchical / Terminal / Around-Expand) | 選択式を直接書く方法で大半の用途をカバーできるため | Selection パネルの選択式入力欄、または Molecular structure パネルのツリー選択 |
| キーバインドのカスタマイズ | UXP 版の実装をそのまま移植しない判断のため | 現時点では変更できません |
| Help &gt; About plugins... / About config... / Addon manager... / Console | Mozilla XULRunner に固有の機能のため | 開発者ツールは **View &gt; Toggle Developer Tools** から開けます |
| Help &gt; Check for updates | Mozilla の更新機構に依存していたため | 配布物を入手し直してください |

## 廃止された機能 (代替なし)

| CueMol2 の機能 | 廃止の理由 |
|---|---|
| View &gt; Hardware stereo | 移行対象外の判断 |
| File &gt; Open web page... | アプリ内ブラウザを持たないため。外部リンクは OS の既定ブラウザで開きます |
| Tools &gt; Execute script... | 実装の予定がないため、動かない項目を残さず削除されました |
| MolClient (SMILES から分子を生成) | 外部の MolServer (XMLRPC) が必要なため |
| QSL (軽量シーン) 形式への書き出し | CueMol 本体から削除されました |
| LuxRender / LuxCore / Warabi / raw 形式への書き出し | CueMol3 の Export scene には含まれません (CueMol2 では引き続き利用できます) |
| Script による塗り分け (Script coloring) | CueMol2 でも UI から選択・作成できない機能だったため |
| マウスプリセットの選択 | ポインティングデバイスの設定と役割が重複するため → [マウス・トラックパッド操作](../ui/mouse-input.md) |
| HiDPI の切り替え / UI 言語の切り替え設定 | CueMol3 側に対応する処理がないため |
| 分子重ね合わせの RMSD 情報のファイル出力 | RMSD は Output パネルのログで確認できるため |

## 現時点で未実装の機能

上記とは別に、「実装予定はあるがまだ動作しない」項目があります。
→ [開発状況と未実装機能](status.md)

---

*最終確認: 2026-08-10 / 確認対象: 開発版 (tritium)*
