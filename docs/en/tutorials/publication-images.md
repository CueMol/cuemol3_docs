<!-- source: ja/tutorials/publication-images.md @ 773364a -->

# Exporting high-resolution images for publication

This tutorial walks through exporting a scene as an image of publication or presentation quality.
It uses the scene finished in [Making a protein ribbon figure](ribbon-figure.md) as the example,
but the procedure is the same for any scene.

!!! info "Screenshots planned"
    Screenshots showing the workflow will be added to this page.

<!-- TODO(screenshot): Finished result. Comparison of a screen capture and the ray-traced result with the same composition -->

## 1. The two output methods and when to use them

| Method | Characteristics | Suited for |
|---|---|---|
| **Rendering &gt; Export scene &gt; PNG image...** | Exports the on-screen rendering as is. Fast | Working records, slides, checking |
| **Rendering &gt; Image rendering...** (rendering window) | High-quality rendering by ray tracing. Higher quality shading and outlines | Figures for papers, posters |

A quick and reliable workflow is to check the composition with Export scene first,
then finish the final version in the rendering window. The finished image is normally pasted
into presentation software or figure-making software to assemble a composite figure.

## 2. Exporting the screen as PNG

When **Rendering &gt; Export scene &gt; PNG image...** is selected, an options screen appears
after the destination is specified.

- **Size** and **resolution (DPI)** can be specified
- Enabling **background transparency** produces a PNG with a transparent background (useful for overlaying on slides)

DPI does not affect the number of pixels in the image. It determines the **physical size on paper**
when the exported PNG is pasted into other software and printed (for example, a 1200×1200 pixel
image exported at 600 DPI prints at 2×2 inches, about 5 cm square).

For other output formats (POV-Ray SDL / STL / MQO, etc.), see the
[Rendering menu](../menu/rendering.md).

## 3. Finishing with ray tracing

When **Rendering &gt; Image rendering...** is selected, a separate **rendering window** opens
in Still mode. The window is modeless, so the view can be adjusted in the main window while
it stays open (→ [Rendering window](../ui/rendering-window.md)).

1. In the run bar at the bottom, select the view to render in **Target**.
   **Backend** can be left at the default, **Umbreon**
2. Select the output size in the **Image** tab. Choose a preset (for example, **1200×1200 (600dpi)**)
   or specify the width and height directly with **Custom**
3. In the **Quality** section of the **Render** tab, set **Lighting** (how shading is applied) to
   **Raytrace only**. This is sufficient to give a clean result for a cartoon figure like this one.
   **Supersampling** (the setting that smooths outlines) can be left at the default
4. Press **Start Render** to start rendering. Progress is displayed

<!-- TODO(screenshot): Rendering window. Size selection in the Image tab -> Quality section of the Render tab (Lighting = Raytrace only) -->

!!! tip "Global Illumination for depth in shading"
    Setting **Lighting** to **Global Illumination** (the default) gives shading by global
    illumination, which adds a sense of depth. For figures with only a cartoon, however, the
    effect is small. Try it on figures with intricate shapes such as molecular surfaces.

    <!-- TODO(screenshot): Comparison of Raytrace only and Global Illumination (same composition, preferably an intricate shape where the effect of GI is visible). Insert indented inside this admonition with a width attribute + .on-glb -->

For the meaning of each quality item and how to choose among them, see [Rendering](../reference/rendering.md).

!!! note "Differences from CueMol2"
    High-quality output in CueMol2 called an external POV-Ray, but in CueMol3 the built-in
    ray tracer **Umbreon** is the default, and neither preparing an external program nor
    setting a path is needed (→ [Rendering window](../ui/rendering-window.md)).

## 4. Checking and saving the result

When rendering completes, the resulting image is displayed in the image area at the upper left
of the window.

- **Save** in the image area toolbar saves it as a PNG file
- **Copy** copies it to the clipboard
- The arrow buttons step back through the history of past rendering results. The history also
  records the settings used at the time, and pressing **Use settings** restores them

If the composition or quality is not satisfactory, adjust in the main window and run
**Start Render** again. Settings remain in the result history, so results can be compared
while experimenting.

!!! note "Rendering window settings are saved in the scene"
    The settings are saved together with the scene file and are still there the next time the
    scene is opened. Changes to the settings can be reverted with Undo. To return to past
    settings, use **Use settings** in the result history (→ [Rendering](../reference/rendering.md#saving-settings)).

## Next steps

- [Rendering](../reference/rendering.md) — Details and default values of the quality items
- [Rendering window](../ui/rendering-window.md) — Description of each part of the window

---

*Verified against: CueMol3 2.3.13.523*
