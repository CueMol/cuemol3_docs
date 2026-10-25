<!-- source: ja/reference/tools/apbs.md @ 773364a -->

# Calculating the electrostatic potential (APBS elepot calculation)

Calculates the electrostatic potential map of a molecule using [APBS](https://www.poissonboltzmann.org/).
Open the **APBS electrostatic potential** dialog with **Tools &gt; APBS elepot calculation...**.
The calculated map becomes an [ElePotMap (electrostatic potential)](../objects/elepot.md) Object
and can be used for coloring molecular surfaces and other purposes.

!!! info "Screenshot planned"

<!-- TODO(screenshot): APBS electrostatic potential dialog (progress display while running) -->

## Preparation

The calculation uses APBS and pdb2pqr, which assigns charges and atomic radii. Both are bundled
with the macOS / Windows release assets, so no setup is normally needed. For builds that do not bundle them,
specify the executable paths in **Settings &gt; Tools &gt; APBS / PDB2PQR** (→ [Configuring external tools](../../install/external-tools.md)).

If the paths are not set, a warning is shown at the top of the dialog and **Start** cannot be pressed.

To use a surface for coloring, [generate the molecular surface](mol-surface.md) first.

## Dialog items

### Target

| Item | Default | Description |
|---|---|---|
| **Molecule** | — | Molecule to calculate |
| **Use selection** / selection | OFF | When ON, only the part specified by the selection expression is calculated. To exclude water molecules and ions, specify something like `protein` |
| **Elepot name** | `pot_<molecule name>` | Name of the resulting electrostatic potential map Object. Filled in automatically when a molecule is chosen |

### Charge method

| Item | Default | Description |
|---|---|---|
| **Method** | Use PDB2PQR | How charges are assigned (see below) |
| **Force field** | Value in Settings (default `charmm`) | With Use PDB2PQR, the force field used to assign charges (`charmm` / `amber` / `tyl06` / `peoepb` / `swanson`) |
| **Use hydrogen atoms** | OFF | With Use internal, uses the hydrogen atoms in the molecule |

- **Use PDB2PQR**: Assigns charges and atomic radii with pdb2pqr, then runs the calculation.
- **Use internal**: Uses CueMol's own charge assignment. pdb2pqr is not required, but the
  N and C termini of proteins are not handled correctly, and when the molecule has no hydrogen atoms,
  charges are assigned by a simple method that adds the charges of hydrogens to the atoms they are bonded to,
  so this is not recommended. If the molecule has hydrogen atoms, turning **Use hydrogen atoms**
  ON avoids this problem.

### APBS options

Calculation conditions for APBS. They normally do not need to be changed. See the APBS documentation for details.

| Item | Default | Description |
|---|---|---|
| **Solve non-linear PBE** | OFF | Solves the non-linear Poisson-Boltzmann equation |
| **Temperature (K)** | 298.15 | Temperature |
| **Max grid size (A)** | 1.0 | Grid spacing (Å) |
| **Water dielectric** | 78.54 | Dielectric constant of the solvent |
| **Protein dielectric** | 2.0 | Dielectric constant of the molecular interior |

## Running and results

Press **Start** to begin the calculation; progress is displayed (pdb2pqr runs first, then APBS).
Large molecules take longer. **Stop** cancels a running calculation.

When the calculation finishes, an electrostatic potential map Object is added to the scene and the dialog closes.
The addition can be reverted with a single Undo.

- The map comes with a `unitcell` Renderer that outlines the calculated region. Once you have
  confirmed that the region is large enough, it can be hidden or deleted.
- The calculated map is saved together with the scene when the scene is saved to `.qsc`.

## Coloring a molecular surface

In the Color panel, select a molsurf Renderer, choose **Electrostatic potential** as the Coloring type, and specify the
calculated map. Turn **By SAS** ON and set **High** / **Low** to about ±2 (in kT/e)
to make the distribution easier to see. For the detailed procedure, see
[Coloring a molecular surface by electrostatic potential](../../tutorials/surface-elepot.md); for the settings, see
[Coloring](../coloring.md).

## Using from the Console

In the native mode of the [Console](../plugins/console/index.md), `calc_elepot` performs the same operation
(→ [Console command list](../plugins/console/commands.md)).

## See also

- [Tools menu](../../menu/tools.md)
- [ElePotMap (electrostatic potential)](../objects/elepot.md)
- [Configuring external tools](../../install/external-tools.md)
- [Generating a molecular surface](mol-surface.md)

---

*Verified against: CueMol3 2.4.0.546*
