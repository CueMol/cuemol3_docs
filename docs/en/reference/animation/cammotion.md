<!-- source: ja/reference/animation/cammotion.md @ 570ee02 -->

# CamMotion (camera motion)

An animation that smoothly moves the view to a saved camera position,
orientation and zoom.

!!! info "In preparation"
    This page is only an outline. Details for each item will be added later.

## Properties

For the common properties (name, start time, duration, and so on), see
[Animation](index.md#common-properties).

Target camera
:   The camera to move to. It must be saved beforehand as a camera in the
Camera panel (see [Camera](../camera.md)).

Ignore rotation
:   When ON, the view orientation is not changed.

Ignore center
:   When ON, the view center is not changed.

Ignore zoom
:   When ON, the zoom is not changed.

Ignore slab
:   When ON, the slab (the range of depth that is displayed) is not changed.

<!-- TODO(content): fill in the value ranges and defaults of each cammotion item
     from AnimElementInspector.tsx and the C++ qif definition -->

To set the view at the start of the animation, use the start camera setting
in the Animation panel.

## See also

- [List of animations](index.md)
- [Bottom panel](../../ui/bottom-panels.md)

---

*Verified against: CueMol3 2.3.15.530*
