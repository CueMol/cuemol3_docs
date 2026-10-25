<!-- source: ja/reference/renderers/common.md @ e4bd8cd -->

# Common Renderer properties

These properties are shared by all Renderers. They appear in the **Common** section
at the top of the **Properties** tab of the property inspector
(→ [Property inspector](../../ui/inspector.md)).

## Basic settings

Name
:   The name of the Renderer. It must be unique within the scene

Selection
:   A [selection expression](../selection.md) that specifies the range drawn by this Renderer.
    Effective only for Renderers that target molecules (MolCoord)

Visible
:   Toggles visibility. Linked to the eye icon in the scene tree

Locked
:   Lock. When ON, the Renderer is excluded from editing operations

## Material and opacity

Material
:   Specifies the material. The default is empty (not specified), in which case `default` is applied
    → [Material](material.md)

Opacity
:   Opacity. 1 is fully opaque; the closer to 0, the more transparent

## Edge lines

Edge type
:   Type of edge line (None / Edges / Silhouette)

Width
:   Width of the edge line (in Å)

Color
:   Color of the edge line

Renderers that have no faces (simple / trace / spline / contour / gpu_mapmesh, selection highlight,
unit cell, [namelabel](namelabel.md)) do not show the edge line settings.
→ [Edge lines](edge-lines.md)

!!! info "In preparation"
    A list of the default value, value range and property name (key in the Generic tab)
    of each property will be added later.

<!-- TODO(content): Build the property table (inspector label / property name / type / default)
     from RendererCommonSection.tsx and the C++ Renderer.qif -->

## See also

- [Renderer list](index.md)
- [Material](material.md) / [Edge lines](edge-lines.md)
- [Selection expression syntax](../selection.md)

---

*Verified against: CueMol3 2.3.21.544*
