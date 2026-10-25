<!-- source: ja/reference/color-syntax.md @ e4bd8cd -->

# Color syntax

Colors are usually specified with the color picker, but they can also be written directly as text.
Colors in scene files (`.qsc`) and style files are written in the syntax described here.

!!! note "Entering colors as text"
    The CueMol3 GUI is centered on the color picker, but the syntax described here can also be used for finer adjustment. In particular, colors with modifiers cannot be specified from the GUI.

<!-- TODO(verify): whether the tritium color picker has a free-text input field,
     and if so in which panel / inspector. If it does, describe it here -->

## HTML notation

Same as the `#` color notation used in HTML and CSS.

### 6-digit notation

```
#UVWXYZ
```

U to Z are digits 0-9 or letters A-F.
UV is the red intensity, WX the green intensity, and YZ the blue intensity.

**Examples:**

```
#1234AB
```

Red=0x12 (=18/255), Green=0x34 (=52/255), Blue=0xAB (=171/255).

```
#FFFFFF
```

Red=0xFF, Green=0xFF, Blue=0xFF gives white.

### 3-digit notation

```
#XYZ
```

X is a digit 0-9 or a letter A-F. Equivalent to `#XXYYZZ`.

**Example:**

```
#CCC
```

Red=0xCC (=204/255), Green=0xCC, Blue=0xCC gives gray.

## RGB notation

```
rgb(X,Y,Z)
```

X, Y and Z are real numbers from 0 to 1 and represent the red, green and blue intensities.

**Example:**

```
rgb(1.0, 0.5, 0.5)
```

This gives pink.

### Notation with alpha (opacity)

```
rgba(X,Y,Z,W)
```

X, Y, Z and W are real numbers from 0 to 1. W is the opacity; 0 is fully transparent.

## HSB notation

```
hsb(X,Y,Z)
```

X is a real number from 0 to 360 and represents the hue (0 is red and 180 is light blue).
Y and Z are real numbers from 0 to 1 and represent the saturation and the brightness.

### Notation with alpha (opacity)

```
hsba(X,Y,Z,W)
```

W is the opacity; 0 is fully transparent.

## Name notation

```
<string of _a-z0-9+- characters>
```

Specifies a color by a color name defined in a style file. Names are case-insensitive.
The system default style file defines the same kind of color names as those available in HTML / CSS
([CSS Color Module Level 3](https://www.w3.org/TR/css3-color/#svg-color)).

**Example:**

```
antiquewhite
```

This is the same color as `#faebd7`.

## Molecule color notation

```
$molcol
```

Can be used in the color settings of Renderers that refer to a molecular Object. Besides molecular structure Renderers,
it also works for Solid coloring of molecular surfaces (molsurf / dsurface) and isosurfaces (isosurf).
It refers to the color specified on the corresponding molecular Object.

When the coloring of the molecular Object is changed, the color of Renderers that use `$molcol` follows.
Use it when several Renderers should share the same coloring.
→ [Coloring](coloring.md)

## Modifiers

Written in curly braces (`{}`) after any of the color specifications above.
Multiple modifiers are separated by semicolons.

```
<color>{<modifier1>;<modifier2>;...}
```

A modifier consists of a key and a value.

```
modifier := <key> : <value>
```

The following keys are available. The key determines the kind of value that can be specified.

material
:   Specifies the material. The value is a string naming the material → [Material](renderers/material.md)

alpha
:   Specifies the opacity. The value is a real number from 0 to 1

mod_h
:   Change in hue. The value is any real number

mod_s
:   Change in saturation. The value is any real number

mod_b
:   Change in brightness. The value is any real number

Modifiers can be used with the rgb, hsb, `#` and color name notations alike,
but apart from material there is little point in using them with anything other than the color name notation or the molecule color notation.

**Examples:**

```
rgb(1,0,0){material: shadow; alpha: 0.5}
```

Specifies red with the material changed to shadow (flat fill without shading) and the opacity changed to 0.5.

```
$molcol{mod_s: -0.2}
```

Specifies the molecule color with the saturation (1 is the pure color; the smaller the value, the whiter the color) decreased by 0.2.
That is, the color is slightly whiter than the coloring specified on the molecule side.

## See also

- [Coloring](coloring.md)
- [Material](renderers/material.md)

---

*Verified against: CueMol3 2.3.15.530*
