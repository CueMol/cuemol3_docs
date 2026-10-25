<!-- source: ja/reference/renderers/namelabel.md @ e4bd8cd -->

# namelabel (name label)

A Renderer that attaches name labels to atoms in the molecular view. Target Object: molecule (MolCoord).

!!! note "Created automatically when you add a label"
    namelabel is an internal Renderer that is created automatically when you click an atom
    in the molecular view to show its name. In the scene tree it appears as an unnamed
    `(*namelabel)` row
    (→ [Loading and displaying a structure](../../tutorials/basic/loading.md)).
    It is not listed in the New Renderer dialog.

!!! info "In preparation"
    This page is a skeleton. Example figures will be added later.

## Overview

<!-- TODO(screenshot): namelabel example (labels with different alignment) -->

The label text is flat text drawn on the screen and has no 3D shape. For this reason,
the [edge line](edge-lines.md) settings are not shown in the property inspector.

## Properties

For the common properties, see [Common Renderer properties](common.md).

### Name label

| Item | Default | Description |
|---|---|---|
| Format | (empty) | Format of the label text. When empty, it takes the form `{chain} {resn}{resi} {name}` |
| Color | Yellow | Color of the label text |
| Label on top | OFF | When ON, the label is always visible and is not hidden by shapes in front of it |
| Max labels | 50 | Upper limit on the number of labels (1 to 1000). When exceeded, the oldest ones disappear first |
| Horizontal align | Left | Which position of the label is aligned to the atom (horizontal: Left / Center / Right) |
| Vertical align | Bottom | Which position of the label is aligned to the atom (vertical: Top / Middle / Bottom) |
| Offset X / Offset Y | 0 px | Amount by which the label is shifted on the screen from the atom position (-100 to 100 px) |

- In **Format**, list item names enclosed in `{}`, as in `{resn}{resi} {name}`.
  The available item names are the same as the words of the [selection expression](../selection.md):
  `name` (atom name), `resn` (residue name), `resi` (residue number), `chain` (chain name),
  `elem` (element symbol), `bfac` (B-factor), `occ` (occupancy), `alt` (altloc),
  `aid` (atom ID), and `molname` (molecule name).
  You can add a numeric format after `:`, as in `{bfac:.2f}`.
- **Format** is the default text for labels that have no format of their own. If a label has
  its own format or text (for example, one added with the Console `label` command),
  that is used instead.
- The default for **Horizontal align** / **Vertical align** (Left / Bottom) is the conventional
  placement, with the lower left of the label at the atom. The reference point is the atom position
  shifted by **Offset X** / **Offset Y**.

### Font

| Item | Default | Description |
|---|---|---|
| Font size | 12 pt | Size of the text (1 to 72 pt) |
| Font name | sans-serif | Choose from the list of fonts installed on the system |
| Font style | Normal | Normal / Italic |
| Font weight | Normal | Normal / Bold |

The default color and font for newly created labels can be changed in **Atom Labels** under **Settings**
(→ [Settings reference](../settings.md#atom-labels)).

## Limitations

- The alignment (Horizontal align / Vertical align) is also reflected in POV-Ray output,
  but not in output to the LW viewer, where labels remain bottom-left aligned.
- In [command-line rendering](../rendering.md#rendering-from-the-command-line),
  labels are not drawn.

## See also

- [Renderer list](index.md)
- [atomintr (measurement display)](atomintr.md) — labels for measured values
- [Settings reference](../settings.md#atom-labels)

---

*Verified against: CueMol3 2.3.21.544*
