# tritium_cli

**tritium_cli** は、Console のコマンドをターミナルから実行するクライアントです。
CueMol3 に同梱されているほか、npm から単体でインストールすることもできます
([npm でインストールする](#npm-でインストールする))。コマンドは起動中の CueMol3 の**アクティブなタブ**に対して実行されます。

## 使い方

```
tritium_cli [--dialect native|pymol] [--echo] [--no-launch] [-c COMMANDS | SCRIPT]
```

- 引数なしで起動すると対話モードになります。プロンプトは `CueMol <ディレクトリ> ❯`
  (PyMOL 互換モードでは `pymol <ディレクトリ> ❯`) で、++tab++ で補完、++ctrl+c++ で実行中の
  コマンドを止め、`native` / `pymol` でモードを切り替え、`exit` または ++ctrl+d++ で終了します。
  `quit` は CueMol3 を終了してから tritium_cli も終了します。
- ++tab++ の補完はパネルと同じで、2 回目の ++tab++ で候補のメニューになります。`help` の
  表示はターミナルの幅で折り返されます (パイプに出力するときは Markdown のまま出ます)。
- `-c` でコマンドを、または引数にスクリプトのファイルを渡すと、それを実行して終了します。
  `.qax` のファイルを渡すと、記録された操作を再生します。
  パイプから流し込むこともできます。失敗したときの終了ステータスは 1 です。
- `--echo` は、実行する各コマンドを出力の前に表示します。
- 相対パスは、tritium_cli を実行したディレクトリを基準に解決されます。
- 実行したコマンドは CueMol3 の Console タブにも `[cli]` を付けて表示されます。

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

- [Console](index.md) / [Console のコマンド一覧](commands.md) / [PyMOL 互換モード](pymconsole.md)
- [MCP Server](../mcp-server.md) — 同じサーバーを使います
- [操作の記録と再生](../../actions.md) / [設定項目](../../settings.md#console)

---

*確認対象: CueMol3 2.4.1.547*
