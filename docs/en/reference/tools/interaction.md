<!-- source: ja/reference/tools/interaction.md @ 773364a -->

# Extracting interactions (Interaction)

This tool automatically extracts intramolecular and intermolecular atomic contacts (candidate interactions such as hydrogen bonds) and displays them as lines and labels of a measurement display ([atomintr](../renderers/atomintr.md)).
Open the **Interaction analysis** dialog with **Tools &gt; Interaction...**.

!!! info "Screenshot planned"

<!-- TODO(screenshot): Interaction analysis dialog, and an example of the extracted interactions -->

## Dialog items

### Molecule

| Item | Default | Description |
|---|---|---|
| Molecule / selection | — | The molecule to extract interactions from, and the part of it to target. If the selection is empty, all atoms are targeted |
| **Second molecule** | OFF | When ON, you can choose a second molecule. Interactions between the first selection and the second molecule are extracted |
| **Second selection** | OFF | When ON, you can specify a second selection. Only interactions spanning the first selection and the second selection are extracted |

The second selection applies to the second molecule if Second molecule is ON, and to the first molecule if it is OFF. If you choose the same molecule as the first one for the second molecule, the second molecule setting is ignored.

### Parameters

| Item | Default | Description |
|---|---|---|
| **Min distance (A)** | 2.5 | Minimum distance (Å) to count as an interaction |
| **Max distance (A)** | 3.5 | Maximum distance (Å) to count as an interaction. Must be larger than Min distance |
| **Max labels** | 30 | Maximum number of interactions to extract (1 to 1000) |
| **Hydrogen bond (N, O) only** | OFF | When ON, pairs involving carbon atoms are excluded (in proteins, only pairs of atoms such as N and O remain) |
| **Label set name** | `measure` | Name of the atomintr Renderer to which the interactions are added. It is created if it does not exist |

Each time you open the dialog, all items other than the molecule return to their defaults.

!!! note "Hydrogen bond geometry is not considered"
    What is extracted is the set of atom pairs that satisfy the distance condition; hydrogen bond geometry and the like are not taken into account.

## Running and results

When you press **OK**, the atom pairs that meet the conditions are added to the atomintr Renderer (named by Label set name) of the first molecule. If the Renderer does not exist, it is created, and the interactions are displayed as dotted lines with distance labels.
The addition can be undone with a single Undo.

- If no matching interaction is found, "No interaction was found" is shown and the dialog stays open.
- Interactions beyond Max labels are not added. If that is not enough, Undo, increase Max labels, and run again.

The extracted interactions are the same as measurements made with the Distance tool in the tool palette. The display settings can be changed in the properties of [atomintr](../renderers/atomintr.md).

### Example: extracting interactions between two chains

To extract the interactions between chain A and chain B in PDB entry 1OX1 (trypsin and a substrate analog):

1. Specify `chain A` as the first selection.
2. Turn **Second selection** ON and specify `chain B` as the second selection.
3. Leave the other items at their defaults and press **OK**.

Candidate interactions between chain A and chain B are added to `measure`.

## Using it from the Console

In the native mode of the [Console](../plugins/console/index.md), `analyze_interactions` performs the same processing (see [Console command list](../plugins/console/commands.md)).

## See also

- [Tools menu](../../menu/tools.md)
- [atomintr (measurement display)](../renderers/atomintr.md)
- [Toolbar and tool palette](../../ui/toolbar-tools.md) — measuring distances, angles and dihedral angles

---

*Verified against: CueMol3 2.4.0.546*
