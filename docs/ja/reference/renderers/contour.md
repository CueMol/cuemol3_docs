# contour (等高線メッシュ)

電子密度マップなどのスカラー場を、等高線メッシュとして描画する Renderer です。
対象 Object: 密度マップ (DensityMap)、静電ポテンシャルマップ (ElePotMap)。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): contour の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Contour

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を contour のインスペクタセクションと C++ 定義から起こす -->

<!-- TODO(content): cryo-EM マップモード (2.3.11.507 で追加)。Region
     (Auto / Box around center / Full map) / Level of detail / LoD budget
     (既定 2 Mcell、isosurf の 16 とは異なる。Full map のときのみ) /
     Refine on zoom (同上)。Full map では Buffer size と Use periodic boundary が
     隠れる。仕様が変わる可能性があるため保留 -->

## 関連項目

- [Renderer の一覧](index.md)
- [isosurf](isosurf.md)
- [gpu_mapmesh](gpu_mapmesh.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
