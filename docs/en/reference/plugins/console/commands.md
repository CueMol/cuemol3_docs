<!-- source: ja/reference/plugins/console/commands.md @ 53a8286 -->

# Console command list

This is the list of commands available in the **native mode** of the [Console](index.md). For the syntax, see
[Native mode syntax](index.md#writing-native-mode-commands); for the arguments of each command, run
`help <command>` in the Console.

## List by topic

Commands are grouped by `help` topic. Names in parentheses are short aliases for the same operation. Type a command by the name or an alias in this table.
Prefix abbreviations (such as `open` for `open_log`) are not run (++tab++ completes them).

| Topic (`help <topic>`) | Commands |
|---|---|
| Scenes and tabs (`tabs`) | `list_scenes` (`scenes`) / `create_scene` / `switch_scene` / `close_scene` |
| Objects and the scene tree (`nodes`) | `get_scene_state` (`scene`) / `set_visible` (`show` / `hide`) / `delete_node` (`delete`) / `rename_node` (`rename`) / `focus_node` / `focus_nodes` (`focus`) / `move_node` / `copy_node` / `paste_node` |
| Undo and actions (`edit`) | `undo` / `redo` / `clear_undo` / `list_actions` / `export_actions` |
| Renderers (`renderers`) | `list_renderer_types` / `create_renderer` / `create_preset_renderer` / `set_renderer_selection` / `set_renderer_type` (`retype`) / `list_renderer_styles` / `apply_renderer_style` (`style`) / `set_renderer_styles` / `create_group` |
| Colouring (`coloring`) | `list_coloring_styles` / `set_renderer_coloring` / `set_coloring_prop` / `add_paint` / `add_paint_at` / `list_paint` / `set_paint` / `remove_paint` / `move_paint` / `clear_paint` / `set_default_color` / `set_elepot_coloring` / `set_multigrad_nodes` |
| Style sets (`styles`) | `create_style_set` / `delete_style_set` / `set_style_readonly` / `load_style_file` / `save_style_file` / `define_color` / `remove_color` / `remove_selection` / `remove_style` |
| Selections (`selections`) | `list_chains` / `list_residues` / `count_selection` (`count`) / `set_mol_selection` (`select`) / `define_selection` (`define`) |
| View and cameras (`viewing`) | `rotate_view` (`turn`) / `set_view` (`view` / `slab` / `fit_slab`) / `set_bgcolor` / `focus_selection` (`zoom` / `center`) / `orient_view` / `pan_view` (`pan`) / `set_projection` (`projection`) / `list_cameras` (`cameras`) / `save_camera` (`save_view`) / `apply_camera` (`restore_view`) / `delete_camera` / `rename_camera` / `move_camera` / `set_camera_visibility` / `clear_camera_visibility` / `load_camera_file` / `save_camera_file` / `reload_camera` |
| Properties (`properties`) | `list_node_props` (`props`) / `get_prop` (`get`) / `set_prop` (`set`) / `set_node_prop` / `reset_prop` |
| Molecule editing (`molecule`) | `superpose` / `delete_atoms` / `rename_chain` / `renumber_residues` / `merge_molecules` / `set_secondary_structure` / `add_bond` / `remove_bond` / `set_symmetry` / `show_symmetry` / `create_symmetry_copy` / `show_unit_cell` / `set_atom_label` / `set_atom_labels` |
| Surfaces (`surfaces`) | `create_surface` / `recalc_surface` / `calc_elepot` / `cut_surface` |
| Measurement and analysis (`analysis`) | `measure_geometry` / `measure_selections` / `analyze_interactions` / `list_interactions` / `remove_interaction` |
| Density maps (`maps`) | `fetch_map` / `fetch_emdb` / `fetch_map_url` / `list_map_contours` / `set_map_contour` (`contour`) / `create_surface_from_map` / `recenter_map` / `load_mtz` / `load_ccp4` |
| Animation (`animation`) | `animate` / `list_anims` / `add_anim` / `remove_anim` / `move_anim` / `set_anim_time` / `set_anim_prop` / `list_anim_props` (`anim_props`) / `set_anim_options` / `reset_anim_prop` / `set_anim_generic_prop` / `list_morph_frames` / `add_morph_frame` / `remove_morph_frame` / `convert_to_morph` / `set_frame` / `list_traj_blocks` / `remove_traj_block` / `move_traj_block` |
| Files and images (`files`) | `fetch_pdb` (`fetch`) / `fetch_entry` / `fetch_url` / `load_file` (`load`) / `load_pdb` / `load_mmcif` / `load_msms` / `load_psf` / `load_amber` / `load_trajectory` / `add_traj_block` / `save_scene` (`save`) / `save_object` (`write`) / `export_scene` / `export_image` / `render_image` (`render`) / `set_render_settings` |
| Console (`console`) | `cd` / `pwd` / `ls` / `run` / `open_log` / `close_log` / `log` / `help` / `quit` / `exit` |

The MD trajectory commands (`load_trajectory` and so on) are available only when the **MD Tools** plugin is enabled
(→ [MD trajectories](#md-trajectories)).

## Notes on individual commands

- `load` detects the format and loads the file in the same way as **File &gt; Open**. A `.qsc` file is opened as a scene.
  Format-specific commands such as `load_pdb` accept the options used when opening a file as named
  arguments (`load_pdb f.pdb, build2ndry=false`). They do not detect the format; the file is always read as that format.
- When a molecule is loaded without specifying a Renderer (`load` / `fetch`, etc.), it is drawn in a PyMOL-like display:
  proteins as ribbon, nucleic acids as nucl, ligands containing carbon as ballstick (sticks), other ligands as
  cpk (spheres), and water as simple. When a Renderer is specified, the molecule is drawn with that one Renderer.
- `fetch` retrieves the file in mmCIF format by default. It accepts the same loading options as the **File &gt; Open** dialog
  (`build2ndry` / `loadAltConf`, etc.) as named arguments.
- `save` accepts the same save options as **Save As** (`embedAll` / `version` / `compress` / `base64`).
  When several commands are run together, putting `save` last saves the scene after the earlier changes are committed.
  No other command can follow `save`.
- `set_bgcolor` sets the background colour (`set_bgcolor white`; the same as `set bgcolor, white`).
- `focus` (`focus_nodes`), given several Objects or Renderers, fits all of them in the view
  (the same as selecting several in the scene tree and pressing **Focus**). `zoom` / `center` (`focus_selection`)
  fit the view to the atoms matching a selection expression. They do not change the selection of the Object.
- `orient_view` turns the view so that the principal axes of the atoms matching a selection expression line up with the screen axes, and fits them in the view.
- `copy_node` takes out the contents of an Object, Renderer or Renderer group, which can be pasted into another Object with `paste_node`
  (the same as copy &amp; paste in the GUI). `paste_node` can also paste animation elements
  (`before` specifies the element at the insertion position; if omitted, the element is appended at the end).
- `load_psf` opens a CHARMM / NAMD topology (`.psf`). `coordFile` specifies NAMD coordinates (`.coor`);
  if omitted, the molecule has no coordinates.
- Specifying `rock` as the `type` of `add_anim` adds a [RockSpin](../../animation/rockspin.md) element.
- `set_frame` shows one frame of a morphing animation or an MD trajectory (it is not recorded in Undo).
- `fetch_emdb` fetches a cryo-EM map from EMDB. Specify an EMDB ID (such as `EMD-11638`) or the
  PDB ID of a cryo-EM structure (for a PDB ID, the first map of that entry). The source can be chosen from wwPDB (default) /
  EBI / PDBj. The display is the same as when fetched with **Get PDB**
  (→ [Fetching from the PDB](../../get-pdb.md#cryo-em-maps)).
- `fetch_entry` fetches a structure by database (`pdb` (RCSB) / `pdbe` / `pdbj` / `redo` (PDB-REDO) / `alphafold` /
  `pubchem` / `ccd`) and ID. For `alphafold` specify a UniProt accession, for `pubchem` a
  compound ID (CID), and for `ccd` the CCD code of a ligand (such as `ATP`) (→ [Fetching from the PDB](../../get-pdb.md)).
- `fetch_map_url` fetches a CCP4 / MRC map at a URL (`.map` / `.mrc` / `.ccp4`, also compressed with
  `.gz`). Cryo-EM maps are shown as isosurfaces, and crystallographic maps as contours.
- `render` runs [rendering](../../rendering.md) (GI or NPR). It can be stopped with **Stop** while running.
- `calc_elepot` performs the same processing as the electrostatic potential calculation in the **Tools** menu and uses
  the APBS path set in Settings. `cut_surface` cuts a molecular surface, and `add_morph_frame` and the like perform the same
  processing as the tool for creating morphing animations.
- `superpose` superposes with US-align by default (`algo` can also select `SSM` / `LSQ`).
  With `recenter=true`, after superposing, the view is fitted to the superposed atoms of the moved molecule.
  `pivot` specifies the atom that US-align uses to represent each residue (`auto` / `CA` / `C3'` / `C4'` / `P`)
  (→ [Superposing molecules](../../tools/superpose.md)). As the result, it prints the RMSD, the number of aligned residues (atoms for LSQ)
  and the rotation angle. With US-align it also prints the TM-score and the sequence identity.
- `animate` plays, pauses and stops an animation and moves to a given time.
- `list_anim_props` lists the properties of an animation element, with the names and values that `set_anim_prop` takes.
  Giving `set_anim_prop` a name that does not exist for `rend` / `endcam` / `mol` is an error.
  `list_anims` marks an element whose target Renderer or the like cannot be found.
- The scene commands (`create_scene` / `switch_scene` / `close_scene`) open, close and switch tabs.
  `close_scene` does not close a scene with unsaved changes. Add `discardChanges=true` to
  discard the changes and close it.
- `quit` exits CueMol3. If there are unsaved changes, a confirmation is shown. `quit force=true`
  (or `quit -f`) exits without confirmation. `exit` is the same as `quit`.

## MD trajectories

When the **MD Tools** plugin is enabled (→ [Plugins](../index.md)), the following commands for MD trajectories
are added. **File &gt; Open MD Trajectory...**, dropping files, and editing blocks in the
[Trajectory panel](../../../ui/bottom-panels/trajectory.md) are recorded in History as these commands
(→ [Recording and replaying operations](../../actions.md)).

| Command | Action |
|---|---|
| `load_trajectory` | Opens a topology file (`.gro` / `.prmtop` / `.parm7` / `.psf`) with trajectory and coordinate files. The frames follow one another in the order given. |
| `add_traj_block` | Adds files as blocks to a molecule or trajectory that is open. An ordinary molecule becomes a trajectory, and its original coordinates remain as the first frame. With `replace=true`, the files replace the existing frames. |
| `list_traj_blocks` | Lists the blocks (file, format, number of frames, first frame). Blocks are numbered from 0. |
| `remove_traj_block` | Removes one block. |
| `move_traj_block` | Moves a block earlier (negative) or later (positive) by `by` places, which reorders the frames. |

- Trajectory and coordinate files can be given several at a time, or as a pattern such as `*.xtc`.
- `reader` specifies the format (if omitted, it is detected from the extension). With `nevery`, only one frame in
  every N of each file is read.
- With a selection expression in `loadSel`, only those atoms are read. The other atoms are removed from the molecule,
  so reading without the solvent saves memory.

## See also

- [Console](index.md) / [tritium_cli](cli.md) / [PyM console](pymconsole.md) / [ChX console](chx_console.md)
- [MCP Server](../mcp-server.md) — the same operations can be called as tools.
- [Recording and replaying operations](../../actions.md)

---

*Verified against: CueMol3 3.0.7.578*
