<!-- source: ja/reference/objects/molcoord.md @ 570ee02 -->

# MolCoord (molecule)

An Object that holds atomic coordinates. All molecular structure data, including proteins, nucleic acids and small molecules, is of this class.

!!! info "In preparation"
    This page is only a skeleton. A list of properties will be added later.

## Creating

Load a molecular coordinate file with **Open File...** in the File menu, or fetch one by PDB ID with **Get PDB...**
(→ [File menu](../../menu/file.md)).

For the readable formats, see
[Supported file formats](../../getting-started/index.md#supported-file-formats).

## Properties

<!-- TODO(content): write the molcoord property table (name / type / description)
     from the C++ qif definition and the inspector -->

## Supported Renderers

[simple](../renderers/simple.md) / [trace](../renderers/trace.md) /
[spline](../renderers/spline.md) / [ballstick](../renderers/ballstick.md) /
[cpk](../renderers/cpk.md) / [anisou](../renderers/anisou.md) /
[tube](../renderers/tube.md) / [ribbon](../renderers/ribbon.md) /
[cartoon](../renderers/cartoon.md) / [nucl](../renderers/nucl.md) /
[atomintr](../renderers/atomintr.md) / [disorder](../renderers/disorder.md) /
[dsurface](../renderers/dsurface.md)

## Export formats

Export is available in PDB, MOL/SDF, PQR and XYZR formats
(File &gt; Save File As...).

## See also

- [List of Objects](index.md)
- [Renderer](../renderers/index.md)

---

*Verified against: CueMol3 2.3.15.530*
