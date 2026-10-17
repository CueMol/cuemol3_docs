# プラグイン

**プラグイン**は、まとまった 1 つの機能を有効・無効で切り替えられるようにしたものです。
実験的な機能や、使う人が限られる機能が該当します。
切り替えは **Settings &gt; Plugins &gt; Installed** で行います
(→ [設定項目](../settings.md#plugins))。

!!! info "撮影予定"

<!-- TODO(screenshot): Settings > Plugins > Installed (5 つのスイッチが並んだ状態) -->

## 切り替えられるプラグイン

| プラグイン | 内容 | 既定 | 有効にすると増えるもの |
|---|---|---|---|
| **AI Agent** | 文章で指示するとシーンを組み立てるチャットパネル。OpenAI・Anthropic・Google (Gemini) のモデルを使い、API キーは自分で用意します | OFF | アクティビティバーの **AI Agent** ビューと、Settings の **Plugins &gt; AI Agent** ページ (→ [AI Agent](ai-agent.md)) |
| **MD Tools** | MD シミュレーションのトラジェクトリ (topology + DCD / XTC / TRR) を開いて再生します | OFF | **File &gt; Open MD Trajectory...** と、下部パネルの **Trajectory** タブ |
| **Console** | CueMol の操作をコマンドで実行するコマンドラインです。PyMOL 互換モードも使えます | **ON** | 下部パネルの先頭の **Console** タブ、ステータスバーの **CLI**、Settings の **Plugins &gt; Console** ページ (→ [Console](console/index.md)) |
| **MCP Server** | 同じコンピュータの AI クライアント (Claude Code など) から MCP で CueMol3 を操作できるようにします | OFF | ステータスバーの **MCP** と、Settings の **Plugins &gt; MCP Server** ページ (→ [MCP Server](mcp-server.md)) |
| **Component Catalog** | 画面部品のカタログ。CueMol3 の UI を開発・レビューするための内部ツールです | OFF | アクティビティバーの **Component Catalog** ビュー |

**MD Tools** / **Console** / **MCP Server** の 3 つは実験的な機能で、
説明文が *Experimental.* で始まります。

!!! note "常に有効な機能は一覧に出ません"
    **Get PDB** (File &gt; Get PDB... とツールバーのボタン) と
    **Sequence Panel** (下部パネルの Sequence タブ) も内部的にはプラグインですが、
    切り替えられないため Installed の一覧には並びません。
    これらは機能を 1 か所にまとめるためにプラグインの形をとっているもので、
    外せるようにする意図はありません。

## 設定の保存

切り替えた結果は、**自分で切り替えたものだけ**が記録されます。
一度も触っていないプラグインは、そのつど既定に従います。
このため、あとのバージョンで既定が変わると、設定を触っていない環境にはその変更が届きます。

## MD トラジェクトリは既定で無効になりました

2.3.15.530 より前のバージョンでは、**File &gt; Open MD Trajectory...** と
下部パネルの **Trajectory** タブが常に表示されていました。現在は **MD Tools**
プラグインの一部となり、**既定では無効**です。使う場合は Settings &gt; Plugins &gt;
Installed で **MD Tools** を有効にしてください。

無効の状態でも、**すでにシーンに入っている Trajectory は今までどおり描画され、
シーンファイル (`.qsc`) からも読み込まれます**。無効になるのは GUI だけです。
再生中にプラグインを無効にすると、タブが閉じて再生が止まります。

## 制限事項

- macOS では、起動した直後の短い間だけ、プラグインが追加するメニュー項目が
  メニューバーに現れないことがあります。

## 関連項目

- [AI Agent](ai-agent.md) / [Console](console/index.md) / [PyMOL 互換モード](console/pymconsole.md) / [MCP Server](mcp-server.md)
- [設定項目](../settings.md#plugins)
- [サイドパネル](../../ui/side-panels.md) / [下部パネル](../../ui/bottom-panels.md)

---

*確認対象: CueMol3 2.4.0.546*
