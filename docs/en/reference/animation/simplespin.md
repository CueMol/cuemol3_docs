<!-- source: ja/reference/animation/simplespin.md @ 570ee02 -->

# SimpleSpin

An animation that rotates the view around a specified axis.
It is the most basic element for showing a molecule from all sides.

!!! info "In preparation"
    This page is only an outline. Details of each item will be added later.

## Properties

For the common properties (name, start time, duration, etc.),
see [Animation](index.md#common-properties).

Rotation angle
:   The angle to rotate by

Spin axis
:   The vector of the rotation axis (X / Y / Z)

<!-- TODO(content): derive the value range and default of each simplespin item
     from AnimElementInspector.tsx and the C++ qif definition -->

By placing several SimpleSpin elements with different settings in a row, an animation
whose rotation direction or speed changes partway through can be created.

## See also

- [List of animations](index.md)
- [Bottom panel](../../ui/bottom-panels.md)

---

*Last checked: 2026-08-11 / Verified against: development build (tritium)*
