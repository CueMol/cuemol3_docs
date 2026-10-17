# 分子表面の生成 (Mol surface generation)

分子から分子表面 (溶媒排除表面、SES) を生成します。
**Tools &gt; Mol surface generation...** で **Mol surface generation** ダイアログを開きます。
生成した表面は [MolSurfObj (分子表面)](../objects/molsurf.md) の Object になり、
[molsurf](../renderers/molsurf.md) Renderer で表示されます。

!!! info "撮影予定"

<!-- TODO(screenshot): Mol surface generation ダイアログ -->

## ダイアログの項目

### Target

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Molecule** | — | 表面を作る分子 |
| **Use selection** / 選択 | OFF | ON にすると、選択式で指定した部分だけに表面を作ります。右端の ▼ から名前付き選択・履歴・選択ビルダーを使えます |

!!! tip "水分子を除いてください"
    結晶構造などには水分子が含まれていることがあります。選択を使わないと、水や基質を含む
    すべての原子に対して表面が計算されます。タンパク質だけに作るなら、**Use selection** を
    ON にして `protein` を、chain A だけなら `chain A` を指定します。

### Surface

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Object name** | `sf_<分子名>` | 作られる表面の Object の名前。分子を選ぶと自動で入ります |
| **Point density (/A)** | 2 | 表面のきめ細かさ (1〜10)。上げると細かくなりますが、計算に時間がかかり、メモリやファイルの容量も増えます |
| **Probe radius (A)** | 1.4 | 表面を計算するプローブの半径 (Å)。既定は水分子の半径です |
| **Algorithm** | Auto | 表面を計算する方法 (Auto / MeshMS / BALL) |

- 10 kDa 程度の小さな分子では、Point density を 5 程度に上げるときれいな表面になります。
  100 kDa を超える大きな分子では、低めの値の方が速く計算できます。
- **Algorithm** の違いは [MolSurfObj の生成アルゴリズム](../objects/molsurf.md#生成アルゴリズム-algorithm)
  を参照してください。既定の *Auto* では MeshMS を使い、失敗したときは BALL に切り替わります。

## 実行と結果

**OK** を押すと、表面の Object (MolSurfObj) と、それを表示する `molsurf` Renderer が作られます。
生成は 1 回の Undo で元に戻せます。

- molsurf Renderer は、生成元の分子を参照して CPK で着色されます。Color パネルから、
  ほかの分子用 Renderer と同じように Paint / CPK / Rainbow などの着色に変えられます
  (→ [Coloring](../coloring.md))。
- 生成のたびに、使われたアルゴリズム・所要時間・頂点数と面数が Output パネルのログに出力されます。
- 生成した表面は、シーンを `.qsc` に保存すると一緒に保存されます。

## 表面を作り直す (Regenerate surface)

シーンツリーで MolSurfObj を右クリックし、**Regenerate surface…** を選ぶと、**Regenerate surface**
ダイアログが開きます。**Point density (/A)** と **Algorithm** を変えて、同じ表面を作り直せます。

- 生成元の分子・選択・プローブ半径は表示されるだけで、変えられません。変えたい場合は、
  Mol surface generation で新しく作ります。
- 生成元の分子がシーンに無い場合 (ファイルから読み込んだ表面など) は、項目が選べません。
- 密度だけを変えた作り直しは速く終わります
  (→ [MolSurfObj](../objects/molsurf.md#生成アルゴリズム-algorithm))。

## Console から使う

[Console](../plugins/console/index.md) の native モードでは、`create_surface` で生成し、
`recalc_surface` で作り直せます (→ [Console のコマンド一覧](../plugins/console/commands.md))。

## 関連項目

- [Tools メニュー](../../menu/tools.md)
- [MolSurfObj (分子表面)](../objects/molsurf.md) / [molsurf](../renderers/molsurf.md)
- [分子表面の切断](surface-cutter.md) / [静電ポテンシャルの計算](apbs.md)
- [分子表面を静電ポテンシャルで着色する](../../tutorials/surface-elepot.md)

---

*確認対象: CueMol3 2.4.0.546*
