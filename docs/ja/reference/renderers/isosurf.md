# isosurf (等値面)

電子密度マップなどのスカラー場を、等値面 (サーフェス) として描画する Renderer です。
対象 Object: 密度マップ (DensityMap)、静電ポテンシャルマップ (ElePotMap)。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): isosurf の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Isosurf

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を isosurf のインスペクタセクションと C++ 定義から起こす -->

<!-- TODO(content): cryo-EM マップモード (2.3.11.507 で追加)。Region
     (Auto / Box around center / Full map) / Level of detail / LoD budget
     (既定 16 Mcell、Full map のときのみ) / Refine on zoom (同上)。Full map では
     Max grid size と Use periodic boundary が隠れる。仕様が変わる可能性が
     あるため保留 -->

## 関連項目

- [Renderer の一覧](index.md)
- [contour](contour.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
