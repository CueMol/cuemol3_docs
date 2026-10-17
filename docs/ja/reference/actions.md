# 操作の記録と再生 (Actions)

CueMol3 は、Undo の 1 ステップごとに、その中で行われた**操作 (op)** を記録しています。
記録はアクティビティバーの **Actions** ビューで見られ、qax ファイルに保存して
あとから再生したり、**マクロ**として別の Object に適用したりできます。

Actions ビューには 2 つのパネルがあります。

| パネル | 内容 |
|---|---|
| **History** | アクティブなシーンの Undo の履歴と、各ステップで行われた操作 |
| **Actions** | アプリに同梱のプリセットと、自分で保存した操作 (User Actions) |

!!! info "撮影予定"

<!-- TODO(screenshot): Actions ビュー (History パネルでステップを展開した状態と、Actions パネルのプリセット一覧) -->

## 記録される操作

GUI での編集のほとんどと、[Console](plugins/console.md) (CueMol モード・PyMOL 互換モード)・
[MCP Server](plugins/mcp-server.md)・[AI Agent](plugins/ai-agent.md) から行った編集が、
保存して再生できる操作として記録されます。プロパティの変更、ファイルの読み込みと取得、
Renderer とスタイル、着色と Paint、選択、分子の編集、重ね合わせ、ラベルと計測、
結晶の対称性、モーフィング、アニメーション、カメラ、スタイルセット、静電ポテンシャルの
計算、コピー &amp; ペーストなどです。

**MD トラジェクトリの編集は、まだ記録されません。**

Undo / Redo の表示 (ツールバーの Undo / Redo のドロップダウンを含む) も、記録された操作から
作られます。どの Renderer を作ったか、どのプロパティを変えたか、といった内容が表示されます。

## History パネル

アクティブなシーンの Undo の履歴を、1 ステップ 1 行で表示します。

- 先頭の **Initial state** の行は、履歴の始まりです。
- 操作を 2 つ以上含むステップは展開でき、行われた操作が 1 行ずつ並びます。
- 行の右には、どこから行った編集かが表示されます (`gui` / `cmd` / `pym` / `mcp` / `ai` / `qax`)。
- 取り消したステップ (Redo 側) はグレーの斜体で、現在の位置の行は強調色で表示されます。
- 行はクリックで選び、++shift++ / ++cmd++ / ++ctrl++ + クリックで複数選べます。

### パネルの操作

パネル上部のツールバーと、行の右クリックメニューから次の操作を行えます。

