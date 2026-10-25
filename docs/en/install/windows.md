<!-- source: ja/install/windows.md @ 6cacee7 -->

# Installing on Windows

Target: **Windows (x64)**. The release asset is `CueMol3-<version>-Windows-x64-Setup.exe` (an NSIS installer)
(see [Download](index.md#download) for how to obtain it).

!!! warning "The release asset is unsigned"
    The current `.exe` is not code-signed with Authenticode.
    A SmartScreen warning is displayed when it is run. Use the procedure below to work around it.

!!! warning "A CPU with AVX2 support is required"
    The x86-64 build is compiled with AVX2 instructions. A CPU of Intel Haswell / AMD Zen or later
    (roughly 2013 or later) is required; on an older CPU, the program **crashes when a molecular surface is generated**
    (→ [Installation](index.md#release-assets)).

## Steps

`CueMol3-<version>-Windows-x64-Setup.exe` is a wizard-style NSIS installer. When run, it proceeds as follows.

1. Welcome page
2. Choose the install location
3. Run the installation (the program is installed for all users in `C:\Program Files\CueMol3\`,
   so a UAC elevation prompt is displayed)
4. Finish

After installation, shortcuts are created in the Start menu and on the desktop, and CueMol3 is registered in
"Apps & features / Add or remove programs". The file formats that CueMol3 can open are also
registered under **"Open with"** in Explorer
(the default application is not changed → [Installation](index.md#file-associations)).
Files can also be opened by double-clicking them or by passing them on the command line.

<!-- TODO(screenshot): the welcome page and the install location page of the NSIS installer -->

## Working around the first-run warning

When an unsigned `.exe` is run, **"Windows protected your PC"** (unknown publisher) is displayed.

1. Click **"More info"** in the dialog
2. Click the **"Run anyway"** button that appears

<!-- TODO(screenshot): the SmartScreen warning dialog with "More info" expanded -->

!!! info "Future plans"
    This warning will go away once code signing is introduced (an EV/OV certificate or Azure Trusted Signing).
    Introduction is planned as future work.

## Bundled external tools

The Windows release assets built by CI include ffmpeg / APBS-PDB2PQR / POV-Ray.
For builds that do not include them, specify the paths in Settings.
Umbreon, which is used for ray tracing, is built into the library, so it is not among the bundled tools.

→ [Configuring external tools](external-tools.md)

## Uninstalling

Select **CueMol3** in "Settings &gt; Apps &gt; Installed apps" (or "Add or remove programs") and uninstall it.
