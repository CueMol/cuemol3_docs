<!-- source: ja/tutorials/animation-movie.md @ 773364a -->

# Making an animation and exporting a movie

This tutorial follows the whole process: arranging molecule rotations, camera movements and display switches on a timeline to build an animation, then writing it out as a movie file.
The first half uses the scene (3UG9) finished in [Making a protein ribbon figure](ribbon-figure.md), and the morphing in the second half uses two structures of transducin-α (1TND / 1TAG).

!!! info "Screenshots planned"
    Screenshots showing the workflow will be added to this page.

<!-- TODO(screenshot): Finished result. A timeline with strips lined up in the Animation panel and the molecular view during playback -->

## 1. How animation works

An animation is built by placing **animation elements** (rotation, camera movement, display switching, etc.) on a timeline. Each element is shown as a band (strip); the position of the band is the start time and its length is the duration
(→ [Animation](../reference/animation/index.md)).

## 2. Open the Animation panel

With the 3UG9 scene open, open the **Animation** tab in the bottom panel
(→ [Bottom panels](../ui/bottom-panels.md)).

## 3. Rotate the molecule

First, create the classic animation in which the molecule keeps spinning in place.

1. Choose **Simple spin** from the add menu of the panel
2. A strip is added. Select it and check the inspector on the right
3. Adjust **Rotation angle** and **Spin axis**.
   At 360°, the molecule makes one full turn and returns to its original orientation (→ [SimpleSpin](../reference/animation/simplespin.md))
4. Drag the band to change its start position, and drag its edge to change its length (the time taken for the rotation)

<!-- TODO(screenshot): Simple spin strip and inspector (Rotation angle / Spin axis) -->

## 4. Play it back to check

Press the play button of the panel to play the animation on the molecular view.
You can also check the state at any point in time by dragging the current position on the timeline, or by typing a time into the current time field and pressing ++enter++.

## 5. Add a camera motion

The view moves smoothly to a saved camera. This is used for effects such as zooming from the overall view to a region of interest.

1. Set the molecular view to the viewpoint you want as the start, and press **New camera from view** in the **View &gt; Camera** panel of the left side panel to save it (→ [Camera](../reference/camera.md))
2. In the same way, set the view to the viewpoint you want as the end and save another camera
3. In the header of the timeline, set the **start camera** to the camera for the start point
4. Choose **Camera motion** from the add menu
5. Select the added strip and specify the end camera in **Target camera** of the inspector (→ [CamMotion](../reference/animation/cammotion.md))

On playback, the view is interpolated from the start camera to the end camera over the span of the strip. If a start camera is specified, the animation always starts from the viewpoint of that camera, regardless of the viewpoint at the time you press play. To add acceleration and deceleration to the viewpoint movement, set the common property **Quadric** (→ [Animation](../reference/animation/index.md)).

## 6. Add a display switch

This is a display switch such as making the ballstick of a ligand appear partway through.
Show / Hide are animations in which a Renderer gradually **fades in / fades out** over the span of the strip.

1. Choose **Show** (fade in) or **Hide** (fade out) from the add menu
2. In the inspector, choose the target Renderer from the checklist
   (→ [Show / Hide](../reference/animation/showhide.md))

There are also **Slide in / Slide out**, which bring objects in and out with a movement from off-screen
(→ [SlideInOutAnim](../reference/animation/slideinout.md)). To leave a span with no elements placed, secure the length with the do-nothing **No operation** element.

## 7. Add morphing

Morphing animates a structural change by linearly interpolating the coordinates of corresponding atoms between two structures of the same molecule. Here, the structural change between the GTP-bound form (**1TND**) and the GDP-bound form (**1TAG**) of transducin-α is used as an example.

### Load the two structures

1. Choose **File &gt; New Tab** and create a new scene with **New Scene**
2. Fetch `1TND` with **File &gt; Get PDB...**. On the Renderer specification screen, choose **trace** and specify `c; A` in **Selection** (1TND contains three copies of the same molecule (chains A / B / C), so only chain A is displayed)
3. In the same way, fetch `1TAG` with **File &gt; Get PDB...** (Renderer is **trace**. It has only chain A, so no Selection is needed)

### Superpose 1TAG onto 1TND

