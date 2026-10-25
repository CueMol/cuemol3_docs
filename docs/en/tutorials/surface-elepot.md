<!-- source: ja/tutorials/surface-elepot.md @ 773364a -->

# Coloring a molecular surface by electrostatic potential

This tutorial generates a molecular surface, colors it by the electrostatic potential
calculated with APBS, and produces a figure showing the charge distribution of the molecule.
The example is lysozyme (PDB ID: **1QIO**). It is a basic protein, so the
positively charged regions of its surface stand out clearly.

!!! info "Screenshots planned"
    Screenshots showing the workflow will be added to this page.

<!-- TODO(screenshot): Final result. A molecular surface colored by electrostatic potential (oriented so that the positive and negative regions are visible) -->

## 1. Load the structure

Fetch `1QIO` with **File &gt; Get PDB...** (coordinates only is fine).
Select **cartoon** as the Renderer.

## 2. Generate the molecular surface

Open **Tools &gt; Mol surface generation...**.

1. Select 1QIO in **Molecule** under **Target**
2. Enable **Use selection** and enter `protein` as the selection expression. Crystal structures
   contain water molecules, and without this the surface would be calculated around the waters as well
3. Raise **Point density (/A)** to **5**. This sets the fineness of the surface, and raising it
   gives a smoother surface for a small protein such as 1QIO (for very large molecules,
   the default of 2 is faster)
4. **Object name** and **Probe radius (A)** (1.4 Å, the radius of a water molecule) can be left at their defaults
5. **Algorithm** can also be left at the default **Auto** (→
   [MolSurfObj (molecular surface)](../reference/objects/molsurf.md#generation-algorithm-algorithm))
6. Click OK. A molecular surface Object and a molsurf Renderer are created, and the surface is displayed

<!-- TODO(screenshot): The Mol surface generation dialog and the molecular surface right after generation -->

The MolSurf Object holds only the shape of the surface. The molsurf Renderer refers to the molecule
specified in **Selection mol** in the inspector (here, 1QIO, from which the surface was generated)
for coloring and selection.
To display only part of the surface, specify the range in **Selection**.
For details, see [MolSurf](../reference/objects/molsurf.md) /
[molsurf](../reference/renderers/molsurf.md).

## 3. Calculate the electrostatic potential

Open **Tools &gt; APBS elepot calculation...**.

1. Select 1QIO in **Molecule** under **Target**
2. Enable **Use selection** here as well and enter `protein`
   (the calculation is normally done without water and ions)
3. **Elepot name** (the name of the electrostatic potential map Object to be created) can be left at the default
4. Leave **Method** under **Charge method** at the default **Use PDB2PQR**
5. Click **Start**. The calculation runs in the order pdb2pqr, then apbs, and the progress is displayed.
   It takes time for large molecules. When it finishes, an electrostatic potential map (ElePotMap)
   Object is added to the scene

APBS and pdb2pqr are bundled with the macOS / Windows release assets, so installation and
configuration are normally not needed. For builds that do not bundle them (such as Linux), install them
separately and specify the paths in Settings (→ [Configuring external tools](../install/external-tools.md)).

<!-- TODO(screenshot): The APBS elepot calculation dialog (progress display during the run) -->

Calculation conditions such as temperature and dielectric constants can be changed in **APBS options**.
A box showing the region over which the map was calculated (a `*unitcell` Renderer) is also added to the scene.
Once you have confirmed that the region is large enough, you can hide it.
For details on the electrostatic potential map Object, see [ElePotMap](../reference/objects/elepot.md).

## 4. Color the surface by electrostatic potential

1. Open the **Explorer &gt; Color** panel in the left side panel
2. Select the molsurf Renderer at the top
3. Select **Electrostatic potential** as the Coloring type
4. In **Potential**, select the electrostatic potential map created in step 3
5. Enable **By SAS**. The values on the surface itself (SES) are too close to the charged atoms
   and tend to give a mottled coloring, so the surface is colored with the values on the
   solvent-accessible surface (SAS), which lies outside the surface by the radius of a water molecule (1.4 Å)
6. Set **High** to about **2** and **Low** to about **-2**. The unit of the values is kT/e, and
   with the default of ±10 hardly any color appears. The narrower the range,
   the stronger the contrast

For details on the settings, see [Coloring](../reference/coloring.md).

<!-- TODO(screenshot): The Electrostatic potential settings in the Color panel, and the colored surface -->

## 5. Overlay a translucent surface and the cartoon

To show the structure inside the surface as well, make the surface translucent and overlay it on the cartoon.

1. Select the molsurf Renderer in the **Explorer &gt; Scene** tree (scene tree)
   in the left side panel
2. In the **Common** section of the property inspector, lower **Opacity** to about 0.5

This gives the classic overlay in which the path of the main chain is visible through the surface.
For finishing and export, see [Exporting high-resolution images for publication](publication-images.md).

<!-- TODO(screenshot): Overlay of a translucent surface and the cartoon -->

## Next steps

- [Exporting high-resolution images for publication](publication-images.md) — finish this figure by ray tracing
- [Coloring](../reference/coloring.md) — settings for electrostatic potential
- [MolSurf](../reference/objects/molsurf.md) / [ElePotMap](../reference/objects/elepot.md) — details of the generated Objects

---

*Verified against: CueMol3 2.4.0.546*
