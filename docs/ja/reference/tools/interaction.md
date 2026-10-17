# 相互作用の抽出 (Interaction)

分子内・分子間の原子の接触 (水素結合などの相互作用の候補) を自動で抽出し、計測表示
([atomintr](../renderers/atomintr.md)) の線とラベルとして表示します。
**Tools &gt; Interaction...** で **Interaction analysis** ダイアログを開きます。

!!! info "撮影予定"

<!-- TODO(screenshot): Interaction analysis ダイアログと、抽出した相互作用の表示例 -->

## ダイアログの項目

### Molecule

| 項目 | 既定値 | 説明 |
|---|---|---|
| 分子 / 選択 | — | 相互作用を抽出する分子と、その中の対象部分。選択が空のときは全原子が対象です |
| **Second molecule** | OFF | ON にすると 2 つ目の分子を選べます。1 つ目の選択と 2 つ目の分子の間の相互作用を抽出します |
| **Second selection** | OFF | ON にすると 2 つ目の選択を指定できます。1 つ目の選択と 2 つ目の選択にまたがる相互作用だけを抽出します |

2 つ目の選択は、Second molecule が ON なら 2 つ目の分子、OFF なら 1 つ目の分子に対する
選択です。2 つ目の分子に 1 つ目と同じ分子を選んだ場合は、2 つ目の分子の指定は無視されます。

### Parameters

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Min distance (A)** | 2.5 | 相互作用とみなす最小距離 (Å) |
| **Max distance (A)** | 3.5 | 相互作用とみなす最大距離 (Å)。Min distance より大きくする必要があります |
| **Max labels** | 30 | 抽出する相互作用の最大数 (1〜1000) |
| **Hydrogen bond (N, O) only** | OFF | ON にすると、炭素原子が関わるものを除きます (タンパク質では N・O などの原子の組だけが残ります) |
| **Label set name** | `measure` | 相互作用を追加する atomintr Renderer の名前。無ければ作られます |

ダイアログを開くたびに、分子以外の項目は既定値に戻ります。

!!! note "水素結合の向きは考慮されません"
    抽出されるのは距離の条件を満たす原子の組で、水素結合の向きなどは考慮されていません。

## 実行と結果

**OK** を押すと、条件に合う原子の組が、1 つ目の分子の atomintr Renderer (Label set name の名前) に
追加されます。Renderer が無ければ新しく作られ、相互作用が点線と距離のラベルで表示されます。
追加は 1 回の Undo で元に戻せます。

- 該当する相互作用が無かった場合は「No interaction was found」と表示され、ダイアログは閉じません。
- Max labels を超えた分は追加されません。足りない場合は Undo してから、Max labels を増やして
  実行し直してください。

抽出した相互作用は、ツールパレットの Distance ツールで作った計測と同じものです。表示の設定は
[atomintr](../renderers/atomintr.md) のプロパティで変えられます。

### 例: 2 つの鎖の間の相互作用を抽出する

PDB エントリ 1OX1 (トリプシンと基質アナログ) で、A 鎖と B 鎖の間の相互作用を抽出する場合:

1. 1 つ目の選択に `chain A` を指定します
2. **Second selection** を ON にして、2 つ目の選択に `chain B` を指定します
3. ほかの項目は既定のまま **OK** を押します

A 鎖と B 鎖の間の、相互作用の候補が `measure` に追加されます。

## Console から使う

[Console](../plugins/console/index.md) の native モードでは `analyze_interactions` で同じ処理を
行えます (→ [Console のコマンド一覧](../plugins/console/commands.md))。

## 関連項目

- [Tools メニュー](../../menu/tools.md)
- [atomintr (計測表示)](../renderers/atomintr.md)
- [ツールバーとツールパレット](../../ui/toolbar-tools.md) — 距離・角度・二面角の計測

---

*確認対象: CueMol3 2.4.0.546*
