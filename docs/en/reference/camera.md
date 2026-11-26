<!-- source: ja/reference/camera.md @ d6bebaf -->

# Camera

A **camera** is a named, saved state of the view (position, orientation, zoom and slab).
Cameras are listed in **Explorer &gt; Camera** in the side panel, and can be recalled at any time to return to the same view.

## Working with cameras

Cameras are managed in the **Camera panel**, which appears when **Explorer** is selected in the activity bar
(→ [Side panels](../ui/side-panels.md#camera-panel)).
The seven most common commands are toolbar buttons; the rest are in the right-click menu of a row.

In the table below, the "Right-click menu" column gives the menu item name and the "Toolbar" column gives the button tooltip.

| Right-click menu | Toolbar | Description |
|---|---|---|
| New Camera... | New camera from view | Creates a new camera from the current view. If a camera with the same name exists, it is overwritten without confirmation. |
| Save from view | Save from view | Overwrites the selected camera with the current view. |
| Save from scene (with vis flags) | Save from view with show/hide | Same as above, and also saves the visibility flags. |
| Apply to view | Apply to view | Returns to the saved view. |
| Apply to scene (with vis flags) | Apply to view with show/hide | Same as above, and also restores the visibility flags. Double-clicking a row does the same. |
| Delete | Delete | Deletes the camera. The ++delete++ / ++backspace++ keys do the same. |
| Rename... | — | Renames the camera. ++f2++ does the same. |
| Copy / Paste Camera | — | Copies and pastes cameras. Also available from the Edit menu and with ++cmd+c++ / ++cmd+v++. |
| Camera file &gt; Load... / Reload / Save / Save As... | — | Reads and writes camera files (`.cam`). **Reload** is available only for cameras loaded from a file. |
| Edit vis flags / Clear vis flags | — | Edits or clears the visibility flags. **Edit vis flags** opens **Visibility** in the inspector. **Clear vis flags** is available only for cameras that have flags. |
| Properties... | Property | Shows the camera in the [inspector](../ui/inspector.md). |

The order of the list can be changed by dragging rows, and is saved in the scene file.
`__current` is pinned at the top and cannot be reordered.

## `__current`

`__current` is a special camera that represents the current view. Every scene has it from the moment it is created,
and it is updated to the current view just before the scene is saved, an image is exported, rendering starts, and so on.
It is also the default start camera of an animation.

- It cannot be deleted, renamed, overwritten, applied or copied. It can be saved to a `.cam` file with
  **Camera file &gt; Save As...** in the right-click menu.
- It holds only the view, not visibility flags.
- It is not subject to Undo. Saving it with **File &gt; Save current view...** does not
  mark the scene as changed, nor does it clear Redo.

!!! note "CueMol2 (UXP version) does not preserve camera order"
    Camera order was introduced in CueMol3. If a scene with a custom order is saved again in CueMol2,
    the cameras return to alphabetical order.

## Information stored in a camera

**Property** on the toolbar or **Properties...** in the right-click menu shows the camera in the
[inspector](../ui/inspector.md). While the inspector is shown, selecting another row in the
Camera panel switches the inspector to that camera as well.

| Section | Contents |
|---|---|
| Camera | **Name** (the name; it can also be changed here) and **Source** (the path for a camera loaded from a camera file, otherwise `Embedded in the scene`). A camera loaded from a camera file has **Reload** / **Save** buttons. |
| View | The saved view (Center / Rotation / Zoom / Distance / Slab / Projection / Center mark). Display only; it cannot be edited. |
| Visibility | The visibility flags (see below) |

For `__current`, only the Camera section is shown, and the only button is **Save As...**.

<!-- TODO(content): Derive the meaning of each property from the C++ Camera definition -->

## Camera files (`.cam`)

Cameras can be written to and read from `.cam` files one at a time.
Use **Camera file** in the right-click menu of the Camera panel.

| Item | Description |
|---|---|
| Load... | Chooses a `.cam` file and adds it to the scene as a camera. The added camera is applied to the current view immediately, and for a camera with visibility flags, the show / hide state is also restored. If a camera with the same name exists, it is added under a changed name such as `copy1_<name>`. |
| Reload | Reloads the camera from the file it was loaded from. |
| Save | Overwrites the file the camera was loaded from. For a camera not loaded from a file, it behaves like Save As.... |
| Save As... | Saves the camera to a new file. |

A camera loaded from a file or saved to a file becomes **linked** to that file,
and its row in the Camera panel gets a link icon (the file path is shown in **Source** in the inspector).

- In the scene file (`.qsc`), a linked camera is saved as a reference to the file, and it is loaded from that
  file when the scene is opened.
- **When the scene is saved, linked cameras are also written to their files.** Note that a `.cam` file shared
  with other scenes is overwritten as well.

The current view can also be written to a `.cam` file with **Save current view...** in the File menu
(→ [File menu](../menu/file.md)). In this case, no camera is added to the scene and no link to the file is made.

## Visibility flags

A camera can carry flags that specify whether each Renderer is shown when the camera is applied.
Use them to switch the visible elements from one view to another.

The visibility flags are edited in the **Visibility** section of the inspector. The Objects and
Renderers of the scene are listed (Renderers are indented under their Object); the checkbox of each row specifies
whether it is included in the camera, and the eye button specifies whether it is shown or hidden when the camera is applied.

- **Capture**: Includes all rows and records the current show / hide state of the scene (the view is not changed).
- **Clear**: Clears the visibility flags.
- Changes take effect on the spot, and each change is undone with a single Undo.

## See also

- [Animation](animation/index.md) — [CamMotion](animation/cammotion.md) targets cameras.
- [File menu](../menu/file.md)
- [Side panels](../ui/side-panels.md#camera-panel)

---

*Verified against: CueMol3 3.0.3.565*
