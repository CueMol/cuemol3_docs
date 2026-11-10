# ユーザーディレクトリ (~/.cuemol)

ホームフォルダの `.cuemol` フォルダ (`~/.cuemol`) に、起動のたびに実行するスクリプトと、
追加のスタイルファイルを置けます。毎回同じ設定をしてから作業を始めたいときに使います
(PyMOL の `~/.pymolrc` に当たります)。3.0.1.555 で加わりました。

```
~/.cuemol/
  startup.txt      native モードのコマンド
  startup.qax      記録した操作 (qax)
  startup.pml      PyM console のスクリプト
  startup.cxc      ChX console のスクリプト
  styles/*.xml     追加のスタイルファイル
  local-api.json   tritium_cli と MCP Server の接続情報 (自動で作られます)
```

どれも必要なものだけを置けば十分です。フォルダが無ければ何もしません。
環境変数 `CUEMOL_HOME` を設定すると、`~/.cuemol` の代わりにそのフォルダを使います
(`local-api.json` の場所も変わります)。

## 起動スクリプト

CueMol3 を起動すると、最初のシーンができたあとに、次のファイルのうち存在するものを
この順に [Console](plugins/console/index.md) で実行します。

| 順 | ファイル | 実行するモード |
|---|---|---|
| 1 | `startup.txt` | native モード (1 行に 1 コマンド) |
| 2 | `startup.qax` | native モード (記録した操作の再生 → [操作の記録と再生](actions.md)) |
| 3 | `startup.pml` | [PyM console](plugins/console/pymconsole.md) |
| 4 | `startup.cxc` | [ChX console](plugins/console/chx_console.md) |

- 実行するのは起動ごとに 1 回だけです。あとから Console のプラグインを無効にして有効に戻しても、
  実行し直しません。
- **1 つのファイルが 1 回の Undo にまとまります** (`startup.qax` は、記録された操作ごとに 1 回の Undo です)。
- ファイルの中の相対パスは、そのファイルのあるフォルダ (`~/.cuemol`) から解決します。
- エラーでファイルの実行が止まっても、残りのファイルは実行します。
- 実行した内容と結果は、Console に `[startup] ` を付けて表示されます。
- **Console** プラグインが無効のときは、どのファイルも実行しません。**PyM console** や
  **ChX console** が無効のときは、そのファイル (`startup.pml` / `startup.cxc`) を飛ばし、
  Console に `[startup] startup.cxc skipped (the console dialect for .cxc files is off)` のように表示します
  (→ [プラグイン](plugins/index.md))。
- OS から開いたファイル (ダブルクリックやドラッグ &amp; ドロップ) と、[tritium_cli](plugins/console/cli.md) から
  送ったコマンドは、起動スクリプトが終わるまで待ってから実行されます。

### 実行中の表示と中止

起動スクリプトの実行中は、ステータスバーに **Startup 1/3** のような項目が表示されます。
クリックすると **Startup Scripts** のポップオーバーが開き、ファイルごとの状態
(Waiting / Running / Done / Failed / Stopped / Skipped / Not run) が表示されます。
**Stop** を押すと、実行中のファイルを止め、残りのファイルも実行しません
(Console の **Stop** でも同じです)。

すべてのファイルが成功すると、項目は消えます。失敗したとき (赤) や中止したとき (灰色) は、
ポップオーバーを開いて閉じるまで残ります。

!!! info "撮影予定"

<!-- TODO(screenshot): ステータスバーの Startup の項目と、Startup Scripts のポップオーバー -->

## スタイルファイル

`~/.cuemol/styles/` に置いた `.xml` ファイルを、起動時に
[スタイル](styles.md)のファイルとして読み込みます。

- ファイル名の順に読み込みます。読み込んだスタイルセットは読み取り専用です。
- 同じスタイルが複数の場所で定義されているときは、GUI で設定した値 (`user_styles.xml`) が
  最も優先され、次にこのフォルダのファイル (ファイル名が後ろのものほど優先)、最後に
  CueMol3 の組み込みのスタイルです。
- ルートの `<styles id="...">` に id が無いファイル、id が `user` のファイル、読み込みに失敗した
  ファイルは読み込みません (この場合、画面にはメッセージは出ず、ログにだけ記録されます)。

## 関連項目

- [Console](plugins/console/index.md) / [PyM console](plugins/console/pymconsole.md) /
  [ChX console](plugins/console/chx_console.md)
- [操作の記録と再生](actions.md)
- [スタイル](styles.md)
- [プラグイン](plugins/index.md)

---

*確認対象: CueMol3 3.0.1.555*
