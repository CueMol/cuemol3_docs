<!-- source: ja/reference/plugins/console/cli.md @ d6bebaf -->

# tritium_cli

**tritium_cli** is a client that runs Console commands from a terminal.
It is bundled with CueMol3 and can also be installed on its own from npm
([Install from npm](#install-from-npm)). Commands are run on the **active tab** of the running CueMol3.

## Usage

```
tritium_cli [OPTIONS] [FILE...] [-c COMMANDS] [-i]
tritium_cli <command> [ARGS]
```

- Started without arguments, it enters interactive mode. The prompt is `CueMol <directory> ❯`
  (`PyMOL <directory> ❯` in PyM console, `ChimeraX <directory> ❯` in ChX console). ++tab++ completes, ++ctrl+c++ stops the running
  command, `native` / `pymol` / `chimerax` switches the mode, and `exit` or ++ctrl+d++ quits.
  `quit` quits CueMol3 first and then tritium_cli as well.
- ++tab++ completion works the same as in the panel, and a second ++tab++ opens the candidate menu. The
  output of `help` is wrapped to the terminal width (it is printed as Markdown when piped).
- Passing commands with `-c`, or files as arguments, runs them and exits. With `-i`,
  interactive mode starts afterwards. Input can also be piped in.
- Files given as arguments are handled according to their type.

    | File | Action |
    |---|---|
    | Data such as structures and maps (`1crn.pdb` / `map.ccp4`, etc.) | Opens it in the active tab. The format is identified in the same way as **File &gt; Open**. Several can be listed. |
    | `.qsc` | Opens the scene in a new tab. Combined with data files or `-c`, they are loaded into that scene. |
    | `.qax` | Replays the recorded operations. |
    | `.pml` / `.cxc` | Runs it as a PyM console / ChX console script. |
    | `.txt` | Runs it as a text file of commands in the current mode. |

    Data files and `-c` are grouped into one Undo together. A script cannot be passed together with other files or `-c`.
- `--dialect` chooses the mode (`native` / `pymol` / `chimerax`). The mode of a disabled plugin cannot
  be chosen.
- The exit status is 0 on success, 1 when a command fails, 2 for invalid arguments, and 130 when interrupted.
- `--echo` prints each command before its output as it is run.
- Relative paths are resolved against the directory where tritium_cli was run.
- Commands that were run are also shown in the Console tab of CueMol3 with a `[cli]` prefix.

## Subcommands

| Command | Action |
|---|---|
| `tritium_cli status` | Shows whether CueMol3 is running, and which ports accept what. It does not launch CueMol3. The exit status is 0 if it is running and 1 if not. |
| `tritium_cli version` | Shows the versions of tritium_cli and the running CueMol3 (same as `--version` / `-V`) |
| `tritium_cli help [command]` | Shows the usage, or the usage of a subcommand. |
| `tritium_cli skill` | Shows the description for AI agents (skill). `skill install` writes it to `~/.claude/skills/cuemol/SKILL.md` for Claude Code (`--dir` changes the destination; an existing file with different contents is not overwritten unless `--force` is given). |
| `tritium_cli mcp` | Connects to an MCP client over standard input / output (stdio) (→ [MCP Server](../mcp-server.md#registering-with-tritium_cli-mcp)). |

## Connection

If CueMol3 is not running, tritium_cli launches it and waits (use `--no-launch` to suppress this).
In this case, command-line access is allowed for that run only.

A tritium_cli installed from npm looks for an installed CueMol3 and launches it.
It searches the standard install locations (`/Applications` etc. on macOS, the installer's
install location on Windows, the .deb install location on Linux). If CueMol3 is elsewhere
(an AppImage, for example), set the environment variable `CUEMOL3_APP` to the path of the app. If CueMol3
cannot be found, tritium_cli shows the download location and exits.

To connect to a CueMol3 that is already running, turn **Command line access** ON in
**Settings &gt; Plugins &gt; Console** (OFF by default). The port and token to connect to are
read from `~/.cuemol/local-api.json`.

Only one client can edit at a time. If a command is sent while another tritium_cli or MCP client
is running, `CueMol is busy` is shown and the command is not run.
Try again after it finishes.

## Adding to PATH

The path of the bundled tritium_cli is shown in **Command line tool** under
**Settings &gt; Plugins &gt; Console** (it can be copied with **Copy**).

| OS | Method |
|---|---|
| macOS | Link the displayed path into a directory on PATH (`ln -s "<path>" ~/.local/bin/tritium_cli`) |
| Windows | Add the directory containing the displayed `tritium_cli.cmd` to PATH. |
| Linux (.deb) | Installed at `/usr/bin/tritium_cli`. |
| Linux (AppImage) | Not available. To use tritium_cli, install the .deb. |

## Install from npm

With Node.js (18 or later), tritium_cli alone can be installed from npm.
The `tritium_cli` command is added to PATH.

```
npm install -g @cuemol/tritium-cli
```

A tritium_cli installed from npm is updated separately from CueMol3. If the version of the
communication protocol between it and CueMol3 does not match, a warning to update the older one is shown when interactive mode starts
(some commands may not work).

!!! note
    The npm version has been verified only in combination with an installed CueMol3 on macOS.

## CLI in the status bar

While Console is enabled, **CLI** is shown on the right side of the status bar. Clicking it shows
the state of the command-line connection (Off / Starting / Ready / Running / Error), the same
toggle switch as **Command line access**, and a button to copy the tritium_cli path (**Copy path**).

## See also

- [Console](index.md) / [Console command list](commands.md) / [PyM console](pymconsole.md) / [ChX console](chx_console.md)
- [MCP Server](../mcp-server.md) — uses the same server.
- [Recording and replaying operations](../../actions.md) / [Settings](../../settings.md#console)

---

*Verified against: CueMol3 3.0.0.554*
