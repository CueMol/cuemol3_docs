<!-- source: ja/reference/selection.md @ e4bd8cd -->

# Selection expression syntax

Reference for the syntax of **selection expressions**, which specify a part of a molecule.
The syntax is shared with CueMol2 selection expressions, and compatibility with scene files (`.qsc`) is preserved.

A selection expression consists of **selection literals** and **selection operators**.
Some selection literals take a [name list](#name-list) or a [number list](#number-list) as an argument.

!!! tip "Where to enter selection expressions"
    - **Selection panel** — Type a selection expression directly and apply it. The expression is validated
      as you type, and expressions used before can be reused from **History**. The **selection builder**,
      which assembles an expression in the GUI without writing it, is also available
      (→ [Selection builder](../ui/selection-builder.md))
    - **The `sel` property of a Renderer** — In the property inspector, or in the Selection field of the
      New Renderer dialog, specifies the range that the Renderer draws
    - **Selection fields in dialogs** — Specify the target for molecular surface generation,
      interaction detection and so on

    → [Side panels](../ui/side-panels.md)

## Selection literals

A selection literal works as a selection command by itself.
It can be combined or modified with the operators described below.

### Select all

```
all
*
```

Selects all atoms in the molecule.

### Select none

```
none
```

Selects nothing.

### Selection by element

```
elem [name list]
e; [name list]
```

Atoms whose **element name** is given in the [name list](#name-list) are selected.
`e;` is an abbreviation of `elem`. With an abbreviation, the whitespace after the `;` can be omitted
(the same applies to the other abbreviations below).

**Example:**

```
e; C,N,O
```

Selects the carbon, nitrogen and oxygen atoms in the molecule.

### Selection by atom name

```
name [name list]
n; [name list]
```

All atoms whose **atom name** is given in the [name list](#name-list) are selected.

**Example:**

```
n; CA,N,O
```

Selects all atoms in the molecule named CA, N or O.
These are usually the α carbon, amide nitrogen and carbonyl oxygen atoms of the protein main chain.

### Selection by residue name

```
resn [name list]
r; [name list]
```

All atoms in residues whose name is given in the [name list](#name-list) are selected.

**Example:**

```
r; ARG,LYS
```

Selects the ARG (arginine) and LYS (lysine) residues in the molecule.

Regular expressions can also be used in the name list (→ [Name list](#name-list)).

```
r; /^A/
```

Selects residues whose name starts with A, such as ARG, ALA and ASN.

### Selection by residue number

```
resi [number list]
resid [number list]
i; [number list]
```

All atoms in residues whose number is given in the [number list](#number-list) are selected.

**Example:**

```
i; 3,5,10:20
```

Selects all residues numbered 3, 5, and 10 to 20.

### Selection by chain name

```
chain [name list]
c; [name list]
```

All atoms in chains whose name is given in the [name list](#name-list) are selected.

**Example:**

```
c; A,B
```

Selects chains A and B.

### Hierarchical notation

A notation with parts separated by dots, as follows.

```
chain name.residue number.atom name
```

Selects atoms that have the given **atom name** (multiple names can be specified in name list form),
in the residues in the range of the given **residue number** (multiple values can be specified in number list form),
in the chains with the given **chain name** (multiple names can be specified in name list form).
If `*` is specified, all chains / residues / atoms become targets.

This notation has exactly the same meaning as

```
chain "chain name" and resid "residue number" and name "atom name"
```

**Examples:**

```
A.1:100.CA,CB
```

Selects the α and β carbons of residues 1 to 100 in chain A.

```
*.5,6,7.*
```

Selects all atoms in residues 5, 6 and 7 of all chains.
This is equivalent to `resid 5,6,7`.

### Selection by residue property

```
rprop [name1]=[name2]
```

All atoms in residues whose residue property given by [name1] has the value given by [name2]
are selected.

**Example:**

```
rprop secondary=helix
```

Selects all atoms in residues whose residue property `secondary` is `helix`.

### Selection by B-factor

```
bfac <comparison operator> <number>
<comparison operator> := "<" | ">" | "="
```

Atoms whose B-factor satisfies the condition given by the comparison operator and the number are selected.
The number can be a real number.

**Example:**

```
bfac>50
```

Selects atoms with a B-factor greater than 50.

### Selection by occupancy

```
occ <comparison operator> <number>
<comparison operator> := "<" | ">" | "="
```

Atoms whose occupancy satisfies the condition given by the comparison operator and the number are selected.

**Example:**

```
occ>0.5
```

Selects atoms with an occupancy greater than 0.5.

### Selection by alternate conformation

```
alt [name list]
```

Atoms whose alternate conformation ID is given in the [name list](#name-list) are selected.

**Examples:**

```
alt A,null
```

Selects atoms with alternate conformation A, and atoms without an alternate conformation
(blank in the PDB file).
Note that if, for example, only the side chain of a residue has alternate conformations, only the side chain
is selected unless the expression is written like this.

```
A.7.* & alt B, null
```

Within residue 7 of chain A, selects atoms with alternate conformation B and atoms without
an alternate conformation.

### Selection by atom ID

```
aid [number list]
```

Atoms whose internal atom ID is given in the [number list](#number-list) are selected.
The atom ID is a serial number assigned internally when a molecule is loaded,
and it is not guaranteed to be preserved when the scene is saved and reloaded.
Normally, use the other selection literals above.

## Selection operators

### AND operator

```
[expr1] and [expr2]
[expr1] & [expr2]
```

Creates a selection that is the intersection of the selections represented by expr1 and expr2.
When written as `&`, the spaces before and after can be omitted.

**Example:**

```
chain A and resn ALA
c;A&r;ALA
```

Selects only the ALA residues belonging to chain A in the molecule.

### OR operator

```
[expr1] or [expr2]
[expr1] | [expr2]
```

Creates a selection that is the union of the selections represented by expr1 and expr2.

**Example:**

```
chain A or resn ALA
```

Selects the whole of chain A and all ALA residues in the molecule.

### NOT operator

```
not [expr1]
! [expr1]
```

Creates a selection that is the complement of the selection represented by expr1.

**Example:**

```
not resn ALA
```

Selects everything in the molecule except ALA residues.

### AROUND operator

```
[expr1] around [real value]
[expr1] around ["molecule name"] [real value]
a; ... (abbreviation of around)
```

Selects atoms within the given distance (in Å) of the selection represented by expr1.
Note that the selection of expr1 itself is not included.

In the second form, selects atoms in the other molecule given by the molecule name that are within
the given distance (in Å) of the selection represented by expr1.

**Examples:**

```
chain A around 3
```

Selects the set of atoms within 3 Å of chain A. Chain A itself is not selected.

```
chain A around ["1CRN.pdb"] 3
```

Selects the set of atoms within 3 Å of chain A in the molecule named 1CRN.pdb
(the selection is empty unless the same scene contains a molecule Object named 1CRN.pdb).

### EXPAND operator

```
[expr1] expand [real value]
ex; ... (abbreviation of expand)
```

Selects atoms within the given distance (in Å) of the selection represented by expr1.
Note that, unlike AROUND, the selection of expr1 itself is also included.

**Example:**

```
chain A expand 3.5
```

Selects chain A itself and the set of atoms within 3.5 Å of it.

### BYRES operator

```
byres [expr1]
br; [expr1]
```

Extends the selection of expr1 to whole residues.

**Example:**

```
byres name SD
```

Extends the set of atoms named SD to whole residues.
For proteins, this selects all methionine (Met) residues.

### BYSIDECH operator

```
bysidech [expr1]
```

Restricts the selection of expr1 to side chains only.
For proteins, the region selected by bysidech also includes Cα, to make the display easier to read.

**Example:**

```
bysidech A.10:100.*
```

Selects only the side chains (and Cα) of residues 10 to 100 in chain A.

### BYMAINCH operator

```
bymainch [expr1]
```

Restricts the selection of expr1 to the main chain only.

### NEIGHBOR / EXTEND operators

```
neighbor [real value]
extend [real value]
```

These are accepted by the grammar, but **the selection processing is not implemented, so the result is always an empty selection**.
Do not use them.

## Named macros

Frequently used selection expressions have predefined names.
The names can be written as they are in a selection expression.

| Name | Definition | Meaning |
|---|---|---|
| `protein` | `rprop type=prot` | Protein |
| `nucleic` | `rprop type=nucl` | Nucleic acid |
| `water` | `rprop type=water` | Water molecules |
| `sugar` | `rprop type=pyranose` | Sugar (pyranose) |
| `ligand` | `!rprop type=prot and !rprop type=nucl and !rprop type=water` | Anything other than protein, nucleic acid and water |
| `hydrogen` | `elem H` | Hydrogen atoms |
| `helix` | `rprop secondary=helix` | α helix |
| `sheet` | `rprop secondary=sheet` | β sheet |
| `coil` | `!rprop secondary=helix and !rprop secondary=sheet` | Anything other than helix and sheet |

**Example:**

```
protein and !hydrogen
```

Selects the non-hydrogen atoms of the protein.

## Name list

```
name [, name, ...]
```

A name list consists of a name, or a list of names separated by commas.
Any number of spaces, including none, may appear before and after a comma.

The first character of a name is a letter, a digit or an underscore (`_`).
From the second character on, a prime (`'`) and an asterisk (`*`) can also be used in addition to these.
Letters are case-insensitive.

If a name contains any other character (such as a dot), it must be enclosed in `"` (double quotation marks).
Note that when enclosed in double quotation marks, letters are case-sensitive.

!!! tip "Primes and asterisks in nucleic acid atom names"
    Atom names in the sugar part of nucleic acids are written either with a prime, as in `C1'`, or with
    an asterisk, as in `C1*` in old PDB files. If you **write the selection expression with a prime**,
    it also matches atoms named with an asterisk.
    Conversely, an expression written with an asterisk does not match atoms named with a prime.

### Regular expressions

Regular expressions can be used as a name list.

```
/^A[0-9][0-9]$/
```

The above selects three-character names such as A01, whose first character is A and whose remaining two characters are digits.
To match the whole name, `^` (matches the beginning of the line) must be added at the start and
`$` (matches the end of the line) at the end, as in this example.

Comma-separated notation of an ordinary name list and regular expressions can be mixed.

```
ABC,/^A[0-9][0-9]$/
```

Selects ABC and A followed by a two-digit number.

Note that letters in a regular expression are case-sensitive.

## Number list

```
<range> [, <range>, ...]
<range> := <number> | <number1>:<number2>
```

A number list consists of a range, or a list of ranges separated by commas.
A range is either a single integer (number) or two integers in the form `number1:number2`.
The latter represents the range of integers from number1 to number2, inclusive.

```
1, 3:10, 51
```

The above represents the set of integers 1, 3, 4, ..., 9, 10 and 51.

### Special case for residue numbers (insertion code)

When specifying residue numbers, an insertion code can be included.
For example, to select residue numbers 20A and 20B, write

```
i; 20A, 20B
```

A range notation such as 20A:20Z is also possible.
However, the ordering of residue numbers that include insertion codes is subtle,
so unexpected residues may be selected.

## See also

- [Selection builder](../ui/selection-builder.md) — Assemble selection expressions in the GUI without writing them
- [Coloring](coloring.md) — Color specification per selection (Paint)
- [Side panels](../ui/side-panels.md) — Operation of the Selection panel

---

*Verified against: CueMol3 2.3.12.517*
