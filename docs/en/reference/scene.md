<!-- source: ja/reference/scene.md @ 570ee02 -->

# Scene

A **Scene** is the top-level element of the scene tree. It holds [Objects](objects/index.md),
[Renderers](renderers/index.md), the [camera](camera.md), style sets, and
[animations](animation/index.md).
Display settings that apply to the whole scene are also stored as Scene properties.

One scene is shown per tab. The same scene can also be shown in multiple tabs (views)
(→ New Tab in the [File menu](../menu/file.md)).
The display settings for a new scene (anti-aliasing / ambient occlusion / background color /
color proofing) can be specified under **Scene settings** in the New Tab dialog, and the confirmed values
become the defaults for subsequent new scenes. "Default" below means the factory value.

## Opening the properties

Choose **Properties...** from the Scene menu, or select the scene row in the scene tree.
The properties appear in the **Properties** tab of the property inspector
(→ [Property inspector](../ui/inspector.md)).
Changes are applied to the molecular view immediately. Sections are not collapsible; all of them are shown at the same time.

There is no modal dialog as in CueMol2.

## Ambient occlusion

Settings for screen-space ambient occlusion (GTAO).
It casts shadows into recessed parts of a molecule to emphasize depth.

Enabled
:   Enables or disables ambient occlusion. The default is **disabled**

Preset
:   Preset for how the shading is applied. Not selectable while disabled

| Preset | Description |
|---|---|
| Low | Shading reaches a short distance, emphasizing fine surface detail (default) |
| Medium | Intermediate |
| High | Shading reaches a long distance, emphasizing the overall shape of the molecule |

A preset bundles the shading reach, the number of samples, and the intensity into one set.
When the reach is increased, the number of steps is increased so that sampling does not become coarse,
and the intensity is lowered so that wide areas do not become too dark.

**Medium** and **High** are computationally expensive, so they are computed at half resolution
only while the view is being moved, and redrawn at full resolution when the view stops. Image export always uses full resolution.

!!! note "Individual adjustments are in the Generic tab"
    Individual values such as radius, intensity, number of slices, number of steps, and half-resolution rendering
    do not appear in the Properties tab. They can be edited
    in the **Generic** tab of the inspector. When a value is changed in the Generic tab, the Preset display changes to **Custom**.

The items that can be edited in the Generic tab are as follows.

| Property | Default | Description |
|---|---|---|
| `aoEnabled` | false | Enable / disable (same as Enabled in the Properties tab) |
| `aoRadius` | 4.0 | Radius of the sphere in which shading is computed |
| `aoIntensity` | 2.2 | Contrast. The larger the value, the lighter the shading |
| `aoSlices` | 9 | Number of horizontal slices. Larger values are smoother but slower |
| `aoSteps` | 3 | Number of samples per slice |
| `aoHalfRes` | false | Computes at half resolution only while the view is moving, and redraws at full resolution when it is still. Export always uses full resolution. The Medium / High presets enable this |

## Anti-aliasing

Settings for the post-processing that reduces jagged edges in the molecular view.
They can be set independently of ambient occlusion.

Quality
:   Anti-aliasing quality

| Quality | Description |
|---|---|
| Off | No post-processing (direct rendering with hardware MSAA) |
| Standard (FXAA) | Edge smoothing with FXAA (default) |
| High (FXAA + 8x SS) | FXAA plus 8-sample supersampling |
| Ultra (FXAA + 32x SS) | FXAA plus 32-sample supersampling |

!!! tip "Supersampling takes effect once the view is still"
    The supersampling of High / Ultra accumulates samples **only while the view
    is still**. Rendering while the view is moving does not become heavier;
    image quality improves progressively after you stop. Moving the view restarts the accumulation.

The items that can be edited in the Generic tab are as follows.

| Property | Default | Description |
|---|---|---|
| `aa_method` | fxaa | Method. Choose from `none` / `fxaa` / `smaa` |
| `aaJitterLevel` | 0 | Supersampling level. 0 is disabled; 1 to 5 correspond to 2 / 4 / 8 / 16 / 32 samples |
| `aaSmaaThreshold` | 0.05 | Edge detection threshold for SMAA. The smaller the value, the more edges are processed |

SMAA is not included in the Quality presets, so to use it, set
`aa_method` to `smaa` in the Generic tab. The Quality display then changes to **Custom**.

## Background

Color
:   Background color. The default is black

The Scene menu and the right-click menu of the scene tree have a white / black toggle,
but to specify an arbitrary color, set it here (→ [Scene menu](../menu/scene.md)).

## Color proofing

A display that simulates color reproduction in CMYK output. It lets you check on screen how colors will look when printed.

Enabled
:   Enables or disables color proofing. The default is disabled.
    If it is enabled while no ICC profile is set, the default CMYK profile
    is assigned

Profile
:   ICC profile to use

Intent
:   Rendering intent. Choose from **Perceptual** (default) / **Relative colorimetric** /
    **Saturation** / **Absolute colorimetric**

The profile and intent settings are retained when proofing is disabled again.

## Scene information

The following items are read-only and are shown in the Generic tab.

| Property | Description |
|---|---|
| `name` | Scene name |
| `src` | Path the scene was loaded from |
| `srctype` | Format of the source |
| `basePath` | Directory used as the base for resolving relative paths |

## See also

- [Scene menu](../menu/scene.md)
- [Property inspector](../ui/inspector.md)
- [Object](objects/index.md) / [Renderer](renderers/index.md)
- [Scene file (`.qsc`)](qsc-format.md)

---

*Verified against: CueMol3 2.3.13.523*
