<!-- source: ja/reference/coloring.md @ d6bebaf -->

# Coloring

Coloring determines the rule by which a Renderer is colored.
You set it per Renderer (or per Object) in the **Color** panel of the side panel.

This page is a reference covering the parameters of each Coloring.
For how to use the panel, see [Side panels](../ui/side-panels.md).

## Coloring types

| Type | Description | Applies to |
|---|---|---|
| [Molecule color](#molecule-side-coloring-molcol) | Follow the molecule-side coloring | Renderers only |
| [Paint](#paint) | Specify pairs of a selection and a color in a table | All |
| [Solid](#solid) | Paint with a single color | All |
| [CPK](#cpk) | Assign a color to each element | All |
| [Bfac/Occ](#bfacocc) | Gradient according to values such as temperature factor or occupancy | All |
| [Rainbow](#rainbow) | Change colors across the rainbow along residue numbers, etc. | All |
| [Electrostatic potential](#electrostatic-potential) | Color by the values of an electrostatic potential map | Molecular surfaces only |
| [Multi-gradient](#multi-gradient) | Gradient passing through multiple colors | Map Renderers and molecular surface Renderers |
| [Reset to default style](#reset-to-default-style) | Return to the coloring of the default style | All |

Renderers that cannot handle color (selection highlight, atom labels, [atomintr](renderers/atomintr.md), etc.)
do not appear in the target list of the Color panel.

!!! info "In preparation"
    Details of the parameters of each Coloring will be added later.

## Paint

Specify pairs of a selection and a color in a table. Rows are evaluated from the top,
and the color of the first matching row is used.

Choosing **Paint coloring** as the Coloring type opens a submenu, where you choose the color scheme the Paint starts from.
Whichever you choose, it starts with a table containing rows for per-secondary-structure coloring.

| Item | Description |
|---|---|
| **CueMol2 default** | The same four colors as CueMol2 (sheet SteelBlue, helix khaki, nucleic yellow, everything else FloralWhite) |
| **CueMol1 (woody)** | The default three colors of CueMol1 (sheet light green, helix light red, everything else light yellow) |
| Palette themes | Choose the main color of the molecule from the submenu of each theme (see below). |
| Single-color presets | Red / Orange / Yellow / Green / Cyan / Blue / Purple (in hue order). **Renderers only** |

The palette themes are **Okabe-Ito**, designed with color vision diversity in mind; Paul Tol's **Tol bright** /
**Tol vibrant** / **Tol muted** / **Tol light**; ColorBrewer's **Brewer Set2** / **Brewer Dark2**; and
**Tableau 10**. Each color is listed with its name and a swatch. With the chosen color as the main color, helix and sheet are painted
in the main color itself, nucleic in a color with a slightly shifted hue, and `*` (coils, etc.) in a whitened color
(four rows: sheet / helix / nucleic / `*`).

**Molecule color** is a style that makes the Renderer's color follow the molecule-side coloring; it is not a Paint
(see [Molecule-side coloring](#molecule-side-coloring-molcol)). It is first in the list of Coloring types, and ribbon / cartoon / tube
Renderers are created in this state.

When a molecule is loaded, it is colored automatically per molecule. In the order in which molecules are loaded into the scene,
the Okabe-Ito colors are assigned one per molecule and painted by the same rule as above (the result is the same as choosing that color from the menu).
The colors used are saved in the scene, so they do not change when a saved scene is reopened.

In a [Legacy mode](scene.md#compatibility) scene (including scenes made with CueMol2), the coloring at load time
is the same four colors as CueMol2 default, and it does not vary per molecule.

<!-- TODO(content): Describe adding, deleting and reordering rows, specifying selection expressions, specifying colors,
     and combining with material modifiers (see the Paint table in ColorPane.tsx) -->

For color notation, see [Color syntax](color-syntax.md); for how to write selections, see
[Selection expression syntax](selection.md).

## Solid

Paints the whole Renderer with a single color. It can be used in the same way on molecular surfaces
(molsurf / isosurf / dsurface).

If you specify `$molcol` as the color, the Renderer follows the coloring of the molecule Object
(see [Molecule-side coloring](#molecule-side-coloring-molcol)). This gives the same result as
placing a single row (`*`, `$molcol`) in a Paint. Even though Solid paints everything with the same `$molcol`,
the molecule-side color that `$molcol` refers to differs per atom, so the color varies per atom as a result.

## CPK

Assigns predetermined colors to each element.
You can specify a color for each of C / N / O / S / P / H and for other elements.

<!-- TODO(content): Default color of each element (DefaultCPKColoring in default_style.xml) -->

## Bfac/Occ

Changes the color continuously according to values such as the temperature factor (B-factor) or occupancy.

| Item | Description |
|---|---|
| **Mode** | The value that determines the color: **B-factor** / **Occupancy** / **Distance from center** (distance from the center of the molecule) |
| **Multi-colour gradient** | Switches to a gradient that passes through multiple colors (see below) |
| **Low** / **High** (colors) | The colors at the lower and upper limits of the value. Between them, the two colors are interpolated. |
| **Auto** | How the lower and upper values are determined: **Manual** (the Low / High values below) / **Auto (by mol)** (the value range of the whole molecule) / **Auto (by rend)** (the value range of the atoms the Renderer draws) |
| **Low** / **High** (values) | The lower and upper values. Editable only when **Auto** is **Manual**. |

### Multi-color gradients

Turning **Multi-colour gradient** ON paints with a gradient that passes through multiple colors instead of
interpolating two colors. Right after it is turned ON, the gradient has two points at the ends with the current two colors,
so the appearance does not change. While it is ON, the rows from **Low** / **High** down are hidden, and a gradient
editor is shown instead. Turning it OFF returns to two-color interpolation.

The editor works the same as in [Multi-gradient](#multi-gradient). The histogram shows the distribution of the atom values
(B-factor or occupancy). With **Distance from center**, no histogram is shown.

- The values of the stops are the B-factor, occupancy or distance values themselves. The **Auto** setting is not used.
  Values outside the range get the color of the nearest end stop.
- In addition to Rainbow / Resmap / Heatmap, the presets include **AlphaFold pLDDT**.
  It colors the AlphaFold prediction confidence (pLDDT, 0 to 100) with the same colors as ChimeraX.

| pLDDT | Color |
|---|---|
| 0 | Red |
| 50 | Orange |
| 70 | Yellow |
| 90 | Light-cyan blue |
| 100 | Blue |

Structures fetched from AlphaFold DB with [Get PDB](get-pdb.md#alphafold-db) are shown in these colors
(AlphaFold models store pLDDT in the B-factor field).

Each edit can be reverted with Undo, and it is saved in the scene.

## Rainbow

Changes the hue continuously along the order of residue numbers, etc.

<!-- TODO(content): Describe the mode, the basis, the start / end hue, brightness and saturation -->

## Electrostatic potential

Colors a molecular surface according to the values of an electrostatic potential map ([ElePotMap](objects/elepot.md)).
It can be selected **only for molecular surface Renderers**.

APBS / PDB2PQR are required for the calculation
(see [Configuring external tools](../install/external-tools.md)).

<!-- TODO(content): Describe specifying the target map, whether SAS coloring is available, and the low / mid / high values and colors -->

## Multi-gradient

Paints with a gradient that passes through multiple colors according to map values.
It can be selected for map Renderers such as density maps and for molecular surface Renderers (molsurf / dsurface).

The settings area shows a histogram of the target map and a gradient bar,
and you edit the stops (color breakpoints) on the bar directly.

- Drag a stop to move it. Click an empty spot on the bar to add one, and drag
  a stop downward to delete it.
- The value and color of the selected stop can also be edited in the input fields.
- You can also start from a preset (Rainbow / Resmap / Heatmap).

Edits are reflected immediately in the molecular view, and each operation can be reverted with Undo.

<!-- TODO(content): Describe the specification and default of the target map, and the contents of each preset -->

## Reset to default style

Returns the Renderer's coloring to the state defined in the default style
(see [Styles](styles.md)).

## Molecule-side coloring (`$molcol`)

You can also keep the coloring on the molecule Object rather than on each Renderer, and share it among
multiple Renderers. In this case, use `$molcol` in the Renderer's color specification
(see [Color syntax](color-syntax.md#molecule-color-notation)).

For molecular surface Renderers, choosing `$molcol` as the color of [Solid](#solid) gives this form.

## See also

- [Color syntax](color-syntax.md)
- [Selection expression syntax](selection.md)
- [Styles](styles.md)
- [Side panels](../ui/side-panels.md)

---

*Verified against: CueMol3 3.0.6.577*
