<!-- source: ja/reference/rendering.md @ e4bd8cd -->

# Rendering

Settings for ray-tracing output in the [rendering window](../ui/rendering-window.md).
The default rendering backend of CueMol3 is the built-in ray tracer **Umbreon**.

Umbreon is built into the visualization library (libcuemol2), so **no external program
and no path setting are needed**. For how to open the window and run a render, see
[Rendering window](../ui/rendering-window.md).

## Backend

Select the backend with **Backend** in the run bar at the bottom of the rendering window.

| Backend | Description |
|---|---|
| Umbreon | Built-in ray tracer. **Default**. No external program required |
| Umbreon (NPR) | Same ray tracer, with ink-drawing-style output in which shading is expressed by hatching → [NPR (ink-style rendering)](rendering-npr.md) |
| POV-Ray | Legacy backend. **Deprecated** |

Distributed builds include Umbreon, so Umbreon is already selected when the window opens.
A backend you switch manually is saved in the scene, like the other settings
(→ [Saving settings](#saving-settings)).

This page covers the settings of **Umbreon**, which produces photorealistic output. For the
Hatching group and the Detail tab of Umbreon (NPR), see
[NPR (ink-style rendering)](rendering-npr.md) (the Lighting and Supersampling in Quality
and the individual settings are shared).

!!! info "POV-Ray will be kept for the time being"
    POV-Ray has been used as a backend since CueMol2, but it is deprecated in CueMol3.
    It requires a separate external POV-Ray installation and lacks the shading features
    of Umbreon (ambient occlusion / global illumination). It remains as an option for
    reproducing past scenes with the same appearance, but use Umbreon for new images.

    To use POV-Ray, set the path to the executable in Settings
    (→ [Configuring external tools](../install/external-tools.md)).

### Common settings not used by Umbreon

Of the settings in the **Image** tab and **Camera**, the following items are not used by
Umbreon. While Umbreon is selected, the setting fields themselves are hidden.

| Item | Why it is hidden |
|---|---|
| Stereo mode / Stereo depth | Umbreon does not support stereoscopic output |
| CPU threads | Umbreon renders in parallel within the process, so it does not accept a thread count |
| Post-render alpha blending | Umbreon composites transparency itself, so the external blendpng is not used |
| Pixel labels | A POV-Ray-only feature |

## Quality

This section is at the top of the **Render** tab. Quality is not a single slider but a
combination of **mutually independent axes**, so each axis has its own dropdown.

Lighting
:   How shading is applied. The default is **Global Illumination**

Supersampling
:   Base image quality. The default is **3x**

AO quality
:   Quality of ambient occlusion. Shown only when Lighting is Ambient Occlusion

GI lighting
:   Distribution of light for global illumination. Shown only when Lighting is Global Illumination

Shadows
:   How shadows are cast. The default is **Off**

Each dropdown rewrites the values of the individual settings below in one go. Conversely,
if you change an individual setting by hand, no level matches the new value, so the display
of that axis changes to **Custom**.

### Lighting

Select how to give a sense of depth by darkening the concave parts of a molecule and
brightening the protruding parts.

| Lighting | Description |
|---|---|
| Raytrace only | No shading. The fastest, with a flat appearance |
| Ambient Occlusion | Computes shading from occlusion by the surroundings |
| Global Illumination | Computes shading by tracing light bounces (**default**) |

Only **one** of Ambient Occlusion and Global Illumination can be selected, because both
achieve the same purpose (a sense of depth through shading) by different methods.

!!! tip "Why Global Illumination is the default"
    Global Illumination has a built-in denoiser, so the result looks clean even with a
    small number of samples. For a comparable sense of depth, it takes far less time
    than Ambient Occlusion at High.

### Supersampling

Render at an integer multiple of the output size and then downscale, which reduces
jagged outlines.

| Supersampling | Description |
|---|---|
| 1x (off) | No enlargement. The fastest |
| 2x | |
| 3x | **Default** |
| 4x | Highest quality |

The amount of computation grows with the **square of the factor** (4x is 16 times 1x).

The quality of [edge lines](renderers/edge-lines.md) is also determined by this factor.
If edge lines look jagged, raise it first. This is why the default is 3x.

### AO quality

Shown when Lighting is **Ambient Occlusion**.

| AO quality | Description |
|---|---|
| Low | For drafts, with fewer samples |
| Medium | Standard (**default**) |
| High | Computes shading exactly for each point |

!!! warning "High takes an extremely long time"
    Low and Medium compute in batches per output pixel, but High recomputes for each
    shading point, so it can be tens of times slower than Medium. Medium is sufficient
    except for the final image.

### GI lighting

Shown when Lighting is **Global Illumination**. Select, in levels, how much of the energy
of the frontal light (headlight) is moved to the global-illumination bounce light.
The strength of the key light from diagonally above does not change at any level.

| GI lighting | Description |
|---|---|
| 0 (raytrace match) | Same light distribution as Raytrace only. The global-illumination bounce is minimal |
| 1 | |
| 2 | |
| 3 | |
| 4 (max GI) | Turns the headlight off completely and shades with only the key light and the bounce (**default**) |

Changing the level **does not change the average brightness**. What changes is how the
shading appears. Low noise is determined not by this axis but by the individual setting
**GI samples**. The level rewrites the individual settings Light intensity /
Flash fraction / Ambient fraction in one go, and changing any of them by hand changes the
display to **Custom**.

### Shadows

Cast shadows from the light source. This can be set independently of Lighting.

| Shadows | Description |
|---|---|
| Off | No shadows (**default**) |
| Hard | Shadows with sharp outlines |
| Soft | Blurred shadows |
| Very soft | More blurred shadows |

!!! note "Shadows fall only on meshes"
    Parts drawn as spheres or cylinders (the atoms and bonds of [cpk](renderers/cpk.md)
    and [ballstick](renderers/ballstick.md)) receive no shadows. For molecular
    representations Lighting alone gives a sense of depth, so the default is Off.

## Individual settings

An accordion below the Quality section. Open it when the presets are not enough.
Changing a setting here changes the display of the corresponding axis to Custom.

### Antialiasing

| Item | Default | Range | Description |
|---|---|---|---|
| Supersampling | 3 | 1-8 | Same value as Supersampling in Quality |

### Lights

Light source settings that apply regardless of the Lighting method. Umbreon (NPR) has the
same group.

| Item | Default | Range | Description |
|---|---|---|---|
| Light intensity | 1.3 | 0-3 | Overall strength of the light sources |
| Flash fraction | 0 | 0-1 | Fraction of the direct light assigned to the headlight from the viewpoint direction. The rest becomes the key light from diagonally above. The smaller it is, the sharper the shading |

When Lighting is Global Illumination, the **GI lighting** level rewrites these two.
Selecting Raytrace only or Ambient Occlusion returns them to 1.55 / 0.6. The defaults of
Umbreon (NPR) are also 1.55 / 0.6. If you switch back to Global Illumination from there,
**GI lighting re-enters at the default level (4)**.

### Ambient Occlusion

Shown only when Lighting is Ambient Occlusion.

| Item | Default | Range | Description |
|---|---|---|---|
| AO samples | 64 | 1-256 | Samples per point. More is smoother but slower |
| AO distance (0 = auto) | 0 | 0-1000 | Radius within which occluders are searched. 0 determines it automatically from the size of the scene |
| AO intensity | 1.0 | 0-1 | Strength of the shading |
| AO on direct light | 1.0 | 0-1 | Fraction by which shading is also applied to direct light. At 0, the shading becomes almost invisible |
| Multi-scale AO | ON | | Combines large and small radii to emphasize both fine bumps and the overall shape |
| Bent normal | ON | | Applies ambient light taking the direction of occlusion into account |
| Low-discrepancy sampling | ON | | Spreads samples evenly to reduce noise |
| AO gather | Per output pixel | | Unit of the shading computation. **Per output pixel** is per output pixel (fast); **Per shading hit** is per shading point (exact, slow) |

!!! tip "Leave AO distance at 0 (auto)"
    At 0 the radius is derived from the size of the whole scene, so shading looks the
    same for a small peptide and for a large complex. Enter a positive value only when
    you want to fix a specific radius.

### Shadows

| Item | Default | Range | Description |
|---|---|---|---|
| Cast shadows | OFF | | Whether shadows are cast |
| Shadow samples | 1 | 1-64 | Number of shadow samples. More is smoother but slower |
| Light radius (deg) | 0.0 | 0-30 | Apparent size of the light source (degrees). Values above 0 give blurred shadows |

The larger the Light radius, the wider the shadow edges blur and the more noise appears,
so increase Shadow samples as well.

### Edges

Umbreon-specific settings for how [edge lines](renderers/edge-lines.md) are drawn.
Whether edge lines are drawn, and their **thickness and color**, are specified with the
common properties on the Renderer side.

| Item | Default | Range | Description |
|---|---|---|---|
| Crease angle (deg) | Off | Off / 15 / 30 / 45 / 60 / 90 / 120 | Lower limit (degrees) of the fold angle of faces drawn as crease lines. Effective when Edge type is Edges; the larger the angle, the fewer folds are drawn, leaving only distinct ones. Off draws no crease lines |
| Contact edges | ON | | Draws the lines where Renderers with different edge-line settings intersect (see below) |
| Outline far depth | 0.2 | 0-1 | When Edge type is Silhouette, the depth at which outlines behind faces faded by fog start to be drawn. A fraction of the fog range: 0 is the view center and 1 is the end of the fog |

**Contact edges** draws the intersection lines where the shape of one Renderer pierces the
surface of another (for example, a ballstick bond going into a ribbon). Renderers with the
same edge-line settings (type, thickness, color) are treated as one group, and
intersection lines are drawn only between groups (not between the Renderers that make up a
single cartoon). In a scene where all Renderers have the same edge settings (for example,
all left at the defaults), no intersection lines are drawn.
The molecular view does not draw these intersection lines. If you turn this setting OFF,
intersection lines are no longer drawn, and for Renderers whose Edge type is Silhouette
the outline is interrupted where they touch other Renderers.

### Transparency

How overlapping translucent Renderers are composited. Available in both Umbreon and
Umbreon (NPR) (not in POV-Ray). Collapsed by default.

| Item | Default | Description |
|---|---|---|
| Per-pixel transparency | ON | Composites translucency pixel by pixel |

Each translucent Renderer is drawn as if opaque and then composited. When ON, the weights
are determined only by the layers that actually cover the pixel, so the weight of the
background never becomes negative. OFF is the conventional layer-by-layer compositing: in
a pixel where translucent layers whose opacities sum to more than 1 overlap, the weight of
the background becomes negative, and **dark things behind them are inverted to bright**
(for example, black edge lines seen through a translucent surface appear white).

A pixel covered by only one translucent layer looks the same whether ON or OFF. The
difference appears only where layers overlap. The rendering time is the same either way.
Turn it OFF only when you need the same result as blendpng or POV-Ray.

### Global Illumination

Shown only when Lighting is Global Illumination.

| Item | Default | Range | Description |
|---|---|---|---|
| GI samples | 32 | 8 / 32 / 64 / 256 | Samples per pixel. More reduces noise but is slower |
| Denoise | OIDN | | Noise removal method. **OIDN** / **A-trous** / **None** |
| Ambient fraction | 0.6 | 0-1 | Fraction of the total light gathered as global-illumination bounce. Rewritten by the **GI lighting** level |
| Sky gradient | ON | | Makes the sky, which is the light source of the bounce, a gradient that is white at the top and approaches Ground color toward the bottom. The brightness of the bounce then varies with the orientation of the surface (the overall brightness does not change) |
| Ground color | #666666 | | Ground-side color of Sky gradient |

With Denoise set to None, the image is grainy unless GI samples is made large.
Normally leave it at OIDN.

## Edge lines and materials

Some of the common properties on the Renderer side affect only ray-tracing output.

[Material](renderers/material.md)
:   Umbreon resolves the surface appearance from the material name. Some appearances differ from POV-Ray

[Edge lines](renderers/edge-lines.md)
:   In Umbreon, the **Silhouette** Edge type is a mode that draws **only the outer outline**.
    Renderers with the same edge-line settings (type, thickness, color) form one group with
    a single outer outline, and no lines are drawn where they overlap.
    **Edges** also draws the inner crease lines in addition to the outline.
    Edge lines are also drawn in the molecular view, and are adjusted to look as similar as possible

## Rendering from the command line

Images can also be written from a scene file (`.qsc`) without using the GUI.
Both routes use Umbreon.

```sh
cuetty --input scene.qsc --render out.png --width 1920 --height 1080
```

```sh
python -m cuemol.umbreon_render scene.qsc out.png -W 1920 -H 1080
```

`--camera` (`-c`) specifies a camera saved in the scene. If omitted, the current view
(`__current`) that the GUI writes when saving the scene is used.

Both render using the rendering window settings saved in the scene
(→ [Saving settings](#saving-settings)) as they are. A scene with no saved settings is
rendered with the defaults (Lighting is Global Illumination, 1200×1200 px), and the
projection follows that of the camera. `--width` / `--height` (`-W` / `-H`) override the
saved size.

!!! warning "Text such as atom labels is not rendered"
    If you need a figure with labels, use the rendering window.

## Saving settings

The rendering window settings (the Backend selection and the contents of the Image /
Render / Detail tabs) are **saved in the scene** and read and written together with the
scene file (`.qsc`). When you switch Target, the settings of that scene are shown. Only
values changed from the defaults are written.

Changing settings is an edit of the scene and can be undone. In the rendering window as
well, ++cmd+z++ / ++cmd+shift+z++ (++ctrl+z++ / ++ctrl+y++ on Windows / Linux) work
(when a text field has focus, they undo within the field).

The history of render results records the settings used at run time. The history arrows
switch only the image; pressing the **Use settings** button restores the settings used
when that image was rendered to the editor and the scene (this can be undone with a single
Undo) (→ [Rendering window](../ui/rendering-window.md)). The output destination settings
for movies are held by the application, not the scene, and remain the next time the window
is opened.

## See also

- [Rendering window](../ui/rendering-window.md) — window layout and operations
- [NPR (ink-style rendering)](rendering-npr.md) — settings of the Umbreon (NPR) backend
- [Rendering menu](../menu/rendering.md) — menu items and Export scene
- [Material](renderers/material.md) / [Edge lines](renderers/edge-lines.md)
- [Scene](scene.md) — ambient occlusion and antialiasing on the molecular view side
- [Settings reference](settings.md) — all items of the Settings tab

---

*Verified against: CueMol3 2.3.14.525*
