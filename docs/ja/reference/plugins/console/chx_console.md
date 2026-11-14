# ChX console

**ChX console** は、[Console](index.md) で使える ChimeraX 互換の console です。
ChimeraX のコマンド言語の一部を解釈します。
`open 1crn` や `color byhetero` のような、ChimeraX で使っていたコマンドと原子の指定
(atom specification) をそのまま打てます。3.0.0.554 で加わりました。

ChimeraX との完全な互換は目指しておらず、**すでに知っているコマンドが動くこと**が
目的です。コマンドは CueMol の操作に翻訳されてから実行されるので、ほかの編集と同じように
[History](../../actions.md) に記録され、Undo で戻せます。ChimeraX と意味が一致しないものは、
近いもので代用せずに、理由を示して拒否します (`lighting` だけは例外で、近似して警告を出します)。
拒否したコマンドは `Warning: <理由>; skipped` と表示して飛ばし、スクリプトの残りを実行します。

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
  `car` → `cartoon`。`c` は `camera` になります)。大文字と小文字は区別します (`Open` は知らないコマンドです)。
- ++tab++ は、コマンド名、keyword、引数の値 (選択肢や色の名前など)、ファイル名を補完します。
  `#` の後では model 番号を、分子の名前とともに補完します。
- **1 回の実行が 1 回の Undo にまとまります。**
- 読めるが対応していない keyword は、警告を出して無視します (スクリプトは先へ進みます)。
- ChX console が対応していないコマンド・値・原子の指定は、警告を出してそのコマンドを飛ばします。
  ChimeraX にも無いコマンドや書式の誤りなどは、そこでスクリプトを止めます。

## スクリプト

- `open file.cxc` で、ChimeraX のコマンドを書いた `.cxc` ファイルを実行します。
- ターミナルからは `tritium_cli file.cxc` でも実行できます (→ [tritium_cli](cli.md))。
- 記録した操作のファイル (`.qax`) と PyMOL のスクリプト (`.pml`) は、ChX console では
  実行できません。それぞれ native モード、PyM console に切り替えて実行してください。

## 対応コマンド

各コマンドの引数は `usage <コマンド>` または `help <コマンド>` で確認できます。

| 分類 | コマンド |
|---|---|
| 開く・閉じる・保存 | `open` / `alphafold fetch` / `close` (`close session`) / `delete` / `save` |
| 表示 | `show` / `hide` (`display` / `~show` / `~display`) / `cartoon` (`cartoon hide` / `cartoon style`) / `ribbon` / `~ribbon` / `nucleotides` / `style` / `size` / `surface` (`surface hidePatches` / `surface close` / `surface zone` / `surface unzone` / `~surface`) / `transparency` / `label` (`label delete` / `~label`) / `volume` (`volume zone` / `volume unzone`) / `unitcell` (`unitcell outline` / `unitcell delete`) |
| 色 | `color` (`colour`) / `color byattribute` / `color bfactor` / `color modify` / `color list` / `rainbow` |
| ビュー | `view` (`view name` / `view list` / `view delete` / `view matrix` / `view initial`) / `turn` / `move` / `zoom` / `cofr` / `camera` / `lighting` / `graphics` (`graphics silhouettes`) / `set` / `preset` / `wait` |
| 動き (アニメーション) | `turn` (`frames` 付き) / `roll` / `rock` / `wobble` / `stop` |
| 選択 | `select` (`select add` / `select subtract` / `select intersect` / `select clear` / `select zone` / `select up` / `select down` / `~select`) / `name` (`name list` / `name delete`) |
| 情報と計測 | `info` (`info models` / `chains` / `residues` / `atoms`) / `distance` (`distance delete` / `~distance`) / `dssp` |
| 重ね合わせ | `align` / `matchmaker` (`mmaker`) |
| その他 | `alias` (`alias list` / `alias delete` / `~alias`) / `undo` / `redo` / `usage` / `help` |

- `open` は構造・マップのファイル、PDB ID (4 文字、または `pdb:1abc`)、URL、`.cxc` スクリプト、
  `.qsc` のシーンを受け付けます。PDB ID は mmCIF 形式で取得します。`pdbe:` / `pdbj:` / `redo:` /
  `alphafold:` / `pubchem:` / `ccd:` / `emdb:` などのデータベースの接頭辞 (または `fromDatabase`)、
  `from eds` (結晶構造の 2Fo-Fc マップ)、`from rcsb_bio` / `pdbe_bio` (生物学的集合体) も使えます。
  1 つの `open` に複数の名前を並べられます。開いたものには **#1**, **#2**, ... の
  model 番号が振られます (ChimeraX と同じく、閉じた番号は次に開いたものに再び使われます)。
- 空のシーンに最初に `open` したときだけ、開いたものが収まるように視点を合わせます。2 つ目以降の
  `open` では視点を動かしません (ChimeraX と同じです)。
- `open` で開いた分子は、ChimeraX の自動の表示 (auto style) に倣って描かれます。分子の大きさに応じて、
  cartoon とリガンドの周りの棒、または全原子の球などで表示し、model ごとの色と元素の色で塗ります。
  AlphaFold DB から開いた構造は、予測の信頼度 (pLDDT) の色で塗ります。
- `show` / `hide` / `style` / `cartoon` / `color` / `surface` / `label` などは、ChX console が
  分子ごとに作る `chx:` で始まる名前の Renderer だけを操作します。GUI で作成した Renderer には
  影響しません。
