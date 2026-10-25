<!-- source: ja/reference/plugins/console/commands.md @ 773364a -->

# Console command list

This is the list of commands available in the **native mode** of the [Console](index.md). For the syntax, see
[Native mode syntax](index.md#writing-native-mode-commands); for the arguments of each command, run
`help <command>` in the Console.

## List by topic

Commands are grouped by `help` topic. Names in parentheses are short aliases for the same operation.

| Topic (`help <topic>`) | Commands |
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

## Notes on individual commands

- `load` detects the format and loads the file in the same way as **File &gt; Open**. A `.qsc` file is opened as a scene.
  Format-specific commands such as `load_pdb` accept the options used when opening a file as named
  arguments (`load_pdb f.pdb, build2ndry=false`).
- `fetch` retrieves the file in mmCIF format by default.
- `render` runs [rendering](../../rendering.md) (GI or NPR). It can be stopped with **Stop** while running.
- `calc_elepot` performs the same processing as the electrostatic potential calculation in the **Tools** menu and uses
  the APBS path set in Settings. `cut_surface` cuts a molecular surface, and `add_morph_frame` and the like perform the same
  processing as the tool for creating morphing animations.
- `superpose` superposes with US-align by default (`algo` can also select `SSM` / `LSQ`).
  `pivot` specifies the atom that US-align uses to represent each residue (`auto` / `CA` / `C3'` / `C4'` / `P`)
  (→ [Superposing molecules](../../tools/superpose.md)).
- `animate` plays, pauses and stops an animation and moves to a given time.
- The scene commands (`create_scene` / `switch_scene` / `close_scene`) open, close and switch tabs.
  `close_scene` does not close a scene with unsaved changes. Add `discardChanges=true` to
  discard the changes and close it.
- `quit` exits CueMol3. If there are unsaved changes, a confirmation is shown. `quit force=true`
  (or `quit -f`) exits without confirmation. `exit` is the same as `quit`.

## See also

- [Console](index.md) / [tritium_cli](cli.md) / [PyMOL compatibility mode](pymconsole.md)
- [MCP Server](../mcp-server.md) — the same operations can be called as tools
- [Recording and replaying operations](../../actions.md)

---

*Verified against: CueMol3 2.4.0.546*
