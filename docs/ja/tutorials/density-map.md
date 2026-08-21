# 電子密度マップを重ねて表示する

X 線結晶構造に電子密度マップを重ねて、モデルと密度の対応を確かめる手順を追います。
題材にはリゾチームの結晶構造 (PDB ID: **1QIO**) を使い、2Fo-Fc マップと Fo-Fc マップを
座標と一緒にネットワークから取得します。

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。モデル (棒モデル) に 2Fo-Fc (青) と Fo-Fc (緑/赤) のメッシュが重なった図 -->

## 1. 座標と密度マップをまとめて取得する

**File &gt; Get PDB...** は、座標に加えて電子密度マップも取得できます。

1. **PDB Accession Code** に `1QIO` を入力します
2. **Fetch coord file** に加えて、**Fetch 2Fo-Fc map** と **Fetch Fo-Fc map** にも
   チェックを入れます
3. マップの取得元は既定の **RCSB (cif.gz)** のままにします (**EBI (MTZ)** でも取得できます)
4. 取得が終わると、座標の Object 名と Renderer を指定する画面が出ます。
   ここでは **simple** (線画) を選ぶと、密度と原子の対応が見やすくなります

<!-- TODO(screenshot): Get PDB ダイアログ (1QIO、マップ 2 種にチェック) -->

マップには Renderer 指定の画面は出ず、次の構成で自動的に表示されます。

| Object | Renderer | 色 | レベル |
|---|---|---|---|
| `1qio_2fofc` | contour1 | 青 | +1.0σ |
| `1qio_fofc` | pos-cont | 緑 | +3.0σ |
| `1qio_fofc` | neg-cont | 赤 | −3.0σ |

2Fo-Fc マップ (青) はモデル全体を包む密度、Fo-Fc マップはモデルと実測の差を表す密度で、
緑が「モデルにない密度」、赤が「密度のないモデル」の目安になります。

## 2. 表示を確認する

シーンツリーには、座標の Object とは別に、マップの Object (`1qio_2fofc` / `1qio_fofc`) と
その contour Renderer が並びます。目のアイコンで個別に表示・非表示を切り替えられます。

マップは**ビュー中心の周囲だけ**が描かれます。分子ビューを平行移動すると、
表示されるマップの範囲も追従します。

contour 表示の仕組みは [contour](../reference/renderers/contour.md)、
マップ Object の詳細は [DensityMap](../reference/objects/densitymap.md) を参照してください。

## 3. レベルと範囲を調整する

マップの表示は、左サイドパネルの **Crystal &gt; Density map** パネルで調整します
(→ [サイドパネル](../ui/side-panels.md))。

1. 上部で対象の Renderer (`1qio_2fofc/contour1` など) を選びます
2. **Level** スライダで等高線レベルを変えます。ノイズが目立つときは上げ、
   密度の弱い部分を見たいときは下げます
3. **Extent** スライダで表示範囲 (中心からの距離) を変えます
4. **Transp** スライダで透明度を変えます

レベルは既定では σ 単位です。▼ メニューの **Use absolute contour level** で
絶対値指定に切り替えられます。

<!-- TODO(screenshot): Density map パネルと、Level を変えたときのメッシュの変化 (2 段階の比較) -->

## 4. 注目部位に絞って表示する

活性部位などの注目箇所を拡大して確かめるときの流れです。

1. 分子ビューで注目部位が中心に来るように視点を動かします
2. **Extent** を 10 Å 程度まで下げて、周囲のメッシュを減らします
3. 表示が追従していないときは、パネルの **Redraw** で表示中心を現在のビュー中心に
   更新できます

Fo-Fc の緑・赤のメッシュだけを見たいときは、シーンツリーで
`1qio_2fofc` の目のアイコンを閉じて 2Fo-Fc を一時的に隠すと確認しやすくなります。

## 5. 図として仕上げる

密度マップ入りの図も、通常のシーンと同じ手順で書き出せます
(→ [論文用の高解像度画像を書き出す](publication-images.md))。

## 次のステップ

- [対称分子・単位格子を表示する](symmetry.md) — 同じ 1QIO で結晶パッキングを見る
- [contour](../reference/renderers/contour.md) / [DensityMap](../reference/objects/densitymap.md) — 表示設定の詳細
- [サイドパネル](../ui/side-panels.md) — Density map パネルの各項目

---

*確認対象: CueMol3 2.3.8.494*
