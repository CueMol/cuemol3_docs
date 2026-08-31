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

Region
:   表示する範囲。*Auto* (既定) は、結晶学的マップでは *Box around center*、
    クライオ電子顕微鏡マップでは *Full map* になります。
    *Box around center* はビュー中心の周りだけを描き、視点の移動に追従します。
    *Full map* はマップ全体を描きます

Level of detail
:   格子を何点おきに読むか。*Auto* (既定) は、*Full map* のときは描く範囲の格子数が
    **LoD budget** に収まる最小の値 (2 の冪) を選び、*Box around center* のときは
    全格子点を使います。*1 (full resolution)* から *8* までを直接指定することもできます

LoD budget
:   *Auto* の **Level of detail** が収めようとする格子数。単位の 1 Mcell は
    約 100 万格子点です。大きくすると細かくなりますが描画が重くなります
    (既定は 16 Mcell)。**Region** が *Full map* のときだけ表示されます

Refine on zoom
:   ON (既定) にすると、描く範囲を視点の周りに絞り込み、その分だけ細かく描き直します。
    引いて見ているときはマップ全体が粗く、拡大した部分は細かくなります。
    **Region** が *Full map* のときだけ表示されます

**Max grid size** と **Use periodic boundary** は、**Region** が
*Box around center* のときだけ表示されます。

## 関連項目

- [Renderer の一覧](index.md)
- [contour](contour.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.12.517*