The two structures are almost the same as molecules, but the positions of the molecules contained in the PDB entries differ.
Because morphing interpolation uses the coordinates as they are, superpose the two first.

1. Open **Tools &gt; Molecular superposition...**
2. Choose **SSM** in **Method** under **Algorithm**
3. Choose 1TND in **Molecule** under **Reference** and specify `c; A` in **Selection**
4. Choose 1TAG in **Molecule** under **Moving**
5. Press **OK**, and 1TAG moves to a position where it overlaps chain A of 1TND

The result of the superposition (RMSD and the number of aligned residues) can be checked in the log of **Output** in the bottom panel. Note that SSM superposes by matching secondary structures, so it can be used only for proteins.

### Convert to MorphMol and add a frame

1. Open **Tools &gt; Mol morphing animation...**
2. In **Target**, choose 1TND, the starting point of the change
3. Press **Convert to MorphMol**. The molecule is converted to a **MorphMol**, which can hold multiple frames (structures)
4. Press **Add mol...** and choose 1TAG, the end point of the change. The coordinates are copied as a frame
5. Confirm that the frame list shows the original structure (`(this)`) and the added structure, then close the dialog

The 1TAG Object that was the copy source is no longer needed, so you can delete it or hide it in the scene tree.

### Place it on the timeline and play

1. Choose **Mol morphing** from the add menu of the Animation panel
2. Select the added strip and specify the converted 1TND in **Target MorphMol** of the inspector (→ [MolAnim](../reference/animation/molanim.md))
3. On playback, the molecule deforms between the GTP-bound form and the GDP-bound form

Chains B and C, ligands and water molecules that exist only on the 1TND side have no correspondence, so they stay still, but they are not visible because only the trace of chain A is displayed.

!!! tip "To make a back-and-forth loop"
    Add another **Mol morphing** strip after the first, and set **Start value** to 1 and **End value** to 0 in the inspector to get the change in the reverse direction.
    Placing the two side by side gives a "there and back" loop animation
    (→ [MolAnim](../reference/animation/molanim.md)).

<!-- TODO(screenshot): Morph animation tool dialog (frame list) and the molecular view during morphing playback -->

!!! note "To create morphing with your own structures"
    Atoms are matched between frames by **chain name, residue number and atom name** (the order of atoms in the file does not matter). Failure to match is not an error: atoms present only in the original structure (`(this)`) **stay still**, and atoms present only in the added structure are ignored. To deform the whole molecule cleanly, prepare structures with water, ligands, hydrogens, etc. removed and with consistent chain names and residue numbers.
    Also, linear interpolation is a method suited to representing local structural changes. For large domain motions, create intermediate structures with other software and insert them as frames to make the transition natural.

!!! note "Differences from CueMol2"
    In CueMol2, choosing the menu displayed a prompt to select the target and implicitly converted it to a MorphMol. In CueMol3, the target is chosen in **Target** in the dialog and converted explicitly with the **Convert to MorphMol** button (this can be undone with Undo).

## 8. Export as a movie

Choose **Rendering &gt; Movie rendering...** and the rendering window opens in Movie mode (→ [Rendering window](../ui/rendering-window.md)).

1. Choose the target view in **Target**. **Backend** can be left at the default **Umbreon**
2. Choose the size in the **Image** tab (e.g. **HD1080 (1920×1080)**)
3. Press **Start Render**. The frames are rendered one by one, and when finished they are encoded into a movie file with ffmpeg (bundled with the macOS / Windows release assets; → [Configuring external tools](../install/external-tools.md))
4. By default the output is created in a temporary folder. Use **Save movie as...** to save the finished movie wherever you like

A **Frame rate** of 24 to 30 is usually sufficient. Movie rendering takes "number of frames × time per still image", so it is safest to try the size and quality on a single still image first. For presentations, a size around VGA / SVGA is enough.
Output settings such as the frame rate and movie format are remembered next time.
The settings for raising quality are shared with still images
(→ [Exporting high-resolution images for publication](publication-images.md)).

<!-- TODO(screenshot): Rendering window in Movie mode (progress and preview) -->

## Next steps

- [Animation](../reference/animation/index.md) — element types and common properties
- [Rendering window](../ui/rendering-window.md) — settings of the movie mode
- [Camera](../reference/camera.md) — saving viewpoints and display flags

---

*Verified against: CueMol3 2.4.0.546*
