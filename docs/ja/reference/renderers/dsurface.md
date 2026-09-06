# dsurface (分子表面・直接計算)

分子 Object から分子表面を直接計算して描画する Renderer です。
対象 Object: 分子 (MolCoord)。表面 Object を別途生成する必要がありません。
着色は Color パネルで設定します。静電ポテンシャルと Multi-gradient も選べます
(→ [Coloring](../coloring.md))。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): dsurface の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Surface

### Atom radii

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を dsurface のインスペクタセクションと C++ 定義から起こす -->

## 関連項目

- [Renderer の一覧](index.md)
- [molsurf](molsurf.md)
- [dsurf2](dsurf2.md)
- [cpk](cpk.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.13.523*
