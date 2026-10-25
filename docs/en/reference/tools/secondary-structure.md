<!-- source: ja/reference/tools/secondary-structure.md @ 773364a -->

# Assigning secondary structure (Reassign secondary structure)

Renderers such as cartoon and ribbon draw their shapes based on the secondary structure of the protein.
This page explains how secondary structure is assigned and how to change the assignment with
**Tools &gt; Reassign secondary str...**.

!!! info "Screenshot planned"

<!-- TODO(screenshot): Reassign secondary structure dialog (with Mode set to Assign) -->

## Assignment when a file is loaded

When the **Calculate secondary structure** option in the **&lt;format&gt;-specific options** shown while
opening a PDB / mmCIF file is ON (the default), the secondary structure is calculated automatically
from the coordinates after loading. The calculation uses the DSSP algorithm
(see [Loading and displaying a structure](../../tutorials/basic/loading.md)).

When it is OFF, the secondary structure is set according to the HELIX / SHEET records in the file.
For a file that has no such records, no secondary structure is assigned.

## The Reassign secondary structure dialog

Open the **Reassign secondary structure** dialog with **Tools &gt; Reassign secondary str...**.
Choose the target molecule in **Molecule**, and the operation in **Mode**.

| Mode | Description |
|---|---|
| **Recalculate** (default) | Redoes the automatic secondary structure assignment |
| **Assign** | Assigns the specified secondary structure to the selected part |

### Recalculate (rerun the automatic assignment)

Recalculates the secondary structure with the same DSSP algorithm as when a file is loaded.

| Item | Default | Description |
|---|---|---|
| **Ignore β bulge** | OFF | Ignores β bulges in the calculation |
| **Helix gap-fill angle (°)** / **Angle** | OFF / 120 | The angle used to fill gaps in helices. **Angle** can be set only when the switch is ON |

<!-- TODO(content): Details of how Ignore β bulge and Helix gap-fill angle are judged (to be written from the C++ calcProt2ndry2 implementation) -->


### Assign (manual assignment)

| Item | Description |
|---|---|
| Selection | The selection expression for the part whose assignment is to be changed. The ▼ at the right end gives access to named selections, history and the selection builder |
| **Type** | The secondary structure to assign. The default is Coil |

The following can be chosen for **Type**.

| Type | Description |
|---|---|
| Coil | Removes the secondary structure |
| β strand | Makes it a β strand |
| α helix | Makes it an α helix |
| 3-10 helix | Makes it a 3<sub>10</sub> helix |
| π helix | Makes it a π helix |

For example, with the selection `*` and Type set to Coil, all secondary structure information is removed.
If you do not like the automatic assignment, you can use this method to change regions to β strands or
α helices.

!!! warning "Avoid extreme assignments"
    You can make a region that is not geometrically a β strand into a β strand, but cartoon and ribbon
    may then take on abnormal shapes. Avoid extreme changes such as making the whole molecule β strands,
    and save the scene before changing the assignment.

## Running and the result

When you press **OK**, the secondary structure of the molecule is rewritten and the change is reflected
in displays such as cartoon.
Both Recalculate and Assign can be undone with a single Undo.

A manually changed secondary structure is saved along with the scene when you save it to a `.qsc` file,
and is kept the next time the scene is opened.

## Using it from the Console

In the native mode of the [Console](../plugins/console/index.md), `set_secondary_structure` performs the
same operation. If the selection is omitted, the automatic assignment is redone; if a selection is
given, `type` (`coil` / `strand` / `helix` / `helix310` / `helixpi`) is assigned to that part.

## See also

- [Tools menu](../../menu/tools.md)
- [cartoon](../renderers/cartoon.md) / [ribbon](../renderers/ribbon.md)
- [Selection expression syntax](../selection.md)

---

*Verified against: CueMol3 2.4.0.546*
