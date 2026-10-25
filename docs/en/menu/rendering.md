<!-- source: ja/menu/rendering.md @ 6cacee7 -->

# Rendering menu

Output high-quality images and movies, and export the scene to various file formats.

## Open the rendering window

| Item | Description | Shortcut |
|---|---|---|
| Image rendering... *(renamed in CueMol3)* | Opens the rendering window in **still image (Still) mode** | |
| Movie rendering... *(renamed in CueMol3)* | Opens the rendering window in **movie (Movie) mode** | |

!!! info "Changes from CueMol2"
    In CueMol2, these were separate windows named after the Renderer: "POV-Ray rendering..." and
    "Animation rendering...". In CueMol3 they are merged into a single **rendering window**,
    and the menu items now represent the **type of output** (still image / movie).
    The rendering backend is selected in the window (the default is Umbreon, the built-in ray tracer).

    The rendering window is modeless (non-modal), so the molecular view can be operated while it is open.
    For details, see [Rendering window](../ui/rendering-window.md).

    The **Render** button on the toolbar also opens the same window, but does not change the mode.

## Export scene

Writes the current scene to various file formats. Select the format from the submenu.

| Item | Description |
|---|---|
| PNG image... | Writes a PNG image using the same rendering as the screen display. Size, resolution (DPI) and background transparency can be specified |
| Umbreon ray-traced image... | Writes a PNG ray-traced with Umbreon, the built-in ray tracer. The options are the same as for PNG image... |
| POV-Ray SDL... | Writes a scene description file (`.pov`) for rendering with external POV-Ray. An `.inc` file is also generated in the same location. No image is output |
| STL... | Writes shape data in STL format (`.stl`) |
| Metasequoia (MQO)... | Writes a Metasequoia object file (`.mqo`) |

!!! note "When some items are not displayed"
    Items for exporters that are not built into the library in use are
    **hidden from the submenu** by a check at startup. The distributed builds include Umbreon,
    but if you build CueMol yourself without enabling `HAVE_UMBREON`,
    **Umbreon ray-traced image...** is not displayed.

    Export to LuxRender / Warabi / raw format / QSL, which was available in CueMol2, is not provided in CueMol3.

---

*Verified against: CueMol3 2.3.7.489*
