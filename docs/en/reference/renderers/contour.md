<!-- source: ja/reference/renderers/contour.md @ e4bd8cd -->

# contour (contour mesh)

A Renderer that draws a scalar field such as an electron density map as a contour mesh.
Target Objects: density map (DensityMap), electrostatic potential map (ElePotMap).

!!! info "In preparation"
    This page is only a skeleton. Details of each property will be added later.

## Overview

<!-- TODO(screenshot): example of a contour display -->

## Properties

For the common properties, see [Common Renderer properties](common.md).

### Contour

<!-- TODO(content): build the property table (inspector label / property name / default /
     description) from the contour inspector section and the C++ definition -->

Map kind
:   The kind of this map (*Crystallographic* / *Cryo-EM*). Read-only; it shows the detected **Map type** of the [DensityMap](../objects/densitymap.md#map-type)

Region
:   The range to display. *Auto* (default) becomes *Box around center* for crystallographic maps
    and *Full map* for cryo-EM maps.
    *Box around center* draws only the area around the view center and follows the movement of the viewpoint.
    *Full map* draws the whole map

Level of detail
:   How many grid points to skip between reads. *Auto* (default) picks the smallest value (a power of 2)
    for which the number of grid points in the drawn range fits within the **LoD budget**.
    You can also specify a value directly, from *1 (full resolution)* to *8*.
    It is not used when **Region** is *Box around center* (all grid points are always drawn)

LoD budget
:   The number of grid points that *Auto* **Level of detail** tries to fit within. The unit, 1 Mcell, is
    about one million grid points. Increasing it gives finer detail but makes drawing heavier
    (the default is 2 Mcell). Shown only when **Region** is *Full map*

Refine on zoom
:   When ON (default), the drawn range is narrowed to the area around the viewpoint and redrawn in finer detail accordingly.
    When zoomed out, the whole map is coarse, and the zoomed-in part becomes finer.
    Shown only when **Region** is *Full map*

**Buffer size** and **Use periodic boundary** are shown only when **Region** is
*Box around center*.

## See also

- [Renderer list](index.md)
- [isosurf](isosurf.md)
- [gpu_mapmesh](gpu_mapmesh.md)
- [Material](material.md) / [Edge lines](edge-lines.md)

---

*Verified against: CueMol3 2.3.13.523*
