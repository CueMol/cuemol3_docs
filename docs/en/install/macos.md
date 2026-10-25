<!-- source: ja/install/macos.md @ 6cacee7 -->

# Installing on macOS

Target: **macOS / Apple Silicon (arm64)**. The release asset is `CueMol3-<version>-macOS-arm64-Installer.dmg`
(see [Download](index.md#download) for how to obtain it).

!!! warning "Ad-hoc signed only; the publisher is not verified"
    The app carries an **ad-hoc signature** (`codesign --sign -`). This is required for
    the app to launch on Apple Silicon and **does not verify the publisher**.
    The app is not signed with a Developer ID and is not notarized, so a dmg downloaded
    from the web is given the quarantine attribute and cannot be launched as is.
    Use the procedure below to work around this.

## Steps

1. Double-click `CueMol3-<version>-macOS-arm64-Installer.dmg` to mount it
2. Drag the `CueMol3.app` that appears into the `Applications` folder to copy it
3. Launch the app for the first time using one of the following methods (see below)

<!-- TODO(screenshot): the mounted dmg window (CueMol3.app and the drag target Applications) -->

## Working around the first-launch warning

On first launch, a dialog appears saying, in essence, that "CueMol3" was not opened, and
**the only choices are "Move to Trash" and "Done"**. Either of the following methods launches the app.

!!! warning "\"Open\" from the right-click menu does not work"
    On macOS 14 and earlier, right-clicking the app (++ctrl++ + click) and choosing
    **Open** worked around this. That method was **removed in macOS 15 (Sequoia) and later**.
    Right-clicking offers only "Move to Trash".
    The same applies to macOS 26 (Tahoe).

### Method A: Allow from System Settings (recommended)

1. Double-click `/Applications/CueMol3.app` to **try launching it once**
   (when the dialog appears, click **Done** to close it. **Do not click "Move to Trash"**)
2. Open Apple menu &gt; **System Settings**
3. Select **Privacy & Security** and scroll down to the **Security** section
4. Click **Open Anyway** next to the line saying "CueMol3" was blocked
5. Authenticate with Touch ID or your login password
6. If a confirmation dialog appears, click **Open Anyway** again

The button in step 4 does not appear unless step 1 has been done. If the button is not
visible, start over from the launch attempt.

Once the app has been launched this way, it can be launched by double-clicking as usual from then on.

### Method B: Remove the quarantine attribute

Run the following in Terminal. Afterward, the app can be launched by double-clicking.

```sh
xattr -dr com.apple.quarantine /Applications/CueMol3.app
```

This method also works when the message "CueMol3 is damaged and can't be opened" is shown
and the button of Method A does not appear.

!!! note
    A dmg built locally by yourself does not get the quarantine attribute, so this warning does not appear.

## Bundled external tools

The macOS release assets built by CI include ffmpeg, APBS/PDB2PQR and POV-Ray.
For builds that do not include them, such as a locally packaged build, specify the paths in Settings.
Umbreon, used for ray tracing, is built into the library and is therefore not part of the bundle.

→ [Configuring external tools](external-tools.md)

## Updating

From 2.4.0.546 onward, a new release can be installed from within the app
(→ [Update](update.md)).

## Uninstalling

Move `/Applications/CueMol3.app` to the Trash.
