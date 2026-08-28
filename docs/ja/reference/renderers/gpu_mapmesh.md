# gpu_mapmesh (等高線・GPU)

等高線メッシュ表示を GPU (シェーダ) で行う Renderer です。
対象 Object: 密度マップ (DensityMap)、静電ポテンシャルマップ (ElePotMap)。

!!! note "contour の GPU 実装です"
    表示内容は [contour](contour.md) と同等で、プロパティも同じものが
    Properties タブの **GPU contour** セクションに表示されます。
    表示の設定は Density map パネルからも調整できます
    (→ [サイドパネル](../../ui/side-panels.md))。

!!! warning "新規作成の選択肢からは外れました"
    線の太さを変えられず、CPU 版の [contour](contour.md) より遅いため、
    New Renderer の一覧から外されました。既存のシーンに含まれるものは表示され、
    設定も変更できます。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): gpu_mapmesh の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を gpu_mapmesh のインスペクタセクションと C++ 定義から起こす -->

<!-- TODO(content): cryo-EM マップモード (2.3.11.507 で追加)。contour と同じ
     Region / Level of detail / LoD budget / Refine on zoom を持つ
     (インスペクタのセクション見出しは GPU contour)。仕様が変わる可能性が
     あるため保留 -->

## 関連項目

- [Renderer の一覧](index.md)
- [contour](contour.md)
- [isosurf](isosurf.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.11.507*
