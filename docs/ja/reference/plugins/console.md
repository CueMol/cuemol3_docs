# Console

CueMol の操作をコマンドで実行するコマンドラインです。**既定で有効**のプラグインで、
下部パネルの **Console** タブから使います。ターミナルから同じコマンドを実行する
**tritium_cli** も同梱されています (→ [ターミナルから使う (tritium_cli)](#ターミナルから使う-tritium_cli))。

コマンドのモードは 2 つあり、パネルで切り替えます。

| モード | プロンプト | 内容 |
|---|---|---|
| **CueMol モード** (既定) | `CueMol>` | CueMol 自身の操作のコマンド。選択は CueMol の[選択式](../selection.md)で書きます。このページで説明します |
| **PyMOL 互換モード** | `PyM>` | PyMOL 互換のコマンド (→ [PyMOL 互換モード](pymconsole.md)) |

!!! info "撮影予定"

<!-- TODO(screenshot): Console タブ (CueMol モードでコマンドを実行した直後の状態) -->

## 有効にする

既定で有効なので、下部パネルの先頭に **Console** タブがあります。ほかのタブを選ぶまでは、
このタブが前面に表示されます。
使わない場合は **Settings &gt; Plugins &gt; Installed** で **Console** を無効にします
(→ [プラグイン](index.md))。

!!! note "PyM Console から名前が変わりました"
    2.3.20.539 までの **PyM Console** プラグインは、2.3.21.544 で **Console** に
    変わりました。PyM Console を無効にしていた場合も Console は有効になっているので、
    使わない場合はもう一度無効にしてください。PyMOL 互換モードの入力の履歴は引き継がれます。

## モードの切り替え

- ツールバー左端の **CueMol** | **PyMOL** で切り替えます。
- 行に `native` または `pymol` とだけ打って実行しても切り替わります。
- 選んだモードは記憶され、次に起動したときもそのモードで始まります。
- 入力の履歴はモードごとに別々です。

## 入力と補完

| 操作 | 動作 |
|---|---|
| ++enter++ | コマンドを実行します |
| ++shift+enter++ | 改行します |
| ++tab++ | カーソルより前の部分を補完します。カーソルより後ろはそのまま残ります。候補が複数あるときは、プロンプトのすぐ上に一覧が表示されます。一覧が出ているときにもう一度押すと、候補を選ぶメニューになります |
| ++up++ / ++down++ | 入力の履歴をたどります (カーソルが先頭行 / 最終行にあるとき) |

- 候補のメニューでは、++tab++ / ++shift+tab++ / 矢印キーで候補を移り、++enter++ で確定します
  (コマンドは実行されません)。++esc++ を押すと、++tab++ を押す前の入力に戻ります。
  そのほかのキーを打つと、選んでいる候補を確定してからそのキーが入力されます。
  候補はクリックでも確定できます。
- `*` や `?` を含む語で ++tab++ を押すと、一致するものすべてに展開されます。
- ファイル名の補完では、`.` で始まる名前は `.` を打ったときだけ候補になります。一致する
  ものが無ければ、大文字と小文字を区別せずに探し直します。`cd` ではディレクトリだけが候補になります。
- CueMol モードの ++tab++ は、コマンド名、`help` の項目、引数の値 (選択肢や true / false)、
  Object・Renderer の名前、名前付き選択、色の名前、Renderer の種類、プロパティのパス、
  まだ指定していない引数の `name=`、ファイルのパス (パスを取る引数のみ) を補完します。
- **1 回の実行が 1 回の Undo にまとまります。**
- ツールバーの **Clear** で記録領域を消去し、**Help** でいまのモードの `help` を実行します。
- 実行中は「Running...」の横に **Stop** が表示されます。押すと次のコマンドの前で止まります。
  それまでに実行した分は残ります。

## CueMol モードの書き方

```
zoom 1crn, chain A and resid 10:20
set 1crn/cartoon1.width, 2
create_renderer 1crn, ballstick, name=bs1
```

- コマンド名のあとに引数を**カンマ**で区切って並べます。`name=value` の形で引数の名前を
  指定することもできます。
- コマンド名は「動詞_対象」の形です (`list_cameras` / `add_paint` など)。`props` / `view` /
  `slab` のように名詞だけのコマンドは、値を付けずに打つとその内容を表示し、値を付けると設定します。
- Object は名前 (`1crn`)、Renderer は `Object名/Renderer名` (`1crn/cartoon1`) で指定します。
  Renderer 名だけでも、シーン内で一意なら通ります。どの要素も `#12` のように **uid** で
  指定できます。名前が曖昧なときは実行されず、候補の uid が表示されます。
- プロパティは要素のあとに `.` で続けます (`1crn/cartoon1.width`、`view.centerMark`)。
  シーンのプロパティは名前だけで指定します。
- `help` は項目の一覧を、`help <項目>` はその項目のコマンドの一覧を、`help <コマンド>`
  または `<コマンド> ?` はそのコマンドの書式と引数の表を表示します。`help syntax` は
  コマンドの書き方の説明です。

### 複数の対象とワイルドカード

Object・Renderer・プロパティのパスと、読み込むファイルのパスは、空白で区切って複数
並べられます。`*` と `?` のワイルドカードも使えます。

```
hide 1crn 2abc/cartoon1
set */simple1.width, 0.7
load *.pdb ~/pdb/1c*.pdb
get_prop *.visible
```

- コマンドは対象ごとに 1 回ずつ実行されます。失敗した対象は警告になり、残りの対象は
  実行されます。何にも一致しないパターンは `no matches found: <パターン>` の警告になります。
- 複数並べた場合も、行全体が 1 回の Undo にまとまります。
- 空白を含む名前は、引用符で囲むか (`"my mol"`)、空白の前に `\` を付けます (`my\ mol`)。
  `*` そのものは `\*` と書きます。
- `props` (`list_node_props`) と `get` (`get_prop`) は結果を表で表示します。対象が複数のときは
  1 つの表にまとめます。

!!! warning "空白を含む名前には引用符が必要です"
    2.3.21.544 までは、空白を含む Object 名や Renderer 名、パスを引用符なしで書けました。
    2.4.0.546 からは、空白が区切りとして読まれます。

## 対応コマンド

`help` の項目ごとに並べます。括弧内は同じ操作の短い別名です。

| 項目 (`help <項目>`) | コマンド |
|---|---|
| Scenes and tabs (`tabs`) | `list_scenes` (`scenes`) / `create_scene` / `switch_scene` / `close_scene` |
| Objects and the scene tree (`nodes`) | `get_scene_state` (`scene`) / `set_visible` (`show` / `hide`) / `delete_node` (`delete`) / `rename_node` (`rename`) / `focus_node` (`focus`) / `move_node` / `paste_node` |
| Undo and actions (`edit`) | `undo` / `redo` / `clear_undo` / `list_actions` / `export_actions` |
| Renderers (`renderers`) | `list_renderer_types` / `create_renderer` / `create_preset_renderer` / `set_renderer_selection` / `set_renderer_type` (`retype`) / `list_renderer_styles` / `apply_renderer_style` (`style`) / `set_renderer_styles` / `create_group` |
| Colouring (`coloring`) | `list_coloring_styles` / `set_renderer_coloring` / `set_coloring_prop` / `add_paint` / `add_paint_at` / `list_paint` / `set_paint` / `remove_paint` / `move_paint` / `clear_paint` / `set_default_color` / `set_elepot_coloring` / `set_multigrad_nodes` |
| Style sets (`styles`) | `create_style_set` / `delete_style_set` / `set_style_readonly` / `load_style_file` / `save_style_file` / `define_color` / `remove_color` / `remove_selection` / `remove_style` |
| Selections (`selections`) | `list_chains` / `list_residues` / `count_selection` (`count`) / `set_mol_selection` (`select`) / `define_selection` (`define`) |
| View and cameras (`viewing`) | `rotate_view` (`turn`) / `set_view` (`view` / `slab` / `fit_slab`) / `center_view` (`zoom` / `center`) / `pan_view` (`pan`) / `set_projection` (`projection`) / `list_cameras` (`cameras`) / `save_camera` (`save_view`) / `apply_camera` (`restore_view`) / `delete_camera` / `rename_camera` / `move_camera` / `set_camera_visibility` / `clear_camera_visibility` / `load_camera_file` / `save_camera_file` / `reload_camera` |
| Properties (`properties`) | `list_node_props` (`props`) / `get_prop` (`get`) / `set_prop` (`set`) / `set_node_prop` / `reset_prop` |
| Molecule editing (`molecule`) | `superpose` / `delete_atoms` / `rename_chain` / `renumber_residues` / `merge_molecules` / `set_secondary_structure` / `add_bond` / `remove_bond` / `set_symmetry` / `show_symmetry` / `create_symmetry_copy` / `show_unit_cell` / `set_atom_label` / `set_atom_labels` |
| Surfaces (`surfaces`) | `create_surface` / `recalc_surface` / `calc_elepot` / `cut_surface` |
| Measurement and analysis (`analysis`) | `measure_geometry` / `measure_selections` / `analyze_interactions` / `list_interactions` / `remove_interaction` |
| Density maps (`maps`) | `fetch_map` / `list_map_contours` / `set_map_contour` (`contour`) / `create_surface_from_map` / `recenter_map` / `load_mtz` / `load_ccp4` |
| Animation (`animation`) | `animate` / `list_anims` / `add_anim` / `remove_anim` / `move_anim` / `set_anim_time` / `set_anim_prop` / `set_anim_options` / `reset_anim_prop` / `set_anim_generic_prop` / `list_morph_frames` / `add_morph_frame` / `remove_morph_frame` / `convert_to_morph` |
| Files and images (`files`) | `fetch_pdb` (`fetch`) / `fetch_url` / `load_file` (`load`) / `load_pdb` / `load_msms` / `load_namd` / `load_amber` / `save_scene` (`save`) / `save_object` (`write`) / `export_scene` / `export_image` / `render_image` (`render`) / `set_render_settings` |
| Console (`console`) | `cd` / `pwd` / `ls` / `run` / `open_log` / `close_log` / `log` / `help` / `quit` / `exit` |

- `load` は **File &gt; Open** と同じように形式を判別して読み込みます。`.qsc` はシーンとして開きます。
  `load_pdb` などの形式ごとのコマンドは、ファイルを開くときのオプションを名前付きの引数で
  受け付けます (`load_pdb f.pdb, build2ndry=false`)。
- `fetch` は既定で mmCIF 形式で取得します。
- `render` は[レンダリング](../rendering.md)を実行します (GI または NPR)。実行中は **Stop** で止められます。
- `calc_elepot` は **Tools** メニューの静電ポテンシャル計算と同じ処理で、Settings に設定した
  APBS のパスを使います。`cut_surface` は分子表面の切断、`add_morph_frame` などはモーフィングの
  アニメーションを作るツールと同じ処理です。
- `superpose` は既定で US-align により重ね合わせます (`algo` で `SSM` / `LSQ` も選べます)。
  `pivot` で、US-align が残基の代表に使う原子 (`auto` / `CA` / `C3'` / `C4'` / `P`) を指定します
  (→ [Tools メニュー](../../menu/tools.md))。
- `animate` はアニメーションの再生・一時停止・停止・時刻の移動を行います。
- シーンのコマンド (`create_scene` / `switch_scene` / `close_scene`) はタブを開閉・切り替えます。
  `close_scene` は、変更が保存されていないシーンは閉じません。`discardChanges=true` を付けると
  変更を捨てて閉じます。
- `quit` は CueMol3 を終了します。保存していない変更があれば確認が出ます。`quit force=true`
  (または `quit -f`) では確認せずに終了します。`exit` は `quit` と同じです。

## スクリプトとログ

- `run file` または `@file` で、コマンドを 1 行ずつ書いたテキストのファイルを実行します。
  スクリプト全体が 1 回の Undo にまとまります。
- `run file.qax` (または `@file.qax`) は、記録された操作のファイル (qax) を再生します。
  行にそれだけを書いた場合は、記録された操作ごとに 1 回の Undo になり、失敗した操作の
  ところで止まります。スクリプトの中から実行した場合は、スクリプト全体の Undo に含まれます
  (→ [操作の記録と再生](../actions.md))。
- `open_log` でファイル (既定は `log.qax`) を開くと、それ以降の実行で行われた操作が
  qax として記録されます。シーンを変えなかった実行は記録されません。`log` で書いた文は
  メモとして入ります。`close_log` で記録を終えます。
- `list_actions` は Undo の各ステップと、その中で行われた操作を古い順に表示します。
  `export_actions file[, first[, last]]` はその範囲を qax に書き出します。
- `.pml` (PyMOL のスクリプト) は CueMol モードでは実行できません。PyMOL 互換モードに切り替えて
  実行してください。

## ターミナルから使う (tritium_cli)

**tritium_cli** は、Console のコマンドをターミナルから実行するクライアントです。
CueMol3 に同梱されています。コマンドは起動中の CueMol3 の**アクティブなタブ**に対して実行されます。

```
tritium_cli [--dialect native|pymol] [--echo] [--no-launch] [-c COMMANDS | SCRIPT]
```

- 引数なしで起動すると対話モードになります。プロンプトは `CueMol <ディレクトリ> ❯`
  (PyMOL 互換モードでは `pymol <ディレクトリ> ❯`) で、++tab++ で補完、++ctrl+c++ で実行中の
  コマンドを止め、`native` / `pymol` でモードを切り替え、`exit` または ++ctrl+d++ で終了します。
  `quit` は CueMol3 を終了してから tritium_cli も終了します。
- ++tab++ の補完はパネルと同じで、2 回目の ++tab++ で候補のメニューになります。`help` の
  表示はターミナルの幅で折り返されます (パイプに出力するときは Markdown のまま出ます)。
- `-c` でコマンドを、または引数にスクリプトのファイルを渡すと、それを実行して終了します。
  `.qax` のファイルを渡すと、記録された操作を再生します。
  パイプから流し込むこともできます。失敗したときの終了ステータスは 1 です。
- `--echo` は、実行する各コマンドを出力の前に表示します。
- 相対パスは、tritium_cli を実行したディレクトリを基準に解決されます。
- 実行したコマンドは CueMol3 の Console タブにも `[cli]` を付けて表示されます。

### 接続

CueMol3 が起動していなければ、tritium_cli が起動して待ちます (`--no-launch` で抑止)。
この場合は、その回に限りコマンドラインからの実行が許可されます。

すでに起動している CueMol3 に接続するには、**Settings &gt; Plugins &gt; Console** の
**Command line access** を ON にします (既定は OFF)。接続先のポートとトークンは
`~/.cuemol/local-api.json` から読み取られます。

### PATH に通す

**Settings &gt; Plugins &gt; Console** の **Command line tool** に、同梱の tritium_cli の
パスが表示されます (**Copy** でコピーできます)。

| OS | 方法 |
|---|---|
| macOS | 表示されたパスを PATH 上のディレクトリにリンクします (`ln -s "<パス>" ~/.local/bin/tritium_cli`) |
| Windows | 表示された `tritium_cli.cmd` のあるディレクトリを PATH に加えます |
| Linux (.deb) | `/usr/bin/tritium_cli` にインストールされます |
| Linux (AppImage) | 使えません。tritium_cli を使う場合は .deb をインストールしてください |

### ステータスバーの CLI

Console が有効なとき、ステータスバーの右側に **CLI** が表示されます。クリックすると、
コマンドラインからの接続の状態 (Off / Starting / Ready / Running / Error) と、
**Command line access** と同じ切り替えスイッチ、tritium_cli のパスのコピー (**Copy path**) が
表示されます。

## 制限事項

- シーンのコマンド (`create_scene` / `switch_scene` / `close_scene`) と `quit` / `exit` は、スクリプトの中では使えません。
- Python は受け付けません。`.py` / `.pym` のスクリプトや、`/` で始まる行は拒否されます。
- AI Agent の指示や [MCP Server](mcp-server.md) の呼び出しを実行している間は、コマンドを
  実行できません。

## 関連項目

- [PyMOL 互換モード](pymconsole.md) / [MCP Server](mcp-server.md) / [AI Agent](ai-agent.md)
- [プラグイン](index.md) / [設定項目](../settings.md#plugins)
- [選択式の文法](../selection.md)
- [操作の記録と再生](../actions.md)
- [下部パネル](../../ui/bottom-panels.md)

---

*確認対象: CueMol3 2.4.0.546*
