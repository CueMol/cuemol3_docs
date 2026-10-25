<!-- source: ja/menu/tools.md @ 6cacee7 -->

# Tools menu

This menu collects tools for structure analysis and calculation.

!!! info "Bond editing has moved to the tool palette"
    CueMol2's Tools &gt; Mol bond editor... has been replaced in CueMol3 by the **Add Bond** tool
    in the **tool palette** at the left edge of the molecular view. There is no menu item
    (→ [Toolbar and tool palette](../ui/toolbar-tools.md)).

## Analysis and generation tools

See the page linked from each item name for details.

| Item | Description | Shortcut |
|---|---|---|
| [Molecular superposition...](../reference/tools/superpose.md) | Superposes two molecules (US-align / SSM / LSQ). The RMSD and other results are shown in the log of the Output panel | |
| [Interaction...](../reference/tools/interaction.md) | Detects interactions between atoms (distances and hydrogen bonds) and displays them as labels. You can specify the target molecule and selection, the distance range, and the maximum number of labels | |
| [Reassign secondary str...](../reference/tools/secondary-structure.md) | Recalculates and reassigns the secondary structure of proteins | |
| [Mol morphing animation...](../reference/tools/morphing.md) | Creates a morphing animation that interpolates between two structures. Converts the target molecule to a MorphMol and adds the structures that serve as frames | |
| [Mol surface generation...](../reference/tools/mol-surface.md) | Generates a molecular surface (SES) Object. You specify the target molecule, selection, mesh density (Point density), probe radius, and generation algorithm (Algorithm) | |
| [Mol surface cutter...](../reference/tools/surface-cutter.md) | Cuts a molecular surface with a plane. You can choose how the cut face is handled (main body only / cut face only / split into two Objects) | |
| [APBS elepot calculation...](../reference/tools/apbs.md) | Calculates an electrostatic potential map using APBS. Assigns charges and radii with pdb2pqr, runs APBS, and loads the result | |

!!! warning "APBS requires configuration"
    If the paths to the APBS and pdb2pqr executables are not set in Settings, the dialog's **Start** button cannot be pressed
    (→ [Configuring external tools](../install/external-tools.md)).

!!! info "Molecular surface generation algorithms"
    **Algorithm** offers *Auto* / *MeshMS* / *BALL*. The default *Auto* selects MeshMS,
    and if MeshMS fails it switches to BALL automatically, so a surface is always generated
    (→ [MolSurfObj (molecular surface)](../reference/objects/molsurf.md)).

!!! tip "Measuring distances, angles and dihedral angles"
    Distances, angles and dihedral angles between atoms are measured not from a menu but with the
    Distance / Angle / Torsion tools in the **tool palette** at the left edge of the molecular view
    (→ [Toolbar and tool palette](../ui/toolbar-tools.md)).

---

*Verified against: CueMol3 2.4.0.546*
