# Console のコマンド一覧

[Console](index.md) の **native モード**で使えるコマンドの一覧です。書き方は
[native モードの書き方](index.md#native-モードの書き方)を、各コマンドの引数は Console で
`help <コマンド>` を参照してください。

## 項目ごとの一覧

`help` の項目ごとに並べます。括弧内は同じ操作の短い別名です。コマンドはこの表の名前か別名で
打ちます。前方一致の省略形 (`open` で `open_log` など) は実行されません (++tab++ では補完できます)。

| 項目 (`help <項目>`) | コマンド |
|---|---|
| Scenes and tabs (`tabs`) | `list_scenes` (`scenes`) / `create_scene` / `switch_scene` / `close_scene` |
| Objects and the scene tree (`nodes`) | `get_scene_state` (`scene`) / `set_visible` (`show` / `hide`) / `delete_node` (`delete`) / `rename_node` (`rename`) / `focus_node` / `focus_nodes` (`focus`) / `move_node` / `copy_node` / `paste_node` |
| Undo and actions (`edit`) | `undo` / `redo` / `clear_undo` / `list_actions` / `export_actions` |
| Renderers (`renderers`) | `list_renderer_types` / `create_renderer` / `create_preset_renderer` / `set_renderer_selection` / `set_renderer_type` (`retype`) / `list_renderer_styles` / `apply_renderer_style` (`style`) / `set_renderer_styles` / `create_group` |
| Colouring (`coloring`) | `list_coloring_styles` / `set_renderer_coloring` / `set_coloring_prop` / `add_paint` / `add_paint_at` / `list_paint` / `set_paint` / `remove_paint` / `move_paint` / `clear_paint` / `set_default_color` / `set_elepot_coloring` / `set_multigrad_nodes` |
| Style sets (`styles`) | `create_style_set` / `delete_style_set` / `set_style_readonly` / `load_style_file` / `save_style_file` / `define_color` / `remove_color` / `remove_selection` / `remove_style` |
| Selections (`selections`) | `list_chains` / `list_residues` / `count_selection` (`count`) / `set_mol_selection` (`select`) / `define_selection` (`define`) |
| View and cameras (`viewing`) | `rotate_view` (`turn`) / `set_view` (`view` / `slab` / `fit_slab`) / `focus_selection` (`zoom` / `center`) / `orient_view` / `pan_view` (`pan`) / `set_projection` (`projection`) / `list_cameras` (`cameras`) / `save_camera` (`save_view`) / `apply_camera` (`restore_view`) / `delete_camera` / `rename_camera` / `move_camera` / `set_camera_visibility` / `clear_camera_visibility` / `load_camera_file` / `save_camera_file` / `reload_camera` |
| Properties (`properties`) | `list_node_props` (`props`) / `get_prop` (`get`) / `set_prop` (`set`) / `set_node_prop` / `reset_prop` |
| Molecule editing (`molecule`) | `superpose` / `delete_atoms` / `rename_chain` / `renumber_residues` / `merge_molecules` / `set_secondary_structure` / `add_bond` / `remove_bond` / `set_symmetry` / `show_symmetry` / `create_symmetry_copy` / `show_unit_cell` / `set_atom_label` / `set_atom_labels` |
| Surfaces (`surfaces`) | `create_surface` / `recalc_surface` / `calc_elepot` / `cut_surface` |
| Measurement and analysis (`analysis`) | `measure_geometry` / `measure_selections` / `analyze_interactions` / `list_interactions` / `remove_interaction` |
| Density maps (`maps`) | `fetch_map` / `fetch_emdb` / `fetch_map_url` / `list_map_contours` / `set_map_contour` (`contour`) / `create_surface_from_map` / `recenter_map` / `load_mtz` / `load_ccp4` |
| Animation (`animation`) | `animate` / `list_anims` / `add_anim` / `remove_anim` / `move_anim` / `set_anim_time` / `set_anim_prop` / `set_anim_options` / `reset_anim_prop` / `set_anim_generic_prop` / `list_morph_frames` / `add_morph_frame` / `remove_morph_frame` / `convert_to_morph` / `set_frame` |
| Files and images (`files`) | `fetch_pdb` (`fetch`) / `fetch_entry` / `fetch_url` / `load_file` (`load`) / `load_pdb` / `load_mmcif` / `load_msms` / `load_psf` / `load_amber` / `save_scene` (`save`) / `save_object` (`write`) / `export_scene` / `export_image` / `render_image` (`render`) / `set_render_settings` |
| Console (`console`) | `cd` / `pwd` / `ls` / `run` / `open_log` / `close_log` / `log` / `help` / `quit` / `exit` |

## コマンドごとの補足

- `load` は **File &gt; Open** と同じように形式を判別して読み込みます。`.qsc` はシーンとして開きます。
  `load_pdb` などの形式ごとのコマンドは、ファイルを開くときのオプションを名前付きの引数で
  受け付けます (`load_pdb f.pdb, build2ndry=false`)。形式は判別せず、常にその形式として読み込みます。
- Renderer を指定せずに分子を読み込むと (`load` / `fetch` など)、PyMOL に近い表示で描きます。
  タンパク質は ribbon、核酸は nucl、炭素を含むリガンドは ballstick (棒)、それ以外のリガンドは
  cpk (球)、水は simple です。Renderer を指定したときは、その Renderer 1 つで描きます。
- `fetch` は既定で mmCIF 形式で取得します。**File &gt; Open** のダイアログと同じ読み込みのオプション
  (`build2ndry` / `loadAltConf` など) を名前付きの引数で受け付けます。
- `save` は **Save As** と同じ保存のオプション (`embedAll` / `version` / `compress` / `base64`) を
  受け付けます。
- `focus` (`focus_nodes`) は、Object や Renderer を複数並べると、すべてが収まるように表示します
  (シーンツリーで複数選んで **Focus** を押したときと同じです)。`zoom` / `center` (`focus_selection`)
  は、選択式に一致する原子に合わせて表示します。Object の選択は変えません。
- `orient_view` は、選択式に一致する原子の主軸が画面の軸に沿うように向きを変えて表示します。
- `copy_node` は Object・Renderer・Renderer グループの内容を取り出し、`paste_node` で別の Object に
  貼り付けられます (GUI のコピー &amp; ペーストと同じです)。`paste_node` はアニメーションの要素も
  貼り付けられます (`before` で挿入位置の要素を指定します。省略すると末尾)。
- `load_psf` は CHARMM / NAMD のトポロジー (`.psf`) を開きます。`coordFile` で NAMD の座標 (`.coor`) を
  指定でき、省略すると座標の無い分子になります。
- `add_anim` の `type` に `rock` を指定すると、[RockSpin](../../animation/rockspin.md) の要素を追加します。
- `set_frame` は、モーフィングや MD トラジェクトリの 1 フレームを表示します (Undo には残りません)。
- `fetch_emdb` は EMDB の電顕マップを取得します。EMDB ID (`EMD-11638` など) か、電顕構造の
  PDB ID を指定します (PDB ID の場合は、そのエントリの最初のマップ)。取得元は wwPDB (既定) /
  EBI / PDBj から選べます。表示は **Get PDB** で取得したときと同じです
  (→ [PDB からの取得](../../get-pdb.md#cryo-em-maps))。
- `fetch_entry` は、データベース (`pdb` (RCSB) / `pdbe` / `pdbj` / `redo` (PDB-REDO) / `alphafold` /
  `pubchem` / `ccd`) と ID を指定して構造を取得します。`alphafold` は UniProt accession、`pubchem` は
  化合物の ID (CID)、`ccd` はリガンドの CCD コード (`ATP` など) で指定します (→ [PDB からの取得](../../get-pdb.md))。
- `fetch_map_url` は、URL にある CCP4 / MRC 形式のマップ (`.map` / `.mrc` / `.ccp4`、`.gz` で
  圧縮したものも可) を取得します。電顕マップは等値面で、結晶学的マップは等高線で表示します。
- `render` は[レンダリング](../../rendering.md)を実行します (GI または NPR)。実行中は **Stop** で止められます。
- `calc_elepot` は **Tools** メニューの静電ポテンシャル計算と同じ処理で、Settings に設定した
  APBS のパスを使います。`cut_surface` は分子表面の切断、`add_morph_frame` などはモーフィングの
  アニメーションを作るツールと同じ処理です。
- `superpose` は既定で US-align により重ね合わせます (`algo` で `SSM` / `LSQ` も選べます)。
  `recenter=true` を付けると、重ね合わせたあと、動かした分子の重ね合わせた原子に合わせて表示します。
  `pivot` で、US-align が残基の代表に使う原子 (`auto` / `CA` / `C3'` / `C4'` / `P`) を指定します
  (→ [分子の重ね合わせ](../../tools/superpose.md))。
- `animate` はアニメーションの再生・一時停止・停止・時刻の移動を行います。
- シーンのコマンド (`create_scene` / `switch_scene` / `close_scene`) はタブを開閉・切り替えます。
  `close_scene` は、変更が保存されていないシーンは閉じません。`discardChanges=true` を付けると
  変更を捨てて閉じます。
- `quit` は CueMol3 を終了します。保存していない変更があれば確認が出ます。`quit force=true`
  (または `quit -f`) では確認せずに終了します。`exit` は `quit` と同じです。

## 関連項目

- [Console](index.md) / [tritium_cli](cli.md) / [PyM console](pymconsole.md) / [ChX console](chx_console.md)
- [MCP Server](../mcp-server.md) — 同じ操作をツールとして呼び出せます
- [操作の記録と再生](../../actions.md)

---

*確認対象: CueMol3 3.0.2.560*
