<!-- source: ja/reference/renderers/index.md @ e4bd8cd -->

# Renderer

A **Renderer** determines how the data of an Object is drawn.
Multiple Renderers can be attached to a single Object, for example ribbon for the main chain
and ballstick for the active site.

Renderers are created by right-clicking an Object row or a Renderer group row in the scene tree
and choosing **New Renderer** (→ [Side panels](../../ui/side-panels.md)).
Settings are edited in the property inspector
(→ [Property inspector](../../ui/inspector.md)).

## List of types

| Type | Target Object | Description | New Renderer |
|---|---|---|---|
| [simple](simple.md) | Molecule | Lightest display; draws bonds as lines | ○ |
| [trace](trace.md) | Molecule | Connects the main-chain pivot atoms (Cα, etc.) with lines | ○ |
| [tracestick](tracestick.md) | Molecule | A trace drawn with spheres at the main-chain pivot atoms and cylinders between them | ○ |
| [spline](spline.md) | Molecule | Draws the main chain as a smoothed curve | ○ |
| [ballstick](ballstick.md) | Molecule | Draws atoms as spheres and bonds as cylinders | ○ |
| [cpk](cpk.md) | Molecule | Space-filling model drawn with spheres of van der Waals radii | ○ |
| [anisou](anisou.md) | Molecule | Draws anisotropic temperature factors as ellipsoids (ORTEP style) | ○ |
| [tube](tube.md) | Molecule | Draws the main chain as a smooth tube | ○ |
| [ribbon](ribbon.md) | Molecule | Ribbon / plate / tube display according to secondary structure | ○ |
| [cartoon](cartoon.md) | Molecule | Schematic secondary-structure display with helices drawn as cylinders | ○ |
| [nucl](nucl.md) | Molecule | Nucleic acid main-chain tube + base display | ○ |
| [atomintr](atomintr.md) | Molecule | Displays distances, angles and interactions between atoms | ○ |
| [disorder](disorder.md) | Molecule | Displays disordered regions, bridging the gaps with dotted lines | ○ |
| [dsurface](dsurface.md) | Molecule | Molecular surface computed directly from the molecule | ○ |
| [dsurf2](dsurf2.md) | Molecule | Molecular surface using a distance field | — |
| [molsurf](molsurf.md) | Molecular surface | Draws an already generated molecular surface Object | ○ |
| [contour](contour.md) | Density map | Contour mesh display | ○ |
| [isosurf](isosurf.md) | Density map | Isosurface display | ○ |
| [gpu_mapmesh](gpu_mapmesh.md) | Density map | GPU implementation of the contour mesh | — |

Types with "—" in the **New Renderer** column do not appear in the list in the New Renderer dialog.

- **atomintr** is created automatically when you use the measurement tools in the tool palette
  (Distance / Angle / Torsion) or **Interaction...** in the Tools menu
- **atomintr** and **disorder** do not appear in the Renderer type list shown when opening a file.
  Right after loading there is nothing for them to draw (no measurements have been created yet, and
  there is no main-chain Renderer for disorder to follow). Create them with
  New Renderer after the Object has been added to the scene
- **gpu_mapmesh** was removed from the choices for new Renderers because its line width cannot be changed
  and it is slower than [contour](contour.md). Those contained in existing scenes are
  displayed as before, and their settings can still be changed
- **dsurf2** has been merged into [dsurface](dsurface.md). Distance-field meshes are
  chosen with **Algorithm** in dsurface. Those contained in existing scenes are loaded as
  dsurface (→ [dsurf2](dsurf2.md))

Internal Renderers (selection highlight, atom labels, symmetry molecules, unit cell, etc.) are also
not shown in the list. Of these, the atom label Renderer is described in [namelabel](namelabel.md).

## Property structure

Renderer properties are divided into those common to all types and those specific to each type.

- **Common properties** — name, selection, show / hide, material, opacity, and edge lines
  (edge lines only for Renderers that have faces) → [Common Renderer properties](common.md)
- **Type-specific properties** — see the page for each Renderer

Properties that do not appear in the **Properties** tab of the inspector
can be edited in the **Generic** tab.

## Presets

The New Renderer dialog also offers **presets**, which create several Renderers at once.
Choosing a preset creates a set of Renderers, each assigned its target by a selection expression,
as a single group.

| Preset | Composition |
|---|---|
| Default preset 1 | `ribbon` (protein) + `nucl` (nucleic acid) + `ballstick` (everything else) |
| Default preset 2 | `cartoon` (protein) + `nucl` (nucleic acid) + `ballstick` (everything else) |
| Simple preset 1 | `trace` (protein and nucleic acid) + `simple` (everything else) |

## See also

- [Object](../objects/index.md) — what Renderers draw
- [Coloring](../coloring.md)
- [Styles](../styles.md)
- [Selection expression syntax](../selection.md)

---

*Verified against: CueMol3 2.3.21.544*
