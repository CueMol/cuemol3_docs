<!-- source: ja/reference/tools/surface-cutter.md @ 773364a -->

# Cutting a molecular surface (Mol surface cutter)

Cuts a molecular surface (MolSurfObj) with a plane and creates a cross section.
Choose **Tools &gt; Mol surface cutter...** to open the **Mol surface cutter** dialog.

!!! info "Screenshot planned"

<!-- TODO(screenshot): a molecular surface cut by the slab, and the surface after cutting -->

## Defining the cutting plane

The cutting plane is the **near slab plane** of the molecular view. Before opening the dialog, adjust the viewing direction, the viewpoint position and the slab so that the slab cuts the surface and you can see inside
(see [Mouse and trackpad input](../../ui/mouse-input.md)).

## Dialog items

| Item | Default | Description |
|---|---|---|
| **Target surface** | — | The molecular surface Object to cut |
| **Cross section** | Complete | How the cross section is handled (see the table below) |
| **Section mesh density (/A)** | 5.0 | Density of the triangle mesh created for the cross section. A larger value gives a finer mesh but takes longer to compute |

The choices for **Cross section** are as follows.

| Cross section | Description |
|---|---|
| **Complete** | Puts the cut surface and the cross section in the same Object |
| **Separately** | Puts the cut surface and the cross section in separate Objects. The cross section becomes a new Object named `sect_<original name>`. Use this when you want to color only the cross section differently |
| **Section only** | Keeps only the cross section |
| **No section** | Keeps only the cut surface (a surface with a hole and no cross section) |

## Running and the result

Click **OK** to cut the surface at the current slab plane. The cut can be undone with a single Undo.

Right after you click OK, the cut can overlap with the clipping by the slab, so it may look as if nothing happened.
Rotate the molecule or widen the slab to confirm that the surface has been cut.

If you save the scene as a `.qsc` file, the cut surface is saved in its cut state.

!!! warning "Save the scene before cutting"
    If you cut again with a plane that interferes with a surface that has already been cut, an error may occur and the cross section may not be created.

## Using it from the Console

In the native mode of the [Console](../plugins/console/index.md), `cut_surface` performs the same operation.
Use `mode` to specify how the cross section is handled (`full` / `separate` / `sect` / `body`)
(see [Console command list](../plugins/console/commands.md)).

## See also

- [Tools menu](../../menu/tools.md)
- [Generating a molecular surface](mol-surface.md) / [MolSurfObj (molecular surface)](../objects/molsurf.md)

---

*Verified against: CueMol3 2.4.0.546*
