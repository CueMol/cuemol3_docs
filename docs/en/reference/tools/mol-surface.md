<!-- source: ja/reference/tools/mol-surface.md @ 773364a -->

# Generating a molecular surface (Mol surface generation)

Generates a molecular surface (solvent-excluded surface, SES) from a molecule.
Choose **Tools &gt; Mol surface generation...** to open the **Mol surface generation** dialog.
The generated surface becomes a [MolSurfObj (molecular surface)](../objects/molsurf.md) Object
and is displayed by the [molsurf](../renderers/molsurf.md) Renderer.

!!! info "Screenshot planned"

<!-- TODO(screenshot): Mol surface generation dialog -->

## Dialog items

### Target

| Item | Default | Description |
|---|---|---|
| **Molecule** | — | The molecule to build the surface for |
| **Use selection** / selection | OFF | When ON, the surface is built only for the part specified by the selection expression. The ▼ at the right end gives access to named selections, history and the selection builder |

!!! tip "Exclude water molecules"
    Crystal structures and similar data may contain water molecules. Unless a selection is used,
    the surface is calculated for all atoms, including waters and substrates. To build it for the protein only,
    turn **Use selection** ON and specify `protein`; for chain A only, specify `chain A`.

### Surface

| Item | Default | Description |
|---|---|---|
| **Object name** | `sf_<molecule name>` | Name of the surface Object to be created. Filled in automatically when a molecule is chosen |
| **Point density (/A)** | 2 | Fineness of the surface (1 to 10). A higher value gives a finer surface, but the calculation takes longer and memory use and file size also increase |
| **Probe radius (A)** | 1.4 | Radius (Å) of the probe used to calculate the surface. The default is the radius of a water molecule |
| **Algorithm** | Auto | Method used to calculate the surface (Auto / MeshMS / BALL) |

- For a small molecule of about 10 kDa, raising Point density to about 5 gives a smoother surface.
  For a large molecule over 100 kDa, a lower value calculates faster.
- For the differences between the **Algorithm** options, see [MolSurfObj generation algorithm](../objects/molsurf.md#生成アルゴリズム-algorithm).
  The default *Auto* uses MeshMS and switches to BALL if it fails.

## Running and the result

Pressing **OK** creates the surface Object (MolSurfObj) and the `molsurf` Renderer that displays it.
The generation can be reverted with a single Undo.

- The molsurf Renderer refers to the source molecule and is colored with CPK. From the Color panel,
  the coloring can be changed to Paint / CPK / Rainbow and so on, in the same way as for other molecule Renderers
  (→ [Coloring](../coloring.md)).
- Each time a surface is generated, the algorithm used, the elapsed time, and the numbers of vertices and faces are written to the log in the Output panel.
- The generated surface is saved together with the scene when the scene is saved as `.qsc`.

## Regenerating a surface (Regenerate surface)

Right-click a MolSurfObj in the scene tree and choose **Regenerate surface…** to open the **Regenerate surface**
dialog. The same surface can be regenerated with a different **Point density (/A)** and **Algorithm**.

- The source molecule, selection and probe radius are only displayed and cannot be changed. To change them,
  create a new surface with Mol surface generation.
- If the source molecule is not in the scene (for example, a surface loaded from a file), the items cannot be selected.
- Regenerating with only the density changed finishes quickly
  (→ [MolSurfObj](../objects/molsurf.md#生成アルゴリズム-algorithm)).

## Using from the Console

In the native mode of the [Console](../plugins/console/index.md), a surface is generated with `create_surface`
and regenerated with `recalc_surface` (→ [Console command list](../plugins/console/commands.md)).

## See also

- [Tools menu](../../menu/tools.md)
- [MolSurfObj (molecular surface)](../objects/molsurf.md) / [molsurf](../renderers/molsurf.md)
- [Cutting a molecular surface](surface-cutter.md) / [Calculating the electrostatic potential](apbs.md)
- [Coloring a molecular surface by electrostatic potential](../../tutorials/surface-elepot.md)

---

*Verified against: CueMol3 2.4.0.546*
