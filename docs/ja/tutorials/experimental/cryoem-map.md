# cryo-EM マップとモデルの表示

クライオ電子顕微鏡 (cryo-EM) のマップと、そこに当てはめられた原子モデルを取得して表示し、
等高線レベル (Level) によって見え方がどう変わるかを確かめる手順を追います。
題材には、ナノディスクに再構成したラットの TRPV1 チャネル (EMDB: **EMD-8118**、PDB ID: **5IRZ**) を使います。
分解能は 3.28 Å で、実際の解析でよく出会う範囲です。主鎖はたどれ、大きな側鎖の形も見えますが、
すべての側鎖がはっきり見えるわけではありません。

!!! abstract "このチュートリアルについて"
    - **題材**: ナノディスク中の TRPV1 (EMDB: EMD-8118、PDB ID: 5IRZ)
    - **学ぶこと**: Get PDB での cryo-EM マップとモデルの取得、上位 % によるレベルの指定、Level と側鎖の密度の見え方、スラブによる切り出し
    - **前提**: [電子密度マップの表示](density-map.md) (Density map パネルの使い方)

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。S6 ヘリックスの一部 (ballstick) と、それを包む等値面 -->

## 1. マップとモデルを取得する

**File &gt; Get PDB...** で `5IRZ` を入力します。電顕構造のエントリなので、入力欄の下に
**Coordinates** と **Cryo-EM maps** の項目が表示されます (→ [PDB からの取得 (Get PDB)](../../reference/get-pdb.md#cryo-em-maps))。

1. **Coordinates** の **Fetch coordinates** が ON になっていることを確かめます。
2. **Cryo-EM maps** の **EMD-8118 map** が ON になっていることを確かめます。行の下に、
   ファイルのサイズ (約 28 MB)・格子の大きさ (各辺 192)・推奨レベルが表示されます。
3. **Download** を押し、Renderer は **cartoon** を選びます。

モデルは `5irz` (chain B〜E の 4 本の鎖でできた四量体)、マップは `emd_8118` という名前の Object になります。
マップは等値面 ([isosurf](../../reference/renderers/isosurf.md)) で、登録者が推奨するレベルで表示されます。

!!! note "cryo-EM マップの既定の表示"
    cryo-EM マップは、結晶のマップと違ってマップ全体 (Region が *Full map*) を描きます。
    このため、Density map パネルの **Extent** と **Redraw** は使いません
    (→ [isosurf](../../reference/renderers/isosurf.md))。

## 2. レベルの単位を上位 % にする

左サイドパネルの **Crystal &gt; Density map** パネルを開き、上部で `emd_8118/isosurf` を選びます。

cryo-EM マップは、読み込んだ時点ではレベルを絶対値 (マップの密度の値) で持っています。
**Level** の入力欄は 4 前後で、その下にもう一方の単位 (上位約 0.9 %) が表示されています。

1. Renderer の選択の右の ▼ を押し、**Use top-percent contour level** を選びます。

入力欄が上位 % の値になります。「格子点の値の上位何 % を囲むか」という単位で、値が**小さいほど
囲む範囲が狭く** (レベルが高く) なります。マップごとに密度の値の大きさが違っても、同じ感覚で比べられます
(→ [DensityMap](../../reference/objects/densitymap.md#マップの種類-map-type))。

## 3. マップ全体でレベルを変えてみる

マップ全体を見ながら、**Level** を変えてみます (入力欄に値を入れて ++enter++ を押します)。

| Level (上位 %) | 見え方 |
|---|---|
| 0.9 (推奨レベル付近) | 四量体の形と、膜貫通部分のヘリックスが見えます。 |
| 3 | マスク (マップの外側を 0 にした範囲) の内側のノイズまで囲まれ、全体が球状の塊になります。 |

レベルを下げすぎると、ノイズがタンパク質の密度と区別できなくなります。
確かめたら、**Level** を推奨レベル付近 (0.9) に戻します。

## 4. 短い範囲で側鎖の密度を見る

マップと当てはめられたモデルの対応を、短い範囲で確かめます。ここでは、細孔を作る S6 ヘリックスの
一部 (chain B の残基 660〜672) を使います。チロシンなどの大きな側鎖を含む範囲です。

1. シーンツリーで `5irz` を右クリックし、**New Renderer** から **ballstick** を選びます。
   **Selection** にチェックを入れ、**Atoms** に `B.660:672.*` を入力して **Create** を押します。
2. シーンツリーで `cartoon1` の目のアイコンを閉じて、cartoon を非表示にします。
3. `ballstick1` の行を選び、**Focus** を押します。
4. 左サイドパネルの **Explorer &gt; View** パネルで、**Slab** に `10` を入力します。
   視点の中心から手前と奥の 5 Å ずつだけが表示され、周りのヘリックスの密度が切り取られます。
5. Density map パネルの **Transp** を 0.5 前後にして、等値面の内側のモデルが見えるようにします。

分子を回して、ヘリックスを横から見る向きにします。そのうえで **Level** を変えて、
側鎖がどこまで密度に包まれるかを比べます。

| Level (上位 %) | 見え方 |
|---|---|
| 0.3 | 密度が細くなり、ロイシンなどの側鎖の先端がはみ出します。チロシンの環はおおむね包まれたままです。 |
| 0.9 (推奨レベル付近) | チロシンの環が密度に包まれ、ヘリックスの主鎖も連続して見えます。 |
| 3 | 密度が太ってほかの密度とつながり、側鎖の形が読み取れなくなります。 |

<!-- TODO(screenshot): Level 0.3 / 0.9 / 3 での S6 ヘリックスの比較 -->

3 Å 台前半の分解能では、同じヘリックスの中でも、芳香環のような大きく硬い側鎖ははっきり見え、
小さな側鎖や柔らかい側鎖ははっきりしません。モデルの側鎖の向きを確かめるときは、
1 つのレベルだけでなく、レベルを上げ下げして見ることが大切です。

## 同じことをコマンドで

本文の操作を [Console](../../reference/plugins/console/index.md) の native モードのコマンドで書くと、
次のようになります。Console に 1 行ずつ入力します ([tritium_cli](../../reference/plugins/console/cli.md)
からも実行できます)。各コマンドの引数は Console で `help <コマンド>` を実行すると確認できます
(→ [Console のコマンド一覧](../../reference/plugins/console/commands.md))。

```
# 1. マップとモデルを取得する
fetch_pdb 5IRZ, mmcif, cartoon
fetch_emdb EMD-8118
# 2. レベルの単位を上位 % にする (GUI のみ)
list_map_contours
# 3. マップ全体でレベルを変えてみる
set_map_contour emd_8118/isosurf, level=3
set_map_contour emd_8118/isosurf, level=0.9
# 4. 短い範囲で側鎖の密度を見る
create_renderer 5irz, ballstick, selection="B.660:672.*"
hide 5irz/cartoon1
focus_nodes 5irz/ballstick1
set_view slab=10
set_map_contour emd_8118/isosurf, alpha=0.5
set_map_contour emd_8118/isosurf, level=0.3
```

- `fetch_emdb` は、マップを EMDB の推奨レベルで表示します。`list_map_contours` で、
  そのレベルを上位 % で確認できます (`unit=percent`)。
- `set_map_contour` の `level` は、cryo-EM マップでは常に上位 % で指定します
  (Density map パネルの単位の切り替えとは関係ありません)。

## 次のステップ

- [電子密度マップの表示](density-map.md) — 結晶のマップ (2Fo-Fc / Fo-Fc) の表示
- [isosurf](../../reference/renderers/isosurf.md) — Region / Level of detail などの cryo-EM マップ向けの設定
- [論文用の高解像度画像の書き出し](../figures/publication-images.md)

---

*確認対象: CueMol3 3.0.6.577*
