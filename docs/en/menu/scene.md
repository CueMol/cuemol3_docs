<!-- source: ja/menu/scene.md @ 6cacee7 -->

# Scene menu

Settings that affect the whole scene.

| Item | Description | Shortcut |
|---|---|---|
| Background &gt; White | Sets the background color to white. A color swatch is shown next to the item, and the check mark follows the current background color | |
| Background &gt; Black | Sets the background color to black. A color swatch is shown next to the item, and the check mark follows the current background color | |
| Use color proofing | Toggles color proofing (simulation of color reproduction in CMYK output). The check mark follows the current state. If no ICC profile is set, enabling it assigns the default profile; disabling it keeps the profile setting | |
| Properties... | Opens the current scene in the property inspector | |

!!! tip "The background color can also be changed from the right-click menu"
    Right-click the scene row in the scene tree to use the Background submenu and
    the Use color proofing check item in the same way.

!!! info "Items editable in Properties..."
    The scene Properties are not shown in a modal dialog as in CueMol2, but in the Properties tab
    of the [property inspector](../ui/inspector.md).
    They include settings for ambient occlusion, anti-aliasing, background and color proofing,
    and changes are reflected in the molecular view immediately. For the list of items, see the
    [Scene reference](../reference/scene.md).

    Use this also to specify an arbitrary background color
    (the Background menu items only switch between white and black).

---

*Verified against: CueMol3 2.3.12.517*
