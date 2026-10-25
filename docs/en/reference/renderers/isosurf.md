<!-- source: ja/reference/renderers/isosurf.md @ e4bd8cd -->

# isosurf (isosurface)

A Renderer that draws a scalar field such as an electron density map as an isosurface (surface).
Target Objects: density map (DensityMap) and electrostatic potential map (ElePotMap).

!!! info "In preparation"
    This page is only a skeleton. Details of each property will be added later.

## Overview

<!-- TODO(screenshot): example of an isosurf display -->

## Properties

For the common properties, see [Common Renderer properties](common.md).

### Isosurf

<!-- TODO(content): build the property table (inspector label / property name / default /
     description) from the isosurf inspector section and the C++ definition -->

Map kind
:   The kind of this map (*Crystallographic* / *Cryo-EM*). Read-only; it shows the result of the
    **Map type** detection of the [DensityMap](../objects/densitymap.md#map-type)

Region
:   The range to display. *Auto* (default) becomes *Box around center* for crystallographic maps
    and *Full map* for cryo-EM maps.
    *Box around center* draws only the area around the view center and follows the movement of the viewpoint.
    *Full map* draws the entire map

Level of detail
:   How many grid points to skip between reads. With *Auto* (default), when **Region** is *Full map*
    it picks the smallest value (a power of 2) at which the number of grid points in the drawn range fits within
    **LoD budget**; when **Region** is *Box around center* it uses all grid points.
    You can also specify a value directly, from *1 (full resolution)* to *8*

LoD budget
:   The number of grid points that *Auto* **Level of detail** tries to stay within. The unit, 1 Mcell, is
    about one million grid points. A larger value gives finer detail but makes drawing slower
    (default: 16 Mcell). Shown only when **Region** is *Full map*

Refine on zoom
:   When ON (default), the drawn range is narrowed to the area around the viewpoint and redrawn in finer detail accordingly.
    When zoomed out, the whole map is drawn coarsely, and the part you zoom in on becomes finer.
    Shown only when **Region** is *Full map*

Cap mode
:   Whether to close with a face the places where the isosurface is cut at the boundary of the displayed range. With *Auto* (default),
    the surface is closed when **Region** is *Full map* and for generated surface Objects, and is left open when
    **Region** is *Box around center*. *On* always closes it, and *Off* always leaves it open

**Max grid size** and **Use periodic boundary** are shown only when **Region** is
*Box around center*.

The default color is light gray ([contour](contour.md), the contour mesh, is blue).

## See also

- [Renderer list](index.md)
- [contour](contour.md)
- [Material](material.md) / [Edge lines](edge-lines.md)

---

*Verified against: CueMol3 2.3.13.523*
