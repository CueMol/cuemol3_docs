<!-- source: ja/reference/plugins/console/cli.md @ 773364a -->

# tritium_cli

**tritium_cli** is a client that runs Console commands from a terminal.
It is bundled with CueMol3 and can also be installed on its own from npm
([Install from npm](#install-from-npm)). Commands are run on the **active tab** of the running CueMol3.

## Usage

```
tritium_cli [--dialect native|pymol] [--echo] [--no-launch] [-c COMMANDS | SCRIPT]
```

- Started without arguments, it enters interactive mode. The prompt is `CueMol <directory> ❯`
  (`pymol <directory> ❯` in PyMOL compatibility mode). ++tab++ completes, ++ctrl+c++ stops the running
  command, `native` / `pymol` switches the mode, and `exit` or ++ctrl+d++ quits.
  `quit` quits CueMol3 first and then tritium_cli as well.
- ++tab++ completion works the same as in the panel, and a second ++tab++ opens the candidate menu. The
  output of `help` is wrapped to the terminal width (it is printed as Markdown when piped).
- Passing commands with `-c`, or a script file as the argument, runs them and exits.
  Passing a `.qax` file replays the recorded operations.
  Input can also be piped in. The exit status is 1 on failure.
- `--echo` prints each command before its output as it is run.
- Relative paths are resolved against the directory where tritium_cli was run.
- Commands that were run are also shown in the Console tab of CueMol3 with a `[cli]` prefix.

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

## Adding to PATH

The path of the bundled tritium_cli is shown in **Command line tool** under
**Settings &gt; Plugins &gt; Console** (it can be copied with **Copy**).

| OS | Method |
|---|---|
| macOS | Link the displayed path into a directory on PATH (`ln -s "<path>" ~/.local/bin/tritium_cli`) |
| Windows | Add the directory containing the displayed `tritium_cli.cmd` to PATH |
| Linux (.deb) | Installed at `/usr/bin/tritium_cli` |
| Linux (AppImage) | Not available. To use tritium_cli, install the .deb |

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

- [Console](index.md) / [Console command list](commands.md) / [PyMOL compatibility mode](pymconsole.md)
- [MCP Server](../mcp-server.md) — uses the same server
- [Recording and replaying operations](../../actions.md) / [Settings](../../settings.md#console)

---

*Verified against: CueMol3 2.4.1.547*
