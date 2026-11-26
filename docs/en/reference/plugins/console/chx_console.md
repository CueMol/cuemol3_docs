<!-- source: ja/reference/plugins/console/chx_console.md @ f8502b6 -->

# ChX console

**ChX console** is a ChimeraX-compatible console available in [Console](index.md).
It interprets a subset of the ChimeraX command language.
Commands and atom specifications you used in ChimeraX, such as `open 1crn` or `color byhetero`,
can be typed as they are. It was added in 3.0.0.554.

Full compatibility with ChimeraX is not a goal. The aim is that **commands you already know work**.
Commands are translated into CueMol operations before they run, so like other edits they are recorded in
[History](../../actions.md) and can be undone. Anything whose meaning does not match ChimeraX is refused with
a reason rather than replaced with something similar (`lighting` is the only exception; it is approximated with a warning).
A refused command is skipped with `Warning: <reason>; skipped`, and the rest of the script is run.

## Enabling the plugin

It is provided by the **ChX console** plugin, which is enabled by default together with the
**Console** plugin (→ [Plugins](../index.md)). Choose **ChimeraX** with the switch at the left end of the toolbar,
or type just `chimerax` on a line and run it, to switch to ChX console
(→ [Switching modes](index.md#switching-modes)).

Disabling **ChX console** in **Settings &gt; Plugins &gt; Installed** makes
**ChimeraX** in the switch and `--dialect chimerax` of tritium_cli unavailable.

## Input and completion

![ChX console: ChimeraX selected in the toolbar, with `help` run at the `ChX>` prompt](../../../../assets/images/reference/plugins/console/chx_console.webp){ width="649" .on-glb }

The prompt is `ChX&gt;`. The input history is separate from the other modes.

- Several commands can be written on one line, separated by `;`. From a `#` in the command-name position to the end of the line is a comment.
- Command names and keywords can be abbreviated by prefix, as in ChimeraX (`col` → `color`,
  `car` → `cartoon`; `c` becomes `camera`). Case is significant (`Open` is an unknown command).
- ++tab++ completes command names, keywords, argument values (choices, color names, etc.) and file names.
  After `#`, it completes model numbers together with the molecule names.
- **Each run becomes a single Undo step.**
- Keywords that are understood but not supported are ignored with a warning (the script continues).
- Commands, values and atom specifications that ChX console does not support are skipped with a warning.
  Commands that do not exist in ChimeraX either, syntax errors and the like stop the script there.

## Scripts

- `open file.cxc` runs a `.cxc` file containing ChimeraX commands.
- From a terminal, `tritium_cli file.cxc` also runs it (→ [tritium_cli](cli.md)).
- Files of recorded operations (`.qax`) and PyMOL scripts (`.pml`) cannot be run in ChX console.
  Switch to native mode or PyM console, respectively, to run them.

## Supported commands

The arguments of each command can be checked with `usage <command>` or `help <command>`.

| Category | Commands |
|---|---|
| Open, close, save | `open` / `alphafold fetch` / `close` (`close session`) / `delete` / `save` |
| Display | `show` / `hide` (`display` / `~show` / `~display`) / `cartoon` (`cartoon hide` / `cartoon style`) / `ribbon` / `~ribbon` / `nucleotides` / `style` / `size` / `surface` (`surface hidePatches` / `surface close` / `surface zone` / `surface unzone` / `~surface`) / `transparency` / `label` (`label delete` / `~label`) / `volume` (`volume zone` / `volume unzone`) / `unitcell` (`unitcell outline` / `unitcell delete`) |
| Color | `color` (`colour`) / `color byattribute` / `color bfactor` / `color modify` / `color list` / `rainbow` |
| View | `view` (`view name` / `view list` / `view delete` / `view matrix` / `view initial`) / `turn` / `move` / `zoom` / `cofr` / `camera` / `lighting` / `graphics` (`graphics silhouettes`) / `set` / `preset` / `wait` |
| Motion (animation) | `turn` (with `frames`) / `roll` / `rock` / `wobble` / `stop` |
| Selection | `select` (`select add` / `select subtract` / `select intersect` / `select clear` / `select zone` / `select up` / `select down` / `~select`) / `name` (`name list` / `name delete`) |
| Information and measurement | `info` (`info models` / `chains` / `residues` / `atoms`) / `distance` (`distance delete` / `~distance`) / `dssp` |
| Superposition | `align` / `matchmaker` (`mmaker`) |
| Other | `alias` (`alias list` / `alias delete` / `~alias`) / `undo` / `redo` / `usage` / `help` |

- `open` accepts structure and map files, PDB IDs (four characters, or `pdb:1abc`), URLs, `.cxc` scripts and
  `.qsc` scenes. PDB IDs are fetched in mmCIF format. Database prefixes such as `pdbe:` / `pdbj:` / `redo:` /
  `alphafold:` / `pubchem:` / `ccd:` / `emdb:` (or `fromDatabase`), `from eds` (the 2Fo-Fc map of a crystal structure),
  and `from rcsb_bio` / `pdbe_bio` (biological assemblies) can also be used.
  Several names can be listed in one `open`. What is opened gets the model numbers **#1**, **#2**, ...
  (as in ChimeraX, a closed number is reused for the next thing opened).
- Only the first `open` into an empty scene adjusts the view so that what was opened fits. The second and later
  `open` commands do not move the view (as in ChimeraX).
- Molecules opened with `open` are drawn following ChimeraX's automatic display (auto style). Depending on the size of the molecule,
  they are shown as a cartoon with sticks around ligands, or as spheres for all atoms, and so on, and colored by model and by element.
  Structures opened from AlphaFold DB are colored by prediction confidence (pLDDT).
- `show` / `hide` / `style` / `cartoon` / `color` / `surface` / `label` and similar commands operate only on the Renderers
  whose names start with `chx:`, which ChX console creates per molecule. They do not affect Renderers created in the GUI.
- `color` accepts color names, hexadecimal notation such as `#rrggbb`, and function forms such as `rgb()` / `hsl()` / `gray()`.
  `byhetero` / `byelement` / `bychain` / `bymodel` / `bynucleotide` / `fromatoms` /
  `fromcartoons` can also be used. `rainbow` and `color byattribute` accept `palette` to specify the sequence of colors
  (ColorBrewer palette names can also be used). The `alphafold` / `esmfold` / `pae` / `paegreen` / `paecontacts`
  palettes place colors at fixed values (such as pLDDT 0 to 100), as in ChimeraX.
- `surface` creates a molecular surface (dsurface) per chain, as in ChimeraX.
- `turn` with `frames` appends that rotation as an animation element at the end of the timeline and
  plays it once. `roll` / `rock` / `wobble` (and `turn ... rock N` / `turn ... wobble N`) add an element for
  one cycle when `frames` is not specified, and play it in a loop until `stop` (`stop` restores the
  loop setting). The loop repeats the whole timeline, so a warning is shown if there are other elements.
  Rotations become [SimpleSpin](../../animation/simplespin.md) elements and swings become [RockSpin](../../animation/rockspin.md)
  elements. Speed and phase only roughly match ChimeraX; they are not identical.
- `view` shows the specified items (the whole scene if omitted) so that they fit, without changing the orientation.
  Views saved with `view name` are saved as CueMol cameras.
- `distance` measures the distance between exactly two atoms.
- `align` is a least-squares fit that pairs atoms in order, and `matchmaker` superposes with US-align.
  The result of `matchmaker` may differ from ChimeraX, which uses a sequence alignment
  (a warning is shown each time it runs).
- `save` saves to `.png` (image), `.qsc` (scene), `.pdb` (one molecule) and `.stl`. It cannot save to `.cxs`.
- Aliases defined with `alias` remain valid until CueMol3 quits.

## Atom specification

ChimeraX atom specifications are **translated** into CueMol [selection expressions](../../selection.md) before they run.

| ChimeraX | CueMol |
|---|---|
| `#1`, `#1,3-5` (model) | Chooses molecules by model number. |
| `/A,B` | `chain A,B` |
| `:10-20,30`, `:10A` | `resi 10:20`, `resi 30`, `resi 10A` |
| `:ALA` | `resn ALA` |
| `@CA,CB` | `name CA,CB` |
| `all` / `protein` / `nucleic` / `ligand` / `solvent` / `helix` / `strand` / `coil` | `*` / `protein` / `nucleic` / `ligand` / `water` / `helix` / `sheet` / `coil` |
| `ions` | Metal and halogen atoms of ligand residues |
| `backbone` / `mainchain`, `sidechain` / `sideonly` | An expression listing atom names |
| Element symbols (`C`, `Fe`) | `elem Fe` |
| `sel` | The current selection of each molecule |
| Names (defined with `name`) | CueMol named selections |

- The operators `&` / `|` / `~` and parentheses can be used. Items separated by spaces form a union (`#1 #2`).
  Per-model specifications written one after another also form a union (`#1/k#2/o`).
- Wildcards (`*` / `?` / `[...]`) can be used for chains, residue names and atom names.
- Distance specifications (`@<5`, `:<5`, etc.) can be used. The boundary is "less than or equal to" in ChimeraX and "less than" in CueMol.
- Attribute specifications (`@@bfactor>50`, `@@occupancy`, `@@display`, `::polymer_type`, `::ss_type`, `::number`, etc.) can be
  used. Attributes that CueMol does not have are refused.
- Names defined with `name` can include models. A name whose expression differs per model can be used only within
  ChX console and is not saved in the scene.
- Sub-models (`#1.2`), quoted names and the like are not supported.

## Limitations

- As in ChimeraX, the style of hidden atoms is kept (after `style :ALA sphere` → `hide :ALA atoms` →
  `show :ALA atoms`, ALA is shown as spheres). However, when the scene is saved and reopened, the style of hidden
  atoms reverts to that of the automatic display (auto style).
- Transparency (`transparency`) is set per Renderer, so specifying only part of a molecule is refused.
- `frames` of `move` / `zoom` and similar commands does not animate; they move in one step (`turn` animates as described above).
- Model numbers are reassigned when the scene is saved and reopened.
- Coloring with `bypolymer` / `byidentity`, `color random`, `color zone`, `lighting model`, map arithmetic with `volume`
  (`volume gaussian`, etc.), `name frozen`, saving to `.cxs` and the like are not supported.

## See also

- [Console](index.md) / [PyM console](pymconsole.md) / [tritium_cli](cli.md)
- [Plugins](../index.md) / [Selection syntax](../../selection.md)
- [Recording and replaying operations](../../actions.md)

---

*Verified against: CueMol3 3.0.2.560*
