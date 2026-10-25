<!-- source: ja/reference/objects/densitymap.md @ 570ee02 -->

# DensityMap (density map)

An Object that holds a three-dimensional scalar field such as an electron density map.

!!! info "In preparation"
    This page is only an outline. The list of properties will be added later.

## Creating

Load a density map file or a structure factor file with **Open File...** in the File menu,
or fetch one with **Get PDB...**
(→ [File menu](../../menu/file.md)).

## Properties

<!-- TODO(content): write the densitymap property table (name / type / description)
     from the C++ qif definition and the inspector -->

### Map type

Crystallographic maps (periodic) and cryo-EM maps (non-periodic) are handled separately.
The type is detected automatically from the file header, and it determines the default display range
(→ **Region** of [contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md)),
the unit of the contour level (see below), and the default style applied to the Renderer (*Default* / *Cryo-EM*).

To change the detected type, specify **Map type** on the options screen shown when opening the file (for CCP4/MRC) as one of
*Auto (from header)* / *Crystallographic (periodic)* / *Cryo-EM (whole map, level of detail)*
(→ [File menu](../../menu/file.md)). After loading, it can be changed with
**Map type** in the **Density map** section of the **Properties** tab of the property inspector.
The detection result is shown in **Effective kind** in the same section.
When Map type is changed, the contour / isosurf styles are also switched between *Default* and *Cryo-EM*
(a Renderer that you have set to a different style is left unchanged).

The contour level is held in a unit that depends on the map type. For crystallographic maps it is σ
(the unit in which the standard deviation of the map is 1; default 1.1), and for cryo-EM maps it is the top percentage
of grid point values to be enclosed (default: top 1 %). **Level** in the Density map panel accepts either this unit or
an absolute value (→ [Side panels](../../ui/side-panels.md)).

The ORIGIN of MRC files is also read, so a map whose origin is not 0 overlaps correctly
with a model fitted to it.

## Supported Renderers

[contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) /
[gpu_mapmesh](../renderers/gpu_mapmesh.md)

The display range and contour level can also be adjusted from the Density map panel
(→ [Side panels](../../ui/side-panels.md)).

## See also

- [List of Objects](index.md)
- [Renderers](../renderers/index.md)

---

*Verified against: CueMol3 2.3.13.523*
