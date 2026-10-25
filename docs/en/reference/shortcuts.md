<!-- source: ja/reference/shortcuts.md @ e4bd8cd -->

# Keyboard shortcuts

A list of the keyboard shortcuts available in CueMol3.
Read ++cmd++ as ++ctrl++ on Windows / Linux.

!!! note "Key bindings cannot be changed"
    In the current version, shortcut keys cannot be customized
    (→ [Merged, renamed and removed features](../changes/features.md)).

## File operations

| Action | Shortcut |
|---|---|
| New Tab | ++cmd+t++ |
| Open File... | ++cmd+o++ |
| Open Scene... | ++cmd+shift+o++ |
| Close Tab | ++cmd+w++ |
| Reload Scene | ++cmd+r++ |
| Save Scene | ++cmd+s++ |
| Save Scene As... | ++cmd+shift+s++ |

→ [File menu](../menu/file.md)

## Edit

| Action | Shortcut |
|---|---|
| Undo | ++cmd+z++ |
| Redo | ++ctrl+y++ (Windows / Linux)<br/>++cmd+shift+z++ (macOS) |
| Cut | ++cmd+x++ |
| Copy | ++cmd+c++ |
| Paste | ++cmd+v++ |
| Select All | ++cmd+a++ |

The target of Cut / Copy / Paste depends on where the focus is.
In a text field they act on the text being typed, in the scene tree on nodes, and in the
Paint table of the Color panel on table rows. In the History panel of the Actions view, Copy copies the
operation of the selected step as a command.

++cmd+z++ (Undo) also depends on the focus. Undoing a typo in a text field
does not roll back operations on the scene.

++cmd+a++ (Select All) behaves differently depending on where the focus is.

→ [Edit menu](../menu/edit.md)

## Preferences and quit

| Action | Shortcut |
|---|---|
| Preferences... (macOS) | ++cmd+comma++ |
| Options (Windows / Linux) | ++ctrl+k++ |
| Quit (Windows / Linux) | ++ctrl+q++ |
| Quit CueMol3 (macOS) | ++cmd+q++ |

## Switching tools in the tool palette

The tool palette at the left edge of the molecular view can be switched with single letter keys.
The keys do not work while a text field has the focus or while a modifier key is held down.

| Tool | Key |
|---|---|
| Navigate | ++n++ |
| Rect Select | ++b++ |
| Lasso | ++l++ |
| Distance | ++d++ |
| Angle | ++a++ |
| Torsion | ++t++ |
| Add Bond | ++e++ |

→ [Toolbar and tool palette](../ui/toolbar-tools.md)

## Toggling the display

| Action | Shortcut |
|---|---|
| Tool palette (collapse the tool palette) | ++cmd+shift+p++ |

→ [View menu](../menu/view.md#tool-palette)

## Others

| Action | Key |
|---|---|
| Delete the selected rows in the scene tree / Camera panel | ++delete++ / ++backspace++ |
| Start renaming (scene tree, Camera panel, Paint table) | ++f2++ |
| Close a menu (menu bar on Windows / Linux) | ++escape++ |

For viewpoint operations with the mouse or trackpad, see
[Mouse and trackpad input](../ui/mouse-input.md).

## See also

- [Menu reference](../menu/index.md)
- [Toolbar and tool palette](../ui/toolbar-tools.md)
- [Mouse and trackpad input](../ui/mouse-input.md)

---

*Verified against: CueMol3 2.4.0.546*
