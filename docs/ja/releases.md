# 更新履歴

リリースごとの主な変更点です。お使いのバージョンは **Help &gt; About CueMol3** で確認できます。

!!! info "詳細は GitHub のリリースノートにあります"
    このページは、ふだん使ううえで知っておくとよい点だけをまとめたものです。
    修正の一件一件や内部の変更まで含む完全な記録は
    [GitHub の Releases](https://github.com/CueMol/cuemol2/releases) にあります。

    CueMol3 と CueMol2 は同じリリースで一緒に配布されるため、リリースノートには
    CueMol2 (UXP 版) の変更も含まれています。

このページには直近の 5 リリースを載せています。それより前は
[過去のリリース](releases-archive.md)を参照してください。

## 2.4.0.546 (2026-10-17)

### 重ね合わせ

- **重ね合わせの既定の手法が US-align になりました。** **Tools &gt; Molecular superposition...** の
  **Method** で US-align / SSM / LSQ を選べます。US-align はタンパク質のほか
  **RNA / DNA** も重ね合わせられます (SSM はタンパク質専用です)。SSM と LSQ は従来どおりです
  → [Tools メニュー](menu/tools.md)
- **US-align では Pivot atom で残基の代表にする原子を選べます。** 既定の Auto (CA / C3') は
  アミノ酸に CA、ヌクレオチドに C3' を使います。ダイアログの設定は次回に引き継がれます
- **Console の `superpose` は `pivot` を取ります。** PyMOL 互換モードの `align` / `super` も
  US-align になり、RMSD とあわせて対応づけた残基の数と TM-score を表示します
  → [PyMOL 互換モード](reference/plugins/pymconsole.md#対応コマンド)

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
  → [Console](reference/plugins/console.md#複数の対象とワイルドカード)
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

- **PyM Console は Console になり、既定で有効になりました。** 下部パネルの Output の隣に
  **Console** タブがあります。モードは 2 つあり、ツールバーで切り替えます。
  既定の **CueMol モード**は CueMol 自身の操作のコマンドで、従来の PyMOL 互換のコマンドは
  **PyMOL 互換モード**でそのまま使えます → [Console](reference/plugins/console.md)
- **CueMol モードでは、GUI で行う編集の大部分をコマンドで行えます。** シーン (タブ) の作成と
  切り替え、視点とカメラ、Renderer とスタイル、着色と Paint、密度マップ、重ね合わせなどの
  分子の編集、レンダリング、静電ポテンシャルの計算、分子表面の切断、モーフィングなどです。
  Object は `1crn`、Renderer は `1crn/cartoon1` のように指定し、プロパティは
  `set 1crn/cartoon1.width, 2` で設定します。`help` で項目ごとの一覧が出ます
  → [Console](reference/plugins/console.md#対応コマンド)
- **++tab++ 補完は、引数ごとに候補を出します。** 引数の値、まだ指定していない引数の
  `name=`、Renderer のプロパティ、ファイルのパスなどです。補完はカーソルより前の部分に働き、
  候補の一覧はプロンプトのすぐ上に表示されます
- **PyMOL 互換モードに `ray` が加わりました。** ビューをレンダリングし、続く `png` でその画像を
  保存します → [PyMOL 互換モード](reference/plugins/pymconsole.md#対応コマンド)

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
  → [Console](reference/plugins/console.md#ターミナルから使う-tritium_cli)

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
    - **PyM Console を無効にしていても、Console は有効になります。** プラグインの識別子が
      変わったためです。使わない場合は Settings &gt; Plugins &gt; Installed で **Console** を
      無効にしてください。PyMOL 互換モードの入力の履歴は引き継がれます

## 2.3.20.539 (2026-09-29)

### Renderer

- **主鎖を球と円柱で描く tracestick が追加されました。** pivot 原子 (タンパク質では Cα、
  核酸では P) を球で描き、つながった残基のあいだを円柱で結びます。[trace](reference/renderers/trace.md)
  を ballstick の形にしたもので、途切れる場所も trace と同じです。スタイルは **Default** /
  **Thick** / **Ball &amp; stick** / **Thick ball &amp; stick** の 4 つです
  → [tracestick](reference/renderers/tracestick.md)

### PyM Console

- **PyMOL のスクリプトを実行できるようになりました。** `@file.pml` または `run file.pml`
  で実行し、スクリプト全体が 1 回の Undo にまとまります。`log_open` / `log_close` で
  打ったコマンドを記録でき、記録したファイルは `@` でそのまま再実行できます。
  実行中は **Stop** で止められます → [PyM Console](reference/plugins/pymconsole.md#スクリプトとログ)
- **使えるコマンドが増えました。** `save` (分子・シーン・画像)、`label`、`spectrum`、
  `set_color`、`align` / `super` / `pair_fit` (RMSD を表示)、`get_view` / `set_view`、
  `orient`、`mplay` / `mstop` / `rewind` / `frame` などです。`load` は `.qsc` / `.pse` /
  `.pml` と URL を、`fetch` は密度マップ (`type=2fofc`) と生物学的集合体 (`type=pdb1`)、
  チェーンの指定 (`1abcA`) を受け付けます
  → [PyM Console](reference/plugins/pymconsole.md#対応コマンド)
- **書き方が PyMOL に近づきました。** 選択式の中で Object 名が使えます
  (`1abc and chain A`)。`show` / `hide` は引数なしや `everything`、略した表現名も
  受け付け、`quiet=1` のような PyMOL のキーワード引数も通ります。`stick_radius` などの
  PyMOL の設定は、CueMol に同じ量があるものが対応するプロパティに割り当てられます

### AI Agent

- **Google Gemini が使えるようになりました。** モデルは `google:<モデル名>` と書き、
  API キーは **Settings &gt; Plugins &gt; AI Agent** の **Google AI API key**
  (または環境変数 `GEMINI_API_KEY`) に設定します
  → [AI Agent](reference/plugins/ai-agent.md#モデルと-api-キーの設定)
- **パネル上端でモデルを切り替えられるようになりました。** 一覧には、API キーを
  保存したプロバイダのモデルのうち、そのキーで使えるものだけが並びます
  → [AI Agent](reference/plugins/ai-agent.md#使い方)
- **モデルが今のビューを見られるようになりました。** 操作の結果を画像にして確かめながら
  進めます。その画像は記録のツールの行に縮小表示されます

### ファイルを開く

- **MD トラジェクトリのファイルをドロップしたときの案内が正しくなりました。**
  `.xtc` / `.dcd` / `.trr` はフレームしか持たず単独では開けませんが、これまでは
  「壊れているか、対応していない形式」と表示されていました。今は **File &gt; Open MD
  Trajectory...** で開くよう案内し、MD Tools が無効のときは先に **Settings &gt; Plugins**
  で有効にするよう案内します → [File メニュー](menu/file.md#object-の読み込み)
- **Open File... の形式の一覧から、トラジェクトリの形式がなくなりました。**
  選んでも開けなかったためです

## 2.3.15.530 (2026-09-18)

### プラグイン

- **機能ごとに有効・無効を切り替えられるようになりました。** **Settings &gt; Plugins &gt;
  Installed** に一覧が並び、スイッチで切り替えます。切り替えた結果は自分で触ったものだけが
  記録されるので、一度も触っていない機能はそのつど既定に従います
  → [プラグイン](reference/plugins/index.md)
- **文章で指示するとシーンを組み立てる AI Agent パネルが追加されました** (既定は無効)。
  「1CRN を読み込んで cartoon で表示して」のように書くと、モデルが GUI と同じ操作を順に
  呼び出します。1 回の指示は 1 回の Undo で戻せます。OpenAI と Anthropic のどちらでも動き、
  API キーは OS の安全な保管領域に保存されます
  → [AI Agent](reference/plugins/ai-agent.md)
- **PyMOL 互換のコマンドライン PyM Console が追加されました** (既定は無効)。
  `fetch 1crn` や `bg_color white` のような、PyMOL で使っていたコマンドをそのまま打てます。
  コマンドの解析と ++tab++ 補完は PyMOL の実装を移植したものです
  → [PyM Console](reference/plugins/pymconsole.md)
- **MD トラジェクトリの GUI が既定で無効になりました。** **File &gt; Open MD
  Trajectory...** と下部パネルの **Trajectory** タブは **MD Tools** プラグインの
  一部になり、Settings &gt; Plugins &gt; Installed で有効にしないと現れません。
  すでにシーンに入っている Trajectory は今までどおり描画されます
  → [プラグイン](reference/plugins/index.md)

### 分子表面

- **dsurf2 が dsurface に統合され、メッシュの作り方を選べるようになりました。**
  2 つは同じプロパティを持つ同じ Renderer で、違いはメッシュの作り方だけだったのに、
  New Renderer の一覧は両方を並べるだけでどちらを選べばよいかを示していませんでした。
  dsurface の **Algorithm** で **Distance field** (既定) / **MeshMS (analytic SES)** /
  **EDTSurf (voxel)** から選びます
  → [dsurface](reference/renderers/dsurface.md#algorithm)
- **解析的に溶媒排除表面を作る MeshMS が選べるようになりました。** 格子をたどらずに
  メッシュを作るため、細かい設定では距離場より大幅に高速です。溶媒排除表面専用なので、
  それ以外の表面では距離場に切り替わり、理由が Output パネルに出ます
- **Detail の意味が 3 つのアルゴリズムで揃いました。** 既定の 6 ではどれを選んでも
  ほぼ同じ細かさになります。選べる段に **24** が加わりました (16 から 32 への跳びが
  大きすぎたためです) → [dsurface](reference/renderers/dsurface.md#surface)
- **分子表面の生成ダイアログの Point density の既定が 2 /A になりました** (従来は 1)。
  1 /A は粗すぎて、そのまま使うことがほとんどなかったためです

### カメラ

- **カメラがシーンツリーから独立し、専用のパネルになりました。** アクティビティバーに
  **View** が加わり、その中の **Camera** パネルに一覧が表示されます。カメラは視点の
  一覧であって Object の階層ではないためです。**View** パネル (視点の数値操作) も
  Explorer からこちらへ移り、Explorer には Scene と Color が残ります
  → [サイドパネル](ui/side-panels.md#camera-パネル)
- **カメラの主な操作がツールバーのボタンになりました。** 新規作成・保存・適用
  (表示フラグ付きを含む)・削除の 6 つです。従来は右クリックメニューからしか行えませんでした
  → [カメラ](reference/camera.md#カメラの操作)
- **カメラの順序を行のドラッグで変えられるようになり、シーンファイルに保存されます。**
  `__current` は先頭に固定されます
- カメラの右クリックメニューから、選んでも何も起きなかった **Properties** が消えました

### 3D ビュー

- **分子表面 (dsurface) をクリック・ホバーできるようになりました。** 表面はこれまで
  当たり判定の対象に入っておらず、クリックしても何も起きませんでした。描画モードが
  **Fill** のときが対象で、網目と点は対象外です。矩形選択・投げ縄選択は従来どおり
  表面を対象にしません。**Tools &gt; Mol surface generation... で生成した分子表面
  (molsurf) は対象になりません** — 分子 (MolCoord) とは別の Object (MolSurfObj) を
  描いているためです → [ピッキングとホバー表示](ui/mouse-input.md#ピッキングとホバー表示)
- **暗い背景でホバーの強調表示が見えるようになりました。** 縁取りの外側が常に暗い色
  だったため、黒い背景に simple のような線の Renderer を出していると何も見えませんでした。
  背景の明るさに応じて白と暗い色を切り替えます
- **クリックが透過する不透明度のしきい値が 0.6 になりました** (従来は 0.5)。不透明度 0.6
  の表面は向こう側が見えているのに自分が拾われていました。0.6 ちょうども透過します
  → [ピッキングとホバー表示](ui/mouse-input.md#ピッキングとホバー表示)

### 画面と操作

- **分子ビューのツールパレットを折りたためるようになりました。** 上端のつまみを押すと
  つまみだけの形になり、もう一度押すと戻ります。**View &gt; Tool palette**
  (++cmd+shift+p++) でも切り替えられ、状態は次回の起動にも引き継がれます
  → [ツールバーとツールパレット](ui/toolbar-tools.md#ツールパレット)
- **ファイルを新しいシーンで開けるようになりました。** これまで Object のファイルは
  必ず現在のシーンに加えられていました。**Settings &gt; General &gt; Files** の
  **Drag and drop opens into** と **File manager opens into** で、経路ごとに選べます
  (どちらも既定は現在のシーン)。**Open File...** と **Open Recent** は常に現在のシーン、
  `.qsc` は対象外です → [設定項目](reference/settings.md#files)

!!! warning "既存のシーンで見え方が変わることがあります"
    - **dsurface で保存したシーンは、距離場によるメッシュで描かれます。** 従来の
      dsurface はボクセルによる実装でしたが、アルゴリズムの設定はそれ自体が新しいため
      ファイルに記録されておらず、開くと新しい既定になります。メッシュの見え方と
      Detail の効き方が変わります。以前の見た目に戻すには、Algorithm に
      **EDTSurf (voxel)** を指定してください。`dsurf2` で保存したシーンは
      **Distance field** になるので、見た目は変わりません
    - **MD トラジェクトリの GUI は、有効にするまで出てきません。**
      設定を触ったことがない場合は無効になります。Settings &gt; Plugins &gt; Installed の
      **MD Tools** を有効にしてください
    - **カメラの順序は CueMol2 (UXP 版) では保たれません。** 順序を付けたシーンを
      CueMol2 で保存し直すと、カメラは名前順に戻ります

## 2.3.14.525 (2026-09-12)

### 3D ビューの操作

- **描かれた形状のとおりにクリックが当たるようになりました。** cartoon / ribbon / tube では
  帯の中央をクリックしても当たらず、残基の CA の近くしか拾えていませんでした。矩形 / 投げ縄
  選択と対称分子は、これまでどおり原子の位置で判定します
  → [ピッキングとホバー表示](ui/mouse-input.md#ピッキングとホバー表示)
- **ポインタの下にあるものが分子ビューの左下に表示され、その場で強調されるようになりました。**
  チェインと残基 (原子単位の Renderer では原子名も)、それが属する Object と Renderer が
  出ます。強調表示のためにシーンを描き直さないので、アンビエントオクルージョンや
  アンチエイリアシングの蓄積は巻き戻りません。**Settings &gt; Input &gt; Mouse &amp; Navigation** の
  **GPU Picking** / **Hover Info** / **Hover Highlight** で切り替えられます
  → [設定項目](reference/settings.md#mouse--navigation)

### 描画 (レンダリング)

- **半透明が重なった部分で、暗いものが明るく反転する不具合が修正されました。** 半透明の
  表面越しの黒いエッジ線が白く描かれていました。画素ごとに合成する
  **Per-pixel transparency** が既定になります。半透明が 1 枚しか掛かっていない画素は
  従来と同じ絵で、変わるのは重なった部分だけです
  → [レンダリング](reference/rendering.md#transparency)
- **ウィンドウを覆ったり最小化したりするとレンダリングが数倍遅くなる不具合が修正されました。**
  一度遅くなるとアプリケーションを再起動するまで戻りませんでした。レンダリング中は
  システムがスリープしないようにもなりました
- **レンダリングウィンドウが、レンダリングをまたいで表示倍率とスクロール位置を保つように
  なりました。** 履歴を行き来しても保たれるので、2 つの結果を同じ倍率で見比べられます。
  `+` / `-` / `100%` / `Fit` は表示領域の中心を基準に拡大縮小します
  → [レンダリングウィンドウ](ui/rendering-window.md#画像領域)
- **大域照明の光の配分の段を引き直しました。** 段が動かすのは正面からの光と照り返しの配分
  だけになり、キーライトの強さはどの段でも変わらなくなりました
  → [レンダリング](reference/rendering.md#gi-lighting)

### 画面と操作

- **分子表面で Solid coloring が効くようになりました。** 色に `$molcol` を選んでも半透明の
  灰色になり、dsurface / dsurf2 では Solid coloring を選んでも CPK のままでした
  → [Coloring](reference/coloring.md#solid)
- **リストの行をクリックしても、名前の変更やセルの編集に入らなくなりました。**
  シーンツリーでは選択済みの行をもう一度クリックすると名前の変更が始まってしまい、Paint の
  表ではクリックするとテキスト入力欄にフォーカスが入るため ++cmd+c++ / ++cmd+v++ /
  ++cmd+z++ がそちらに吸われていました。編集は ++f2++ ・ダブルクリック・右クリック
  メニューから始めます。シーンツリーの右クリックメニューに **Rename...** が加わりました
  → [サイドパネル](ui/side-panels.md)
- **Paint の行のコピー &amp; ペーストが、選んだ行に効くようになりました。** 複数行を選んでから
  右クリックすると、選択が 1 行に戻ってしまっていました
- **選択の Named の先頭に `all (*)` が並ぶようになりました。** 一覧の高さは、Selection
  パネルではパネルの残りいっぱい、ポップオーバーでは開いた側の空きに合わせます
  → [選択ビルダー](ui/selection-builder.md#named)

!!! warning "既存のシーンで見え方が変わることがあります"
    - **以前のビルドで保存したシーンの GI lighting は Custom と表示されます。** 段の値が
      変わったため、保存されている値がどの段とも一致しません。段を選び直すと新しい値に
      なります
    - **半透明の合成が既定で画素ごとになります。** 半透明が 1 枚しか掛かっていない画素は
      同じ絵になり、2 枚以上重なった画素だけが変わります (それが修正の内容です)。
      blendpng や POV-Ray と揃えたいときは Transparency を OFF にしてください

---

2.3.13.523 以前のリリースは[過去のリリース](releases-archive.md)にまとめてあります。

## 関連項目

- [過去のリリース](releases-archive.md) — 2.3.13.523 以前の更新履歴
- [CueMol2 からの変更点](changes/index.md) — CueMol2 と CueMol3 の違い
- [開発状況と未実装機能](changes/status.md) — 現時点で残っている制限
- [ダウンロード](install/index.md#ダウンロード) — 配布物の入手方法

---

*確認対象: CueMol3 2.4.0.546*
