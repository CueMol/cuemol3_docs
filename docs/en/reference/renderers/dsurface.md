<!-- source: ja/reference/renderers/dsurface.md @ e4bd8cd -->

# dsurface (molecular surface, direct calculation)

A Renderer that calculates a molecular surface directly from a molecule Object and draws it.
Target Object: molecule (MolCoord). There is no need to generate a separate surface Object.
Coloring is set in the Color panel. Besides Solid coloring, electrostatic potential and
Multi-gradient can also be chosen (→ [Coloring](../coloring.md)).

!!! info "In preparation"
    This page is a skeleton. Example figures will be added later.

## Overview

<!-- TODO(screenshot): example of a dsurface display -->

## Properties

For the common properties, see [Common Renderer properties](common.md).

### Surface

| Item | Default | Description |
|---|---|---|
| Drawing mode | Fill | Fill the surface (**Fill**) / mesh (**Wireframe**) / points (**Dots**) |
| Line/Point size | 1.2 px | Line width for Wireframe and point size for Dots. Not used with Fill |
| Algorithm | Distance field | How the mesh is built (see below) |
| Surface type | Solvent excluded | Type of surface. **van der Waals** (van der Waals surface) / **Solvent accessible** (solvent-accessible surface) / **Solvent excluded** (solvent-excluded surface) |
| Detail | 6 | Fineness of the mesh. Chosen from fixed steps (`1` / `2` / `4` / `6` / `8` / `16` / `24` / `32`) |

#### Algorithm

Selects how the mesh is built. Whichever is chosen, the meaning of the surface type (Surface type) is the same;
what differs is how the mesh is built and how fast.

| Algorithm | Supported Surface type | Description |
|---|---|---|
| Distance field | vdW / SAS / SES | Places a distance field on a grid and meshes it (**default**) |
| MeshMS (analytic SES) | SES only | Meshes the solvent-excluded surface analytically. At fine settings it is much faster than the distance field |
| EDTSurf (voxel) | vdW / SAS / SES | The conventional implementation, using voxels and a distance transform |

**The Detail scale is aligned across the three.** At the default of 6, all algorithms
give almost the same number of vertices.

!!! note "If MeshMS cannot be used, it falls back to the distance field"
    Even if **MeshMS (analytic SES)** is selected, the mesh is built with the distance field instead
    when Surface type is anything other than **Solvent excluded**, or when generation fails.
    The switch and its reason appear in the [Output panel](../../ui/bottom-panels.md#output) as lines
    starting with `DirectSurfRend&gt;`. **The values you set are not changed.**

### Atom radii

Radius of each element used in the surface calculation (in Å).

| Item | Default |
|---|---|
| Carbon | 1.70 |
| Nitrogen | 1.55 |
| Oxygen | 1.52 |
| Sulfur | 1.80 |
| Phosphorus | 1.80 |
| Hydrogen | 1.20 |
| Others | 1.70 |

## Click and hover

When **Drawing mode** is **Fill**, clicking or hovering over the surface targets the atom at that position.
**Wireframe** and **Dots** are not targeted. Rectangle selection and lasso selection do not
target the surface (→ [Picking and hover display](../../ui/mouse-input.md#picking-and-hover-display)).

## See also

- [Renderer list](index.md)
- [molsurf](molsurf.md)
- [dsurf2](dsurf2.md)
- [cpk](cpk.md)
- [Material](material.md) / [Edge lines](edge-lines.md)

---

*Verified against: CueMol3 2.3.15.530*
