# PyMOL 互換モード (Console)

[Console](console.md) の **PyMOL 互換モード**は、PyMOL のコマンド言語の一部を解釈します。
`fetch 1crn` や `bg_color white` のような、PyMOL で使っていたコマンドをそのまま打てます。
2.3.20.539 までは **PyM Console** という独立したプラグインでした。

PyMOL との完全な互換は目指しておらず、**すでに知っているコマンドが動くこと**が
目的です。コマンドの解析と ++tab++ 補完は PyMOL の実装を移植したもので、
エラーの文言も同じです。

!!! info "準備中"
    このページは骨組みです。選択式の対応表は今後追加されます。

!!! info "撮影予定"

<!-- TODO(screenshot): Console タブ (PyMOL 互換モードでコマンドを実行した直後の状態) -->

## 有効にする

**Console** プラグインは既定で有効で、下部パネルの先頭に **Console** タブが
あります (→ [プラグイン](index.md))。ツールバー左端の切り替えで **PyMOL** を選ぶか、
行に `pymol` とだけ打って実行すると、PyMOL 互換モードになります (→ [モードの切り替え](console.md#モードの切り替え))。

## 入力と補完

プロンプトは `PyM&gt;` です。

| 操作 | 動作 |
|---|---|
| ++enter++ | コマンドを実行します |
| ++shift+enter++ | 改行します |
| ++tab++ | カーソルより前の部分を補完します。カーソルより後ろはそのまま残ります。候補が複数あるときは、プロンプトのすぐ上に一覧が表示されます。一覧が出ているときにもう一度押すと、候補を選ぶメニューになります (→ [入力と補完](console.md#入力と補完)) |
| ++up++ / ++down++ | 入力の履歴をたどります (履歴は CueMol モードとは別です) |

- ++tab++ の挙動は PyMOL に合わせてあります。コマンド名がすでに確定しているときは補完せず、
  該当するものが無い場合はファイル名の展開にフォールバックします。
- 日本語入力の変換を ++enter++ で確定したときは、コマンドは実行されません。
- **1 回の実行が 1 回の Undo にまとまります。**
- ツールバーの **Clear** で記録領域を消去、**Help** で PyMOL 互換モードのコマンドの一覧を表示します。
- 実行中は「Running...」の横に **Stop** が表示されます。押すと次のコマンドの前で止まり、
  ダウンロード中であれば取り消します。それまでに実行した分は残ります。

## スクリプトとログ

- `@file.pml` または `run file.pml` で、`.pml` スクリプトを実行します。スクリプトの中から
  別のスクリプトを呼ぶこともできます。**スクリプト全体が 1 回の Undo にまとまります。**
- `log_open` でファイル (既定は `log.pml`) を開くと、それ以降にプロンプトで打ったコマンドが
  記録されます。`log_close` で記録を終えます。記録したファイルは `@` でそのまま再実行できます。
  スクリプトから実行されたコマンドは記録されません。
- CueMol モードで記録した操作のファイル (`.qax`) は、PyMOL 互換モードでは実行できません。
  CueMol モードに切り替えて実行してください (→ [操作の記録と再生](../actions.md))。

## 対応コマンド

各コマンドの引数は `help <コマンド>` で確認できます。

| 分類 | コマンド |
|---|---|
| 読み込みと保存 | `load` / `fetch` / `save` / `png` / `ray` / `run` |
| Object | `delete` / `set_name` / `enable` / `disable` / `get_names` / `get_chains` |
| 選択 | `select` / `indicate` / `deselect` / `count_atoms` |
| 表示 | `show` / `hide` / `as` (`show_as`) / `color` / `spectrum` / `set_color` / `bg_color` / `label` |
| マップ | `isomesh` / `isosurface` / `isolevel` |
| 計測 | `distance` / `angle` / `dihedral` |
| 重ね合わせ | `align` / `super` / `pair_fit` |
| ビュー | `zoom` / `center` / `orient` / `reset` / `turn` / `move` / `view` / `get_view` / `set_view` / `refresh` |
| アニメーション | `mplay` / `mstop` / `rewind` / `frame` / `count_states` |
| 設定 | `set` / `get` / `unset` |
| スクリプトとログ | `@` / `run` / `log_open` / `log_close` / `log` |
| その他 | `undo` / `redo` / `cd` / `pwd` / `ls` / `help` / `quit` / `exit` |

- `load` は構造・マップのファイルのほか、`http(s)://` の URL、`.qsc` / `.pse` のシーン、
  `.pml` スクリプトを受け付けます。`.qsc` は、現在のシーンが新規で空でなければ新しいタブに開きます。
- `fetch` は RCSB から取得します。`type=pdb1` などで生物学的集合体を、`type=2fofc` /
  `type=fofc` で密度マップを取得します。`1abcA` や `1abc_A` と書くと、そのチェーンだけを残します。
- `save` は拡張子で形式を決めます。分子 (選択の範囲だけも可) は `.pdb` / `.sdf` / `.mol` /
  `.pqr`、シーンは `.qsc`、ビューは `.png` / `.pov` / `.stl` です。
- `ray` はビューを[レンダリング](../rendering.md) (GI) で描画します。実行中は **Stop** で止められ、
  続く `png` でその画像を保存します (その間にビューやシーンを変えた場合は、通常のビューを保存します)。
  `png` に `ray=1` を付けると、その場でレンダリングして保存します。
- `align` / `super` / `pair_fit` は RMSD を表示します。`align` / `super` はどちらも US-align による
  重ね合わせで、配列アラインメントは行いません。RMSD とあわせて、対応づけた残基の数と
  TM-score も表示します。`pair_fit` は原子を順に対応づける最小二乗法の重ね合わせです。
- `get_view` / `set_view` は PyMOL と同じ 18 個の数値の形式です。
- `label` は PyMOL の式 (`"%s%s" % (resn, resi)` など) を受け付けます。
- `distance` に `cutoff` か `mode` を付けると、2 つの選択のあいだの接触を一覧してラベルを付けます。
- `quiet=1` や `async=0` のような PyMOL のキーワード引数・位置引数も受け付けます。
  効かない引数は警告を出して無視します。
- `stick_radius` / `transparency` / `line_width` / `solvent_radius` / `label_size` /
  `label_color` など、CueMol に同じ量がある PyMOL の設定は対応するプロパティに割り当てられます。
  `show` の前に設定したものは、あとから表示されたものにも効きます。
- `quit` / `exit` は CueMol3 を終了します。保存していない変更があれば確認が出ます。
  `quit force=true` (または `quit -f`) では確認せずに終了します。

## 選択式の翻訳

PyMOL の選択式は、CueMol の[選択式](../selection.md)に**翻訳**されてから実行されます
(そのまま渡されるわけではありません)。演算子の優先順位は両者で一致していますが、
記号の意味が異なるものがあります。選択式の中では Object 名も使えます
(`1abc and chain A` など)。

<!-- TODO(content): 翻訳の対応表 (+ と - の扱い、within / near_to / beyond →
     expand / around、翻訳できず名前を挙げて拒否されるもの) を書く -->

## 制限事項

- **生の Python は受け付けません。** Python のスクリプト (`.py` / `.pym`) は名前を挙げて
  拒否されます。
- `volume` と `isodot` は未実装です。
- 対応していない選択の指定は、黙って別の原子を選ぶのではなく、**名前を挙げて
  理由とともに拒否されます**。
- **計測 (`distance` / `angle` / `dihedral`) は 1 コマンドにつきラベル 1 つ**です。
  選択はその重心 1 点として扱われます。計測できるのは 1 つの分子の中だけです
  (`distance` で接触を一覧する場合は、2 つの分子のあいだでも計測できます)。
- `show` / `hide` は、GUI で作成した Renderer には影響しません。これらのコマンドは
  `pym:` で始まる名前の Renderer だけを操作します。
- `zoom` / `center` / `orient` と、マップの切り出しは 1 つの分子に対して働きます。
- 未対応: MD トラジェクトリのコマンド (`load_traj` / `intra_fit` / `smooth` など)、
  ピッキングに依存するコマンド (`edit` / `drag` など)、`h_add` / `cealign` など。
  `.cif` と `.pse` には保存できません。

## 関連項目

- [Console](console.md) / [プラグイン](index.md) / [AI Agent](ai-agent.md)
- [選択式の文法](../selection.md)
- [下部パネル](../../ui/bottom-panels.md)

---

*確認対象: CueMol3 2.4.0.546*
