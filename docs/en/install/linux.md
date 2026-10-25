<!-- source: ja/install/linux.md @ 6cacee7 -->

# Installing on Linux

Target: **Linux (x64)**. Two release assets are provided: `CueMol3-<version>-Linux-x64.AppImage` and
`CueMol3-<version>-Linux-x64.deb`
(for how to obtain them, see [Download](index.md#download)).

!!! warning "A CPU with AVX2 support is required"
    The x86-64 build is compiled with AVX2 instructions. An Intel Haswell / AMD Zen or later CPU
    (roughly 2013 or later) is required. On older CPUs, the program **crashes when a molecular surface is generated**
    (→ [Installation](index.md#release-assets)).

## AppImage

Runs as a single file without installation.

```sh
chmod +x CueMol3-<version>-Linux-x64.AppImage
./CueMol3-<version>-Linux-x64.AppImage
```

To remove it, simply delete the file.

!!! note "FUSE may be required"
    Running an AppImage requires FUSE. If it does not run, install the distribution's package
    (such as `libfuse2`), or run it with the `--appimage-extract-and-run` option.

## .deb package

On Debian / Ubuntu based systems, the `.deb` can be used.

```sh
sudo apt install ./CueMol3-<version>-Linux-x64.deb
```

The `.deb` also registers file associations, so CueMol3 is listed under "Open With" in the file manager
(the default application is not changed
→ [Installation](index.md#file-associations)). The AppImage contains the same information,
but whether it is registered depends on your desktop integration tool.

Uninstall with the package manager.

```sh
sudo apt remove cuemol3
```

## Code signing

Linux release assets are not signed, but no startup warning caused by code signing appears.
As on macOS / Windows, this is a development version.

## Configuring external tools

The Linux release assets do not include ffmpeg / APBS / PDB2PQR / POV-Ray.
To use the features that depend on them (movie output, electrostatic potential calculation, and POV-Ray for the legacy backend),
install them separately, for example through the distribution's package manager, and specify their paths in Settings.
Ray tracing is performed by the built-in Umbreon, so no separate installation is needed.

→ [Configuring external tools](external-tools.md)
