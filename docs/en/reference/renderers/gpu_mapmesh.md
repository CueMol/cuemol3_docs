<!-- source: ja/reference/renderers/gpu_mapmesh.md @ e4bd8cd -->

# gpu_mapmesh (contour, GPU)

A Renderer that draws the contour mesh on the GPU (with shaders).
Target Objects: density map (DensityMap), electrostatic potential map (ElePotMap).

!!! note "GPU implementation of contour"
    The display is equivalent to [contour](contour.md), and the same properties
    appear in the **GPU contour** section of the Properties tab.
    The display settings can also be adjusted from the Density map panel
    (see [Side panels](../../ui/side-panels.md)).

!!! warning "No longer offered when creating a new Renderer"
    It cannot change the line width and is slower than the CPU version, [contour](contour.md),
    so it has been removed from the New Renderer list. Existing ones in a scene are still displayed,
    and their settings can still be changed.

!!! info "In preparation"
    This page is only a skeleton. Details of each property will be added later.

## Overview

<!-- TODO(screenshot): example display of gpu_mapmesh -->

## Properties

For the common properties, see [Common Renderer properties](common.md).

<!-- TODO(content): build the property table (inspector label / property name / default /
     description) from the gpu_mapmesh inspector section and the C++ definition -->

The display of the map kind (**Map kind**) and the settings for the display range and level of detail (**Region** /
**Level of detail** / **LoD budget** / **Refine on zoom**) are also the same as in contour
→ [contour](contour.md#contour)

## See also

- [Renderer list](index.md)
- [contour](contour.md)
- [isosurf](isosurf.md)
- [Material](material.md) / [Edge lines](edge-lines.md)

---

*Verified against: CueMol3 2.3.13.523*
