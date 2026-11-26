# リガンド結合部位の表示

タンパク質に結合したリガンドと、その周りの残基を取り出して表示し、
水素結合の候補を点線で示す図を作る手順を追います。
題材にはストレプトアビジンとビオチンの複合体 (PDB ID: **1STP**) を使います。
ビオチンは非常に強く結合することで知られ、ポケットの中で多くの残基と水素結合を作っています。

!!! abstract "このチュートリアルについて"
    - **題材**: ストレプトアビジンとビオチンの複合体 (PDB ID: 1STP)
    - **学ぶこと**: 選択式による周辺残基の選択 (`around` / `byres`)、Interaction ツールによる水素結合の候補の表示、原子のラベルの書式
    - **前提**: 基本操作コースの [分子の一部の選択](../basic/selection.md) と [Renderer の追加・削除と設定](../basic/renderers.md)

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。ビオチンと周辺残基の ballstick、水素結合の候補の点線、残基名のラベル -->

## 1. 構造を読み込む

**File &gt; Get PDB...** で `1STP` を取得します。Renderer は **cartoon** を選んでおきます。

1STP には、ストレプトアビジンの鎖が 1 本 (chain A) と、ビオチン 1 分子、水分子が含まれています。
ビオチンの残基名は **BTN** (残基番号 300) です。

## 2. リガンドを ballstick で表示する

1. シーンツリーで `1stp` を右クリックし、**New Renderer** を選びます。
2. **Renderer type** から **ballstick** を選びます。
3. **Selection** にチェックを入れ、**Atoms** に `resn BTN` を入力します。
   残基名が BTN の原子 (ビオチンの 16 原子) が対象になります。
4. **Create** を押すと、ビオチンが ballstick で表示されます (Renderer 名は `ballstick1`)。
5. シーンツリーで `ballstick1` の行を選び、パネル上部の **Focus** を押します。
   ビオチンが画面に収まるように視点が移動します。

## 3. 周辺の残基を表示する

ビオチンから 4 Å 以内に原子を持つ残基を、もう 1 つの ballstick で表示します。

1. もう一度 `1stp` の **New Renderer** から **ballstick** を選びます。
2. **Selection** にチェックを入れ、**Atoms** に次の式を入力します。

    ```
    byres (resn BTN around 4.0) and protein
    ```

3. **Create** を押すと、周辺の残基が ballstick で表示されます (Renderer 名は `ballstick2`)。
4. シーンツリーで `ballstick2` の行を選び、**Focus** を押します。

式は次の 3 つを組み合わせています (→ [選択式の文法](../../reference/selection.md))。

| 部分 | 意味 |
|---|---|
| `resn BTN around 4.0` | ビオチンから 4 Å 以内にある原子。ビオチン自身は含まれません。 |
| `byres (...)` | その原子を含む残基の全原子に広げます。側鎖の一部だけが選ばれて、ちぎれた表示になるのを防ぎます。 |
| `... and protein` | タンパク質の原子に限ります。ビオチンの近くにある水分子を除きます。 |

1STP では、Asn23・Ser27・Tyr43・Ser45・Asn49・Ser88・Thr90・Asp128 などの 16 残基が選ばれます。
ポケットの壁を作る 3 つのトリプトファン (Trp79・Trp92・Trp108) も含まれます。

## 4. cartoon を半透明にする

ストレプトアビジンは β バレル (筒状に巻いた β シート) の構造で、ビオチンは筒の内側に結合しています。
このため、向きによっては cartoon のシートに隠れて、結合部位が見えません。
cartoon を半透明にすると、シートの位置を残したまま内側が見えるようになります。

1. シーンツリーで `cartoon1` を選びます。
2. プロパティインスペクタの **Basic settings** セクションで **Opacity** を 0.3 前後に下げます。

分子をドラッグして回し、ビオチンと周辺の残基が重ならずに見える向きを探してください。

## 5. 水素結合の候補を表示する

**Tools &gt; Interaction...** で **Interaction analysis** ダイアログを開きます
(→ [相互作用の抽出 (Interaction)](../../reference/tools/interaction.md))。

1. **Molecule** で `1stp` を選び、その下の選択に `resn BTN` を指定します。
2. **Second selection** を ON にし、2 つ目の選択に `protein` を指定します。
   ビオチンとタンパク質の間の組だけが対象になります。
3. **Hydrogen bond (N, O) only** を ON にします。炭素原子が関わる組が除かれます。
4. **Min distance (A)** (2.5)・**Max distance (A)** (3.5)・**Max labels** (30) は既定のままにします。
5. **OK** を押します。

