<!-- source: ja/changes/status.md @ 570ee02 -->

# Development status and unimplemented features

!!! warning "This page is a snapshot as of CueMol3 2.3.15.530"
    CueMol3 is under active development. The limitations and problems listed here
    may already be resolved in your version.

The CueMol3 release assets can be downloaded from GitHub Releases, but they are **work-in-progress versions**.
If you need stable behavior, use CueMol2
(→ [Installation](../install/index.md)).

## Partially implemented features

| Feature | Status |
|---|---|
| **Detailed settings for each Renderer type** | The Properties tab of the property inspector has a Common section and a dedicated section for each Renderer type. Nested properties that do not appear there (such as the cross-section shape of cartoon) can be edited in the **Generic** tab |
| **Code signing** | macOS builds are ad-hoc signed only (no Developer ID signing or notarization), and Windows builds are unsigned. Both require a manual workaround on first launch → [Installation](../install/index.md#code-signing-status-of-the-release-assets) |

## Known issues

| Symptom | Details |
|---|---|
| **Selection changes in the Sequence panel are slow to take effect** | After changing the selection in the sequence panel, the highlight in the molecular view may take about 0.5 seconds to update |
| **The first expansion of the Molecular structure panel is slow** | The tree may stutter when first expanded (even when the number of residues is small) |
| **The pointing device is sometimes detected incorrectly** | Detection is estimated from scrolling characteristics, so a mouse and a trackpad may be confused. Specify the device explicitly in Settings |
| **Focus on a density map Renderer row jumps to the origin** | Selecting a density map Renderer (contour / isosurf) row in the scene tree and pressing **Focus** moves the view to the origin instead of the map. Focus on the map's Object row instead |

## Features confirmed to work

All the features targeted for porting from the CueMol2 (UXP version) GUI were either **ported or
confirmed as deliberately not ported** in 2.3.10.504 (for those not ported, see
→ [Merged, renamed and removed features](features.md)). For reference, the main implemented features are listed below.

- Reading and writing files / scenes, network retrieval with Get PDB, recent files,
  drag &amp; drop from the OS and file associations
- Scene tree (toggle visibility / rename / reorder / multiple selection / range selection / context menu)
- Copy &amp; paste via the OS clipboard (exchange with CueMol2 is also possible)
- Creating Renderers (including presets) and editing their settings in the inspector
- Coloring (Solid / Paint / CPK / Rainbow / B-factor / electrostatic potential / Multi-gradient)
- Selection (selection expressions, molecular structure tree, sequence panel, rectangle / lasso tools)
- Measurement (distance / angle / dihedral) and adding or removing bonds
- Creating, cutting and regenerating molecular surfaces (two algorithms, MeshMS / BALL), interaction analysis,
  secondary structure reassignment, molecular superposition
- Changing symmetry and displaying symmetry mates and unit cells (including Create SYMM mol), adjusting density map display
- Electrostatic potential calculation with APBS (requires configuring an external tool)
- Timeline editing and playback of animations, creating morphing animations
- Still image and movie output in the rendering window (the default is the built-in ray tracer Umbreon.
  Ink-style [NPR](../reference/rendering-npr.md) output can also be selected)
- Export scene (PNG / Umbreon / POV-Ray SDL / STL / MQO)

## Reporting problems

If you find a problem, report it as an Issue in the [GitHub repository](https://github.com/CueMol/cuemol2).

---

*Verified against: CueMol3 2.3.15.530*
