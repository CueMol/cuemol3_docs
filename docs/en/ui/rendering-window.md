<!-- source: ja/ui/rendering-window.md @ 6cacee7 -->

# Rendering window

A separate window for producing high-quality ray-traced still images and movies.
It is **modeless** (non-modal), so you can keep it open and work with the molecular view in the main window.

!!! info "Screenshot planned"

<!-- TODO(screenshot): Overall view of the rendering window. Result image at upper left, Render Settings on the right, run bar and log at the bottom -->

## Opening the window

| Action | Result |
|---|---|
| **Rendering &gt; Image rendering...** | Opens the window in **Still mode** |
| **Rendering &gt; Movie rendering...** | Opens the window in **Movie mode** |
| **Window &gt; Rendering Window** | Opens the window or brings it to the front (the mode is not changed) |
| **Render** button on the toolbar | Same as above |

If the window is already open, Image / Movie rendering... only switches the mode.

## Window layout

| Area | Contents |
|---|---|
| Image area (upper left) | Preview of the rendering result. The toolbar is used to save, move through the history and change the zoom (see below) |
| Render Settings (right) | Settings panel. It has an **Image** tab and a **Render** tab, plus a **Detail** tab when Umbreon (NPR) is selected |
| Run bar + log (bottom) | Backend / Target selection, Start / Stop, progress and log |

## Image area

The rendering result is shown here, and the toolbar above it provides the following operations.

| Item | Description |
|---|---|
| **Save** | Saves the result as a PNG file |
| **Copy** | Copies the result to the clipboard |
| Arrows | Move back and forth through the history of rendering results |
| **Use settings** | Restores the settings that were used to render the result currently selected in the history |
| `+` / `-` / `100%` / `Fit` | Change the zoom. **Fit** is the zoom at which the whole image fits |

**The zoom and scroll position are kept across renders.** Even if you change one setting
and render again, or move through the history, the view stays magnified, so two results can be
compared at the same zoom. When the image size changes, the zoom and center are
adjusted so that the same region remains visible. The whole image is shown again only for the first image and when you press **Fit**.

`+` / `-` / `100%` / `Fit` zoom around the center of the viewing area.
Pinch and ++cmd++ + wheel zoom around the pointer position.

## Run bar

| Item | Description |
|---|---|
| **Backend** | Selects the rendering backend. The default is the built-in ray tracer, **Umbreon** |
| **Target** | Selects which view to render (the open views are listed) |
| **Start Render** | Starts rendering |
| **Stop** | Cancels the rendering in progress |
| **Re-encode** (Movie mode only) | Rebuilds the movie file from the frame images already written |

!!! note "You can leave Backend set to Umbreon"
    Umbreon is built into the visualization library, so no external program or
    path setting is needed. **Umbreon (NPR)** is the same ray tracer with shading replaced by hatching,
    producing ink-drawing style figures (→ [NPR](../reference/rendering-npr.md)).
    The remaining backend, POV-Ray, is the **legacy backend used since CueMol2 and is deprecated**
    (→ [Rendering](../reference/rendering.md)).

## Image tab

Settings that do not depend on the backend, such as the size of the output image.
Choose the size from a preset, or specify the width and height directly with Custom.

| Mode | Size presets |
|---|---|
| Still | Custom / Current view / 100×100 (72dpi) / 300×300 (300dpi) / 600×600 (300dpi) / 1200×1200 (600dpi) |
| Movie | Custom / QVGA (320×240) / VGA (640×480) / SVGA (800×600) / XGA (1024×768) / HD720 (1280×720) / HD1080 (1920×1080) |

Selecting **Current view** gives the same size as the molecular view in the main window.

## Render tab

Settings that are specific to each backend. When you switch backends, items the backend does not support are hidden.

For Umbreon, there is a **Quality** section at the top. Quality is split into independent axes,
each with its own dropdown, and usually choosing here is all you need to do.

| Item | Description |
|---|---|
| Lighting | How shading is applied (Raytrace only / Ambient Occlusion / Global Illumination) |
| Supersampling | Basic image quality. The quality of edge lines is also determined by this |
| AO quality / GI lighting | Quality of the method selected in Lighting (for Global Illumination, the distribution of light) |
| Shadows | Cast shadows |

The accordion below lists the individual settings. For details and default values, see
[Rendering](../reference/rendering.md).

For Umbreon (NPR), a **Hatching** section is added at the top, where you specify the drawing feel (Style), the
combination of ink and paper (Coloring), and the density and thickness of lines and dots. Global Illumination
is no longer available under Lighting in Quality. For the **Detail** tab, which allows finer adjustment, see
[NPR](../reference/rendering-npr.md).

For the POV-Ray backend, you can specify the radiosity mode, whether shadows are drawn, and lighting (use of the default light /
light source spread / intensity), among others. There is no Quality section.

The contents of Render Settings, including the Backend selection, are saved in the scene and restored for each scene.
Changes are undoable, and ++cmd+z++ also works inside this window
(→ [Saving settings](../reference/rendering.md#saving-settings)).

## Movie mode

In Movie mode, in addition to the above, you specify the output folder, frame rate, movie format and so on.
The output settings are retained the next time the window is opened.

The process is as follows.

1. **Start Render** renders the frames one by one and writes them to the output folder
2. When all the frames are ready, they are encoded into a movie file with ffmpeg

If you cancel partway, or want to rebuild only the movie after changing settings, the **Re-encode** button
rebuilds the movie from the frames in the output folder.

!!! note "ffmpeg is required (bundled with the release builds)"
    ffmpeg is used to encode movies. It is bundled with the macOS / Windows release assets and
    can be used as is. For builds in which it is not bundled, specify the path in Settings
    (→ [Configuring external tools](../install/external-tools.md)).

The animation itself is created in the **Animation** tab of the bottom panel in the main window
(→ [Bottom panel](bottom-panels.md)).

## Differences from CueMol2

In CueMol2, "POV-Ray rendering" and "Animation rendering" were separate dialogs.
In CueMol3 they are combined into a single window, and the **type of output** (still image / movie) is switched with the mode.

The ray tracing itself has also changed: instead of calling an external POV-Ray, the default is now
the built-in **Umbreon**.

---

*Verified against: CueMol3 2.3.14.525*
