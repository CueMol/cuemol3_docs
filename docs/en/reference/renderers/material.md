<!-- source: ja/reference/renderers/material.md @ e4bd8cd -->

# Material

Separately from color, you can specify a **material** (surface finish) for the 3D objects drawn by a Renderer.
It is a common property of all Renderers, and is set in the **Common**
section of the property inspector.

!!! note "Effective only in ray tracing"
    The material is reflected in the ray-traced output of the rendering window.
    It is ignored in the molecular view (real-time OpenGL display).

<!-- TODO(screenshot): Comparison of each material in Umbreon. The CueMol2 comparison image
     is not reused because it was rendered with POV-Ray -->

## Material types

The following materials are available. **The specified color applies to every material.**

| Name | Appearance |
|---|---|
| `default` | The default finish. Plastic gloss |
| `matte` | A matte finish |
| `spec_metal` | A metallic finish with very strong shininess |
| `diff_metal` | A matte metallic finish |
| `metallic_chrome` | Chrome-like metal with sharp reflections |
| `metallic_copper` | Copper-like metal, somewhat rough |
| `stone35` | A rough matte finish like stone |
| `wood31` | A slightly glossy finish like wood |
| `shadow` | A shadow-like finish with no shininess |
| `nolighting` | Flat fill with no shading |
| `toon1` / `toon2` | Toon-style shading |

`shadow` has no highlights (shininess), so it is suitable for making an object
translucent and overlaying it on other objects.

Metallic materials reflect the surrounding ambient light, so they may look dark
depending on the environment.

If a material name that does not exist is specified, `default` is used.

!!! note "The appearance differs from the POV-Ray backend"
    The table above describes the finishes in the default rendering backend, **Umbreon**.
    The deprecated POV-Ray backend differs in the following points
    (see [Rendering](../rendering.md)).

    - `stone35` / `wood31` are drawn as stone-grain and wood-grain **patterns**. Umbreon has
      no ability to generate patterns, so they become matte finishes of different roughness.
    - `metallic_chrome` / `metallic_copper` / `stone35` / `wood31` **ignore the
      color specification**.
    - `metallic_chrome` / `metallic_copper` look like plastic instead of metal.

## How to specify

### For the whole Renderer

Specify it in **Material** in the **Common** section of the property inspector.
It is empty (unspecified) by default, in which case the `default` material is applied.

### Per color

You can specify the material as a [modifier](../color-syntax.md#modifiers) of a color.

```
<color>{material: <material name>}
```

To set the color to yellow and the material to `shadow`, specify as follows
(the three differ only in how the color is written; all are the same pure yellow).

```
yellow{material:shadow}
rgb(1,1,0){material:shadow}
#FF0{material:shadow}
```

If you specify a different material for each Paint row in Coloring,
you can also change the finish for each secondary structure.

Sheet
:   `SteelBlue{material:stone35}`

Helix
:   `khaki{material:wood31}`

Others (`*`)
:   `FloralWhite{material:metallic_chrome}`

A material cannot be specified on its own, so always specify it together with a color.

!!! tip "Fineness of patterns in POV-Ray"
    When you use `wood31` or `stone35` with the POV-Ray backend, the wood-grain and stone patterns are fine,
    so you cannot see them unless you zoom in considerably. Umbreon does not draw the patterns at all.

## See also

- [Common Renderer properties](common.md)
- [Color syntax](../color-syntax.md)
- [Edge lines](edge-lines.md)
- [Rendering](../rendering.md) — backend and quality settings
- [Rendering window](../../ui/rendering-window.md)

---

*Verified against: CueMol3 2.3.7.489*
