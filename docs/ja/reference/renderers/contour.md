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

Region
:   表示する範囲。*Auto* (既定) は、結晶学的マップでは *Box around center*、
    クライオ電子顕微鏡マップでは *Full map* になります。
    *Box around center* はビュー中心の周りだけを描き、視点の移動に追従します。
    *Full map* はマップ全体を描きます

Level of detail
:   格子を何点おきに読むか。*Auto* (既定) は、描く範囲の格子数が **LoD budget** に
    収まる最小の値 (2 の冪) を選びます。*1 (full resolution)* から *8* までを
    直接指定することもできます。**Region** が *Box around center* のときは
    使われません (常に全格子点を描きます)

LoD budget
:   *Auto* の **Level of detail** が収めようとする格子数。単位の 1 Mcell は
    約 100 万格子点です。大きくすると細かくなりますが描画が重くなります
    (既定は 2 Mcell)。**Region** が *Full map* のときだけ表示されます

Refine on zoom
:   ON (既定) にすると、描く範囲を視点の周りに絞り込み、その分だけ細かく描き直します。
    引いて見ているときはマップ全体が粗く、拡大した部分は細かくなります。
    **Region** が *Full map* のときだけ表示されます

**Buffer size** と **Use periodic boundary** は、**Region** が
*Box around center* のときだけ表示されます。

## 関連項目

- [Renderer の一覧](index.md)
- [isosurf](isosurf.md)
- [gpu_mapmesh](gpu_mapmesh.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.12.517*
