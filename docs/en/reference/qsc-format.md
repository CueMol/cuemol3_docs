<!-- source: ja/reference/qsc-format.md @ 570ee02 -->

# Scene file (`.qsc`)

Reference for the structure of the CueMol scene file `.qsc`.
It is compatible with CueMol2, so scenes created in CueMol2 can be opened in CueMol3.

!!! info "In preparation"
    This page is only a skeleton. Content will be added later.

## Overview

<!-- TODO(content): State that qsc is XML-based, its extension and MIME type,
     and that SceneXMLReader / SceneXMLWriter are the authoritative source -->

## Overall structure

<!-- TODO(content): Write up the nesting of the scene / object / renderer / camera / style / anim
     elements, based on src/qsys/SceneXMLReader.cpp and
     SceneXMLWriter.cpp -->

## Embedding data and external references

When saving a scene, you can choose whether to embed the data of molecular coordinates and density maps in the scene file itself,
or to keep only a reference to the original file
(see Save Scene As... in the [File menu](../menu/file.md)).

<!-- TODO(content): Storage format when embedding (QDF) and the path resolution rules for external references -->

## Compression and character encoding

In the save options, you can specify the compression method and the character encoding.

<!-- TODO(content): Compression choices and defaults (QDF1 + xz),
     and the restrictions when QDF0 is selected, based on QscWriterOptionDialog -->

## Compatibility with CueMol2

<!-- TODO(content): Compatibility option choices, and how elements added in CueMol3
     behave when opened in CueMol2 -->

## See also

- [File menu](../menu/file.md)
- [Supported file formats](../getting-started/index.md#supported-file-formats)

---

*Last checked: 2026-08-11 / Verified against: development build (tritium)*
