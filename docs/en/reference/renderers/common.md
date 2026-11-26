<!-- source: ja/reference/renderers/common.md @ d6bebaf -->

# Common Renderer properties

These properties are shared by all Renderers. They appear in the **Basic settings** and **Edge lines** sections
at the top of the **Properties** tab of the property inspector
(→ [Property inspector](../../ui/inspector.md)).

## Basic settings

Name
:   The name of the Renderer. It must be unique within the scene.

Selection
:   A [selection expression](../selection.md) that specifies the range drawn by this Renderer.
    Effective only for Renderers that target molecules (MolCoord).

Visible
:   Toggles visibility. Linked to the eye icon in the scene tree.

Locked
:   Lock. When ON, the Renderer is excluded from editing operations.

## Material and opacity

Material
:   Specifies the material. The default is empty (not specified), in which case `default` is applied
    → [Material](material.md)

Opacity
:   Opacity. 1 is fully opaque; the closer to 0, the more transparent.

### How translucent Renderers overlap

A Renderer whose Opacity is below 1 is composited over the background in the molecular view with the same method as
in the rendering window (Umbreon).

- Within one Renderer, only the frontmost surface is visible. Its own back faces do not show through
  as a mottled pattern.
- When translucent Renderers overlap, the color is the same regardless of the order in which they are drawn.
- Labels with **Label on top** turned ON stay displayed on top of translucent Renderers.
- Translucent Renderers do not cast ambient occlusion shading. Wrapping a molecule in a translucent surface
  does not darken the structure inside. Ambient occlusion is not applied to the translucent Renderer itself
  either.

For the compositing settings in the rendering window, see **Transparency** in
[Rendering](../rendering.md#transparency).

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

*Verified against: CueMol3 3.0.5.576*
