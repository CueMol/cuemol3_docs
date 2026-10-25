<!-- source: ja/menu/index.md @ 6cacee7 -->

# Menu reference

A list of every item in the CueMol3 menu bar. For items that were renamed, moved or removed since CueMol2, see also
[Merged, renamed and removed features](../changes/features.md).

## Differences between operating systems

The menu contents differ slightly depending on the OS.

| | macOS | Windows / Linux |
|---|---|---|
| Menu bar location | System menu bar at the top of the screen (OS native) | Top of the window |
| Application menu | Yes (see below) | No |
| Item that opens the settings | Application menu &gt; **Preferences...** | **Edit &gt; Options** |
| Quit | Application menu &gt; **Quit CueMol3** | **File &gt; Quit** |
| **About CueMol3** | In the application menu | In the **Help** menu |
| **Check for Updates...** | In the application menu | In the **Help** menu |
| **Help** menu | Not shown (its only items are About and Check for Updates, and these are in the application menu) | Shown |

Read the modifier key ++cmd++ on macOS as ++ctrl++ on Windows / Linux.
This reference uses ++cmd++ and gives both where necessary.

## macOS application menu

On macOS, the menu named after the application (**CueMol3**) has the following items.

| Item | Description | Shortcut |
|---|---|---|
| About CueMol3 | Shows the version information | |
| Check for Updates... | Checks for a new release and, if there is one, updates in the app (→ [Updating](../install/update.md)) | |
| Preferences... | Opens the Settings tab (switches to it if it is already open) | ++cmd+comma++ |
| Services | The macOS Services menu | |
| Hide CueMol3 | Hides the window | ++cmd+h++ |
| Hide Others | Hides the windows of other apps | ++cmd+opt+h++ |
| Show All | Shows all windows again | |
| Quit CueMol3 | Quits CueMol3. If there are unsaved scenes, a confirmation is shown | ++cmd+q++ |

## Menus

<div class="grid cards" markdown>

- **[File](file.md)** — Reading and writing scenes and Objects, tab operations
- **[Edit](edit.md)** — Undo, molecule editing, settings
- **[Rendering](rendering.md)** — Image and movie output, scene export
- **[Scene](scene.md)** — Background color, scene properties
- **[View](view.md)** — Projection mode, center mark, view properties
- **[Tools](tools.md)** — Analysis and calculation tools
- **[Window / Help](window-help.md)** — Switching windows, version information

</div>

## Legend

The tables on each page use the following symbols.

| Symbol | Meaning |
|---|---|
| <span class="badge-wip">In development</span> | The item exists in the menu but **does not work in the current version**. Choosing it does nothing |
| *(added in CueMol3)* | An item that did not exist in CueMol2 and was newly added in CueMol3 |
| *(renamed in CueMol3)* | An item whose name changed from CueMol2 |

Items that existed in CueMol2 but are **no longer** in the CueMol3 menus are not listed in this reference.
Where they moved to, and alternatives, are summarized in [Merged, renamed and removed features](../changes/features.md).

---

*Verified against: CueMol3 2.4.0.546*
