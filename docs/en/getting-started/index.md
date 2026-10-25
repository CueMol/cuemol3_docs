<!-- source: ja/getting-started/index.md @ 6cacee7 -->

# Getting started

## What is CueMol3

**CueMol3** (development codename *tritium*) is software for visualizing the three-dimensional structures of biological macromolecules such as proteins and nucleic acids. Molecular models obtained by X-ray crystallography or cryo-electron microscopy can be displayed together with electron density maps and molecular surfaces, and used to create figures for publications.

CueMol3 is the successor to CueMol2. It uses the same visualization engine (libcuemol2) as CueMol2, so scene files (`.qsc`) remain compatible. On the other hand, the **GUI has been completely rebuilt**, replacing the Mozilla XULRunner used by CueMol2 with **Electron + React**.

For what has changed from CueMol2, see [Changes from CueMol2](../changes/index.md).

## Supported file formats

These are the formats that libcuemol2 can read and write, and they are the same as in CueMol2.
Depending on the build configuration, some formats may not be included.

### Molecular coordinates (read)

| Format | Extensions |
|---|---|
| PDB | `.pdb` / `.ent` / `.pdb.gz` |
| mmCIF | `.cif` / `.cif.gz` |
| SYBYL Mol2 | `.mol2` |
| MOL / SDF | `.mol` / `.sdf` |

### Electron density and potential maps (read)

| Format | Extensions |
|---|---|
| CCP4 density map | `.map` / `.ccp4` / `.mrc` / `.ccp4.gz` |
| XPLOR / CNS density map | `.map` / `.cns` |
| BRIX density map | `.brix` / `.omap` |
| MTZ structure factors | `.mtz` |
| mmCIF map coefficients | `.cif` / `.cif.gz` |
| APBS electrostatic potential map (OpenDX) | `.dx` |

### Molecular surfaces and others (read)

| Format | Extensions |
|---|---|
| MSMS surface files | `.face` / `.vert` |
| PLY polygon file | `.ply` |

### MD trajectories (read)

In CueMol3, MD simulation trajectories can be loaded with **Open MD Trajectory...** in the File menu. This item is part of the **MD Tools** plugin, which is **disabled by default**. Enable it in Settings &gt; Plugins &gt; Installed (→ [Plugins](../reference/plugins/index.md)).

| Format | Extensions |
|---|---|
| AMBER topology | `.prmtop` / `.parm7` / `.top` |
| AMBER NetCDF trajectory | `.nc` |
| DCD binary trajectory | `.dcd` |
| GROMACS coordinates / XTC / TRR | `.gro` / `.xtc` / `.trr` |
| NAMD coordinates | `.coor` |

### Scenes (read)

These are loaded with **Open Scene...** in the File menu (they do not appear in Open File...).

| Format | Extensions |
|---|---|
| PyMOL session | `.pse` |
| CueMol scene | `.qsc` |

### Export

| Format | Use |
|---|---|
| CueMol scene (`.qsc`) | Saving the whole scene. Compatible with CueMol2 |
| PNG image | Snapshot of the screen (Rendering &gt; Export scene) |
| Umbreon ray-traced image (PNG) | High-quality image from the built-in ray tracer (the default rendering method) |
| POV-Ray SDL (`.pov`) | Scene description for external POV-Ray (an `.inc` file is also written) |
| STL (`.stl`) | Shape data for 3D printers, etc. |
| Metasequoia (`.mqo`) | For 3D modeling software |
| PDB / MOL・SDF / PQR / XYZR | Saving a single molecular Object (File &gt; Save File As...) |

## System requirements

| OS | Release assets | Notes |
|---|---|---|
| macOS (Apple Silicon / arm64) | `.dmg` | Ad-hoc signature only. The first launch requires extra steps |
| Windows (x64) | `.exe` (NSIS installer) | Unsigned, so a SmartScreen warning appears |
| Linux (x64) | `.AppImage` / `.deb` | |

An environment where OpenGL is available for 3D display is required.

External tools (ffmpeg / APBS・PDB2PQR / POV-Ray for the legacy backend) are used only by some features.
If they are not bundled with the release assets, specify the path to the executable in Settings
(→ [Configuring external tools](../install/external-tools.md)).
Ray tracing is done by the built-in Umbreon, so no external program is needed.

## License

CueMol is distributed under the **MIT License**. It comes with **no warranty**, and use is at your own risk.

- Users at non-profit (academic) organizations can use both the binaries and the source code free of charge.
- Users at commercial organizations can also use it free of charge, but we would appreciate being informed of the main purpose of use.

## Next steps

- [Quick tour](quick-tour.md) — the shortest path from launch to image export
- [Installation](../install/index.md) — how to get CueMol3 and the steps for each OS
