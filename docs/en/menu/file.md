<!-- source: ja/menu/file.md @ 6cacee7 -->

# File menu

Reads and writes scenes and Objects, and manages tabs.

## Tabs

| Item | Description | Shortcut |
|---|---|---|
| New Tab | Creates a new tab. In the dialog, choose **New Scene** (a new scene) or **New View** (another view of an existing scene). New Scene also lets you set the display settings of the new scene (**Scene settings**: Anti-aliasing / Ambient occlusion / Background / CMYK color proofing). The confirmed values become the defaults for subsequent new scenes (including those created at startup or by dropping a file). New View also lets you choose whether to inherit the current camera | ++cmd+t++ |
| Close Tab | Closes the current tab. If the scene is unsaved and only one view is showing it, you are asked whether to save | ++cmd+w++ |

## Loading Objects

| Item | Description | Shortcut |
|---|---|---|
| Open File... | Opens files such as molecular coordinates, density maps and molecular surfaces. The Renderer type and format-specific options can be set at load time | ++cmd+o++ |
| Open MD Trajectory... | Opens an MD simulation trajectory *(added in CueMol3)*. It appears when the **MD Tools** plugin is enabled (→ [Plugins](../reference/plugins/index.md)) | |
| Get PDB... | Fetches a structure from the network by PDB ID. Coordinates (RCSB CIF / PDB) and density maps (RCSB cif.gz, EBI MTZ) are supported. The data is loaded directly without a temporary file, and can be interrupted with Cancel in the progress dialog | |
| Open Recent | Opens a file chosen from the list of recently opened files (up to 10). **Clear Menu** clears the history | |

For the list of supported formats, see [Supported file formats](../getting-started/index.md#supported-file-formats).

For files whose format cannot be determined from the extension alone (such as `.cif`, where several formats share the same extension), the format is **determined by reading the contents**. Files whose header is long and whose coordinates start several hundred KB into the file, such as recent PDB mmCIF files, can also be opened.

When opening a CCP4/MRC density map, the options screen shows the grid size and the amount of memory required to load it. **Map type** specifies whether the map is treated as a crystallographic map or a cryo-EM map (the default is *Auto (from header)*, which decides from the file header), and **Subsample** loads the map with the grid thinned out
(→ [DensityMap](../reference/objects/densitymap.md#マップの種類-map-type)).
For maps with too many grid points, a warning is shown and a **Subsample** value that fits in memory is suggested.
**Subsample** discards grid points at load time, so the map cannot be made finer afterwards.
**Map type** and **Subsample** are shown only when opening CCP4/MRC. For maps in other formats, Map type can be changed in the inspector after loading.

When opening a density map, the Renderer options show **View after loading** instead of an atom selection. *Auto (by map kind)* (the default) moves the view so that the whole map fits for cryo-EM maps (*Move view center (fit the map)*), and for crystallographic maps aligns the map display center with the current view center without moving the view (*Set map center (keep the view)*). Either behavior can also be selected explicitly.

Files can also be opened without the menu by **dragging &amp; dropping them from the OS onto the window** (files of types that cannot be opened are refused before you drop them). MD trajectory files (`.xtc` / `.dcd` / `.trr`) contain only frames and cannot be opened on their own, so dropping one shows a message to open it with **Open MD Trajectory...** (if MD Tools is disabled, the message asks you to enable it first in Settings &gt; Plugins). Files can also be opened by double-clicking them in the file manager or passing them on the command line
(→ [File associations](../install/index.md#file-associations)).

For these two routes, **Drag and drop opens into** / **File manager opens into** in **Settings &gt; General &gt; Files** select whether files are loaded into the current scene or a new scene (the default for both is the current scene).
**Open File...** and **Open Recent** always load into the current scene regardless of this setting
(→ [Settings](../reference/settings.md#files)).

## Saving Objects

| Item | Description | Shortcut |
|---|---|---|
| Save File As... | Saves a **single Object** to a file, not the scene. Only Objects that have a supported save format are eligible; if there are two or more of them, a screen for choosing the target appears. The save format used last becomes the default next time | |
| Save current view... | Saves the camera of the current view to a `.cam` file | |

## Reading and writing scenes

| Item | Description | Shortcut |
|---|---|---|
| Open Scene... | Opens a CueMol scene file (`.qsc`). PyMOL sessions (`.pse`) can also be loaded from here. | ++cmd+shift+o++ |
| Reload Scene | Reloads the scene from its original file. If there are unsaved changes, you are asked first. | ++cmd+r++ |
| Save Scene | Overwrites the scene file. If no save location is set, it behaves like Save Scene As.... A backup named `<file name>.bak` is created automatically before overwriting. | ++cmd+s++ |
| Save Scene As... | Saves the scene to a specified location. Save options (data embedding / compatibility / compression / character encoding) can be specified. | ++cmd+shift+s++ |

## Quit

| Item | Description | Shortcut |
|---|---|---|
| Quit | Quits CueMol3. For tabs with unsaved scenes, you are asked whether to save; canceling aborts the quit. **Windows / Linux only** (on macOS it is in the application menu) | ++ctrl+q++ |

!!! note "The window close button goes through the same confirmation"
    The close button at the top right of the window (top left on macOS) and ++cmd+q++ share the same confirmation process.

---

*Verified against: CueMol3 2.3.20.539*
