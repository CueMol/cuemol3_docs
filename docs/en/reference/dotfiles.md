<!-- source: ja/reference/dotfiles.md @ f8502b6 -->

# User directory (~/.cuemol)

The `.cuemol` folder in the home folder (`~/.cuemol`) can hold scripts run at every startup and
additional style files. Use it to apply the same settings every time before starting work
(the equivalent of PyMOL's `~/.pymolrc`). It was added in 3.0.1.555.

```
~/.cuemol/
  startup.txt      native mode commands
  startup.qax      recorded operations (qax)
  startup.pml      PyM console script
  startup.cxc      ChX console script
  styles/*.xml     additional style files
  local-api.json   connection info for tritium_cli and MCP Server (created automatically)
```

Only the files that are needed have to be placed there. If the folder does not exist, nothing happens.
Setting the environment variable `CUEMOL_HOME` makes CueMol3 use that folder instead of `~/.cuemol`
(the location of `local-api.json` also changes).

## Startup scripts

When CueMol3 starts, after the first scene is created, the following files that exist are run
in this order in the [Console](plugins/console/index.md).

| Order | File | Mode it runs in |
|---|---|---|
| 1 | `startup.txt` | native mode (one command per line) |
| 2 | `startup.qax` | native mode (replays recorded operations → [Recording and replaying operations](actions.md)) |
| 3 | `startup.pml` | [PyM console](plugins/console/pymconsole.md) |
| 4 | `startup.cxc` | [ChX console](plugins/console/chx_console.md) |

- They run only once per startup. Disabling the Console plugin and enabling it again later
  does not run them again.
- **Each file becomes a single Undo step** (for `startup.qax`, each recorded operation is one Undo step).
- Relative paths in a file are resolved from the folder containing that file (`~/.cuemol`).
- If a file stops with an error, the remaining files are still run.
- What was run and its results are shown in the Console, prefixed with `[startup] `.
- When the **Console** plugin is disabled, none of the files are run. When **PyM console** or
  **ChX console** is disabled, that file (`startup.pml` / `startup.cxc`) is skipped, and the Console
  shows a message such as `[startup] startup.cxc skipped (the console dialect for .cxc files is off)`
  (→ [Plugins](plugins/index.md)).
- Files opened from the OS (by double-clicking or drag &amp; drop) and commands sent from
  [tritium_cli](plugins/console/cli.md) are run after the startup scripts finish.

### Progress display and stopping

While the startup scripts are running, the status bar shows an item such as **Startup 1/3**.
Clicking it opens the **Startup Scripts** popover, which shows the state of each file
(Waiting / Running / Done / Failed / Stopped / Skipped / Not run).
Pressing **Stop** stops the file being run, and the remaining files are not run either
(the **Stop** of the Console does the same).

When all files succeed, the item disappears. When a file fails (red) or is stopped (gray),
the item stays until the popover is opened and closed.

!!! info "Screenshots planned"

<!-- TODO(screenshot): the Startup item in the status bar and the Startup Scripts popover -->

## Style files

The `.xml` files placed in `~/.cuemol/styles/` are loaded at startup as
[style](styles.md) files.

- They are loaded in file name order. The loaded style sets are read-only.
- When the same style is defined in several places, the value set in the GUI (`user_styles.xml`)
  takes the highest priority, then the files in this folder (a later file name takes priority), and finally
  the built-in styles of CueMol3.
- Files without an id on the root `<styles id="...">`, files whose id is `user`, and files that fail to load
  are not loaded (in this case no message appears on screen; it is only recorded in the log).

## Example: changing the palette for the colors of loaded molecules

In a scene with the CueMol3 look, each loaded molecule gets one color from the Okabe-Ito palette
(→ [Coloring](coloring.md#paint)). To use a different palette, place the following file as
`~/.cuemol/styles/palette.xml` and restart CueMol3.

```xml
<?xml version="1.0" encoding="utf-8"?>
<styles id="my_palette">
  <palette id="default_paint" value="tolbright"/>
</styles>
```

For `value`, specify one of the following theme names. They are the same themes listed in the
Paint coloring submenu of the Color panel.

| Theme name | Name in the menu |
|---|---|
| `okabeito` | Okabe-Ito (default) |
| `tolbright` / `tolvibrant` / `tolmuted` / `tollight` | Tol bright / Tol vibrant / Tol muted / Tol light |
| `brewerset2` / `brewerdark2` | Brewer Set2 / Brewer Dark2 |
| `tableau10` | Tableau 10 |

- Only the colors of molecules loaded from now on change. The colors of molecules already painted, or of molecules in saved scenes,
  do not change (the colors used are saved in the scene).
- The specified theme is listed first in the Paint coloring submenu.
- In a [Legacy mode](scene.md#compatibility) scene, molecules are painted with the four CueMol2 colors regardless of the palette.
- To revert, delete the file and restart CueMol3.

## See also

- [Console](plugins/console/index.md) / [PyM console](plugins/console/pymconsole.md) /
  [ChX console](plugins/console/chx_console.md)
- [Recording and replaying operations](actions.md)
- [Styles](styles.md)
- [Plugins](plugins/index.md)

---

*Verified against: CueMol3 3.0.6.577*
