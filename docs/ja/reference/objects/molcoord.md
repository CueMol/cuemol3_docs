# MolCoord (分子)

原子座標を保持する Object です。タンパク質・核酸・低分子など、
分子構造データはすべてこのクラスになります。

!!! info "準備中"
    このページは骨組みのみです。プロパティの一覧は今後追加されます。

## 作成

File メニューの **Open File...** で分子座標ファイルを読み込むか、
**Get PDB...** で PDB ID を指定して取得します
(→ [File メニュー](../../menu/file.md))。

読み込める形式は
[対応ファイル形式](../../getting-started/index.md#対応ファイル形式)を参照してください。

## プロパティ

<!-- TODO(content): molcoord のプロパティ表 (名前 / 型 / 説明) を
     C++ の qif 定義とインスペクタから起こす -->

## 対応する Renderer

[simple](../renderers/simple.md) / [trace](../renderers/trace.md) /
[spline](../renderers/spline.md) / [ballstick](../renderers/ballstick.md) /
[cpk](../renderers/cpk.md) / [anisou](../renderers/anisou.md) /
[tube](../renderers/tube.md) / [ribbon](../renderers/ribbon.md) /
[cartoon](../renderers/cartoon.md) / [nucl](../renderers/nucl.md) /
[atomintr](../renderers/atomintr.md) / [disorder](../renderers/disorder.md) /
[dsurface](../renderers/dsurface.md) / [dsurf2](../renderers/dsurf2.md)

## 書き出せる形式

PDB / MOL・SDF / PQR / XYZR 形式で書き出せます
(File &gt; Save File As...)。

## 関連項目

- [Object の一覧](index.md)
- [Renderer](../renderers/index.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
