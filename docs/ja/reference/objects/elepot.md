# ElePotMap (静電ポテンシャル)

静電ポテンシャルの 3 次元スカラー場を保持する Object です。
DensityMap と同じくスカラー場 (ScalarObject) の一種で、
密度マップ用の Renderer をそのまま利用できます。

!!! info "準備中"
    このページは骨組みのみです。プロパティの一覧は今後追加されます。

## 作成

Tools メニューの **APBS elepot calculation...** で計算するか、
APBS が出力した OpenDX 形式 (`.dx`) を読み込みます
(→ [静電ポテンシャルの計算](../tools/apbs.md)、
[外部ツールの設定](../../install/external-tools.md))。

## プロパティ

<!-- TODO(content): elepot のプロパティ表 (名前 / 型 / 説明) を
     C++ の qif 定義とインスペクタから起こす -->

## 対応する Renderer

[contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) /
[gpu_mapmesh](../renderers/gpu_mapmesh.md)

分子表面を静電ポテンシャルで塗り分けることもできます
(→ [Coloring](../coloring.md))。

## 関連項目

- [Object の一覧](index.md)
- [Renderer](../renderers/index.md)

---

*確認対象: CueMol3 2.4.0.546*
