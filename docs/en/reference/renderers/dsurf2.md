<!-- source: ja/reference/renderers/dsurf2.md @ e4bd8cd -->

# dsurf2 (molecular surface, distance field)

!!! info "Merged into dsurface"
    The distance-field molecular surface is now one of the choices for
    **Algorithm** (**Distance field**) in [dsurface](dsurface.md).
    For this reason, **dsurf2 no longer appears in the New Renderer list**.
    To create one, choose dsurface and set Algorithm to **Distance field**.

    The two were originally the same Renderer with the same properties, differing only in how the mesh was built.
    With both in the list, there was nothing to tell you which one to choose.

## Existing scenes

Scene files (`.qsc`) that contain `dsurf2` still open as before. When loaded,
they become a **dsurface with Algorithm set to Distance field**. This is exactly the
rendering that dsurf2 performed, so the appearance does not change.

On the other hand, **scenes originally saved with `dsurface` open with Algorithm set to
Distance field (the new default)**. The previous dsurface was a voxel-based
implementation, so the look of the mesh and the effect of Detail change. To
get the previous appearance back, set Algorithm to **EDTSurf (voxel)**.

## See also

- [dsurface](dsurface.md) — see this page for the properties
- [Renderer list](index.md)
- [molsurf](molsurf.md)

---

*Verified against: CueMol3 2.3.15.530*
