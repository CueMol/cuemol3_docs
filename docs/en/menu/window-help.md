<!-- source: ja/menu/window-help.md @ 6cacee7 -->

# Window / Help menus

## Window menu

*(Added in CueMol3)*

CueMol3 has two top-level windows: the main window and the rendering window.
This menu switches which window is brought to the front.

| Item | Description | Shortcut |
|---|---|---|
| Main Window | Brings the main window to the front. If it is minimized or hidden, it is restored | |
| Rendering Window | Brings the rendering window to the front. If it is not open, it is opened first and then brought to the front | |

!!! note "Differences between operating systems"
    On macOS, the menu bar belongs to the OS (shared by the whole application), so this menu
    can be used to return to the main window even when the rendering window is in front.

    On Windows / Linux, the menu bar is inside the main window, so to return to the main window
    from the rendering window, click the window directly
    (the rendering window is an independent window, not a child window).

!!! info "Not the same as the CueMol2 Window menu"
    The CueMol2 Window menu (Show/Hide Topbar / Clear log contents / Restore default panel location)
    was removed because it does not correspond to the CueMol3 UI layout. The CueMol3 Window menu
    is a new menu dedicated to switching windows
    (→ [Merged, renamed and removed features](../changes/features.md)).

## Help menu

Shown on **Windows / Linux only**. On macOS, the items (About and Check for Updates) are
merged into the application menu, so this menu itself is not shown.

| Item | Description | Shortcut |
|---|---|---|
| About CueMol3 | Shows version information | |
| Check for Updates... | Checks for a new release. In-app update is currently available only in the macOS (Apple Silicon) build; on Windows / Linux, a message saying it is unavailable is shown (→ [Updating](../install/update.md)) | |

!!! info "Mozilla-specific items were removed"
    About plugins... / About config... / Addon manager... / Console in the CueMol2 Help menu
    were all features specific to Mozilla XULRunner, so they were removed
    from the Electron-based CueMol3. Check for updates has been rebuilt
    with a mechanism specific to CueMol3.

---

*Verified against: CueMol3 2.4.0.546*
