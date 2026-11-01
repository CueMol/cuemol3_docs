# PDB からの取得 (Get PDB)

PDB のエントリの座標と密度マップを、ネットワークから取得して読み込みます。
**File &gt; Get PDB...** (またはツールバーの **Get PDB** ボタン) で **Get PDB** ダイアログを開き、
PDB ID か EMDB ID を入力して **Download** を押します。ID がわからないときは、キーワードで
エントリを探せます。

ファイルは一時ファイルを介さずに直接読み込まれます。取得中は進捗ダイアログが表示され、
**Cancel** で中断できます。

!!! info "撮影予定"

<!-- TODO(screenshot): Get PDB ダイアログ (結晶構造のエントリを入力し、エントリの情報と Coordinates / Density maps が表示された状態) -->

## ID を入力する

**Entry** の **PDB or EMDB ID, or keywords** に、次のどちらかを入力します。

| 入力 | 例 | 取得できるもの |
|---|---|---|
| PDB ID | `1mbn` | 座標と、エントリに応じた密度マップ |
| EMDB ID | `EMD-11638` / `emd_11638` | その電顕マップだけ (座標は無し) |

EMDB ID には `EMD` を付けてください。数字だけ (`1234`) は PDB ID として扱われます。

入力すると、エントリの情報が入力欄の下に表示されます。PDB ID ではタイトルと
「手法 | 分解能 | EMDB ID」、EMDB ID ではタイトルと「Cryo-EM map, no coordinates」です。
その下に表示される取得の項目は、エントリの種類によって変わります。

| エントリ | 表示される項目 |
|---|---|
| 結晶構造 (X 線・中性子) | **Coordinates** と **Density maps** |
| 電顕構造 (EMDB のマップがあるもの) | **Coordinates** と **Cryo-EM maps** |
| それ以外 (NMR など) | **Coordinates** だけ |
| EMDB ID を直接入力 | **Cryo-EM maps** (そのマップだけ) |

存在しない ID のときは「No entry ... was found.」と表示され、取得できません。
4 文字の単語がたまたま PDB ID の形をしていた場合は、**Search as keywords** でキーワードとして
検索できます。

エントリの情報を読めなかったとき (オフラインなど) も取得はできます。その場合、PDB ID には
**Coordinates** と **Density maps** が表示されます。

入力欄の右のボタンで、入力の履歴 (取得した ID と検索したキーワード、最大 20 件) から選べます。

## Coordinates

| 項目 | 説明 |
|---|---|
| **Fetch coordinates** | 座標を取得します (既定は ON) |
| **Format** | **mmCIF (RCSB)** (既定) か **PDB (RCSB)**。PDB 形式に収まらない大きなエントリでは mmCIF だけになります |

座標を取得すると、ファイルを開くときと同じく、Object 名と Renderer を指定する画面が出ます。
Object 名の既定は PDB ID の小文字です。

## Density maps

結晶構造のエントリで表示されます。

| 項目 | 説明 |
|---|---|
| **2Fo-Fc map** / **Fo-Fc map** | それぞれのマップを取得します (既定は OFF) |
| **Source** | 取得元。**RCSB (cif.gz)** (既定) か **EBI (MTZ)** |

マップには Renderer を指定する画面は出ず、決まった色とレベルの等高線で表示されます
(→ [電子密度マップを重ねて表示する](../tutorials/density-map.md))。

## Cryo-EM maps

電顕構造のエントリと、EMDB ID を入力したときに表示されます。

| 項目 | 説明 |
|---|---|
| **&lt;EMDB ID&gt; map** | そのマップを取得します (既定は ON)。エントリに複数のマップがあれば、マップごとに行が並びます。行の下に、ファイルのサイズ・格子の大きさ・推奨レベルが表示されます |
| **Source** | 取得元。**wwPDB** (既定) か **EBI** |

取得したマップは等値面 (isosurf) で表示されます。レベルは、登録者が推奨する等高線レベルです。
推奨レベルが無いマップは、格子点の値の上位 1 % を囲むレベルになります
(→ [DensityMap](objects/densitymap.md))。Object 名は `emd_<番号>` です。

!!! note "推奨レベルが高すぎるマップがあります"
    マップによっては、推奨レベルでは構造の一部しか囲まれないことがあります (EMD-11640 など)。
    その場合は Density map パネルの **Level** で下げてください。

## キーワードで探す

入力欄に ID 以外の文字列を入れると、「Press Enter to search the PDB for these keywords.」と
表示されます。++enter++ を押すか **Search** を押すと、RCSB の全文検索でエントリを探します。

結果は **Search results** に一覧されます。見出しの右には、表示している件数と全件数が表示されます。

| 項目 | 説明 |
|---|---|
| **Method** | 手法で絞り込みます。**All methods** (既定) / **X-ray** / **Electron microscopy** |
| **Sort** | 並べ方。**Relevance** (関連度、既定) / **Best resolution** (分解能の高い順) / **Newest** (新しい順) |
| **More** | 続きの結果を一覧の末尾に足します |

Method や Sort を変えると、同じキーワードで検索し直します。一覧の各行には、ID・タイトル・
手法と分解能が表示されます。

行を選ぶと、その ID を入力したときと同じく、エントリの情報と取得の項目が一覧の下に表示されます。
入力欄にフォーカスを置いたまま、++arrow-up++ / ++arrow-down++ でも行を選べます。
ID を入力し直すと、一覧は閉じます。

## Console から取得する

[Console](plugins/console/index.md) の native モードでは、`fetch_pdb` (`fetch`) で座標を、
`fetch_map` で結晶構造の密度マップを、`fetch_emdb` で電顕マップを取得できます
(→ [コマンド一覧](plugins/console/commands.md))。

## 関連項目

- [File メニュー](../menu/file.md)
- [DensityMap (密度マップ)](objects/densitymap.md)
- [電子密度マップを重ねて表示する](../tutorials/density-map.md)
- [構造の読み込みと表示](../tutorials/basic/loading.md)

---

*確認対象: CueMol3 2.4.2.550*
