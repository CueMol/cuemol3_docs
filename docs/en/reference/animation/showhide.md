<!-- source: ja/reference/animation/showhide.md @ 570ee02 -->

# ShowHideAnim (show/hide)

An animation that gradually shows or hides a Renderer while making it translucent.
Optionally, it can also switch abruptly without fading.

!!! info "In preparation"
    This page is only an outline. Details of each item will be added later.

## Properties

For the common properties (name, start time, duration, etc.), see
[Animation](index.md#common-properties).

Target renderers
:   The Renderers to show or hide

Show/Hide
:   Whether to show or hide them

Fade
:   When ON, the opacity changes continuously.
When OFF, the switch is instantaneous

Target opacity
:   The opacity after the change

<!-- TODO(content): fill in the value range and default of each showhide item
     from AnimElementInspector.tsx and the C++ qif definition -->

## See also

- [List of animations](index.md)
- [Bottom panel](../../ui/bottom-panels.md)

---

*Last checked: 2026-08-11 / Verified against: development build (tritium)*
