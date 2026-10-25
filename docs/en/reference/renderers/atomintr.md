<!-- source: ja/reference/renderers/atomintr.md @ e4bd8cd -->

# atomintr (measurement display)

A Renderer that displays interatomic distances, angles and dihedral angles, as well as interactions such as hydrogen bonds, as lines and labels.
Target Object: molecule (MolCoord).

!!! note "Usually created automatically by the measurement tools"
    atomintr is created automatically when you use the measurement tools in the tool palette (Distance / Angle / Torsion)
    or **Interaction...** in the Tools menu
    (→ [Toolbar and tool palette](../../ui/toolbar-tools.md),
    [Extracting interactions](../tools/interaction.md)).
    It can also be created from the New Renderer dialog, but nothing is drawn until a measurement is added.
    It does not appear in the Renderer type list shown when opening a file.

!!! info "In preparation"
    This page is only a skeleton. Details of each property will be added later.

## Overview

<!-- TODO(screenshot): example of an atomintr display -->

## Properties

For the common properties, see [Common Renderer properties](common.md).

### Interaction

### Dashed line

### 3D tube

### Value label

**Font name** is chosen from the list of fonts installed on the system
(the same list as Atom Label Font in Settings → [Settings reference](../settings.md)).

When **Label on top** is ON, the label is always visible and is not hidden by shapes in front of it (default: OFF).

<!-- TODO(content): build the property table (inspector label / property name / default /
     description) from the atomintr inspector section and the C++ definition -->

## See also

- [Renderer list](index.md)
- [Material](material.md) / [Edge lines](edge-lines.md)

---

*Verified against: CueMol3 2.4.0.546*
