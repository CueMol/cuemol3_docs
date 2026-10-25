<!-- source: ja/tutorials/density-map.md @ 773364a -->

# Overlaying an electron density map

This tutorial shows how to overlay an electron density map on an X-ray crystal structure and check how the model fits the density.
The example is the crystal structure of lysozyme (PDB ID: **1QIO**); the 2Fo-Fc map and the Fo-Fc map are downloaded from the network together with the coordinates.

!!! info "Screenshots planned"
    Screenshots showing the workflow will be added to this page.

<!-- TODO(screenshot): Final result. The model (stick model) overlaid with the 2Fo-Fc (blue) and Fo-Fc (green/red) meshes -->

## 1. Fetch the coordinates and density maps together

**File &gt; Get PDB...** can fetch electron density maps in addition to coordinates.

1. Enter `1QIO` in **PDB Accession Code**
2. In addition to **Fetch coord file**, check **Fetch 2Fo-Fc map** and **Fetch Fo-Fc map**
3. Leave the map source at the default **RCSB (cif.gz)** (**EBI (MTZ)** also works)
4. When the download finishes, a dialog appears for specifying the Object name and Renderer of the coordinates.
   Choosing **simple** (line drawing) here makes it easier to see the correspondence between density and atoms

<!-- TODO(screenshot): Get PDB dialog (1QIO, both maps checked) -->

No Renderer dialog appears for the maps; they are displayed automatically with the following configuration.

| Object | Renderer | Color | Level |
|---|---|---|---|
| `1qio_2fofc` | contour1 | Blue | +1.0σ |
| `1qio_fofc` | pos-cont | Green | +3.0σ |
| `1qio_fofc` | neg-cont | Red | −3.0σ |

The 2Fo-Fc map (blue) is the density that envelops the whole model. The Fo-Fc map shows the difference between the observed data and the model: green indicates places where there is density but no model, and red indicates places where there is a model but no density.

## 2. Check the display

In the **Explorer &gt; Scene** tree in the left side panel (scene tree →
[Side panels](../ui/side-panels.md)), the map Objects (`1qio_2fofc` / `1qio_fofc`) and their contour Renderers are listed separately from the coordinate Object. The eye icons toggle their visibility individually.

Crystallographic maps are drawn **only around the view center**. When the molecular view is translated, the displayed map region follows (a cryo-EM map is drawn in its entirety, and the display range adjustment below is not needed
→ **Region** in [contour](../reference/renderers/contour.md#contour)).

The name "contour" comes from extending the familiar two-dimensional contour lines of maps to three dimensions. For how the display works, see
[contour](../reference/renderers/contour.md);
for the map Object, see [DensityMap](../reference/objects/densitymap.md).

## 3. Adjust the level and extent

The map display is adjusted in the **Crystal &gt; Density map** panel in the left side panel
(→ [Side panels](../ui/side-panels.md)).

1. At the top, select the target Renderer (such as `1qio_2fofc/contour1`)
2. Change the contour level with the **Level** slider. Raise it when noise is distracting, and lower it to see weak density
3. Change the display range (distance from the center) with the **Extent** slider
4. Change the transparency with the **Transp** slider

By default, the level of a crystallographic map is in σ units (the standard deviation of the map taken as 1).
As a guide, view the 2Fo-Fc map at 1 to 1.5σ and the Fo-Fc map at around ±3σ.
The ▼ menu item **Use absolute contour level** switches to specifying an absolute value
(the value in the other unit is shown below Level). For a cryo-EM map, the unit is the top percentage of grid point values instead of σ, and the level is specified as an absolute value when the map is loaded.
Note that the upper limit of **Extent** is determined by the **Buffer size** property of the contour; to extend it further, increase it in the inspector.

<!-- TODO(screenshot): Density map panel, and the mesh changing with Level (two-step comparison) -->

## 4. Focus on a region of interest

This is the procedure for zooming in on a region of interest such as the active site.

1. Move the view in the molecular view so that the region of interest is at the center
2. Lower **Extent** to about 10 Å to reduce the surrounding mesh
3. If the display has not followed, **Redraw** in the panel updates the display center to the current view center
4. Narrowing the **Slab** (the width of the depth range displayed) also reduces the mesh in front of and behind the region of interest, making it easier to see (→ the View panel in [Side panels](../ui/side-panels.md))

To see only the green and red Fo-Fc meshes, close the eye icon of
`1qio_2fofc` in the scene tree to hide the 2Fo-Fc map temporarily.

## 5. Finish as a figure

A figure containing a density map can be exported in the same way as an ordinary scene
(→ [Exporting high-resolution images for publication](publication-images.md)).

## Next steps

- [Displaying symmetry mates and the unit cell](symmetry.md) — look at the crystal packing of the same 1QIO
- [contour](../reference/renderers/contour.md) / [DensityMap](../reference/objects/densitymap.md) — details of the display settings
- [Side panels](../ui/side-panels.md) — each item of the Density map panel

---

*Verified against: CueMol3 2.3.13.523*
