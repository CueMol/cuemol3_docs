# gpu_mapmesh (等高線・GPU)

等高線メッシュ表示を GPU (シェーダ) で行う Renderer です。
対象 Object: 密度マップ (DensityMap)、静電ポテンシャルマップ (ElePotMap)。

!!! note "contour の GPU 実装です"
    表示内容は [contour](contour.md) と同等で、専用のプロパティセクションは
    ありません。共通プロパティのみが Properties タブに表示されます。
    表示の設定は Density map パネルからも調整できます
    (→ [サイドパネル](../../ui/side-panels.md))。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): gpu_mapmesh の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を gpu_mapmesh のインスペクタセクションと C++ 定義から起こす -->

## 関連項目

- [Renderer の一覧](index.md)
- [contour](contour.md)
- [isosurf](isosurf.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