- `color` は色の名前、`#rrggbb` などの 16 進表記、`rgb()` / `hsl()` / `gray()` などの関数の形を
  受け付けます。`byhetero` / `byelement` / `bychain` / `bymodel` / `bynucleotide` / `fromatoms` /
  `fromcartoons` も使えます。`rainbow` と `color byattribute` は `palette` で色の並びを指定できます
  (ColorBrewer のパレット名も使えます)。`alphafold` / `esmfold` / `pae` / `paegreen` / `paecontacts` の
  パレットは、ChimeraX と同じく決まった値 (pLDDT の 0〜100 など) に色を置きます。
- `surface` は ChimeraX と同じくチェーンごとに分子表面 (dsurface) を作ります。
- `turn` に `frames` を付けると、その回転をアニメーションの要素としてタイムラインの末尾に追加し、
  1 回再生します。`roll` / `rock` / `wobble` (と `turn ... rock N` / `turn ... wobble N`) は、
  `frames` を指定しなければ 1 周期分の要素を追加し、`stop` までループで再生します (`stop` で
  ループの設定は元に戻ります)。ループはタイムライン全体を繰り返すので、ほかの要素があると警告が出ます。
  回転は [SimpleSpin](../../animation/simplespin.md)、揺れは [RockSpin](../../animation/rockspin.md)
  の要素になります。速さや位相は ChimeraX とおおよそ合わせてあるだけで、同じではありません。
- `view` は向きを変えずに、指定したもの (省略すると全体) が収まるように表示します。
  `view name` で保存したビューは CueMol のカメラとして保存されます。
- `distance` はちょうど 2 原子の距離を測ります。
- `align` は原子を順に対応づける最小二乗法、`matchmaker` は US-align による重ね合わせです。
  `matchmaker` の重なり方は、配列アラインメントを使う ChimeraX とは異なることがあります
  (実行するたびに警告が出ます)。
- `save` は `.png` (画像)、`.qsc` (シーン)、`.pdb` (分子 1 つ)、`.stl` に保存します。`.cxs` には保存できません。
- `alias` で定義した別名は、CueMol3 を終了するまで有効です。

## 原子の指定 (atom specification)

ChimeraX の原子の指定は、CueMol の[選択式](../../selection.md)に**翻訳**されてから実行されます。

| ChimeraX | CueMol |
|---|---|
| `#1`、`#1,3-5` (model) | model 番号で分子を選びます。 |
| `/A,B` | `chain A,B` |
| `:10-20,30`、`:10A` | `resi 10:20`、`resi 30`、`resi 10A` |
| `:ALA` | `resn ALA` |
| `@CA,CB` | `name CA,CB` |
| `all` / `protein` / `nucleic` / `ligand` / `solvent` / `helix` / `strand` / `coil` | `*` / `protein` / `nucleic` / `ligand` / `water` / `helix` / `sheet` / `coil` |
| `ions` | リガンドの残基の金属とハロゲンの原子 |
| `backbone` / `mainchain`、`sidechain` / `sideonly` | 原子名を並べた式 |
| 元素記号 (`C`、`Fe`) | `elem Fe` |
| `sel` | 各分子の今の選択 |
| 名前 (`name` で定義したもの) | CueMol の名前付き選択 |

- 演算子 `&` / `|` / `~` と括弧が使えます。空白で区切って並べたものは和になります (`#1 #2`)。
  model ごとの指定を続けて書いたものも和になります (`#1/k#2/o`)。
- ワイルドカード (`*` / `?` / `[...]`) は、チェーン・残基名・原子名に使えます。
- 距離による指定 (`@<5`、`:<5` など) が使えます。境界は ChimeraX が「以下」、CueMol が「未満」です。
- 属性による指定 (`@@bfactor>50`、`@@occupancy`、`@@display`、`::polymer_type`、`::ss_type`、`::number` など) が
  使えます。CueMol に無い属性は拒否します。
- `name` で定義する名前には model を含められます。model ごとに式が変わる名前は、ChX console の中でだけ
  使え、シーンには保存されません。
- sub-model (`#1.2`) や引用符で囲んだ名前などには対応していません。

## 制限事項

- 非表示の原子のスタイルは、ChimeraX と同じく保持されます (`style :ALA sphere` → `hide :ALA atoms` →
  `show :ALA atoms` で、ALA は球で表示されます)。ただし、シーンを保存して開き直すと、非表示の原子の
  スタイルは自動の表示 (auto style) のものに戻ります。
- 透明度 (`transparency`) は Renderer ごとに設定されるため、分子の一部だけを指定すると拒否します。
- `move` / `zoom` などの `frames` はアニメーションせず、一度に動かします (`turn` は上記のとおりアニメーションになります)。
- model 番号は、シーンを保存して開き直すと振り直されます。
- `bypolymer` / `byidentity` の着色、`color random`、`color zone`、`lighting model`、`volume` によるマップの演算
  (`volume gaussian` など)、`name frozen`、`.cxs` への保存などには対応していません。

## 関連項目

- [Console](index.md) / [PyM console](pymconsole.md) / [tritium_cli](cli.md)
- [プラグイン](../index.md) / [選択式の文法](../../selection.md)
- [操作の記録と再生](../../actions.md)

---

*確認対象: CueMol3 3.0.2.560*
