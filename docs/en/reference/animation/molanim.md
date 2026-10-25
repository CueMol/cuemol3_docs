<!-- source: ja/reference/animation/molanim.md @ 570ee02 -->

# MolAnim (structural change)

Interpolates between two different structures of the same molecule and
displays the morph as an animation. It uses linear interpolation, which makes it
well suited to animating local structural changes.

A morph pair (MorphMol) is created with **Mol morphing animation...** in the Tools menu
(→ [Morphing structural changes](../tools/morphing.md)).
The target molecule is converted to a MorphMol, and the structures that serve as frames are added
(→ [Making an animation and exporting a movie](../../tutorials/animation-movie.md)).
Morphs in scenes created with CueMol2 can also be loaded and played or edited as they are.

!!! info "In preparation"
    This page is only an outline. Details of each item will be added later.

## Properties

For the common properties (name, start time, duration, etc.), see
[Animation](index.md#common-properties).

Target MorphMol
:   The MorphMol Object that represents the morph. It holds the pair of structures to interpolate

Start value
:   The start value of the interpolation parameter

<!-- TODO(content): fill in the value ranges and defaults of each molanim item
     from AnimElementInspector.tsx and the C++ qif definition -->

## See also

- [List of animations](index.md)
- [Bottom panel](../../ui/bottom-panels.md)

---

*Verified against: CueMol3 2.4.0.546*
