<!-- source: ja/reference/objects/molsurf.md @ 570ee02 -->

# MolSurfObj (molecular surface)

An Object that holds the polygon data of the solvent-excluded surface (SES) of a molecule.

!!! info "In preparation"
    This page is only a skeleton. The list of properties will be added later.

## Creating

Generate it from a molecule with **Mol surface generation...** in the Tools menu, or
load an MSMS surface file (`.face` / `.vert`) or a PLY file
(→ [Generating a molecular surface](../tools/mol-surface.md)).

After generation, the surface can be cut by a plane with Tools &gt; **Mol surface cutter...**
(→ [Cutting a molecular surface](../tools/surface-cutter.md)),
and regenerated from the right-click menu of the scene tree.

### Generation algorithm (Algorithm)

The generation and regeneration dialogs let you choose how the SES is calculated.

| Algorithm | Description |
|---|---|
| Auto | Uses MeshMS (**default**) |
| MeshMS | A new implementation that builds the SES mesh analytically |
| BALL | The implementation CueMol has used so far |

Both are built into the distributed builds. With *Auto*, if MeshMS fails on the
input, it automatically falls back to BALL, so a surface is always generated.

Even with the same density and probe radius, the meshes produced by the two algorithms
do not match. MeshMS applies a single target edge length to the whole surface and merges
vertices before computing normals, so the result is generally smoother.
The density scale is calibrated to BALL, so the same density value gives
a comparable level of detail.

Each time a surface is generated, one line is written to the log in the Output panel
showing which algorithm ran, the elapsed time, and the numbers of vertices and faces.

!!! tip "Regeneration that changes only the density is faster"
    On regeneration, the results of the density-independent part of the calculation are cached.
    If you change **only the density** in the Regenerate dialog, only the meshing is redone.
    The cache is invalidated when any of the coordinates, the selection, or the atomic radii
    change, so an outdated surface is never reused.

!!! note "Existing scenes look the same"
    The scene file format has not changed, so saved scenes are loaded as before.
    The surface changes only when it is regenerated.

## Properties

<!-- TODO(content): build the property table of molsurfobj (name / type / description)
     from the C++ qif definition and the inspector -->

## Supported Renderers

[molsurf](../renderers/molsurf.md)

## See also

- [List of Objects](index.md)
- [Renderers](../renderers/index.md)

---

*Verified against: CueMol3 2.4.0.546*
