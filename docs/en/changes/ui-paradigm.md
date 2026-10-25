<!-- source: ja/changes/ui-paradigm.md @ 570ee02 -->

# Changes in the interaction model

The biggest change in CueMol3 is **where settings are specified**.

## The CueMol2 approach and its problems

Nearly every function in the CueMol2 GUI had the same form.

> Press a menu item or button → a **modal dialog** opens → fill in every field → run with OK

Carrying this form over unchanged would leave the following inconveniences.

- **Settings cannot be adjusted while watching the result.** The dialog covers the molecular view and blocks interaction.
- **The same settings appear in two places.** The fields in the dialog used to create an Object duplicate the property fields available after it is created.
- **Fixing something later means reopening the same dialog.**

## The CueMol3 policy

CueMol3 drops "everything is a modal dialog" and **chooses the location according to the nature of the operation**.

| Nature of the operation | Form in CueMol3 | Examples |
|---|---|---|
| Editing the settings of a persistent target | **Permanent property inspector** | Renderer / Object / scene settings |
| A light choice with 1 to 3 options | **Popover** (a small panel that opens in place) | Choosing the label set for measurement tools, listing and deleting bonds |
| Involves operations on the molecular view | **Tool mode + auxiliary panel** | Measuring distances, angles and dihedral angles, adding bonds |
| A one-time process with many fields | **Dedicated window / panel** | Rendering window |
| Options in the middle of an open or save flow | **Modal dialog** (as before) | Format options when opening a file, options when saving a scene |
| A one-time confirmation or a destructive operation | **Modal dialog** (as before) | Confirmation when closing an unsaved scene, deleting atoms |

Modal dialogs have not been abolished entirely. They are still used **where interrupting the flow makes sense**.

## "Create immediately with defaults, with Undo as the safety net"

This is the central principle of CueMol3.

In CueMol2, even creating a single Renderer required deciding every field in a dialog first.
CueMol3 works as follows.

1. Only **what is minimally required to create it** is asked, through a light UI (the Renderer type, the target Object, and so on).
2. Everything else is **created immediately with default values**.
3. Fine adjustments are made afterward in the inspector, **while watching the result**.
4. If the result is not what you wanted, **Undo** (++cmd+z++ / ++ctrl+z++) reverts the whole creation.

Since mistakes can be reverted with Undo, there is no need to decide everything before creating.

## The property inspector is the only place for settings

For persistent targets (Renderers, Objects and the scene), **the property inspector is the only place** for settings.
The same fields are not duplicated in creation dialogs.

- Changes are **applied to the molecular view immediately** (there are no OK / Apply buttons).
- To revert a change, use **Undo** (there is no Cancel button).
- When another element is selected in the scene tree, the inspector switches to show it.

→ [Property inspector](../ui/inspector.md)

## One-time processes remember their settings

For processes that are "one-time but have many fields", such as export and rendering, the settings used last are remembered
and serve as the initial values the next time. The output destination and frame rate of movie output are examples.

## Summary: where to perform CueMol2 operations

| Operation in CueMol2 | Operation in CueMol3 |
|---|---|
| Open the Renderer property dialog | Select the Renderer in the scene tree → inspector on the right |
| Set values in the dialog and press OK | Change the values in the inspector (applied immediately) |
| Press Cancel in the dialog | Undo with ++cmd+z++ / ++ctrl+z++ |
| Mol bond editor dialog | **Add Bond** tool in the tool palette |
| Options preferences window | **Settings** tab |
| POV-Ray rendering dialog | **Rendering window** (still image mode) |
| Animation rendering dialog | **Rendering window** (movie mode) |

---

*Last checked: 2026-08-10 / Verified against: development build (tritium)*
