<!-- source: ja/ui/inspector.md @ 6cacee7 -->

# Property inspector

The **property inspector** on the right side of the window is a permanent panel that shows and edits the settings of the element selected in the scene tree.
It replaces the various property dialogs of CueMol2.

!!! info "Screenshot planned"

<!-- TODO(screenshot): Inspector with a Renderer selected (Properties tab, Common section expanded) -->

## Differences from CueMol2

| | CueMol2 | CueMol3 |
|---|---|---|
| Form | A modal dialog for each Renderer type | A single permanent panel |
| Molecular view | The dialog hides it / blocks interaction | Always visible and interactive |
| When changes take effect | When OK / Apply is pressed | **The moment a value is changed** |
| Reverting | Cancel | **Undo** (++cmd+z++) |

Because edits take effect immediately, there are no OK / Cancel buttons. Use Undo to revert a change.

## Switching the view

Selecting an element in the scene tree, or double-clicking it, shows its contents in the inspector.
The tabs at the top of the inspector switch the view.

| Tab | Contents |
|---|---|
| **Properties** | A settings view organized by purpose. It is divided into sections, which are opened one at a time (only the scene shows all sections open side by side) |
| **Generic** | A general-purpose editor that lists all the properties of the element |

The tab that opens by default depends on the type of the selected element.

## Contents by target

### Renderer

The Properties tab shows a **Common** section (basic settings and edge lines).
Opacity, material, edge line settings and so on are adjusted here.
For Renderers without faces (simple / trace / spline / contour, etc.), the edge line settings are
not shown (→ [Edge lines](../reference/renderers/edge-lines.md)).

!!! note "Detailed settings for each Renderer type"
    Settings specific to a Renderer type (ribbon / ballstick / molsurf, etc.) are shown
    in a dedicated section for each type.
    Nested properties that do not appear there (such as the cross-section shape of cartoon)
    can be edited in the **Generic** tab.

### Renderer group

Only Name / Visible / Locked are shown.
Items that have no meaning for a group (opacity, material, edge lines) are not shown.

### Object

Name / Selection / Visible / Locked / Linked (read-only) can be edited.
A density map (DensityMap) also shows a **Density map** section
for handling the map type (Map type / Effective kind)
(→ [DensityMap](../reference/objects/densitymap.md#map-type)).

### Scene

Opened from **Properties...** in the Scene menu.
It has settings for ambient occlusion / anti-aliasing / background / color proofing
(→ [Scene reference](../reference/scene.md)). Because there are few items, the sections are not collapsed
and are all displayed.

### View

Opened from **View property...** in the View menu. It is shown in the Generic tab.

## Entering numbers

A numeric setting field can be changed in three ways.

- Pressing the **left or right arrow** increases or decreases the value one step at a time (holding the button repeats the step).
- **Dragging left or right** over the number changes it continuously. Dragging about 3/4 of the field width
  covers the full range of allowed values from end to end. Holding ++shift++ makes the change
  finer, and holding ++ctrl++ / ++cmd++ makes it coarser.
  Pressing ++esc++ restores the value from before the drag started.
- **Clicking** the number turns it into a direct-entry field; confirm with ++enter++
  (cancel with ++esc++). Values outside the allowed range are clamped into the range.

The polygon subdivision settings (**Detail** / **Axial detail** / **Section detail**) are not numeric
input fields but drop-downs offering a set of levels. What is visible is the difference between 4 and 8,
not between 8 and 9, hence this form. The levels are basically powers of 2 (2 / 4 / 8 / 16 / 32), but
only the Detail of [dsurface](../reference/renderers/dsurface.md) also offers 1 and 24.
The list also includes the current value and the default value.

The [selection builder](selection-builder.md) can also be opened from the Selection field.
The number of atoms shown beside the apply button is also displayed here.

## Entering times

The **Start time** / **Duration** of an animation element, time values in the Generic tab, and the current time of the Animation
panel are displayed as a timecode in `M:SS.mmm` format (`H:MM:SS.mmm` for one hour or more),
and are edited segment by segment.

- **Click** a segment to select it, then **drag left or right** to increase or decrease it in that unit.
  Holding ++shift++ makes the step 1/10 as fine, and holding ++ctrl++ / ++cmd++ makes it 10 times larger.
- ++up++ / ++down++ increase or decrease the selected segment one step at a time. ++left++ / ++right++ move
  between segments.
- Typing digits overwrites the selected segment (typing `75` in the seconds segment carries over to 1:15).
- ++enter++ or a double-click opens an expression field, where a timecode such as `1:30.500`,
  a value with a unit such as `250ms` / `1.5s`, or a relative value such as `+2s` can be entered.
  ++esc++ cancels.

For Start time / Duration in the inspector, the timeline strip follows the drag,
and releasing the mouse button counts as a single Undo.

## Generic tab

Shows the properties of the element as a list of names and values.

- String / integer / real / boolean / enum values can be edited.
- A color can be chosen either as a named color of the scene or as a color relative to the molecule.
  A vector is edited component by component (x / y / z / w), and a time with a timecode input field (→ [Entering times](#entering-times)).
- Nested properties are also expanded as dot-separated keys and can be edited.
- A number is committed when focus leaves the input field or ++enter++ is pressed.
  Retyping a number can still be reverted with a single Undo.
- Each item can be reset to its default value. **Reset all to default** resets everything at once
  (a confirmation is shown; properties that no longer exist are skipped). The name (`name`) and the selection
  (`sel`) are exceptions: neither method resets them to their default values.
- Changes can be undone.

---

*Verified against: CueMol3 2.3.21.544*
