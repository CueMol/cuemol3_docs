<!-- source: ja/reference/styles.md @ 570ee02 -->

# Styles

A **style** is a preset that specifies a set of Renderer properties at once.
Because a Renderer has many properties, frequently used combinations can be
given a name and applied together.

## Value precedence

A property value is determined from three layers. Lower layers take priority.

1. **Default value** — the value fixed at the implementation level. It cannot be changed
2. **Style value** — applying a style replaces the default value with the value defined in the style
3. **User-specified value** — a value set directly in the inspector. Both the default value and the style value are ignored

For example, if a property's default value is 0.5, the style defines it as 0.1,
and 1.0 is set in the inspector, the value actually used is 1.0.

!!! tip "When the display does not change after applying a style"
    The property has a user-specified value, which overrides the style value.
    Reset the property to its default value, and the style value takes effect.
    Each item in the inspector can be reset to its default value individually
    (→ [Property inspector](../ui/inspector.md)).

## Types of styles

Styles for shape and styles for Coloring are defined independently and
can be applied separately.

Shape styles
:   A set of properties related to the shape of a Renderer. Applied by right-clicking the Renderer in the scene tree.
    For example, [ribbon](renderers/ribbon.md) has Default / Fancy1 / Round

Coloring styles
:   A set of properties related to coloring. Applied from the Color panel
    (→ [Coloring](coloring.md))

!!! info "In preparation"
    A list of the styles defined in the system will be added later.

<!-- TODO(content): from data/default_style.xml, make a table of the styles that appear in the GUI
     (target Renderer type / style name / contents) -->

## Working with styles

Styles can be applied, created and edited from the right-click menu of the scene tree.
Style sets also appear as nodes in the scene tree,
and can be read from and written to files (→ [Side panels](../ui/side-panels.md)).

!!! warning "Problems have been reported with Edit style / Create style"
    This is under investigation → [Development status and unimplemented features](../changes/status.md)

<!-- TODO(content): check in the tritium implementation how style sets are read and written
     (Style file, .xml) and where user-defined styles are saved, and document them -->

## See also

- [Renderers](renderers/index.md)
- [Coloring](coloring.md)
- [Property inspector](../ui/inspector.md)
- [Side panels](../ui/side-panels.md)

---

*Last checked: 2026-08-11 / Verified against: development build (tritium)*
