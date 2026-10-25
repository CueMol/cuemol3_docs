<!-- source: ja/reference/tools/morphing.md @ 773364a -->

# Morphing structural changes (Mol morphing animation)

Displays the change between two different structures of the same molecule (morphing) as an animation.
It uses linear interpolation, so it is suited to animating local structural changes.

A morph is built in two steps.

1. In **Tools &gt; Mol morphing animation...**, convert a molecule (MolCoord) to a **MorphMol**
   and add the structures to interpolate (frames). This is described on this page.
2. Add a **MolAnim** element to the **Animation** tab in the bottom panel and decide when, and over
   how long, the morph is played (→ [MolAnim (structural change)](../animation/molanim.md)).

For a worked example, see
[Making an animation and exporting a movie](../../tutorials/animation-movie.md).

!!! info "Screenshot planned"

<!-- TODO(screenshot): Morph animation tool dialog (with two frames in Frames) -->

## Preparation: superpose the structures

Morph interpolation uses the coordinates as they are. If the two structures are not aligned in space,
first align them with [molecular superposition](superpose.md).

## Morph animation tool dialog

Open the **Morph animation tool** dialog with **Tools &gt; Mol morphing animation...**.
Operations in the dialog are applied to the scene immediately, and each operation can be undone.
Close the dialog with **Close** (there are no OK / Cancel buttons).

Choose the target molecule in **Target**.

### Converting a MolCoord to a MorphMol

When the selected molecule is not yet a MorphMol, a **Convert to MorphMol** button appears in **Setup**.
Pressing it converts the molecule to a MorphMol.

- The converted molecule becomes the **start** structure of the change (the reference frame).
- The molecule is replaced in the scene, but its name and Renderers are kept as they are.
- The conversion can be undone.

### Adding and deleting frames

When you select a MorphMol, **Frames** shows the list of structures (frames) it holds.
Immediately after conversion, only the reference frame `(this)` is present.

| Button | Description |
|---|---|
| **Add PDB file...** | Choose PDB files (`.pdb` / `.ent` / `.pdb.gz`) and add them as frames. You can choose several. The files are not loaded into the scene |
| **Add mol...** | Add another molecule in the scene as a frame. Choose the molecule in **Molecule to add** and press **Add as frame** |
| **Delete** | Delete the selected frame. `(this)` cannot be deleted |

An added frame is inserted after the row selected in the list. If no row is selected, it is added at the end.
The first frame in the list is the start of the interpolation, and the last frame is the end.

To edit a MorphMol later, choose the MorphMol as Target in the same dialog.

## Notes

### Correspondence between structures

If corresponding residues or atoms do not exist among the start, end and intermediate frames,
those atoms are excluded from the morphing calculation.

- If an atom in the reference frame `(this)` is missing from other frames, that atom stays
  still during the animation.
- If an atom is present in other frames but not in the reference frame, it is ignored when the frame is loaded.

For this reason, morphing between structures of the same molecule determined in different states is easy,
but morphing between similar but different homologs does not work as it is. If you build a model structure
with matching residue numbers, for example by homology modeling, it can be morphed correctly.

### Large structural changes

Linear interpolation has difficulty representing very large, domain-level changes. You can create an
animation by generating several intermediate structures with other software and lining them up
as frames to connect them.

## Using from the Console

In the native mode of the [Console](../plugins/console/index.md), the same operations are available with
`convert_to_morph` / `list_morph_frames` / `add_morph_frame` / `remove_morph_frame`
(→ [Console command list](../plugins/console/commands.md)).

## See also

- [Tools menu](../../menu/tools.md)
- [MolAnim (structural change)](../animation/molanim.md) — the animation element for morphing
- [Making an animation and exporting a movie](../../tutorials/animation-movie.md)

---

*Verified against: CueMol3 2.4.0.546*
