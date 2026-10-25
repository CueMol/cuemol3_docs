<!-- source: ja/menu/edit.md @ 6cacee7 -->

# Edit menu

This menu covers undoing operations, the clipboard, editing molecular structures, and application settings.

## Undo and redo

| Item | Description | Shortcut |
|---|---|---|
| Undo | Undoes the last operation. Disabled when there is nothing to undo | ++cmd+z++ |
| Redo | Redoes an undone operation. Disabled when there is nothing to redo | macOS: ++cmd+shift+z++ / Windows, Linux: ++ctrl+y++ |

The shortcuts act on whichever element has focus. If you undo a typing mistake in a text field
with ++cmd+z++, scene operations are not rolled back. The Undo / Redo buttons on the toolbar
always act on the scene, regardless of focus.

!!! tip "Undoing several steps at once"
    The toolbar's Undo / Redo buttons have a history dropdown, which lets you
    go back several steps at once (→ [Toolbar and tool palette](../ui/toolbar-tools.md)).
    You can check the operation performed in each step in the History panel of the Actions view
    (→ [Recording and replaying operations](../reference/actions.md)).

## Clipboard

| Item | Description | Shortcut |
|---|---|---|
| Cut | Cuts the selected item | ++cmd+x++ |
| Copy | Copies the selected item | ++cmd+c++ |
| Paste | Pastes the clipboard contents | ++cmd+v++ |
| Select All | Selects everything in the text field if one has focus; otherwise selects everything in the active selectable area (such as the log in the Output panel) | ++cmd+a++ |

What Cut / Copy / Paste act on **depends on where the focus is**.

| Focus | Target |
|---|---|
| Text field | The text being entered (standard OS editing operations) |
| Scene tree | Object / Renderer / Renderer group / style set nodes |
| Camera panel | Cameras |
| Paint table in the Color panel | Table rows |
| History panel in the Actions view | Copies the operation of the selected step as a Console command (Copy only) |

**Cut** in the scene tree was added in CueMol3. The selection is deleted only after it has been
written to the clipboard, so the selection is never lost if writing fails, and the deletion can be
reverted with a single Undo. The same operation is also available from the scene tree's context menu.

!!! info "You can copy and paste between CueMol2 and CueMol3"
    Copying goes through the OS clipboard. You can copy a Renderer / Renderer group / Object /
    camera / style / Paint row in CueMol3 and paste it into CueMol2, or the other way around.
    Selections and colors are resolved again against the destination scene when pasting,
    so you can also paste into a different Renderer or a different scene.

    Using the OS clipboard has two side effects: copying in CueMol3 replaces the text
    on the clipboard, and copying in another application discards
    what you copied earlier.

## Clearing history

| Item | Description | Shortcut |
|---|---|---|
| Clear undo data | Discards the Undo history. The Undo / Redo state is updated as well | |

## Editing molecular structures

All of these open a tool dialog.

| Item | Description | Shortcut |
|---|---|---|
| Merge molecule... | Merges two molecule Objects into one | |
| Delete mol atoms... | Deletes the selected atoms from a molecule | |
| Change chain ID... | Changes the chain ID | |
| Change residue number... | Changes the residue number | |

## Settings

| Item | Description | Shortcut |
|---|---|---|
| Options | Opens the Settings tab (switches to it if it is already open). **Windows / Linux only** (on macOS, use Preferences... in the application menu) | ++ctrl+k++ |

!!! info "Settings is a tab, not a dialog"
    In CueMol2, Options was a modal preferences window; in CueMol3 it opens as a tab in the
    content area, so you can work in the molecular view while looking at the settings.
    You can also open it from the gear icon at the bottom of the activity bar on the far left.

---

*Verified against: CueMol3 2.4.0.546*
