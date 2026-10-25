<!-- source: ja/menu/view.md @ 6cacee7 -->

# View menu

Settings that apply per view, such as the projection mode and the center mark of the molecular view.

## Projection

| Item | Description | Shortcut |
|---|---|---|
| Perspective | Switches to perspective projection. The current projection mode is checked | |
| Orthographic | Switches to orthographic projection. The current projection mode is checked | |

## Center mark

Selects how the mark that indicates the rotation center is displayed.

| Item | Description | Shortcut |
|---|---|---|
| Center mark &gt; Cross | Shows a cross mark | |
| Center mark &gt; Axis | Shows the coordinate axes | |
| Center mark &gt; None | Hides the center mark | |

## Tool palette

| Item | Description | Shortcut |
|---|---|---|
| Tool palette | Collapses / opens the tool palette on the molecular view. Checked while it is shown | ++cmd+shift+p++ |

When collapsed, only the handle at the top edge of the palette remains. Clicking the handle toggles it in the same way.
The state is kept for the next launch
(→ [Toolbar and tool palette](../ui/toolbar-tools.md#tool-palette)).

## View properties

| Item | Description | Shortcut |
|---|---|---|
| View property... | Opens the current view on the Generic tab of the [property inspector](../ui/inspector.md) | |

## For developers

| Item | Description | Shortcut |
|---|---|---|
| Toggle Developer Tools | Opens / closes the developer tools. Used when investigating problems | |

!!! tip "Also available from the side panel"
    The projection mode and center mark can also be switched from **View &gt; View** in the left side panel.
    This panel also provides numeric controls for view operations such as rotation, translation, zoom and slab
    (→ [Side panels](../ui/side-panels.md)).

!!! info "Hardware stereo has been discontinued"
    View &gt; Hardware stereo, which existed in CueMol2, is not provided in CueMol3
    (→ [Merged, renamed and removed features](../changes/features.md)).

---

*Verified against: CueMol3 2.3.15.530*
