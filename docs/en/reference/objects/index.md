<!-- source: ja/reference/objects/index.md @ 570ee02 -->

# Object

An **Object** holds data such as a molecular structure or an electron density map.
An Object does not draw anything on screen by itself. Display is handled by the
[Renderers](../renderers/index.md) attached to the Object.

Each Object has a **name** that is unique within the scene. The name is set when the Object is
created, for example by loading a file. If an Object with the same name already exists, an error occurs.

## List of types

| Class | Description | How to create | Main Renderers |
|---|---|---|---|
| [MolCoord](molcoord.md) | Molecular structure (atomic coordinates) | File &gt; Open File... / Get PDB... | [ribbon](../renderers/ribbon.md) and all other molecular Renderers |
| [DensityMap](densitymap.md) | Scalar field such as an electron density map | File &gt; Open File... / Get PDB... | [contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) |
| [ElePotMap](elepot.md) | Electrostatic potential map | Tools &gt; APBS elepot calculation... / loading an OpenDX file | [contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) |
| [MolSurfObj](molsurf.md) | Molecular surface (SES) | Tools &gt; Mol surface generation... / loading an MSMS or PLY file | [molsurf](../renderers/molsurf.md) |

DensityMap and ElePotMap are both kinds of scalar field (ScalarObject), and
the Renderers for density maps can be attached to either.

<!-- TODO(verify): the Object class created by loading an MD trajectory (Open MD Trajectory...).
     If it derives from MolCoord, add a section to this page; if it is a separate class, add a page -->

## Working with Objects

- **Create** — load a file from the File menu, or use one of the generating tools in the Tools menu
  (→ [File menu](../../menu/file.md), [Tools menu](../../menu/tools.md))
- **Save** — File &gt; Save File As... writes a single Object to a file.
  Only Objects that have a corresponding save format can be saved
- **Delete, rename and copy** — right-click menu of the scene tree
  (→ [Side panels](../../ui/side-panels.md))
- **Edit properties** — property inspector
  (→ [Property inspector](../../ui/inspector.md))

## See also

- [Renderer](../renderers/index.md)
- [Supported file formats](../../getting-started/index.md#supported-file-formats)

---

*Last checked: 2026-08-11 / Verified against: development build (tritium)*
