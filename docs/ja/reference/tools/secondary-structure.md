# 二次構造の割り当て (Reassign secondary structure)

cartoon や ribbon などの Renderer は、タンパク質の二次構造に基づいて形を描きます。
このページでは、二次構造がどのように割り当てられるかと、**Tools &gt; Reassign secondary str...** で
割り当てを変更する方法を説明します。

!!! info "撮影予定"

<!-- TODO(screenshot): Reassign secondary structure ダイアログ (Mode が Assign の状態) -->

## ファイルを読み込むときの割り当て

PDB / mmCIF ファイルを開くときのオプション (**&lt;形式&gt;-specific options**) の
**Calculate secondary structure** が ON (既定) になっていると、読み込んだあとに座標から
二次構造が自動的に計算されます。計算は DSSP のアルゴリズムで行われます
(→ [構造を読み込む](../../tutorials/basic/loading.md))。

OFF にすると、ファイル中の HELIX / SHEET レコードに従って二次構造が設定されます。
これらのレコードが含まれていないファイルでは、二次構造は割り当てられません。

## Reassign secondary structure ダイアログ

**Tools &gt; Reassign secondary str...** で **Reassign secondary structure** ダイアログを開きます。
**Molecule** で対象の分子を選び、**Mode** で動作を選びます。

| Mode | 内容 |
|---|---|
| **Recalculate** (既定) | 二次構造の自動割り当てをやり直します |
| **Assign** | 選んだ部分に、指定した二次構造を割り当てます |

### Recalculate (自動割り当ての再実行)

ファイルを読み込むときと同じ DSSP のアルゴリズムで、二次構造を計算し直します。

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Ignore β bulge** | OFF | β バルジを無視して計算します |
| **Helix gap-fill angle (°)** / **Angle** | OFF / 120 | ヘリックスの切れ目を埋めるときに使う角度。スイッチを ON にしたときだけ **Angle** を設定できます |

<!-- TODO(content): Ignore β bulge と Helix gap-fill angle の判定の詳細 (C++ の calcProt2ndry2 の実装から起こす) -->


### Assign (手動での割り当て)

| 項目 | 説明 |
|---|---|
| 選択 | 割り当てを変える部分の選択式。右端の ▼ から名前付き選択・履歴・選択ビルダーを使えます |
| **Type** | 割り当てる二次構造。既定は Coil |

**Type** には次のものを選べます。

| Type | 内容 |
|---|---|
| Coil | 二次構造が無い状態にします |
| β strand | β ストランドにします |
| α helix | α ヘリックスにします |
| 3-10 helix | 3<sub>10</sub> ヘリックスにします |
| π helix | π ヘリックスにします |

たとえば選択を `*`、Type を Coil にすると、すべての二次構造の情報が消えます。
自動割り当てが気に入らない場合は、この方法で β ストランドや α ヘリックスに変更できます。

!!! warning "極端な割り当ては避けてください"
    幾何的に β ストランドでない領域を β ストランドにすることもできますが、cartoon や ribbon が
    異常な形状になることがあります。全体を β ストランドにするような極端な変更は避け、
    割り当てを変える前にシーンを保存しておくことをお勧めします。

## 実行と結果

**OK** を押すと、分子の二次構造が書き換わり、cartoon などの表示に反映されます。
Recalculate・Assign とも、1 回の Undo で元に戻せます。

手動で変更した二次構造は、シーンを `.qsc` ファイルに保存すると一緒に保存され、
次に開いたときも保たれます。

## Console から使う

[Console](../plugins/console/index.md) の native モードでは `set_secondary_structure` で同じ処理を
行えます。選択を省略すると自動割り当てをやり直し、選択を指定するとその部分に `type`
(`coil` / `strand` / `helix` / `helix310` / `helixpi`) を割り当てます。

## 関連項目

- [Tools メニュー](../../menu/tools.md)
- [cartoon](../renderers/cartoon.md) / [ribbon](../renderers/ribbon.md)
- [選択式の文法](../selection.md)

---

*確認対象: CueMol3 2.4.0.546*