条件に合う原子の組が、点線と距離のラベルで表示されます。1STP では次の 8 組です。

| ビオチンの原子 | 相手の残基と原子 | 距離 (Å) |
|---|---|---|
| O3 (ウレイド環のカルボニル) | Asn23 ND2 | 2.99 |
| O3 | Ser27 OG | 2.77 |
| O3 | Tyr43 OH | 2.58 |
| N2 | Ser45 OG | 3.04 |
| O12 (カルボキシ基) | Asn49 N (主鎖) | 2.95 |
| O11 (カルボキシ基) | Ser88 OG | 2.69 |
| S1 (テトラヒドロチオフェン環の硫黄) | Thr90 OG1 | 3.44 |
| N1 | Asp128 OD2 | 2.78 |

表示されるのは、距離の条件を満たす原子の組 (水素結合の候補) です。水素結合の向きは
考慮されていません。**Hydrogen bond (N, O) only** は炭素を除くだけなので、Thr90 と
ビオチンの硫黄の組のように、N・O 以外の原子との組も残ります。

点線と距離のラベルは、`1stp` の atomintr Renderer (`measure`) に追加されます。
線の色やラベルの大きさは、この Renderer のプロパティで変えられます
(→ [atomintr (計測表示)](../../reference/renderers/atomintr.md))。

!!! tip "Second selection を使わない場合"
    手順 2 を省くと、ビオチンと水分子の間の組なども加わります。
    水分子を介した水素結合のネットワークを見たいときは、こちらを使います。

## 6. 残基にラベルを付ける

水素結合の候補を作っている 8 残基に、残基名と番号のラベルを付けます。

1. 分子ビューで、表の 8 残基の Cα 原子を順にクリックします。クリックした原子に
   `A ASN23 CA` のような名称が表示されます (もう一度クリックすると消えます)。
2. シーンツリーに、ラベル用の `(*namelabel)` の行が作られています。この行を選びます。
3. プロパティインスペクタの **Name label** セクションで、**Format** に `{resn}{resi}` を入力します。

ラベルが `ASN23` のような短い形に変わります。書式に使える項目は
[namelabel (名前ラベル)](../../reference/renderers/namelabel.md) を参照してください。
ラベルが ballstick に隠れる場合は、同じセクションの **Label on top** を ON にします。

<!-- TODO(screenshot): ラベルを付けた結合部位 -->

## 同じことをコマンドで

本文の操作を [Console](../../reference/plugins/console/index.md) の native モードのコマンドで書くと、
次のようになります。Console に 1 行ずつ入力します ([tritium_cli](../../reference/plugins/console/cli.md)
からも実行できます)。各コマンドの引数は Console で `help <コマンド>` を実行すると確認できます
(→ [Console のコマンド一覧](../../reference/plugins/console/commands.md))。

```
# 1. 構造を読み込む
fetch_pdb 1STP, mmcif, cartoon
# 2. リガンドを ballstick で表示する
create_renderer 1stp, ballstick, selection="resn BTN"
focus_nodes 1stp/ballstick1
# 3. 周辺の残基を表示する
create_renderer 1stp, ballstick, selection="byres (resn BTN around 4.0) and protein"
focus_nodes 1stp/ballstick2
# 4. cartoon を半透明にする
set 1stp/cartoon1.alpha, 0.3
# 5. 水素結合の候補を表示する
analyze_interactions 1stp, "resn BTN", 3.5, false, 2.5, 30, measure, selection2=protein
list_interactions 1stp/measure
# 6. 残基にラベルを付ける
set_atom_labels 1stp, "A.23,27,43,45,49,88,90,128.CA", "{resn}{resi}"
```

- `analyze_interactions` の引数は、ダイアログと同じ値 (Max distance 3.5、炭素を除く、
  Min distance 2.5、Max labels 30) を順に指定しています。省略したときの既定値は
  ダイアログと異なるので注意してください (`help analyze_interactions` で確認できます)。
- `list_interactions` は、追加された組を一覧します。
- `set_atom_labels` は、選択した原子にまとめてラベルを付けます。書式はラベルごとに
  設定されるので、手順 6 の Format の変更は要りません。

## 次のステップ

- [相互作用の抽出 (Interaction)](../../reference/tools/interaction.md) — ダイアログの項目の詳細
- [選択式の文法](../../reference/selection.md) — `around` / `expand` / `byres` などの演算子
- [論文用の高解像度画像の書き出し](../figures/publication-images.md) — この図をレイトレースで仕上げる

---

*確認対象: CueMol3 3.0.6.577*
