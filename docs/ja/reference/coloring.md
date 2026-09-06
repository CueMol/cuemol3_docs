# Coloring

Renderer をどのような規則で着色するかを決める設定です。
サイドパネルの **Color** パネルで、Renderer 単位 (または Object 単位) に設定します。

このページは各 Coloring のパラメータを網羅するリファレンスです。
パネルの操作の流れは [サイドパネル](../ui/side-panels.md) を参照してください。

## Coloring の種類

| 種類 | 内容 | 対象 |
|---|---|---|
| [Paint](#paint) | 選択範囲と色の組を表で指定する | すべて |
| [Solid](#solid) | 単一の色で塗る | すべて |
| [CPK](#cpk) | 元素ごとに色を割り当てる | すべて |
| [Bfac/Occ](#bfacocc) | 温度因子・占有率などの値に応じたグラデーション | すべて |
| [Rainbow](#rainbow) | 残基番号などに沿って虹色に変化させる | すべて |
| [静電ポテンシャル](#静電ポテンシャル) | 静電ポテンシャルマップの値で塗る | 分子表面系のみ |
| [Multi-gradient](#multi-gradient) | 複数の色を経由するグラデーション | マップ系・分子表面系 |
| [Reset to default style](#reset-to-default-style) | 既定のスタイルの着色に戻す | すべて |

色を扱えない Renderer (選択のハイライト、原子ラベル、[atomintr](renderers/atomintr.md) など)
は Color パネルの対象一覧に表示されません。

!!! info "準備中"
    各 Coloring のパラメータの詳細は今後追加されます。

## Paint

選択範囲と色の組を表で指定します。上の行から順に評価され、
最初にマッチした行の色が使われます。

Coloring の種類で **Paint** を選ぶとサブメニューが開きます。**Default** は二次構造ごとの
標準の塗り分け (sheet / helix / nucleic / `*` の 4 行) で始める Paint で、そのほかに
スタイルとして定義された配色 (Woody / Red など) が並びます。**Molecule color** は
Renderer の色を分子側の着色に従わせるスタイルで、Paint ではありません
(→ [分子側の着色](#分子側の着色-molcol))。

<!-- TODO(content): 行の追加・削除・並べ替え、選択式の指定、色の指定、
     マテリアル修飾子との組み合わせを記載 (ColorPane.tsx の Paint 表を参照) -->

色の記法は [色の記法](color-syntax.md)、選択範囲の書き方は
[選択式の文法](selection.md) を参照してください。

## Solid

Renderer 全体を単一の色で塗ります。

<!-- TODO(content): 既定色のプロパティ名と挙動 -->

## CPK

元素ごとにあらかじめ決められた色を割り当てます。
C / N / O / S / P / H とその他について、それぞれ色を指定できます。

<!-- TODO(content): 各元素の既定色 (default_style.xml の DefaultCPKColoring) -->

## Bfac/Occ

温度因子 (B-factor) や占有率などの値に応じて、色を連続的に変化させます。

<!-- TODO(content): モード (B-factor / 占有率 / 距離)、下限・上限の色と値、
     Auto / Manual の切り替えを記載 -->

## Rainbow

残基番号などの並び順に沿って、色相を連続的に変化させます。

<!-- TODO(content): モード・基準・開始 / 終了色相・明度・彩度を記載 -->

## 静電ポテンシャル

静電ポテンシャルマップ ([ElePotMap](objects/elepot.md)) の値に応じて分子表面を塗ります。
**分子表面系の Renderer でのみ**選択できます。

計算には APBS / PDB2PQR が必要です
(→ [外部ツールの設定](../install/external-tools.md))。

<!-- TODO(content): 対象マップの指定、SAS 着色の可否、低 / 中 / 高の値と色を記載 -->

## Multi-gradient

マップの値に応じて、複数の色を経由するグラデーションで塗ります。
密度マップなどのマップ系の Renderer と、分子表面系の Renderer (molsurf / dsurface / dsurf2) で選択できます。

設定欄には対象マップのヒストグラムとグラデーションバーが表示され、
バー上のストップ (色の区切り) を直接操作して編集します。

- ストップはドラッグで移動します。バーの空きをクリックすると追加、下方向へ
  ドラッグすると削除されます
- 選択したストップの値と色は、入力欄からも編集できます
- プリセット (Rainbow / Resmap / Heatmap) から始めることもできます

編集は分子ビューに即座に反映され、1 回の操作ごとに Undo で戻せます。

<!-- TODO(content): 対象マップの指定と既定値、各プリセットの内容を記載 -->

## Reset to default style

Renderer の着色を、既定のスタイルで定義された状態に戻します
(→ [スタイル](styles.md))。

## 分子側の着色 (`$molcol`)

Renderer ごとではなく分子 Object 側に着色を持たせ、複数の Renderer で共有することも
できます。この場合、Renderer 側の色指定に `$molcol` を使います
(→ [色の記法](color-syntax.md#分子色表記))。

## 関連項目

- [色の記法](color-syntax.md)
- [選択式の文法](selection.md)
- [スタイル](styles.md)
- [サイドパネル](../ui/side-panels.md)

---

*確認対象: CueMol3 2.3.13.523*
