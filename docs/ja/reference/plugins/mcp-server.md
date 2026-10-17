# MCP Server

同じコンピュータで動く AI クライアント (Claude Code / Codex / Antigravity など) から、
**MCP** (Model Context Protocol) で CueMol3 を操作できるようにするプラグインです。
**既定では無効**です。

クライアントからは、[Console](console.md) のコマンドと同じ操作をツールとして呼び出せます。
API キーは CueMol3 側では不要で、モデルの利用はクライアント側の設定に従います。

!!! info "撮影予定"

<!-- TODO(screenshot): ステータスバーの MCP のポップオーバーと Connect a client ダイアログ -->

## 有効にする

**Settings &gt; Plugins &gt; Installed** で **MCP Server** を有効にします
(→ [プラグイン](index.md))。有効にすると、ステータスバーの右側に **MCP** が表示され、
接続の受け付けが始まります。

設定は **Settings &gt; Plugins &gt; MCP Server** にあります。

| 項目 | 既定値 | 説明 |
|---|---|---|
| Accept connections | ON | 接続を受け付けます。OFF にするとポートを閉じます (ステータスバーの MCP は残り、そこから ON に戻せます) |
| Port | 27182 | 待ち受けるポート (1024〜65535)。++enter++ を押すかフォーカスを外したときに反映されます (++esc++ で元の値に戻ります)。範囲外の値はエラーを表示して反映しません。欄の下に待ち受けの状態が表示され、既定値でないときは **Reset to 27182** で戻せます。変えたときは、クライアントを登録し直してください |

## ステータスバーの MCP

ステータスバーの **MCP** は、サーバーの状態を表示します。ツールを実行している間は
**MCP: &lt;ツール名&gt;** と表示されます。

| 状態 | 意味 |
|---|---|
| Off | 接続を受け付けていません |
| Starting | ポートを開いています |
| Ready | クライアントからの接続を待っています |
| Running | ツールを実行しています |
| Error | サーバーを開始できませんでした (ポートが他のプログラムに使われている場合など) |

クリックすると開くポップオーバーには、次のものがあります。

- 上端の切り替えスイッチ (**Accept connections** と同じ設定) と、設定ページを開く歯車のボタン
- **Status** — 状態と、待ち受けているアドレス (`127.0.0.1:<ポート>`) や実行中のツール名
- **Clients** の **Set up...** — クライアントを登録するためのダイアログを開きます
- **Token** の **Regenerate** — 接続に使うトークンを作り直します。古いトークンで登録した
  クライアントは、登録し直す必要があります

## クライアントの登録

**Set up...** で開く **Connect a client** ダイアログで、クライアントの種類
(**Claude Code** / **Codex** / **Antigravity** / **Other**) を選ぶと、登録に使うコマンドや
設定ファイルへの追記内容が表示されます。**Copy** でコピーしたものを使います。

- 表示中はトークンが `<token>` と伏せられており、**Copy** でコピーしたときに実際の値が入ります。
- Claude Code では、表示されたコマンド (`claude mcp add --transport http cuemol ...`) を
  ターミナルで実行します。
- Codex では `~/.codex/config.toml` に、Antigravity では `~/.gemini/config/mcp_config.json` に
  追記します。Codex 用の設定には、時間のかかるレンダリングが途中で打ち切られないよう
  `tool_timeout_sec` が含まれています。
- **Other** では、URL (`http://127.0.0.1:<ポート>/mcp`) と、送るヘッダ
  (`Authorization: Bearer <token>`) が表示されます。Streamable HTTP に対応し、
  ヘッダを送れる MCP クライアントであれば使えます。

トークンやポートを変えたときは、クライアントを登録し直してください。

## できること

- [Console](console.md#対応コマンド) のコマンドにあたる操作を、すべてツールとして呼び出せます。
  そのほか、今のビューを画像として返す `capture_view` があります。
- シーンの一覧・新規作成・切り替え・クローズ (`list_scenes` / `create_scene` / `switch_scene` /
  `close_scene`) ができます。`close_scene` は、変更が保存されていないシーンを閉じません
  (`discardChanges` を指定すると変更を捨てて閉じます)。`save_scene` での保存や、
  `.qsc` を開くこともできます。
- **1 回のツール呼び出しが 1 回の Undo にまとまります** (Undo の名前は `MCP: <ツール名>`)。
  呼び出しは [Actions ビューの History](../actions.md) に記録されます。
- AI Agent の指示や Console のコマンドを実行している間は、ツールの呼び出しは断られます。
  クライアントが呼び出しを取り消すと、実行中の処理も止まります。
- エラーは、クライアントが読める形 (`{ok: false, error}`) で返されます。

!!! note "2.4.0.546 で引数の名前が変わりました"
    着色と Paint の操作 (`add_paint` / `set_paint` / `clear_paint` / `set_default_color` /
    `set_renderer_coloring` など) は、`rendId` の代わりに `nodeId` と `nodeType`
    (`renderer` または `object`) を取ります。Object を指す引数 `molId` は `objId` になりました
    (`add_morph_frame` の `fromMolId` は `fromObjId`)。

## セキュリティ

- サーバーは `127.0.0.1` (このコンピュータの中) でだけ待ち受けます。
- 接続にはトークンが必要です。トークンは CueMol3 のユーザーデータのフォルダに、本人だけが
  読めるファイルとして保存されます。
- Web ページからの要求は拒否されます。
- 待ち受け中は、ポートとトークンが `~/.cuemol/local-api.json` (本人だけが読めるファイル) に
  書かれます。[tritium_cli](console.md#ターミナルから使う-tritium_cli) も同じサーバーを使います。

## 関連項目

- [Console](console.md) / [AI Agent](ai-agent.md)
- [プラグイン](index.md) / [設定項目](../settings.md#plugins)

---

*確認対象: CueMol3 2.4.0.546*
