<!-- source: ja/reference/objects/elepot.md @ 570ee02 -->

# ElePotMap (electrostatic potential)

An Object that holds a 3D scalar field of the electrostatic potential.
Like DensityMap, it is a kind of scalar field (ScalarObject),
so the Renderers for density maps can be used with it as they are.

!!! info "In preparation"
    This page is only a skeleton. The list of properties will be added later.

## Creating

Calculate it with **APBS elepot calculation...** in the Tools menu,
or load an OpenDX-format file (`.dx`) written by APBS
(→ [Electrostatic potential calculation](../tools/apbs.md),
[Configuring external tools](../../install/external-tools.md)).

## Properties

<!-- TODO(content): write the elepot property table (name / type / description)
     from the C++ qif definition and the inspector -->

## Supported Renderers

[contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) /
[gpu_mapmesh](../renderers/gpu_mapmesh.md)

You can also color a molecular surface by electrostatic potential
(→ [Coloring](../coloring.md)).

## See also

- [List of Objects](index.md)
- [Renderer](../renderers/index.md)

---

*Verified against: CueMol3 2.4.0.546*
