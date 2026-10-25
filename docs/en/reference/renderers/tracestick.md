<!-- source: ja/reference/renderers/tracestick.md @ e4bd8cd -->

# tracestick

A Renderer that draws the pivot atoms of the main chain (Cα in proteins, P in nucleic acids) as spheres and connects consecutive residues with cylinders. It draws [trace](trace.md) in the style of [ballstick](ballstick.md), and the main chain breaks at the same places as in trace. Target Object: molecule (MolCoord).

!!! info "In preparation"
    This page is a skeleton. Example figures will be added later.

## Overview

<!-- TODO(screenshot): example of a tracestick display -->

When you hover the pointer over the molecular view, the hover display works per residue, as with trace and cartoon
(→ [Picking and hover display](../../ui/mouse-input.md#picking-and-hover-display)).

## Properties

For the common properties, see [Common Renderer properties](common.md).

### Trace stick

| Item | Default | Description |
|---|---|---|
| Detail | 10 | Subdivision level of the spheres and cylinders |
| Bond width | 0.25 Å | Radius of the cylinders (0-3 Å) |
| Atom radius | 0.25 Å | Radius of the spheres at the pivot atoms (0-3 Å) |

The defaults are the values of the style **Default**, which is applied when the Renderer is created.

### Styles

Four shape styles are available (→ [Styles](../styles.md)).

| Style | Bond width | Atom radius |
|---|---|---|
| Default | 0.25 Å | 0.25 Å |
| Thick | 0.5 Å | 0.5 Å |
| Ball &amp; stick | 0.2 Å | 0.4 Å |
| Thick ball &amp; stick | 0.35 Å | 0.7 Å |

Default and Thick are sticks in which the spheres and cylinders have the same thickness; Ball &amp; stick and
Thick ball &amp; stick show thicker spheres.

## See also

- [Renderer list](index.md)
- [trace](trace.md)
- [ballstick](ballstick.md)
- [Material](material.md) / [Edge lines](edge-lines.md)

---

*Verified against: CueMol3 2.3.20.539*
