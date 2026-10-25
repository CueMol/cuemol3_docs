<!-- source: ja/reference/camera.md @ 570ee02 -->

# Camera

A **camera** is a named, saved state of the view (position, orientation, zoom and slab).
Cameras are listed in **View &gt; Camera** in the side panel, and can be recalled at any time to return to the same view.

!!! info "In preparation"
    This page is only an outline. Details of each item will be added later.

## Working with cameras

Cameras are managed in the **Camera panel**, which appears when **View** is selected in the activity bar
(→ [Side panels](../ui/side-panels.md#camera-panel)).
The six most common commands are toolbar buttons; the rest are in the right-click menu of a row.

In the table below, the "Right-click menu" column gives the menu item name and the "Toolbar" column gives the button tooltip.

| Right-click menu | Toolbar | Description |
|---|---|---|
| New Camera... | New camera from view | Creates a new camera from the current view. If a camera with the same name exists, it is overwritten without confirmation |
| Save from view | Save from view | Overwrites the selected camera with the current view |
| Save from scene (with vis flags) | Save from view with show/hide | Same as above, and also saves the visibility flags |
| Apply to view | Apply to view | Returns to the saved view |
| Apply to scene (with vis flags) | Apply to view with show/hide | Same as above, and also restores the visibility flags. Double-clicking a row does the same |
| Delete | Delete | Deletes the camera. The ++delete++ / ++backspace++ keys do the same |
| Rename... | — | Renames the camera. ++f2++ does the same |
| Copy / Paste Camera | — | Copies and pastes cameras. Also available from the Edit menu and with ++cmd+c++ / ++cmd+v++ |
| Camera file &gt; Load... / Reload / Save / Save As... | — | Reads and writes camera files (`.cam`). **Reload** is available only for cameras loaded from a file |
| Edit vis flags... / Clear vis flags | — | Edits or clears the visibility flags. **Clear vis flags** is available only for cameras that have flags |

The order of the list can be changed by dragging rows, and is saved in the scene file.
`__current` is pinned at the top and cannot be reordered.

!!! note "CueMol2 (UXP version) does not preserve camera order"
    Camera order was introduced in CueMol3. If a scene with a custom order is saved again in CueMol2,
    the cameras return to alphabetical order.

## Information stored in a camera

<!-- TODO(content): Derive the camera properties (center position / rotation / zoom / slab, etc.)
     from the C++ Camera definition -->

## Camera files (`.cam`)

The camera of the current view can be written to a `.cam` file with **Save current view...**
in the File menu (→ [File menu](../menu/file.md)).

<!-- TODO(content): How .cam files are loaded, and how they relate to the cameras in the Camera panel -->

## Visibility flags

A camera can carry flags that specify whether each Renderer is shown when the camera is applied.
Use them to switch the visible elements from one view to another.

<!-- TODO(content): Describe the items of the visibility flag editing dialog (EditCameraVisFlags) -->

## See also

- [Animation](animation/index.md) — [CamMotion](animation/cammotion.md) targets cameras
- [File menu](../menu/file.md)
- [Side panels](../ui/side-panels.md#camera-panel)

---

*Verified against: CueMol3 2.3.15.530*
