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

## 3.0.2.560 (2026-11-14)

### アニメーション

- **アニメーションの要素に Rock が加わりました。** 要素を置いた時点の向きを中心に視点を揺らします。
  **Pattern** で Rock (1 軸の往復) / Nutate (視線が円を描く) / Wobble (8 の字) を選び、振れ幅・回数・
  位相・振れ幅の時間変化 (Grow / Shrink) を設定できます。どこに置いても直前の向きから跳ばずに始まり、
  Simple spin と同じ時間に置くと回りながら揺れます
  → [RockSpin](reference/animation/rockspin.md)
- **Animation パネルで、要素を Cut / Copy / Paste できるようになりました** (**Edit** メニューと
  ++cmd+x++ / ++cmd+c++ / ++cmd+v++)。貼り付けた要素は長さを保ったまま、選んでいる要素の直後に
  続けて並びます。別のシーンにも貼り付けられます → [下部パネル](ui/bottom-panels.md#animation)
- **Simple spin の Rotation angle に範囲が無くなりました。** 負の値で逆向きに回り、720° で 2 周します

### Console からの視点の動き

- **ChX console の `turn` に `frames` を付けると、その回転をアニメーションの要素として追加し、
  1 回再生するようになりました。** `roll` / `rock` / `wobble` は `stop` までループで再生します
  (`stop` でループの設定は元に戻ります)
- **PyM console の `movie.add_roll` / `movie.add_rock` / `movie.add_nutate` / `movie.roll` /
  `movie.rock` / `movie.nutate` / `movie.tdroll` が、アニメーションに要素を追加するようになりました**
  (`mplay` で再生します)。`rock` で揺らしを開始・停止できます
- 速さや位相は ChimeraX / PyMOL とおおよそ合わせてあるだけで、同じではありません
  → [ChX console](reference/plugins/console/chx_console.md) /
  [PyM console](reference/plugins/console/pymconsole.md)

### Styles ビューと Explorer

- **アクティビティバーに Styles ビューが加わりました。** シーンから見えるスタイルセットを名前を探す順に
  並べ、選んだスタイルセットの名前付きの色 (**Colors**) と名前付き選択 (**Selections**) をその場で
  編集できます。スタイルセットはシーンツリーに表示されなくなりました
- アプリに同梱のスタイルセットは読み取り専用になりました。`user` のスタイルセットは編集できます
- **Explorer に Camera パネルと View パネルが入りました** (上から Scene / Camera / Color / View)。
  アクティビティバーの View は無くなりました
  → [サイドパネル](ui/side-panels.md#styles)

### MD トラジェクトリ (MD Tools)

- **トラジェクトリのファイル (`.xtc` / `.dcd` / `.trr` / `.nc`) をドロップすると、開いている分子に
  付けられるようになりました。** 原子数の合う分子から付け先を選ぶと、その分子はトラジェクトリになり、
  元の座標が最初のフレームになります
- **トポロジーだけのファイル (prmtop / PSF) を、座標の無い分子として開けるようになりました。**
  座標 (AMBER の restart、NAMD の `.coor`) やトラジェクトリは、あとからドロップして付けます。
  **File &gt; Open MD Trajectory...** でもトポロジーに prmtop / PSF を選べます
  → [下部パネル](ui/bottom-panels.md#trajectory)

### 画面と操作

- **ダイアログが、最後に確定した設定で開くようになりました** (CueMol3 を再起動した後も)。File Open の
  オプション、New Renderer、分子の統合、重ね合わせ、分子表面、APBS、PNG の書き出しなどが対象です。
  数値を記憶するダイアログ (分子表面 / APBS / 相互作用 / 二次構造) には、既定値に戻す **Defaults**
  ボタンがあります → [Tools メニュー](menu/tools.md)
- **Get PDB で、リガンドを CCD コードで取得できるようになりました** (**CCD (ligand)**、RCSB の理想座標)。
  ChX console では `open ccd:ATP` で取得できます → [PDB からの取得](reference/get-pdb.md#ccd-ligand)
- nucl の **Base type** に、塩基を表示せずチューブだけを残す **None** が加わりました
  → [nucl](reference/renderers/nucl.md)
- **履歴が 20 ステップを超えると、GUI で同じ値を続けて編集したステップが 1 つにまとめられるように
  なりました** (History パネルでは `×N` と表示されます)
  → [操作の記録と再生](reference/actions.md#history-パネル)
- ChX console で、`alphafold` / `pae` などの AlphaFold のパレットを使えるようになりました

!!! warning "以前のバージョンから変わる点"
    - **NAMD の `.coor` を PSF と一緒に開いたシーン (`srctype="namdcoor"`) は読み込めなくなりました。**
      PSF を開き、`.coor` をドロップして付け直してください
    - **Console の native モードの `load_namd` は `load_psf` になりました** (PSF を開き、`coordFile` で
      `.coor` を指定します)
    - アプリに同梱のスタイルセットは編集できなくなりました。色や選択を足すときは、シーンのスタイルセットか
      `user` のスタイルセットに書いてください

## 3.0.1.555 (2026-11-10)

### PDB からの取得

- **Get PDB で、取得元のデータベースを選べるようになりました** (**Database**)。PDB / EMDB に加えて、
  **AlphaFold DB** (UniProt accession で予測構造を取得) と **PubChem** (CID で化合物の 3D 配座を取得) を選べます。
  入力すると、タンパク質名・生物種・平均の pLDDT や、化合物名・分子式・分子量が表示されます
- **PDB のエントリの座標を、RCSB のほか PDBe / PDBj / PDB-REDO から取得できるようになりました** (**Server**)。
  電顕マップの取得元にも **PDBj** が加わりました
- AlphaFold DB から取得した構造は、予測の信頼度 (pLDDT) の色で表示されます。PubChem の化合物は
  ball &amp; stick で表示されます
- Console の native モードに、`fetch_entry` (上記のデータベースからの取得) と `fetch_map_url`
  (URL にある CCP4 / MRC のマップの取得) が加わりました
  → [PDB からの取得](reference/get-pdb.md)

### B-factor の多色のグラデーション

- **Color パネルの Bfac/Occ で、複数の色を経由するグラデーションを使えるようになりました**
  (**Multi-colour gradient**)。原子の値のヒストグラムを見ながら、色の区切りを編集できます。
  編集は Undo で戻せ、シーンに保存されます
- プリセットに、AlphaFold の pLDDT を ChimeraX と同じ色で塗る **AlphaFold pLDDT** が加わりました
- PyM console の `spectrum b` / `spectrum q` に 3 色以上のパレット (`rainbow` など) を指定すると、
  PyMOL と同じく多色のグラデーションで塗るようになりました
  → [Coloring](reference/coloring.md#bfacocc)

### 視点の合わせ方

- **シーンツリーの Focus で、表示しているものに合わせるようになりました。** 分子は表示中の Renderer が
  描いている原子に、密度マップは表示中の等高線に合わせます。小さなものでも、表示の幅は 15 Å より
  狭くしません
- **読み込んだときの視点 (Center view on molecule after loading) も、Focus と同じく大きさまで合わせる
  ようになりました** (以前は中心だけを移していました)。電顕マップは、表示している等値面に合わせます
  → [サイドパネル](ui/side-panels.md#explorer)

### ChX console

- **対応していないコマンドや書き方は、警告を出して飛ばし、スクリプトの残りを実行するようになりました**
  (ChimeraX の公式チュートリアルや図のスクリプトを最後まで流せます)
- `open` で、`pdbe:` / `pdbj:` / `redo:` / `alphafold:` / `pubchem:` / `emdb:` などのデータベースの接頭辞、
  URL、複数の名前、`from eds` (2Fo-Fc マップ) を使えるようになりました。視点を合わせるのは、空のシーンに
  最初に開いたときだけです (ChimeraX と同じ)
- `volume` / `lighting` / `camera` / `nucleotides` / `ribbon` / `unitcell` / `dssp` / `preset` / `wait` /
  `color modify` / `color bfactor` / `color byattribute` などのコマンドと、ColorBrewer のパレットが加わりました
- 隠した原子をもう一度表示すると、隠す前のスタイルで表示されるようになりました
- Settings &gt; Plugins の表示名が **PyM console** / **ChX console** になりました
  → [ChX console](reference/plugins/console/chx_console.md)

### 起動スクリプトとスタイルファイル

- **`~/.cuemol/` に置いたスクリプト (`startup.txt` / `.qax` / `.pml` / `.cxc`) を、起動のたびに
  Console で実行するようになりました。** 1 つのファイルが 1 回の Undo にまとまります。実行中は
  ステータスバーに表示が出て、そこから止められます
- `~/.cuemol/styles/` に置いたスタイルファイル (`.xml`) を、起動時に読み取り専用のスタイルセットとして
  読み込むようになりました
  → [ユーザーディレクトリ (~/.cuemol)](reference/dotfiles.md)

!!! warning "以前のバージョンから変わる点 (ChX console)"
    - **コマンド名の `c` は `camera` の省略になりました** (以前は `cartoon`)。`cartoon` は `car` などと
      打ってください
    - **`color random` は拒否されるようになりました** (警告を出して飛ばします)
    - **閉じた model の番号は、次に開いたものに再び使われるようになりました** (ChimeraX と同じ)

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

---

2.4.1.547 以前のリリースは[過去のリリース](releases-archive.md)にまとめてあります。

## 関連項目

- [過去のリリース](releases-archive.md) — 2.4.1.547 以前の更新履歴
- [CueMol2 からの変更点](changes/index.md) — CueMol2 と CueMol3 の違い
- [開発状況と未実装機能](changes/status.md) — 現時点で残っている制限
- [ダウンロード](install/index.md#ダウンロード) — 配布物の入手方法

---

*確認対象: CueMol3 3.0.2.560*
