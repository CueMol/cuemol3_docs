# dsurface (分子表面・直接計算)

分子 Object から分子表面を直接計算して描画する Renderer です。
対象 Object: 分子 (MolCoord)。表面 Object を別途生成する必要がありません。
着色は Color パネルで設定します。Solid coloring のほか、静電ポテンシャルと
Multi-gradient も選べます (→ [Coloring](../coloring.md))。

!!! info "準備中"
    このページは骨組みです。表示例の図は今後追加されます。

## 概要

<!-- TODO(screenshot): dsurface の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Surface

| 項目 | 既定値 | 説明 |
|---|---|---|
| Drawing mode | Fill | 面で塗る (**Fill**) / 網目 (**Wireframe**) / 点 (**Dots**) |
| Line/Point size | 1.2 px | Wireframe の線幅と Dots の点の大きさ。Fill のときは使いません |
| Algorithm | Distance field | メッシュの作り方 (下記) |
| Surface type | Solvent excluded | 表面の種類。**van der Waals** (ファンデルワールス面) / **Solvent accessible** (溶媒接触表面) / **Solvent excluded** (溶媒排除表面) |
| Detail | 6 | メッシュの細かさ。段階から選びます (`1` / `2` / `4` / `6` / `8` / `16` / `24` / `32`) |

#### Algorithm

メッシュの作り方を選びます。どれを選んでも表面の種類 (Surface type) の意味は同じで、
違うのはメッシュの作られ方と速さです。

| Algorithm | 対応する Surface type | 内容 |
|---|---|---|
| Distance field | vdW / SAS / SES | 距離場を格子に載せてメッシュ化します (**既定**) |
| MeshMS (analytic SES) | SES のみ | 溶媒排除表面を解析的にメッシュ化します。細かい設定では距離場より大幅に高速です |
| EDTSurf (voxel) | vdW / SAS / SES | ボクセルと距離変換を使う従来の実装です |

**Detail の目盛りは 3 つで揃えてあります。** 既定の 6 では、どのアルゴリズムでも
ほぼ同じ頂点数になります。

!!! note "MeshMS が使えない場合は距離場に切り替わります"
    **MeshMS (analytic SES)** を選んでいても、Surface type が **Solvent excluded**
    以外の場合や、生成に失敗した場合は距離場に切り替えてメッシュを作ります。
    切り替えたことと理由は [Output パネル](../../ui/bottom-panels.md#output)に
    `DirectSurfRend&gt;` で始まる行として出ます。**設定した値そのものは変わりません。**

### Atom radii

表面の計算に使う元素ごとの半径です (単位 Å)。

| 項目 | 既定値 |
|---|---|
| Carbon | 1.70 |
| Nitrogen | 1.55 |
| Oxygen | 1.52 |
| Sulfur | 1.80 |
| Phosphorus | 1.80 |
| Hydrogen | 1.20 |
| Others | 1.70 |

## クリックとホバー

**Drawing mode** が **Fill** のときは、表面をクリック・ホバーするとその位置の原子が
対象になります。**Wireframe** と **Dots** は対象外です。矩形選択・投げ縄選択は
表面を対象にしません (→ [ピッキングとホバー表示](../../ui/mouse-input.md#ピッキングとホバー表示))。

## 関連項目

- [Renderer の一覧](index.md)
- [molsurf](molsurf.md)
- [dsurf2](dsurf2.md)
- [cpk](cpk.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.15.530*
