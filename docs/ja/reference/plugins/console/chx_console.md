# ChX console

**ChX console** は、[Console](index.md) で使える ChimeraX 互換の console です。
ChimeraX のコマンド言語の一部を解釈します。
`open 1crn` や `color byhetero` のような、ChimeraX で使っていたコマンドと原子の指定
(atom specification) をそのまま打てます。3.0.0.554 で加わりました。

ChimeraX との完全な互換は目指しておらず、**すでに知っているコマンドが動くこと**が
目的です。コマンドは CueMol の操作に翻訳されてから実行されるので、ほかの編集と同じように
[History](../../actions.md) に記録され、Undo で戻せます。ChimeraX と意味が一致しないものは、
近いもので代用せずに、理由を示して拒否します。

!!! info "撮影予定"

<!-- TODO(screenshot): Console タブ (ChX console でコマンドを実行した直後の状態) -->

## 有効にする

**ChX console** プラグインで提供されます。**Console** プラグインとともに
既定で有効です (→ [プラグイン](../index.md))。ツールバー左端の切り替えで **ChimeraX** を選ぶか、
行に `chimerax` とだけ打って実行すると、ChX console になります
(→ [モードの切り替え](index.md#モードの切り替え))。

**Settings &gt; Plugins &gt; Installed** で **ChX console** を無効にすると、
切り替えの **ChimeraX** と tritium_cli の `--dialect chimerax` が使えなくなります。

## 入力と補完

プロンプトは `ChX&gt;` です。入力の履歴はほかのモードとは別です。

- 1 行に複数のコマンドを `;` で区切って書けます。コマンド名の位置の `#` から行末はコメントです。
- コマンド名と keyword は、ChimeraX と同じく前方一致で省略できます (`col` → `color`、
  `c` → `cartoon`)。
- ++tab++ は、コマンド名、keyword、引数の値 (選択肢や色の名前など)、ファイル名を補完します。
- **1 回の実行が 1 回の Undo にまとまります。**
- 読めるが対応していない keyword は、警告を出して無視します (スクリプトは先へ進みます)。

## スクリプト

- `open file.cxc` で、ChimeraX のコマンドを書いた `.cxc` ファイルを実行します。
- ターミナルからは `tritium_cli file.cxc` でも実行できます (→ [tritium_cli](cli.md))。
- 記録した操作のファイル (`.qax`) と PyMOL のスクリプト (`.pml`) は、ChX console では
  実行できません。それぞれ native モード、PyMOL 互換モードに切り替えて実行してください。

## 対応コマンド

各コマンドの引数は `usage <コマンド>` または `help <コマンド>` で確認できます。

| 分類 | コマンド |
|---|---|
| 開く・閉じる・保存 | `open` / `close` / `delete` / `save` |
| 表示 | `show` / `hide` / `cartoon` (`cartoon hide`) / `style` / `surface` (`surface hidePatches` / `surface close` / `~surface`) / `transparency` / `label` (`label delete` / `~label`) |
| 色 | `color` / `rainbow` |
| ビュー | `view` (`view name` / `view list` / `view delete` / `view matrix`) / `turn` / `move` / `zoom` / `cofr` / `set` / `graphics silhouettes` |
| 選択 | `select` (`select add` / `select subtract` / `select intersect` / `select clear` / `~select`) / `name` (`name list` / `name delete`) |
| 情報と計測 | `info` (`info models` / `chains` / `residues` / `atoms`) / `distance` (`distance delete` / `~distance`) |
| 重ね合わせ | `align` / `matchmaker` (`mmaker`) |
| その他 | `alias` (`alias list` / `alias delete` / `~alias`) / `undo` / `redo` / `usage` / `help` |

- `open` は構造・マップのファイル、PDB ID (4 文字、または `pdb:1abc`)、`.cxc` スクリプト、
  `.qsc` のシーンを受け付けます。PDB ID は mmCIF 形式で取得します。開いた分子には **#1**, **#2**, ... の
  model 番号が振られます (閉じても番号は詰めません)。
- `open` で開いた分子は、ChimeraX の自動の表示 (auto style) に倣って描かれます。分子の大きさに応じて、
  cartoon とリガンドの周りの棒、または全原子の球などで表示し、model ごとの色と元素の色で塗ります。
- `show` / `hide` / `style` / `cartoon` / `color` / `surface` / `label` などは、ChX console が
  分子ごとに作る `chx:` で始まる名前の Renderer だけを操作します。GUI で作成した Renderer には
  影響しません。
- `color` は色の名前、`#rrggbb` などの 16 進表記、`rgb()` / `hsl()` / `gray()` などの関数の形を
  受け付けます。`byhetero` / `byelement` / `bychain` / `bymodel` / `random` も使えます。
  `rainbow` は `palette` で色の並びを指定できます。
- `surface` は ChimeraX と同じくチェーンごとに分子表面 (dsurface) を作ります。
- `view` は向きを変えずに、指定したもの (省略すると全体) が収まるように表示します。
  `view name` で保存したビューは CueMol のカメラとして保存されます。
- `distance` はちょうど 2 原子の距離を測ります。
- `align` は原子を順に対応づける最小二乗法、`matchmaker` は US-align による重ね合わせです。
  `matchmaker` の重なり方は、配列アラインメントを使う ChimeraX とは異なることがあります
  (実行するたびに警告が出ます)。
- `save` は `.png` (画像)、`.qsc` (シーン)、`.pdb` (分子 1 つ) に保存します。`.cxs` には保存できません。
- `alias` で定義した別名は、CueMol3 を終了するまで有効です。

## 原子の指定 (atom specification)

ChimeraX の原子の指定は、CueMol の[選択式](../../selection.md)に**翻訳**されてから実行されます。

| ChimeraX | CueMol |
|---|---|
| `#1`、`#1,3-5` (model) | model 番号で分子を選びます |
| `/A,B` | `chain A,B` |
| `:10-20,30`、`:10A` | `resi 10:20`、`resi 30`、`resi 10A` |
| `:ALA` | `resn ALA` |
| `@CA,CB` | `name CA,CB` |
| `all` / `protein` / `nucleic` / `ligand` / `solvent` / `helix` / `strand` / `coil` | `*` / `protein` / `nucleic` / `ligand` / `water` / `helix` / `sheet` / `coil` |
| `backbone` / `mainchain`、`sidechain` / `sideonly` | 原子名を並べた式 |
| 元素記号 (`C`、`Fe`) | `elem Fe` |
| `sel` | 各分子の今の選択 |
| 名前 (`name` で定義したもの) | CueMol の名前付き選択 |

- 演算子 `&` / `|` / `~` と括弧が使えます。空白で区切って並べたものは和になります (`#1 #2`)。
- ワイルドカード (`*` / `?` / `[...]`) は、チェーン・残基名・原子名に使えます。
- 距離による指定 (`@<5`、`:<5` など) が使えます。境界は ChimeraX が「以下」、CueMol が「未満」です。
- 属性による指定 (`@@bfactor>50`、`@@occupancy`、`::polymer_type`、`::ss_type`、`::number` など) が
  使えます。CueMol に無い属性は拒否します。
- sub-model (`#1.2`) や引用符で囲んだ名前などには対応していません。

## 制限事項

- CueMol には原子ごとの表示の設定が無いため、**非表示の原子のスタイルは保持されません**。
  `style :ALA sphere` → `hide :ALA atoms` → `show :ALA atoms` とすると、ALA は棒で表示されます
  (ChimeraX では球)。もう一度 `style` を実行すれば直ります。
- 透明度 (`transparency`) は Renderer ごとに設定されるため、分子の一部だけを指定すると拒否します。
- `turn` / `move` などの `frames` はアニメーションせず、一度に動かします。
- model 番号は、シーンを保存して開き直すと振り直されます。
- `bypolymer` / `byidentity` の着色、`name frozen`、`.cxs` への保存などには対応していません。

## 関連項目

- [Console](index.md) / [PyMOL 互換モード](pymconsole.md) / [tritium_cli](cli.md)
- [プラグイン](../index.md) / [選択式の文法](../../selection.md)
- [操作の記録と再生](../../actions.md)

---

*確認対象: CueMol3 3.0.0.554*
