# dsurf2 (分子表面・距離場)

距離場 (distance field) を用いて分子表面を描画する Renderer です。
対象 Object: 分子 (MolCoord)。
着色は Color パネルで設定します。静電ポテンシャルと Multi-gradient も選べます
(→ [Coloring](../coloring.md))。

!!! note "dsurface とプロパティを共有します"
    dsurf2 は [dsurface](dsurface.md) と同じプロパティセット
    (Surface type / Detail / Probe radius / 描画モード / 元素ごとの半径) を持ち、
    インスペクタでも同じセクションが表示されます。各項目の説明は
    [dsurface](dsurface.md) を参照してください。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): dsurf2 の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Surface

### Atom radii

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を dsurf2 のインスペクタセクションと C++ 定義から起こす -->

## 関連項目

- [Renderer の一覧](index.md)
- [molsurf](molsurf.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.13.523*
