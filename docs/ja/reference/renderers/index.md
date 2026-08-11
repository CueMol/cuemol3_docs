# Renderer

**Renderer** は Object のデータをどう描画するかを決める要素です。
1 つの Object に複数の Renderer を付けて、主鎖はリボン・活性部位は棒球モデル、
といった重ね方ができます。

Renderer はシーンツリーで Object 行または Renderer グループ行を右クリックし、
**New Renderer** から作成します (→ [サイドパネル](../../ui/side-panels.md))。
設定はプロパティインスペクタで編集します
(→ [プロパティインスペクタ](../../ui/inspector.md))。

## 種類の一覧

| 型名 | 対象 Object | 説明 | New Renderer |
|---|---|---|---|
| [simple](simple.md) | 分子 | 結合を線で描画する最軽量の表示 | ○ |
| [trace](trace.md) | 分子 | 主鎖の pivot 原子 (Cα など) を線で結ぶ表示 | ○ |
| [spline](spline.md) | 分子 | 主鎖を平滑化した曲線で描画 | ○ |
| [ballstick](ballstick.md) | 分子 | 原子を球、結合を円柱で描画する棒球モデル | ○ |
| [cpk](cpk.md) | 分子 | ファンデルワールス半径の球で描画する空間充填モデル | ○ |
| [anisou](anisou.md) | 分子 | 異方性温度因子を楕円体で描画 (ORTEP 風) | ○ |
| [tube](tube.md) | 分子 | 主鎖を滑らかなチューブで描画 | ○ |
| [ribbon](ribbon.md) | 分子 | 二次構造に応じたリボン / 板 / チューブ表示 | ○ |
| [cartoon](cartoon.md) | 分子 | ヘリックスを筒状にした模式的な二次構造表示 | ○ |
| [nucl](nucl.md) | 分子 | 核酸の主鎖チューブ + 塩基表示 | ○ |
| [atomintr](atomintr.md) | 分子 | 原子間の距離・角度・相互作用の表示 | — |
| [disorder](disorder.md) | 分子 | ディスオーダー領域を点線で補って表示 | — |
| [dsurface](dsurface.md) | 分子 | 分子から直接計算した分子表面 | ○ |
| [dsurf2](dsurf2.md) | 分子 | 距離場を用いた分子表面 | ○ |
| [molsurf](molsurf.md) | 分子表面 | 生成済みの分子表面 Object の描画 | ○ |
| [contour](contour.md) | 密度マップ | 等高線メッシュ表示 | ○ |
| [isosurf](isosurf.md) | 密度マップ | 等値面表示 | ○ |
| [gpu_mapmesh](gpu_mapmesh.md) | 密度マップ | 等高線メッシュの GPU 実装 | ○ |

**New Renderer** 列が「—」の型は、New Renderer ダイアログの一覧に表示されません。

- **atomintr** は、ツールパレットの計測ツール (Distance / Angle / Torsion) や
  Tools メニューの **Interaction...** を使うと自動的に作成されます
- **disorder** は主鎖 Renderer を対象に取るため、単独では作成できません

また、内部処理用の Renderer (選択のハイライト、原子ラベル、対称分子、単位格子など) は
一覧に表示されません。

## プロパティの構成

Renderer のプロパティは、種類によらず共通のものと、種類固有のものに分かれます。

- **共通プロパティ** — 名前・選択範囲・表示 / 非表示・マテリアル・不透明度・エッジライン
  → [Renderer 共通プロパティ](common.md)
- **種類固有のプロパティ** — 各 Renderer のページを参照してください

インスペクタの **Properties** タブに現れないプロパティは、
**Generic** タブから編集できます。

## プリセット

New Renderer ダイアログでは、複数の Renderer をまとめて作成する**プリセット**も
選べます。プリセットを選ぶと、選択式で対象を振り分けた Renderer 群が
1 つのグループとして作られます。

| プリセット | 構成 |
|---|---|
| Default preset 1 | `ribbon` (タンパク質) + `nucl` (核酸) + `ballstick` (それ以外) |
| Default preset 2 | `cartoon` (タンパク質) + `nucl` (核酸) + `ballstick` (それ以外) |
| Simple preset 1 | `trace` (タンパク質・核酸) + `simple` (それ以外) |

## 関連項目

- [Object](../objects/index.md) — Renderer が描画する対象
- [Coloring](../coloring.md)
- [スタイル](../styles.md)
- [選択式の文法](../selection.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
