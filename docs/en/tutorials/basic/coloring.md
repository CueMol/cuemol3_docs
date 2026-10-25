<!-- source: ja/tutorials/basic/coloring.md @ 6cacee7 -->

# Coloring Renderers

The color of a Renderer is changed in the **Color panel**, which handles only the
Coloring part of the settings. This page tries the main Coloring types in turn,
using `lysozyme` (simple + ballstick + ribbon) and `1G59` (trace) from the
previous page ([Adding, removing and configuring Renderers](renderers.md)).

!!! info "Screenshots planned"
    Screenshots showing the workflow will be added to this page.

## 1. Using the Color panel

Open the **Explorer &gt; Color** panel in the left side panel
(→ [Side panels](../../ui/side-panels.md)).

1. Select the target Renderer at the top (selecting a Renderer in the scene tree also updates this)
2. Select the Coloring **type**; the settings for that type appear below

For the list of types and their settings, see [Coloring](../../reference/coloring.md).

## 2. CPK — color by element

**CPK** assigns a color to each element, and is the standard choice for simple and ballstick.

1. Select `lysozyme/ballstick1` as the target
2. Select **CPK** as the Coloring type
3. Change the color of **C** (carbon) to gray (for example, `#808080`)

Only the carbon parts of the ballstick turn gray. For how to specify colors (color names,
color codes, etc.), see [Color syntax](../../reference/color-syntax.md).

## 3. B-factor — gradient by value

**B-factor** changes the color continuously according to values such as the temperature factor.

1. Select `lysozyme/simple1` as the target (if you hid it, restore it with the eye icon)
2. Select **B-factor** as the Coloring type

The structure is painted with a gradient from low to high temperature factors.
The colors at the lower and upper limits and the value range (Auto / Manual) can also be set.

## 4. Rainbow — rainbow from end to end

**Rainbow** changes the hue along the residue sequence.

1. Select `1G59/trace1` as the target
2. Select **Rainbow** as the Coloring type
3. Switch the mode from whole molecule to per chain

In 1G59 the protein and the tRNA are separate chains, so each is painted
with its own rainbow (the protein from the N-terminus to the C-terminus, the RNA
from the 5' end to the 3' end).

<!-- TODO(screenshot): 1G59 displayed with per-chain Rainbow -->

## 5. Paint — color by pairs of selection and color

**Paint** offers the most freedom. Pairs of a "selection expression and a color" are
listed as rows of a table, and **the rows are evaluated from the top, with the color of
the first matching row** used for painting.

1. Select `lysozyme/ribbon1` as the target
2. Select **Paint** &gt; **Default** as the Coloring type. A table appears containing the
   standard secondary-structure coloring (four rows: sheet / helix / nucleic / `*`)
3. Rewrite the table as the following three rows (in this order from the top)

| Selection expression | Example color |
|---|---|
| `helix` | light blue |
| `sheet` | green |
| `*` | whitish |

`helix` and `sheet` are predefined selections that represent secondary structure
(→ [Selection expression syntax](../../reference/selection.md)). The `*` (everything) row is at
the bottom, so only the coil regions, which are neither helix nor sheet, get this color.

### Add a paint

Change the color of only the C-terminal helix (residues 119 to 129).

1. Add a row at the **top** of the table
2. Specify `A.119:129.*` as the selection expression and red as the color

The C-terminal region turns red. Because this row is above the `helix` row, red
takes precedence in this range. Layering paints while keeping the row order in mind
is how Paint is used. Rows that are no longer needed can be deleted.

<!-- TODO(screenshot): Paint table (4 rows) and the ribbon after coloring -->

!!! tip "Presets are also available"
    In addition to the **Default** used above, the Paint submenu lists color schemes
    prepared as styles (Woody / Red, etc.). Applying a preset first and then rewriting
    its rows is also a quick approach.

## Next steps

- [Saving the camera and the scene](camera-scene.md) — keep the viewpoint and working state
- [Coloring](../../reference/coloring.md) / [Color syntax](../../reference/color-syntax.md)

---

*Verified against: CueMol3 2.3.13.523*
