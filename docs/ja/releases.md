# 更新履歴

リリースごとの主な変更点です。お使いのバージョンは **Help &gt; About CueMol3** で確認できます。

!!! info "詳細は GitHub のリリースノートにあります"
    このページは、ふだん使ううえで知っておくとよい点だけをまとめたものです。
    修正の一件一件や内部の変更まで含む完全な記録は
    [GitHub の Releases](https://github.com/CueMol/cuemol3/releases) にあります。

    CueMol3 と CueMol2 は同じリリースで一緒に配布されるため、リリースノートには
    CueMol2 (UXP 版) の変更も含まれています。

このページには直近の 5 リリースを載せています。それより前は
[過去のリリース](releases-archive.md)を参照してください。

## 3.0.0.554 (2026-11-06)

### バージョン番号とリポジトリ

- **このリリースから、バージョン番号がアプリの名前に合わせて 3 から始まります。**
- **ソースコードと配布物のリポジトリが [CueMol/cuemol3](https://github.com/CueMol/cuemol3) に
  移りました。** 以前の `CueMol/cuemol2` のアドレスは転送されます
- macOS の 2.4.x と Windows の 2.4.2.550 からは、**Check for Updates...** でこのリリースに
  アップデートできます → [アップデート](install/update.md)

### ChX console

- **ChimeraX 互換の console、ChX console が Console に加わりました** (プロンプトは `ChX>`)。`open` / `show` /
  `hide` / `cartoon` / `style` / `color` / `rainbow` / `surface` / `label` / `view` / `turn` /
  `select` / `name` / `info` / `distance` / `matchmaker` / `save` などの ChimeraX のコマンドと、
  原子の指定 (`#1/A:10-20@CA`、`@<5`、`@@bfactor>50` など) を使えます
- コマンドは CueMol の操作に翻訳されて実行されるので、ほかの編集と同じように History に記録され、
  Undo で戻せます。`open` で開いた分子は、ChimeraX の自動の表示に倣って描かれます。
  `.cxc` のスクリプトも実行できます
  → [ChX console](reference/plugins/console/chx_console.md)

### Console のモードがプラグインに

- **PyM console と ChX console は、それぞれ同名のプラグインになりました。** どちらも既定で有効で、
  **Settings &gt; Plugins &gt; Installed** で無効にすると、そのモードがパネルの切り替えと tritium_cli から消えます。入力の履歴は引き継がれます
  → [プラグイン](reference/plugins/index.md)

### tritium_cli

- **ファイルを渡して、起動中の CueMol3 に開けるようになりました** (`tritium_cli 1crn.pdb map.ccp4`)。
  `-i` を付けると、開いたあと対話モードに入ります。`.qax` / `.pml` / `.cxc` / `.txt` はスクリプトとして
  実行します
- **`tritium_cli mcp` で、MCP クライアントと標準入出力でつなげるようになりました**
  (`claude mcp add cuemol -- tritium_cli mcp`)。MCP Server プラグインが無効でも、その回に限り
  MCP Server を開きます → [MCP Server](reference/plugins/mcp-server.md#tritium_cli-mcp-で登録する)
- **`tritium_cli skill install` で、Claude Code から tritium_cli を使うための skill を
  インストールできるようになりました。** そのほか `status` / `version` / `help <コマンド>` が加わりました
- npm の `@cuemol/tritium-cli` も 3.0.0 になりました
  → [tritium_cli](reference/plugins/console/cli.md)

### シーンツリーと選択

- **シーンツリーで複数の行を選んで Focus を押すと、すべてが収まるように表示するようになりました**
  → [サイドパネル](ui/side-panels.md#explorer)
- **選択を少しずつ足していったときに、選択式が長くならないようになりました。** shift + クリックや
  矩形・投げ縄での追加、Selection Builder、Console で作った選択式は、同じ原子を選ぶ短い式に
  書き直されます。自分で打った選択式はそのままです

!!! warning "以前のバージョンから変わる点"
    - **一度に編集できるのは 1 つのクライアントだけになりました。** tritium_cli や MCP クライアントが
      実行している間に、ほかの tritium_cli や MCP クライアントから送った操作は `CueMol is busy` で
      拒否されます
    - **Console の `center_view` は `focus_selection` に変わりました** (`zoom` / `center` はそのまま
      使えます)。分子の選択は変えなくなりました
    - **tritium_cli の PyM console のプロンプトが `PyMOL <ディレクトリ> ❯` になりました**
      (以前は `pymol`)

## 2.4.2.550 (2026-11-01)

### 既定の見た目

- **読み込んだ分子に、分子ごとに違う色が付くようになりました。** 色覚の多様性に配慮した
  パレット (Okabe-Ito) から、シーンに読み込んだ順に 1 色ずつ割り当てます。ヘリックスとシートは
  その色、核酸は色相を少しずらした色、コイルなどは白っぽくした色です。これまでは、どの分子も
  同じ 4 色で塗られていました → [Coloring](reference/coloring.md#paint)
- 今回の実装では色は qsc ファイル内に保存されるようになったため、もし今後 CueMol3 側の
  既定色が変更になったとしても、保存時と同じ色で開かれます
- パレットは、スタイルファイルに `<palette id="default_paint" value="tolbright"/>` と書くと
  切り替えられます (`tolbright` / `tolvibrant` / `tolmuted` / `tollight` / `brewerset2` /
  `brewerdark2` / `tableau10`)。GUI からは切り替えられません
- 既定の ribbon と nucl の表示設定が若干変更となりました

### PDB からの取得 (Get PDB)

- **EMDB の電顕マップを取得できるようになりました。** ID 欄に EMDB ID (`EMD-11638` /
  `emd_11638`) も入力できます。電顕構造の PDB ID を入れると、2Fo-Fc / Fo-Fc の代わりに、
  そのエントリの EMDB のマップを選べます (サイズ・格子・推奨レベルを表示、取得元は wwPDB / EBI)。
  マップは登録者の推奨レベル (無ければ上位 1 %) の等値面で表示されます
- **入力中に、エントリのタイトル・手法・分解能・EMDB ID が表示されるようになりました**
- **キーワードでエントリを探せるようになりました。** ID 欄に ID 以外の文字列を入れて
  ++enter++ (または **Search**) を押します。手法で絞り込み、関連度・分解能・新しい順に
  並べ替えられ、**More** で続きを読み込めます。行を選ぶと、その ID を入力したのと同じ状態に
  なります。検索した語も入力の履歴に残ります
- ID 欄のラベルは **PDB or EMDB ID, or keywords** になり、取得の項目は **Coordinates** /
  **Density maps** / **Cryo-EM maps** の節に分かれました → [PDB からの取得](reference/get-pdb.md)

### Console と MCP

- **`fetch_emdb` で EMDB の電顕マップを取得できるようになりました** (AI Agent と MCP からも
  使えます)。EMDB ID か、電顕構造の PDB ID を指定します。PyM console では
  `fetch EMD-3489` / `fetch 3489, type=emd` です
- **Renderer を指定せずに読み込んだ分子が、PyMOL に近い表示で描かれるようになりました**
  (`load` / `fetch`、PyM console、MCP、AI Agent)。タンパク質は ribbon、核酸は nucl、
  炭素を含むリガンドは棒 (ballstick)、それ以外のリガンドは球 (cpk)、水は simple です。
  これまでは simple 1 つでした。**File &gt; Open File...** と **Get PDB** で開くときは従来どおりです
- PyM console の `show` / `hide` / `as` / `color` は、これらの部分にそれぞれ効きます。
  PyMOL の `cartoon` は ribbon、`ribbon` は Cα の trace (tracestick) で描きます
  → [PyM console](reference/plugins/console/pymconsole.md#対応コマンド)
- **mmCIF を読む `load_mmcif` が加わりました** → [コマンド一覧](reference/plugins/console/commands.md)

### 自動アップデート

- **Windows 版も、アプリの中でアップデートできるようになりました** (macOS と同じく
  **Check for Updates...**)。更新のたびに管理者権限の確認 (UAC) が出ます
  (`CueMol3 Updater.exe`)。新しい版が起動しなかったときは元の版に戻ります。2.4.1.547 以前の
  Windows 版からは、2.4.2.550 を一度手動でインストールしてください
  → [アップデート](install/update.md#windows-の場合)

!!! warning "以前のバージョンから変わる点"
    - **Console の `load_pdb` / `load_ccp4` などの形式ごとのコマンドは、ファイルの中身で形式を
      判別しなくなりました。** 常にコマンド名の形式として読みます。形式がわからないファイルは
      `load` で読んでください。なお `load_pdb` に mmCIF のファイルを渡してもエラーにはなりません
      (mmCIF は `load_mmcif` で読みます)
    - **CueMol3 と CueMol2 で、既定の ribbon と nucl の形が違うようになりました。** CueMol2 は
      以前の形のままです。CueMol3 で保存したシーンを CueMol2 で開くと CueMol2 の形で描かれ、
      その逆も同じです

## 2.4.1.547 (2026-10-24)

### 速度

- **tube / ribbon / cartoon / 核酸 (nucl) の再生が速くなりました。** MD トラジェクトリや
  モーフィングで原子が動いたとき、形状を作り直さずにその場で書き換えるようになりました。
  Windows ではさらに大きく速くなっています
- **大きな構造の cartoon の作成が速くなりました。** 4V6X (ヒト 80S リボソーム) では
  約 32 秒かかっていたものが約 1 秒になりました
- **分子表面 (molsurf / dsurface) とマップの等値面の、原子による着色が速くなりました**
- いずれも描かれる絵は以前と変わりません

### tritium_cli

- **tritium_cli を npm から単体でインストールできるようになりました。**
  `npm install -g @cuemol/tritium-cli` でインストールします。インストール済みの CueMol3
  (または環境変数 `CUEMOL3_APP` で指定したもの) を探して起動し、見つからなければ
  ダウンロード先を表示します。CueMol3 との間のやり取りの版が食い違っていると警告が
  表示されます。npm 版は macOS でのみ確認しています
  → [tritium_cli](reference/plugins/console/cli.md#npm-でインストールする)

!!! warning "以前のバージョンから変わる点"
    - **dsurface は、別配座 (altloc) のうち ID の無いものと `A` だけを使うようになりました**
      (molsurf と同じです)。`B` / `C` の配座しか無い残基は表面に含まれません
    - **molsurf の色が、分子に設定した着色スキームに従うようになりました** (ほかの Renderer と
      同じです)。rainbow のように状態を持つスキームを分子に設定していると、molsurf の色が
      ほかの Renderer に合わせて変わることがあります
    - **ballstick の環の板は、クリックとホバーの対象ではなくなりました。** 板は特定の 1 原子を
      表さないためです
    - **形状のデータが約 2 GB を超える tube / ribbon / cartoon は描かれません。** 以前は
      CueMol3 が異常終了していました。描かれなかったことはログに表示されます

## 2.4.0.546 (2026-10-17)

### 重ね合わせ

- **重ね合わせの既定の手法が US-align になりました。** **Tools &gt; Molecular superposition...** の
  **Method** で US-align / SSM / LSQ を選べます。US-align はタンパク質のほか
  **RNA / DNA** も重ね合わせられます (SSM はタンパク質専用です)。SSM と LSQ は従来どおりです
  → [Tools メニュー](menu/tools.md)
- **US-align では Pivot atom で残基の代表にする原子を選べます。** 既定の Auto (CA / C3') は
  アミノ酸に CA、ヌクレオチドに C3' を使います。ダイアログの設定は次回に引き継がれます
- **Console の `superpose` は `pivot` を取ります。** PyM console の `align` / `super` も
  US-align になり、RMSD とあわせて対応づけた残基の数と TM-score を表示します
  → [PyM console](reference/plugins/console/pymconsole.md#対応コマンド)

### 操作の記録と再生 (Actions)

- **アクティビティバーに Actions ビューが加わりました。** **History** パネルには Undo の
  ステップが 1 行ずつ並び、各ステップで行われた操作を展開して見られます。
  **Go to step** でその状態まで移り、**Copy as commands** でコマンドとしてコピーし、
  **Save as qax** でファイルに保存できます → [操作の記録と再生](reference/actions.md)
- **Actions パネルから、プリセットと自分で保存した操作を実行できます。** 表示・図の仕上げ・
  解析・動きの 12 個のプリセットが同梱されています。History の **Save to Actions** で
  選んだステップを保存でき、**マクロ**にすると別の Object にも適用できます
- **Undo / Redo の表示が、行った操作の内容になりました。** ツールバーの Undo / Redo の
  ドロップダウンにも、どの Renderer を作ったか、どのプロパティを変えたかが表示されます
- **記録した操作 (qax) は Console でも再生できます。** `run file.qax` / `tritium_cli file.qax`
  で再生し、`list_actions` / `export_actions` で履歴の表示と書き出しができます。`open_log` の
  記録も qax になりました

### Console

- **Console タブが下部パネルの先頭になりました。** ほかのタブを選ぶまで前面に表示されます
- **複数の対象とワイルドカードを書けるようになりました。** `hide 1crn 2abc/cartoon1`、
  `set */simple1.width, 0.7`、`load *.pdb` のように、対象ごとにコマンドが実行されます。
  行全体は 1 回の Undo のままです
  → [Console](reference/plugins/console/index.md#複数の対象とワイルドカード)
- **++tab++ の補完がメニューになりました。** 候補が出ているときにもう一度 ++tab++ を押すと、
  ++tab++ / ++shift+tab++ / 矢印キーで候補を選べます。tritium_cli でも同じです
- **`help` の表示が整理されました。** `help` で項目の一覧、`help <項目>` でコマンドの一覧、
  `help <コマンド>` で書式と引数の表、`help syntax` で書き方の説明が出ます。
  `props` / `get` の結果も表で表示されます
- **`quit` で CueMol3 を終了できます。** tritium_cli では `quit` が CueMol3 と CLI を、
  `exit` が CLI だけを終了します

### アップデート (macOS)

- **macOS (Apple Silicon) 版は、アプリの中から新しいリリースに更新できるようになりました。**
  起動時に新しいリリースを確認し、あれば通知します。アプリケーションメニューの
  **Check for Updates...** と **Settings &gt; General &gt; Updates** からも確認できます。
  新しい版が起動しなかった場合は、元の版に戻ります → [アップデート](install/update.md)
- **ステータスバーの右端に通知センター (ベル) ができました。** アップデートの通知が
  まとまります
- Windows / Linux 版は、これまでどおり配布物をインストールし直してください。
  2.3.21.544 以前からは、2.4.0.546 を一度手動でインストールする必要があります

### その他

- **アプリケーションのアイコンが新しくなりました**
- **macOS で、起動時にキーチェーンのパスワードを聞かれなくなりました**
- **Settings の MCP Server の Port は、++enter++ を押すかフォーカスを外したときに反映される
  ようになりました。** 範囲外の値は反映されません
  → [MCP Server](reference/plugins/mcp-server.md)
- Electron 42.10.0 になりました

!!! warning "以前のバージョンから変わる点"
    - **空白を含む名前は、Console で引用符が必要になりました。** `"my mol"` または `my\ mol` と
      書きます (以前は引用符なしで通っていました)
    - **MCP クライアントは登録し直してください。** 接続のトークンの保存場所が変わり、
      トークンが作り直されます
    - **操作の引数の名前が変わりました** (MCP / AI Agent / qax)。着色と Paint の操作は
      `rendId` の代わりに `nodeId` と `nodeType` を取り、Object を指す `molId` は `objId` に
      なりました
    - **書き込めるスタイルセットが無いシーンで作られるスタイルセットの名前が、`style_1` から
      `default` になりました**

## 2.3.21.544 (2026-10-10)

### Console

- **PyM console は Console になり、既定で有効になりました。** 下部パネルの Output の隣に
  **Console** タブがあります。モードは 2 つあり、ツールバーで切り替えます。
  既定の **native モード** (ツールバーの表示は **CueMol**) は CueMol 自身の操作のコマンドで、
  従来の PyMOL 互換のコマンドは **PyM console** でそのまま使えます → [Console](reference/plugins/console/index.md)
- **native モードでは、GUI で行う編集の大部分をコマンドで行えます。** シーン (タブ) の作成と
  切り替え、視点とカメラ、Renderer とスタイル、着色と Paint、密度マップ、重ね合わせなどの
  分子の編集、レンダリング、静電ポテンシャルの計算、分子表面の切断、モーフィングなどです。
  Object は `1crn`、Renderer は `1crn/cartoon1` のように指定し、プロパティは
  `set 1crn/cartoon1.width, 2` で設定します。`help` で項目ごとの一覧が出ます
  → [Console](reference/plugins/console/index.md#対応コマンド)
- **++tab++ 補完は、引数ごとに候補を出します。** 引数の値、まだ指定していない引数の
  `name=`、Renderer のプロパティ、ファイルのパスなどです。補完はカーソルより前の部分に働き、
  候補の一覧はプロンプトのすぐ上に表示されます
- **PyM console に `ray` が加わりました。** ビューをレンダリングし、続く `png` でその画像を
  保存します → [PyM console](reference/plugins/console/pymconsole.md#対応コマンド)

### 外部からの操作

- **MCP Server プラグインが加わりました。** Claude Code・Codex・Antigravity などの AI
  クライアントから、MCP で CueMol3 を操作できます (既定は無効)。Console のコマンドと同じ
  操作をツールとして呼び出せ、1 回の呼び出しが 1 回の Undo にまとまります。
  ステータスバーの **MCP** から状態の確認とクライアントの登録 (**Set up...**) ができます
  → [MCP Server](reference/plugins/mcp-server.md)
- **ターミナルから Console のコマンドを実行する tritium_cli が同梱されました。**
  対話モードのほか、`-c` やスクリプトのファイルで実行できます。CueMol3 が起動していなければ
  起動します。起動済みの CueMol3 に接続するには **Settings &gt; Plugins &gt; Console** の
  **Command line access** を ON にします
  → [Console](reference/plugins/console/index.md#ターミナルから使う-tritium_cli)

### AI Agent

- **使える操作が Console と同じ定義から作られるようになりました。** 基本の操作は常に使え、
  そのほかの分野 (視点、密度マップ、分子の編集、解析など) はモデルが必要に応じて
  使い始めます。視点を回す・ズームやスラブを設定する操作が加わりました
- **Renderer を名前なしで作ると、種類に番号を付けた名前 (`cartoon1` など) になります**
- **相互作用の解析は、指示がない限り炭素の接触を含めません**

### ラベル

- **原子の名前ラベルを常に手前に表示できるようになりました** (**Label on top**)。手前の形状に
  隠されなくなります。計測表示 (atomintr) のラベルにも同じ設定があります
- **名前ラベルの揃え位置を選べるようになりました。** **Horizontal align** / **Vertical align**
  で、ラベルのどの位置を原子に合わせるかを決めます。既定は従来どおり左下です
- **名前ラベル (`*namelabel`) の設定ページができました。** 書式・色・Label on top・
  上限数・揃え位置・オフセット・フォントを設定できます
  → [namelabel](reference/renderers/namelabel.md)
- **面を持たない Renderer (simple / trace / spline / contour など) には、エッジラインの
  設定が表示されなくなりました** → [エッジライン](reference/renderers/edge-lines.md)

### Color パネル

- **Paint の表の操作が変わりました。** ツールバーは表の上に移り、**Add** / **Move up** /
  **Move down** / **Delete** の順に並びます。行はドラッグで並べ替えられ、
  ++delete++ / ++backspace++ で削除できます → [サイドパネル](ui/side-panels.md#color-パネル)
- **Coloring の種類を選ぶボタンに、現在の種類 (Paint / CPK / Rainbow など) が表示される
  ようになりました**

!!! warning "Console プラグインを無効にしていた場合"
    - **PyM console を無効にしていても、Console は有効になります。** プラグインの識別子が
      変わったためです。使わない場合は Settings &gt; Plugins &gt; Installed で **Console** を
      無効にしてください。PyM console の入力の履歴は引き継がれます

---

2.3.20.539 以前のリリースは[過去のリリース](releases-archive.md)にまとめてあります。

## 関連項目

- [過去のリリース](releases-archive.md) — 2.3.20.539 以前の更新履歴
- [CueMol2 からの変更点](changes/index.md) — CueMol2 と CueMol3 の違い
- [開発状況と未実装機能](changes/status.md) — 現時点で残っている制限
- [ダウンロード](install/index.md#ダウンロード) — 配布物の入手方法

---

*確認対象: CueMol3 3.0.0.554*
