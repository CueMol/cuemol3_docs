# tritium_cli

**tritium_cli** は、Console のコマンドをターミナルから実行するクライアントです。
CueMol3 に同梱されているほか、npm から単体でインストールすることもできます
([npm でインストールする](#npm-でインストールする))。コマンドは起動中の CueMol3 の**アクティブなタブ**に対して実行されます。

## 使い方

```
tritium_cli [OPTIONS] [FILE...] [-c COMMANDS] [-i]
tritium_cli <command> [ARGS]
```

- 引数なしで起動すると対話モードになります。プロンプトは `CueMol <ディレクトリ> ❯`
  (PyMOL 互換モードでは `PyMOL <ディレクトリ> ❯`、ChX console では `ChimeraX <ディレクトリ> ❯`) で、++tab++ で補完、++ctrl+c++ で実行中の
  コマンドを止め、`native` / `pymol` / `chimerax` でモードを切り替え、`exit` または ++ctrl+d++ で終了します。
  `quit` は CueMol3 を終了してから tritium_cli も終了します。
- ++tab++ の補完はパネルと同じで、2 回目の ++tab++ で候補のメニューになります。`help` の
  表示はターミナルの幅で折り返されます (パイプに出力するときは Markdown のまま出ます)。
- `-c` でコマンドを、または引数にファイルを渡すと、それを実行して終了します。`-i` を付けると、
  そのあと対話モードに入ります。パイプから流し込むこともできます。
- 引数のファイルは、種類によって扱いが変わります。

    | ファイル | 動作 |
    |---|---|
    | 構造・マップなどのデータ (`1crn.pdb` / `map.ccp4` など) | アクティブなタブに開きます。形式は **File &gt; Open** と同じように判別します。複数並べられます |
    | `.qsc` | シーンを新しいタブに開きます。データのファイルや `-c` と組み合わせると、そのシーンに読み込みます |
    | `.qax` | 記録された操作を再生します |
    | `.pml` / `.cxc` | PyMOL 互換モード / ChX console のスクリプトとして実行します |
    | `.txt` | コマンドを書いたテキストとして、いまのモードで実行します |

    データのファイルと `-c` は、まとめて 1 回の Undo になります。スクリプトはほかのファイルや `-c` と
    一緒には渡せません。
- `--dialect` でモードを選びます (`native` / `pymol` / `chimerax`)。無効にしているプラグインのモードは
  選べません。
- 終了ステータスは、成功で 0、コマンドの失敗で 1、引数の誤りで 2、中断で 130 です。
- `--echo` は、実行する各コマンドを出力の前に表示します。
- 相対パスは、tritium_cli を実行したディレクトリを基準に解決されます。
- 実行したコマンドは CueMol3 の Console タブにも `[cli]` を付けて表示されます。

## サブコマンド

| コマンド | 動作 |
|---|---|
| `tritium_cli status` | CueMol3 が起動しているか、どのポートで何を受け付けているかを表示します。CueMol3 は起動しません。起動していれば終了ステータス 0、していなければ 1 です |
| `tritium_cli version` | tritium_cli と、起動中の CueMol3 のバージョンを表示します (`--version` / `-V` と同じ) |
| `tritium_cli help [コマンド]` | 使い方、またはサブコマンドの使い方を表示します |
| `tritium_cli skill` | AI エージェント向けの説明 (skill) を表示します。`skill install` で Claude Code の `~/.claude/skills/cuemol/SKILL.md` に書き込みます (`--dir` で書き込み先を変えられます。内容の違うファイルがあれば、`--force` を付けない限り上書きしません) |
| `tritium_cli mcp` | MCP クライアントと標準入出力 (stdio) でつなぎます (→ [MCP Server](../mcp-server.md#tritium_cli-mcp-で登録する)) |

## 接続

CueMol3 が起動していなければ、tritium_cli が起動して待ちます (`--no-launch` で抑止)。
この場合は、その回に限りコマンドラインからの実行が許可されます。

npm でインストールした tritium_cli は、インストール済みの CueMol3 を探して起動します。
標準のインストール先 (macOS では `/Applications` など、Windows ではインストーラの
インストール先、Linux では .deb のインストール先) から探し、それ以外の場所にある場合
(AppImage など) は環境変数 `CUEMOL3_APP` にアプリのパスを指定します。CueMol3 が
見つからなければ、ダウンロード先を表示して終了します。

すでに起動している CueMol3 に接続するには、**Settings &gt; Plugins &gt; Console** の
**Command line access** を ON にします (既定は OFF)。接続先のポートとトークンは
`~/.cuemol/local-api.json` から読み取られます。

一度に編集できるのは 1 つのクライアントだけです。ほかの tritium_cli や MCP クライアントが
実行している間にコマンドを送ると、`CueMol is busy` と表示されて実行されません。
終わってからやり直してください。

## PATH に通す

**Settings &gt; Plugins &gt; Console** の **Command line tool** に、同梱の tritium_cli の
パスが表示されます (**Copy** でコピーできます)。

| OS | 方法 |
|---|---|
| macOS | 表示されたパスを PATH 上のディレクトリにリンクします (`ln -s "<パス>" ~/.local/bin/tritium_cli`) |
| Windows | 表示された `tritium_cli.cmd` のあるディレクトリを PATH に加えます |
| Linux (.deb) | `/usr/bin/tritium_cli` にインストールされます |
| Linux (AppImage) | 使えません。tritium_cli を使う場合は .deb をインストールしてください |

## npm でインストールする

Node.js (18 以降) があれば、tritium_cli だけを npm でインストールできます。
`tritium_cli` のコマンドが PATH に入ります。

```
npm install -g @cuemol/tritium-cli
```

npm でインストールした tritium_cli は、CueMol3 とは別に更新されます。CueMol3 との間の
やり取りの版 (プロトコル) が食い違っていると、対話モードの起動時に古い方を更新するよう警告が表示されます
(一部のコマンドが動かないことがあります)。

!!! note
    npm 版は、インストール済みの CueMol3 との組み合わせを macOS でのみ確認しています。

## ステータスバーの CLI

Console が有効なとき、ステータスバーの右側に **CLI** が表示されます。クリックすると、
コマンドラインからの接続の状態 (Off / Starting / Ready / Running / Error) と、
**Command line access** と同じ切り替えスイッチ、tritium_cli のパスのコピー (**Copy path**) が
表示されます。

## 関連項目

- [Console](index.md) / [Console のコマンド一覧](commands.md) / [PyMOL 互換モード](pymconsole.md) / [ChX console](chx_console.md)
- [MCP Server](../mcp-server.md) — 同じサーバーを使います
- [操作の記録と再生](../../actions.md) / [設定項目](../../settings.md#console)

---

*確認対象: CueMol3 3.0.0.554*
