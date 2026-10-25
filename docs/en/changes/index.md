<!-- source: ja/changes/index.md @ 570ee02 -->

# Changes from CueMol2

CueMol3 shares its visualization engine (libcuemol2) with CueMol2, and scene file (`.qsc`)
compatibility is also preserved. The **GUI, however, has been completely rebuilt**, moving from
Mozilla XULRunner to Electron + React. As a result, the way you operate the program has changed substantially.

## Most important changes

| # | Change | Description | Details |
|---|---|---|---|
| 1 | **Single window + tabs** | Features no longer open in separate windows; scenes and views are arranged as tabs. File &gt; New Window has been removed (use New Tab) | [Window layout](../ui/index.md) |
| 2 | **Live editing in the inspector** | Rendering settings are edited in a permanent property inspector instead of a modal dialog for each type. Changes are reflected in the molecular view the moment a value changes, and can be reverted with Undo | [Property inspector](../ui/inspector.md) |
| 3 | **Unified rendering window** | The two dialogs "POV-Ray rendering" and "Animation rendering" have been merged into a single modeless rendering window, which switches between still image and movie by mode | [Rendering window](../ui/rendering-window.md) |
| 4 | **Toolbar and tool palette** | Split into a toolbar at the top (commands that run immediately) and a tool palette at the left edge of the molecular view (switching of operation modes) | [Toolbar and tool palette](../ui/toolbar-tools.md) |
| 5 | **Measurement and bond editing as tools** | Measuring distances / angles / dihedral angles and adding bonds are now tools that you use by clicking directly in the molecular view, not dialogs | [Toolbar and tool palette](../ui/toolbar-tools.md) |
| 6 | **New Animation panel** | In CueMol2, animations were edited with a list and a modal settings dialog, with no graphical timeline. CueMol3 adds a strip-style timeline to the Animation tab of the bottom panel, with one element = one bar | [Bottom panel](../ui/bottom-panels.md) |
| 7 | **Redesigned selection UI** | Everywhere a selection expression is entered (the Selection panel, the dialogs of New Renderer and the tools, the selection cells of Paint, and so on), a selection builder for assembling a selection in the GUI is now available, in addition to validation and history | [Selection builder](../ui/selection-builder.md) |
| 8 | **Options → Settings tab** | Settings open as a tab in the content area instead of a modal preferences window | [Configuring external tools](../install/external-tools.md) |

## Details

<div class="grid cards" markdown>

- **[Changes in the interaction model](ui-paradigm.md)**

    Why the modal-dialog-centered design was dropped, and where things are placed now.

- **[Merged, renamed and removed features](features.md)**

    A correspondence table of renamed and moved features, and of alternatives for removed features.

- **[Development status and unimplemented features](status.md)**

    The current implementation status, and the remaining limitations and known issues.

</div>

!!! tip "Looking for changes in each release?"
    This section summarizes the **differences between CueMol2 and CueMol3**.
    To see what changed when the CueMol3 version went up,
    see the **[release history](../releases.md)**.

## What stays the same

- **Scene file (`.qsc`) compatibility**: Scenes created in CueMol2 can be opened in CueMol3.
- **Visualization engine**: Renderer types, selection expression syntax and supported file formats are shared.
- **License**: Still the MIT License.

---

*Verified against: CueMol3 2.3.10.504*
