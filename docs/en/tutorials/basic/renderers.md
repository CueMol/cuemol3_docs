<!-- source: ja/tutorials/basic/renderers.md @ 6cacee7 -->

# Adding, removing and configuring Renderers

This tutorial practices attaching multiple Renderers to one Object to layer the display,
and changing settings in the inspector.
Continuing from the previous page ([Selecting part of a molecule](selection.md)),
start with Val2 to Phe3 (`A.2:3.*`) of `lysozyme` selected.

!!! info "Screenshots planned"
    Screenshots showing the workflow will be added to this page.

## 1. Add a Renderer to the selection

Display only the two selected residues as ballstick.

1. In the scene tree, right-click `lysozyme` and choose **New Renderer**
2. Choose **ballstick** from **Renderer type**
3. **Selection** is already filled with the expression for the current selection (`A.2:3.*`).
   Leave it as it is
4. **Renderer name** is automatically suggested with an unused name (such as `ballstick1`).
   To use a more descriptive name, change it here
5. Click **Create**. Only the Val2 to Phe3 part is displayed as ballstick

<!-- TODO(screenshot): New Renderer dialog (ballstick, Selection = A.2:3.*), and the display with only two residues as ballstick -->

## 2. Add a Renderer to the whole molecule

To apply a Renderer to everything regardless of the current selection, uncheck **Selection**.

1. Open **New Renderer** on `lysozyme` again and choose **ribbon**
2. Uncheck **Selection**
3. Click **Create**. The ribbon display is layered over the whole molecule

The simple line drawing, the two-residue ballstick and the whole-molecule ribbon are now stacked.
Closing the eye icon of simple1 in the scene tree tidies up the picture and makes it easier to see.

## 3. Change the displayed range later

Extend the displayed range of ballstick1 from Val2 to Phe3 to Val2 to Glu7.

1. In the **Molecular structure** panel, select residues 2 to 7 as a range and click **Select**
   (applying the selection expression `A.2:7.*` in the Selection panel works the same way)
2. In the scene tree, right-click `ballstick1` and choose **Change sel &gt; Current**

The displayed range of the Renderer is replaced with the current selection and extends to Glu7.
**Change sel** also offers standard ranges such as **All** (everything), **Protein**, **Water** and **Ligand**.

## 4. Delete a Renderer

Select a row in the scene tree and click the **Delete** button at the top of the panel.
It can also be deleted from the right-click menu. Deletion can be reverted with Undo (++cmd+z++ / ++ctrl+z++),
so feel free to experiment (ballstick1 is kept here).

## 5. Adjust properties

The fine details of a Renderer's appearance are determined by **properties**, which are edited in the
**property inspector** on the right (→ [Property inspector](../../ui/inspector.md)).

1. Select `ballstick1` in the scene tree
2. A ballstick-specific section is shown in the **Properties** tab of the inspector
3. Set **Bond width** (thickness of the bond sticks, in Å) and **Atom radius** (radius of the atom spheres)
   to `0.4`. The model becomes stubby
4. Enable **Show ring** to display a plate on the aromatic ring of Phe3

Changes are **reflected immediately** in the molecular view. There are no OK / Apply buttons;
use Undo to revert.

Properties without a type-specific section can all be edited in the **Generic** tab.
Each value has a defined default, and only the items changed from their defaults
can be reset (→ [Property inspector](../../ui/inspector.md)).

<!-- TODO(screenshot): before and after changing Bond width / Atom radius of ballstick in the inspector -->

!!! note "Differences from CueMol2"
    In CueMol2, properties were edited by opening a dialog for each Renderer and confirmed with OK.
    In CueMol3, they are edited in the always-visible inspector while watching the result
    (→ [Changes in the interaction model](../../changes/ui-paradigm.md)).

## Next steps

- [Coloring Renderers](coloring.md) — Coloring types and how to color different parts
- [Renderer list](../../reference/renderers/index.md) — properties of each type in detail

---

*Verified against: CueMol3 2.3.8.494*
