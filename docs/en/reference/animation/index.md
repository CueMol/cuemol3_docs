<!-- source: ja/reference/animation/index.md @ d6bebaf -->

# Animation

Animation changes how the scene looks over time.
The timeline is shown in the **Animation** panel in the bottom panel,
and an animation is built by arranging animation elements (anim obj) on it
(→ [Animation panel](../../ui/bottom-panels/animation.md)).

The finished animation can be exported as a movie in the movie mode of the rendering window
(→ [Rendering window](../../ui/rendering-window.md)).

## List of types

The following elements can be added from the add menu of the Animation panel.

| Add menu | Class | Description |
|---|---|---|
| Simple spin | [SimpleSpin](simplespin.md) | Rotates the view around a given axis |
| Rock | [RockSpin](rockspin.md) | Makes the view oscillate (back and forth, circle, figure eight) |
| Camera motion | [CamMotion](cammotion.md) | Moves the view to a saved camera |
| Show / Hide | [ShowHideAnim](showhide.md) | Fades a Renderer in / out |
| Slide in / Slide out | [SlideInOutAnim](slideinout.md) | Slides a Renderer in and out |
| Mol morphing | [MolAnim](molanim.md) | Morphs between two structures by interpolation |
| No operation | — | An element that does nothing. Used to leave a gap in time. |

## Common properties

Every type of element has the following settings.
They are shown in the inspector when an element is selected in the scene tree or on the timeline.

Name
:   Name of the element. It cannot be empty or the same as the name of another element.

Disabled
:   When ON, the element is not played.

Relative to
:   Reference for the start time. *(absolute)* means an absolute time from the beginning of the timeline;
    if another element is selected, the end time of that element is the reference. A setting that makes
    the references circular is rejected with a reason. If the element used as the reference is removed,
    *(missing: name)* is shown and the animation cannot be played until this is fixed.

Start time
:   Start time. While dragging, the strip on the timeline follows, and releasing it
    counts as a single Undo (→ [Entering times](../../ui/inspector.md#entering-times)).

Duration
:   Duration. It is entered in the same way as Start time.

Quadric
:   Degree of acceleration and deceleration of the change over time. Changing the value
    makes the motion start gently and end gently instead of proceeding at a constant speed.

Elements can be cut, copied and pasted in the Animation panel
(→ [Animation panel](../../ui/bottom-panels/animation.md#copy--paste)).

## See also

- [Animation panel](../../ui/bottom-panels/animation.md) — Using the timeline
- [Rendering window](../../ui/rendering-window.md) — Exporting as a movie
- [Camera](../camera.md)

---

*Verified against: CueMol3 3.0.2.560*
