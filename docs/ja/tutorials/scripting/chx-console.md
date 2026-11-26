# ChX console による作図

ChimeraX のコマンドで、リガンドの結合部位の図を作る手順を追います。
[ChX console](../../reference/plugins/console/chx_console.md) は ChimeraX 互換の console で、
ChimeraX で使っていたコマンドと原子の指定をそのまま打つことができます。
コマンドを 1 行ずつ試してから `.cxc` ファイルにまとめ、最後に GUI で仕上げて保存します。
題材は [リガンド結合部位の表示](../structure/binding-site.md) と同じ、
ストレプトアビジンとビオチンの複合体 (PDB ID: **1STP**) です。

!!! abstract "このチュートリアルについて"
    - **題材**: ストレプトアビジンとビオチンの複合体 (PDB ID: 1STP)
    - **学ぶこと**: ChX console への切り替え、ChimeraX のコマンドと原子の指定、対応していないコマンドの扱い、`.cxc` スクリプトの実行 (Console と tritium_cli)、GUI での仕上げと保存
    - **前提**: ChimeraX のコマンドの基本を知っていること。GUI の操作は基本操作コースの [Renderer の追加・削除と設定](../basic/renderers.md) まで

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。ChX console のスクリプトで作った 1STP の結合部位 -->

## 1. ChX console に切り替える

1. **File &gt; New Tab** などで、空のシーンを用意します。
2. 下部パネルの **Console** タブを開きます。
3. ツールバー左端の切り替えで **ChimeraX** を選びます (行に `chimerax` とだけ打って実行しても切り替わります)。

プロンプトが `ChX>` になります (→ [Console](../../reference/plugins/console/index.md#モードの切り替え))。

## 2. コマンドを 1 行ずつ実行する

次のコマンドを 1 行ずつ入力して、表示の変化を確かめます。

```
open 1stp
color #1 lightgray target c
transparency #1 60 target c
show (:BTN :<4) & protein
style stick
color :BTN orange
color byhetero
label (:BTN :<4) & protein residues
distance :BTN@O3 :43@OH
view :BTN :<5
```

| コマンド | 結果 |
|---|---|
| `open 1stp` | 1STP を mmCIF 形式で取得し、model **#1** として開きます。ChimeraX の自動の表示 (auto style) に倣って、cartoon とリガンドの周りの棒で表示されます。 |
| `color #1 lightgray target c` | cartoon を明るい灰色にします。 |
| `transparency #1 60 target c` | cartoon を 60 % 透明にします。ビオチンは β バレルの内側にあるので、cartoon を透かして見えるようにします。 |
| `show (:BTN :<4) & protein` | ビオチン (残基名 BTN) から 4 Å 以内にあるタンパク質の残基を表示します。 |
| `style stick` | 原子をスティックで表示します。 |
| `color :BTN orange` / `color byhetero` | ビオチンを橙にしてから、炭素以外の原子を元素の色にします。 |
| `label (:BTN :<4) & protein residues` | 周辺の残基に残基名と番号のラベルを付けます。 |
| `distance :BTN@O3 :43@OH` | ビオチンの O3 と Tyr43 の OH の距離 (2.585 Å) を測り、点線で表示します。 |
| `view :BTN :<5` | 向きを変えずに、ビオチンの周りが収まるように表示します。 |

ChX console のコマンドは CueMol の操作に翻訳されてから実行されます。ほかの編集と同じく Undo で戻せます
(1 回の実行が 1 回の Undo にまとまります)。原子の指定 (`:BTN :<4` など) は CueMol の選択式に翻訳されます
(→ [ChX console の原子の指定](../../reference/plugins/console/chx_console.md#原子の指定-atom-specification))。

!!! note "ChimeraX と違う点"
    - 距離による指定の境界は、ChimeraX が「以下」、CueMol が「未満」です。
      ちょうど 4 Å の原子があると、選ばれる残基が ChimeraX と変わることがあります。
    - `show` / `style` / `color` などは、ChX console が分子ごとに作る `chx:` で始まる名前の
      Renderer (シーンツリーの `chx:cartoon` / `chx:stick` など) だけを操作します。
      GUI で作った Renderer には影響しません。

## 3. 対応していないコマンドの扱い

ChimeraX の `hbonds` を試してみます。

```
hbonds :BTN
```

次の警告が表示され、このコマンドは実行されません。

```
Warning: hbonds is not supported yet (a ChimeraX command the console does not have); skipped
```

ChX console は ChimeraX のコマンドの一部だけに対応しています。対応していないコマンド・値・原子の指定は、
このように警告を出して飛ばし、スクリプトの残りを実行します。一方、ChimeraX にも無いコマンドや
書式の誤り (`colr` のような打ち間違いなど) は、エラーを出してそこでスクリプトを止めます。
対応しているコマンドの一覧は [ChX console](../../reference/plugins/console/chx_console.md#対応コマンド) を参照してください。

水素結合の候補は、5. で GUI の Interaction ツールを使って表示します。

## 4. スクリプトにまとめる

2. と 3. のコマンドを、`binding-site.cxc` という名前のテキストファイルに保存します
(ここではホームディレクトリに置きます)。`#` から行末はコメントです。

```
# Biotin binding site of streptavidin (PDB 1STP)
open 1stp
color #1 lightgray target c
transparency #1 60 target c
show (:BTN :<4) & protein
style stick
color :BTN orange
color byhetero
label (:BTN :<4) & protein residues
distance :BTN@O3 :43@OH
hbonds :BTN
view :BTN :<5
```

空のシーンを用意し、ChX console で次のように実行します。

```
open ~/binding-site.cxc
```

`hbonds` の行で警告が出ますが、残りのコマンドはすべて実行され、2. と同じ図ができます。

ターミナルからは、[tritium_cli](../../reference/plugins/console/cli.md) にファイルを渡して実行することもできます。
起動中の CueMol3 の、前面のタブのシーンに対して実行されます。

```
tritium_cli ~/binding-site.cxc
```

## 5. GUI で仕上げて保存する

スクリプトで作った図は、GUI でそのまま続けて編集できます。

1. **Tools &gt; Interaction...** で、ビオチンとタンパク質の間の水素結合の候補を表示します
   (手順は [リガンド結合部位の表示](../structure/binding-site.md#5-水素結合の候補を表示する) と同じです)。
2. **File &gt; Save Scene** で、シーンを `.qsc` ファイルに保存します (→ [シーンの保存 (Save Scene)](../../reference/save-scene.md))。

ChX console の `save` でも保存できます。`.png` (画像) と `.qsc` (シーン) などに対応しています。
ChimeraX のセッション (`.cxs`) には保存できません。

```
save ~/binding-site.qsc
save ~/binding-site.png width 1200 height 900
```

!!! note "保存したシーンの model 番号"
    model 番号 (`#1` など) は、シーンを保存して開き直すと振り直されます。開き直したシーンで
    続けてスクリプトを実行するときは、`info models` で番号を確かめてください。

## 次のステップ

- [ChX console](../../reference/plugins/console/chx_console.md) — 対応コマンドと原子の指定の一覧
- [tritium_cli](../../reference/plugins/console/cli.md) — ターミナルからの実行
- [リガンド結合部位の表示](../structure/binding-site.md) — 同じ図を GUI で作る手順

---

*確認対象: CueMol3 3.0.6.577*