| 操作 | 内容 |
|---|---|
| **Go to step** (右クリックでは **Go to This Step** / **Go to Initial State**) | Undo / Redo を繰り返して、選んだ行の状態まで移ります |
| **Copy as commands** | 選んだステップの操作を、[Console](plugins/console.md) (CueMol モード) のコマンドとしてコピーします。パネルで **Edit &gt; Copy** (++cmd+c++ / ++ctrl+c++) を使っても同じです |
| **Save as qax** | 選んだステップを qax ファイルに保存します |
| **Save to Actions** | 選んだステップを Actions パネルの User Actions に保存します (→ [マクロとして保存する](#マクロとして保存する)) |
| **Show in Inspector** (右クリックのみ) | 選んだステップを[プロパティインスペクタ](../ui/inspector.md)に表示します |

### インスペクタでの表示

ステップの行をダブルクリック (または ++enter++) するか、展開した操作の行をクリックすると、
インスペクタにその内容が**読み取り専用**で表示されます。Undo の表示、編集の出どころ、時刻、
状態 (Done / Undone)、操作ごとの名前・コマンド・引数を確かめられます。
表示しても Undo の位置は変わりません。

操作が記録されていない編集 (MD トラジェクトリの編集など) のステップは、qax に保存できません。

## Actions パネル

再生できる操作の一覧です。2 つのグループがあります。

- **Presets** — アプリに同梱されたプリセット
- **User Actions** — 自分で保存した qax ファイル。ユーザーデータのフォルダの `actions`
  フォルダに置かれます

### 実行する

一覧で選んで、ツールバーの **Run** (または右クリックメニューの **Run**) を押します。
ダブルクリックでは実行されません。

- **マクロ**は、シーンツリーで選んでいる Object に適用されます。Renderer を選んでいる場合は
  その Object が対象です。何も選んでいないときは、シーンに Object が 1 つだけなら
  それが対象になります。対象はパネル上部の **Target** に表示されます。
- 複数の Object を選んで実行すると、まとめて 1 回の Undo になります。適用できなかった
  Object は飛ばされ、最後に一覧で表示されます。
- マクロでない qax ファイルは、記録したときの Object に、名前で適用されます。

### 右クリックメニュー

| 項目 | 内容 |
|---|---|
| **Run** | 実行します |
| **Copy to User Actions** | プリセットのマクロを User Actions にコピーします |
| **Rename...** / **Move to Trash** | User Actions のファイルの名前を変える / ゴミ箱に移します |
| **Open in Editor** | qax ファイルをエディタで開きます |
| **Reveal in Finder** | qax ファイルの場所を開きます |

### プリセット

| プリセット | 内容 |
|---|---|
| Cartoon + ligand | タンパク質を rainbow の cartoon で、リガンドとイオンを ball &amp; stick で表示します (水は描きません) |
| Ligand site | リガンドと、その 5 Å 以内の残基を ball &amp; stick で表示し、その部位に視点を合わせます |
| B-factor cartoon | タンパク質を B-factor で着色した cartoon で表示します |
| Transparent surface | タンパク質に半透明の分子表面を重ねます |
| Electrostatic surface | 静電ポテンシャル (APBS) で着色した分子表面を表示します。APBS と pdb2pqr の設定が必要です (→ [外部ツールの設定](../install/external-tools.md)) |
| Ligand contacts | リガンドとそれ以外との接触・水素結合を、ラベル付きの線で表示します |
| Symmetry mates | 単位胞を埋める対称分子と単位胞の枠を表示します。結晶の情報を持つ Object が対象です |
| White background | 背景を白にします (印刷用の図向け) |
| Black background | 背景を黒にします (スライド向け) |
| Render image | ビューをシーンのレンダリングサイズでレンダリングし、デスクトップに `cuemol_render.png` として保存します |
| 360 degree spin | ビューを 1 回転させるアニメーションを加えて再生します |
| Front, side and top cameras | 今のビューを `front`、y 軸・x 軸のまわりに 90° 回したビューを `side` / `top` としてカメラに保存します |

Cartoon + ligand から Symmetry mates までの 7 つは Object に適用するマクロで、
White background 以降の 5 つは Object を選ばずに実行できます。

## マクロとして保存する

History パネルでステップを選んで **Save to Actions** を押すと、名前を付けて User Actions に
保存するダイアログが開きます。

- **Run on the selected object (save as a macro)** を ON にすると、**マクロ**として保存します。
  マクロは、実行したときに選んでいる Object に適用されます。
- OFF にすると、記録したときの Object に名前で適用される操作として保存します。

次の場合はマクロにできず、ダイアログにその理由が表示されます。

- 選んだステップが 2 つの Object にまたがっている
- 選んだステップの中で作っていない Renderer を操作している
  (その Renderer を作るステップも選んでください)

## qax ファイル

qax は、記録された操作を XML で書いたファイルです (拡張子 `.qax`)。

- History パネルの **Save as qax** や **Save to Actions** で保存します。
- [Console](plugins/console.md#スクリプトとログ) の CueMol モードでは、`run file.qax` (または
  `@file.qax`) で再生します。記録された操作ごとに 1 回の Undo になります。
  `list_actions` で履歴を表示し、`export_actions file[, first[, last]]` で qax に書き出せます。
  `open_log` も、それ以降の操作を qax に記録します。
- ターミナルからは `tritium_cli file.qax` で再生できます
  (→ [ターミナルから使う (tritium_cli)](plugins/console.md#ターミナルから使う-tritium_cli))。
- PyMOL 互換モードでは qax を実行できません。

## 制限事項

- MD トラジェクトリの編集は記録されません。
- マクロにできるのは、引数を取らないものと、Object を 1 つだけ取るものです。
- History パネルに表示されるのは、アクティブなシーンの履歴だけです。

## 関連項目

- [サイドパネル](../ui/side-panels.md#actions) — Actions ビューの位置づけ
- [Console](plugins/console.md) / [MCP Server](plugins/mcp-server.md) / [AI Agent](plugins/ai-agent.md)
- [Edit メニュー](../menu/edit.md) — Undo / Redo

---

*確認対象: CueMol3 2.4.0.546*
