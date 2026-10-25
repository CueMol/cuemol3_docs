<!-- source: ja/reference/coloring.md @ e4bd8cd -->

# Coloring

Coloring determines the rule by which a Renderer is colored.
You set it per Renderer (or per Object) in the **Color** panel of the side panel.

This page is a reference covering the parameters of each Coloring.
For how to use the panel, see [Side panels](../ui/side-panels.md).

## Coloring types

| Type | Description | Applies to |
|---|---|---|
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

Choosing **Paint** as the Coloring type opens a submenu. **Default** is a Paint that starts from the
standard per-secondary-structure coloring (four rows: sheet / helix / nucleic / `*`), followed by
color schemes defined as styles (Woody / Red, etc.). **Molecule color** is a style that makes
the Renderer's color follow the molecule-side coloring; it is not a Paint
(see [Molecule-side coloring](#molecule-side-coloring-molcol)).

<!-- TODO(content): Describe adding, deleting and reordering rows, specifying selection expressions, specifying colors,
     and combining with material modifiers (see the Paint table in ColorPane.tsx) -->

For color notation, see [Color syntax](color-syntax.md); for how to write selections, see
[Selection expression syntax](selection.md).

## Solid

Paints the whole Renderer with a single color. It can be used in the same way on molecular surfaces
(molsurf / isosurf / dsurface).

If you specify `$molcol` as the color, the Renderer follows the coloring of the molecule Object
(see [Molecule-side coloring](#molecule-side-coloring-molcol)). This gives the same result as
placing a single row (`*`, `$molcol`) in a Paint.

!!! note "Choosing `$molcol` is no longer a one-color fill that ignores atoms"
    Molecular surface Renderers have a mode that paints with one color without referring to any atoms.
    Choosing `$molcol` in Solid switches to a mode that looks up the color of each atom, so
    the Renderer leaves that mode. To go back, use **Reset to default style**. For an isosurface (isosurf),
    you can also go back with **Solid color** in the Density map panel.

## CPK

Assigns predetermined colors to each element.
You can specify a color for each of C / N / O / S / P / H and for other elements.

<!-- TODO(content): Default color of each element (DefaultCPKColoring in default_style.xml) -->

## Bfac/Occ

Changes the color continuously according to values such as the temperature factor (B-factor) or occupancy.

<!-- TODO(content): Describe the modes (B-factor / occupancy / distance), the colors and values of the lower and upper limits,
     and switching between Auto / Manual -->

## Rainbow

Changes the hue continuously along the order of residue numbers, etc.

<!-- TODO(content): Describe the mode, the basis, the start / end hue, brightness and saturation -->

## Electrostatic potential

Colors a molecular surface according to the values of an electrostatic potential map ([ElePotMap](objects/elepot.md)).
It can be selected **only for molecular surface Renderers**.

APBS / PDB2PQR are required for the calculation
(see [External tool settings](../install/external-tools.md)).

<!-- TODO(content): Describe specifying the target map, whether SAS coloring is available, and the low / mid / high values and colors -->

## Multi-gradient

Paints with a gradient that passes through multiple colors according to map values.
It can be selected for map Renderers such as density maps and for molecular surface Renderers (molsurf / dsurface).

The settings area shows a histogram of the target map and a gradient bar,
and you edit the stops (color breakpoints) on the bar directly.

- Drag a stop to move it. Click an empty spot on the bar to add one, and drag
  a stop downward to delete it
- The value and color of the selected stop can also be edited in the input fields
- You can also start from a preset (Rainbow / Resmap / Heatmap)

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

*Verified against: CueMol3 2.3.15.530*
