<!-- source: ja/reference/tools/superpose.md @ 773364a -->

# Superposing molecules (Molecular superposition)

Superpose two molecules. Open the **Molecular superposition** dialog with **Tools &gt; Molecular superposition...**, then specify the molecule that stays fixed (Reference) and the molecule to be moved (Moving). Superposition changes the coordinates of the Moving molecule.

!!! info "Screenshot planned"

<!-- TODO(screenshot): Molecular superposition dialog (with Method set to US-align) -->

## Superposition methods

**Method** under **Algorithm** offers three methods.

| Method | Applies to | Characteristics |
|---|---|---|
| **US-align** (default) | Proteins and nucleic acids (RNA / DNA) | Automatically matches the structurally similar parts and superposes them. No need to worry about the selection ranges |
| **SSM** | Proteins only | Automatically determines the corresponding parts from the secondary structure and superposes them |
| **LSQ** | Any molecule | Pairs the selected atoms in order and superposes them by least squares. The atoms to superpose must be specified correctly |

### US-align

US-align automatically finds and matches the structurally similar parts, then superposes them. Unlike SSM, it can superpose **RNA / DNA** as well as proteins.

**Pivot atom** selects the atom that represents each residue (available only with US-align).

| Pivot atom | Description |
|---|---|
| Auto (CA / C3') (default) | Uses CA for amino acids and C3' for nucleotides (including modified bases) |
| CA / C3' / C4' / P | Uses the specified atom |

### SSM

Secondary Structure Matching (SSM) determines similar parts from the secondary structure of proteins (helices, sheets, etc.) and superposes them.

- The selection can usually be `*` (all atoms). To superpose onto chain A of the Reference only, specify something like `chain A` in Selection.
- SSM determines the secondary structure from the main-chain atoms (main-chain amide nitrogen and carbonyl group), so superposition fails if the selection is limited to Cα atoms (`name CA`). Include all the main-chain atoms (e.g. `name C,N,O,CA`).
- For the same reason, molecules that have only Cα coordinates and non-protein polymers such as nucleic acids cannot be superposed. Use US-align for nucleic acids.

### LSQ

Superposes by least squares (Least Square Fitting). It works with any molecule, but the Selection of the Reference and the Moving molecule must be specified with the following points in mind.

- The number of selected atoms is the same in both molecules
- The corresponding parts of each molecule are selected (e.g. `name CA` over the same residue range)

## Dialog items

| Item | Description |
|---|---|
| **Algorithm** &gt; **Method** | Superposition method (US-align / SSM / LSQ) |
| **Algorithm** &gt; **Pivot atom** | Atom that represents each residue in US-align |
| **Reference** &gt; Molecule / Selection | The molecule that stays fixed, and the part used for superposition. An empty Selection means all atoms |
| **Moving** &gt; Molecule / Selection | The molecule to be moved, and the part used for superposition |
| **Auto recenter** | When ON (default), the view is centered on the selected part of the Moving molecule after superposition |
| **Use xformMat property** | When ON, the superposition transform is saved as the xformMat property of the molecule instead of rewriting the coordinates (default is OFF) |

- Method, Pivot atom, the two switches and the molecule choices are kept the next time the dialog is opened. Selection is empty every time.
- In the Selection input field, the ▼ at the right end gives access to named selections, the input history and the selection builder (→ [Selection builder](../../ui/selection-builder.md)).

## Running and results

Pressing **OK** runs the superposition and the Moving molecule moves. A single Undo reverts the superposition. If it fails, an error is shown in the dialog.

The result is written as a log to **Output** in the bottom panel. With US-align, the format is as follows.

```
===== US-align superpose result =====
 Ref: <molecule name> (<number of residues> residues), Mov: <molecule name> (<number of residues> residues)
 Pivot: auto, type: protein
 TM-score: ... (normalized by Ref), ... (normalized by Mov)
 RMSD: ... angstrom
 Nalgn: ...
 SeqID: ...
(alignment)
========================
```

- **TM-score**: Structural similarity. Two values are given, normalized by the length of the Reference and of the Moving molecule respectively
- **RMSD**: RMSD of the representative atoms of the matched residues
- **Nalgn**: Number of matched (aligned) residues
- **SeqID**: Fraction of the matched residues that have the same residue type

SSM outputs `RMSD` (RMSD of the Cα atoms), `Nalgn` (number of matched residues) and `Ngaps` (number of gaps in the alignment). LSQ outputs `RMSD` and `Nfit` (number of atoms used for the superposition).

## Using it from the Console

In the native mode of the [Console](../plugins/console/index.md), the `superpose` command performs the same operation. `algo` specifies the method (`USalign` / `SSM` / `LSQ`) and `pivot` specifies the Pivot atom. In PyMOL compatibility mode, `align` / `super` superpose with US-align and `pair_fit` with LSQ (→ [PyMOL compatibility mode](../plugins/console/pymconsole.md#supported-commands)).

## See also

- [Tools menu](../../menu/tools.md)
- [Making an animation and exporting a movie](../../tutorials/animation-movie.md) — an example of superposing with SSM and then creating a morph
- [Selection expression syntax](../selection.md)

---

*Verified against: CueMol3 2.4.0.546*
