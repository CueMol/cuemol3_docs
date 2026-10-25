<!-- source: ja/reference/settings.md @ e4bd8cd -->

# Settings reference

A list of the items in the **Settings** tab. Open it from **Preferences...** (++cmd+comma++) in the application menu on macOS, or from **Edit &gt; Options** (++ctrl+k++) on Windows / Linux.

Choose a category in the tree on the left, then edit the values on the right.

## Display

### Theme

| Item | Default | Description |
|---|---|---|
| Dark Mode | ON | Switches between the dark and light themes |

### Atom Labels

Format of the atom labels shown in the molecular view.

| Item | Default | Description |
|---|---|---|
| Atom Label Font | sans-serif | Label font. Choose from the fonts installed on the system |
| Atom Label Size | 12 px | Font size (6 to 72 px) |
| Atom Label Color | `#FFFF00` | Color of the label text |
| Atom Label Bold | OFF | Makes the label bold |
| Atom Label Italic | OFF | Makes the label italic |

### Rendering

Paths of the external tools used by the rendering window.
If they are bundled with the release assets, the default values work as they are
(→ [Configuring external tools](../install/external-tools.md)).

| Item | Description |
|---|---|
| POV-Ray Executable | Path to the POV-Ray executable |
| POV-Ray Include Directory | Directory containing the standard POV-Ray include files |
| blendpng Executable | Path to blendpng, which composites the layers of a rendering result |
| ffmpeg Executable | Path to ffmpeg, used to encode movies |

!!! note "No setup is needed for the default rendering"
    The default rendering backend, the built-in ray tracer **Umbreon**, is built into the library,
    so it has no items in Settings. POV-Ray and blendpng in the table above are used only
    when the legacy POV-Ray backend is selected
    (→ [Rendering](rendering.md)).

## Input

### Mouse & Navigation

| Item | Default | Description |
|---|---|---|
| Pointing device | Auto-detect | How scroll input is mapped to view operations. **Mouse** zooms with the wheel; **Mac trackpad** translates with two-finger scrolling and zooms with pinch; **Auto-detect** infers the device from the characteristics of the scroll input |
| XY Rotation Sensitivity | 0.8 | Sensitivity of rotation around the X / Y axes (0.1 to 5.0) |
| Pick Precision | 10 px | Tolerance radius when picking atoms or Objects by clicking (1 to 50 px) |
| GPU Picking | ON | Picks from the rendered shapes themselves. When OFF, picking reverts to the earlier method based on atom positions. This is a fallback for slow machines. Switching takes effect immediately |
| Hover Info | ON | Shows what is under the pointer in a corner of the molecular view. When OFF, the picking calls themselves stop |
| Hover Highlight | ON | Highlights the element under the pointer in the molecular view. Requires both GPU Picking and Hover Info |

→ [Picking and hover display](../ui/mouse-input.md#picking-and-hover-display)

## General

### Files

Specifies, for each route, whether a loaded file is added to the current scene or opened in a new scene.

| Item | Default | Description |
|---|---|---|
| Drag and drop opens into | Current scene | Destination of files dragged and dropped onto the window. **Current scene** adds them to the scene of the active tab. **New scene** opens them in a dedicated tab |
| File manager opens into | Current scene | Destination of files opened from the file manager (Finder / Explorer), specified on the command line, or passed from another instance while CueMol3 is running |

- **File &gt; Open File... and Open Recent always load into the current scene, regardless of this setting.**
  When choosing from the menu you are looking at the scene, so a different destination would be
  more surprising than helpful.
- Scene files (`.qsc`) are not affected by this setting and are opened by the usual rules.
- Even when **New scene** is selected, if the active scene is empty (nothing has been loaded
  and nothing has been changed), the file is loaded into that scene.
- Multiple files opened together share a single scene.

### Updates

Checking for new releases and in-app updates. Only the macOS (Apple Silicon) version can be updated.

| Item | Default | Description |
|---|---|---|
| Check for Updates at Startup | ON | Checks for a new release after startup and notifies you if there is one. Manual checks are still possible when OFF |
| Check for Updates | — | Shows the current version and status. It has **Check Now** / **Release Page** / **Update** buttons |

For details, see [Updating](../install/update.md).

## Tools

### APBS / PDB2PQR

Settings for the external tools used to calculate electrostatic potentials
(→ [Configuring external tools](../install/external-tools.md)).

| Item | Description |
|---|---|
| APBS Executable | Path to APBS, which calculates electrostatic potential maps |
| pdb2pqr Executable | Path to pdb2pqr, which assigns charges and radii |
| pdb2pqr Force Field | Default force field that pdb2pqr uses to assign charges |

!!! note "Where settings are stored"
    The atom label and view navigation values are saved as a user style when the window is closed,
    and the others are saved as application settings. The only exception is API keys, which are
    encrypted and stored in the secure storage of the OS.

## Plugins

### Installed

Turns plugins on and off. The row label is the plugin name, and the switch on the right
enables or disables it (→ [Plugins](plugins/index.md)).

| Item | Default | Description |
|---|---|---|
| AI Agent | OFF | A chat panel that builds a scene from instructions written in text (→ [AI Agent](plugins/ai-agent.md)) |
| MD Tools | OFF | **File &gt; Open MD Trajectory...** and the **Trajectory** tab in the bottom panel |
| Console | ON | The CueMol command line. The PyMOL-compatible mode is also available (→ [Console](plugins/console/index.md)) |
| MCP Server | OFF | Allows AI clients to operate CueMol3 via MCP (→ [MCP Server](plugins/mcp-server.md)) |
| Component Catalog | OFF | A catalog of UI components (for CueMol3 UI development) |

Plugins that cannot be toggled (Get PDB / Sequence Panel) are not listed here.

### AI Agent

This page appears when **AI Agent** is enabled. Set the model and API key to use.
For the list of items, see [AI Agent](plugins/ai-agent.md).

### Console

This page appears when **Console** is enabled (Console is enabled by default).

| Item | Default | Description |
|---|---|---|
| Command line access | OFF | Allows commands from tritium_cli to be executed in this running window. In a CueMol3 launched by tritium_cli, access is allowed for that session only, without changing this setting |
| Command line tool | — | Path to the bundled tritium_cli. It can be copied with **Copy**, and instructions for adding it to PATH are shown alongside |

For details, see [tritium_cli](plugins/console/cli.md).

### MCP Server

This page appears when **MCP Server** is enabled.

| Item | Default | Description |
|---|---|---|
| Accept connections | ON | Accepts connections from MCP clients |
| Port | 27182 | Port to listen on (1024 to 65535). Applied when ++enter++ is pressed or the field loses focus. Values outside the range are not applied |

For details, see [MCP Server](plugins/mcp-server.md).

## See also

- [Edit menu](../menu/edit.md)
- [Configuring external tools](../install/external-tools.md)
- [Rendering](rendering.md)
- [Mouse and trackpad input](../ui/mouse-input.md)

---

*Verified against: CueMol3 2.4.0.546*
