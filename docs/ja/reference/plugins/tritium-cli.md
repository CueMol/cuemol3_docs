# tritium_cli

**tritium_cli** は、Console のコマンドをターミナルから実行するクライアントです。
CueMol3 に同梱されています。コマンドは起動中の CueMol3 の**アクティブなタブ**に対して実行されます。

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

## ステータスバーの CLI

Console が有効なとき、ステータスバーの右側に **CLI** が表示されます。クリックすると、
コマンドラインからの接続の状態 (Off / Starting / Ready / Running / Error) と、
**Command line access** と同じ切り替えスイッチ、tritium_cli のパスのコピー (**Copy path**) が
表示されます。

## 関連項目

- [Console](console.md) / [Console のコマンド一覧](console-commands.md) / [PyMOL 互換モード](pymconsole.md)
- [MCP Server](mcp-server.md) — 同じサーバーを使います
- [操作の記録と再生](../actions.md) / [設定項目](../settings.md#console)

---

*確認対象: CueMol3 2.4.0.546*
