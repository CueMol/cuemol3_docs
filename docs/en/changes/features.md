<!-- source: ja/changes/features.md @ 570ee02 -->

# Merged, renamed and removed features

A list of where the features of CueMol2 went in CueMol3, or whether they are gone.

## Renamed or moved features

These features are still available, but their names or locations have changed.

| CueMol2 | CueMol3 | Notes |
|---|---|---|
| Rendering &gt; POV-Ray rendering... | **Rendering &gt; Image rendering...** | The backend is now chosen inside the rendering window, so the menu is named after the type of output. The default is the built-in ray tracer Umbreon; POV-Ray is deprecated → [Rendering](../reference/rendering.md) |
| Rendering &gt; Animation rendering... | **Rendering &gt; Movie rendering...** | Now the movie mode of the same rendering window |
| Help &gt; Check for updates | **Check for Updates...** (in the application menu on macOS) | A CueMol3-specific mechanism that replaces the Mozilla update system. In-app updating is currently available only on macOS (Apple Silicon) → [Updating](../install/update.md) |
| Tools &gt; Mol bond editor... | **Add Bond** tool in the tool palette | Changed from a modal dialog to clicking directly in the molecular view → [Toolbar and tool palette](../ui/toolbar-tools.md) |
| Edit &gt; Options (preferences window) | **Settings** tab | Opens as a tab in the content area rather than a modal window. Preferences... on macOS |
| Property dialog for each Renderer type | **Property inspector** | The dialogs are gone; properties are now edited live in a persistent panel → [Property inspector](../ui/inspector.md) |
| Presets in the color menu | **Palette panel of the color picker** | Merged as grayscale plus variations for each hue |
| Paint settings dialog | **Paint table in the Color panel** | Cells of the table are now edited directly → [Side panels](../ui/side-panels.md) |
| Object deletion dialog | **Delete in the scene tree** | The dedicated dialog for specifying what to delete by selection expression has been removed |
| File &gt; New Window | **File &gt; New Tab** | See also "Removed features (with alternatives)" below |

## Removed features (with alternatives)

| CueMol2 feature | Reason for removal | Alternative |
|---|---|---|
| File &gt; New Window | Because all windows share a single backend, multiple OS windows cannot be opened | Add a tab with **File &gt; New Tab** |
| Window &gt; Show/Hide Topbar | It does not fit the CueMol3 screen layout | The toolbar is always shown |
| Window &gt; Clear log contents | Same as above | The log in the Output panel is cleared when the application is restarted |
| Window &gt; Restore default panel location | Same as above | Switch the panel layout with the activity bar |
| Window &gt; Panels submenu | Same as above. Side panels switch by group, so there is no place for showing or hiding individual panels | Same as above |
| Tools &gt; Molecular surface generation with MSMS | The route using the external MSMS binary was not in use | Use **Tools &gt; Mol surface generation...** (built-in SES generation) |
| Hierarchical editor in the selection panel (Hierarchical / Terminal / Around-Expand) | Writing selection expressions directly covers most uses | The selection expression field in the Selection panel, or tree selection in the Molecular structure panel |
| Key binding customization | A decision not to port the UXP implementation as it was | Cannot be changed at present |
| Help &gt; About plugins... / About config... / Addon manager... / Console | Features specific to Mozilla XULRunner | Developer tools can be opened from **View &gt; Toggle Developer Tools** |

## Removed features (without alternatives)

| CueMol2 feature | Reason for removal |
|---|---|
| View &gt; Hardware stereo | Decided to be out of scope for the migration |
| File &gt; Open web page... | There is no built-in browser. External links are opened in the OS default browser |
| Tools &gt; Execute script... | There is no plan to implement it, so it was removed rather than leaving a non-working item |
| Tools &gt; Performance measure | Same as above |
| MolClient (generating a molecule from SMILES) | It requires an external MolServer (XMLRPC) |
| Export to QSL (lightweight scene) format | Removed from CueMol itself |
| Export to LuxRender / LuxCore / Warabi / raw formats | Not included in the CueMol3 Export scene (still available in CueMol2) |
| Coloring by script (Script coloring) | It could not be selected or created from the UI in CueMol2 either |
| Mouse preset selection | Its role overlaps with the pointing device setting → [Mouse and trackpad input](../ui/mouse-input.md) |
| HiDPI switching / UI language setting | CueMol3 has no corresponding processing |
| Writing RMSD information of molecular superposition to a file | The RMSD can be checked in the log of the Output panel |

## Features not yet implemented

Separately from the above, some items are planned but do not work yet.
→ [Development status and unimplemented features](status.md)

---

*Verified against: CueMol3 2.4.0.546*
