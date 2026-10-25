# cuemol3_docs

CueMol3 (コードネーム tritium) のユーザードキュメントサイト。
公開先: <https://cuemol.github.io/cuemol3_docs/>

CueMol2 のドキュメントは [cuemol2_docs](https://github.com/CueMol/cuemol2_docs)
(<https://cuemol.github.io/cuemol2_docs/>) で CueMol2 向けに凍結維持しています。
CueMol2 の内容をこのリポジトリへ移してはいけません。

## ローカルプレビュー

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve          # http://127.0.0.1:8000/
mkdocs build --strict # CI と同じ検証 (警告があれば失敗)
```

go-task があれば `task serve` / `task build` / `task check` でも同じことができます
(venv の作成も自動で行われます)。

## E2E 検証 (docs の手順を実アプリで自動実行)

`docs-verify/` に、クイックツアーなどの手順を実アプリ (tritium) 上で Playwright により
自動実行する検証があります。ドキュメントと実装の齟齬を機械的に検出するのが目的です。

```sh
task e2e          # smoke + クイックツアー (Get PDB で実ネットワークを使用)
task e2e:offline  # ネット不要の smoke のみ
task e2e:slow     # レイトレース実行などの重いステップも含める
task e2e:shots    # ドキュメント用スクリーンショットを撮影して docs/assets/images に書き出す
```

前提 (macOS + 実ディスプレイ、cuemol2 側の `task build_tritium` 済みなど) と詳細は
[docs-verify/README.md](docs-verify/README.md) を参照。CI では実行されません (ローカル専用)。

## 執筆規約

### 言語と構成

- 日本語が主で、`docs/ja/` 以下に置きます。ファイル名は英語スラッグ、nav の表示名は日本語。
- 英語版は `docs/en/` に置きます。存在しないページは `fallback_to_default: true` により
  日本語版にフォールバックするので、翻訳できたページだけを追加してください。
  運用 (出典マーカー・遅れの検出) と訳語は下記「英語版」を参照。
- 記述内容は **CueMol3 の実装状況** に従います。CueMol2 にあっても CueMol3 で
  未実装・廃止された機能を、動くかのように書かないこと。

### ページ末尾の確認バージョン

メニューリファレンスなど実装状況に追随するページには、末尾に確認対象のバージョンを
記載します。

```
*確認対象: CueMol3 2.3.7.489*
```

バージョンは CueMol3 の **Help &gt; About CueMol3** に表示される値 (配布物の名前にも入っています)
です。ページを修正したら、そのときのバージョンに更新してください。

旧書式 (`*最終確認: <日付> / 確認対象: 開発版 (tritium)*`) のページがまだ残っています。
移行はページを修正する機会に行い、一括置換はしません。

### 手順ページ (クイックツアー・チュートリアル) の書き方

- 題材・操作対象・値を特定して書く (「タンパク質を読み込む」ではなく「1CRN を読み込む」、
  「プロパティを変える」ではなく「Atom radius を 0.3 から 0.5 に」)。
- **操作の結果どう見えるか**を必ず書く (「虹色に塗り替わる」「球が大きくなる」)。
- 手順は**順序付きリスト**にし、**1 ステップ = 1 つの GUI 操作**にする
  (「A を選んで B にチェックを入れ C を押す」は 3 ステップに分ける)。
- 各ステップには、**操作対象の GUI 要素だけを切り抜いた小さな画像**を添える
  (全景を並べても、どこを操作するのかは伝わらない)。節の始めや操作の結果には全景を置く。
- 実務でその操作をするかを確認する。動くだけの例は書かない
  (例: 分子全体に ballstick を出す、球を円柱より細くする)。

これらは `docs-verify/` の spec が書ける粒度と一致します
(→ [docs-verify/PLAYBOOK.md](docs-verify/PLAYBOOK.md))。

### 画像 (Git LFS は使いません)

このリポジトリは画像を **通常の git 管理** にしています (CueMol2 側の docs は LFS 管理ですが、
CI 帯域の消費と運用事故を避けるため踏襲しません)。次の規約を守ってください。

- スクリーンショットは WebP または圧縮 PNG。**1 枚 300 KB 以内**を目安に、
  ページ表示幅に合わせてリサイズしてから追加する。
- 置き場所は `docs/assets/images/<ページのパス (ja/en は含めない)>/<名前>.webp`
  (例: `docs/ja/ui/inspector.md` の図は `docs/assets/images/ui/inspector/`)。
  日本語版と英語版で同じ画像を参照します。
- 手で作った図 (注釈付きの図など) を WebP にするには `task images:import` を使う。
  1280 px 幅に縮小し、300 KB に収まるまで品質を落とす (撮影と同じ変換)。

  ```sh
  task images:import -- ~/Desktop/figure.png docs/assets/images/ui/inspector/drag-input.webp
  task images:import -- in.png out.webp --width 1920   # 全景を大きく見せたいとき
  task images:import -- in.png out.webp --width 0      # 2x の切り抜き (縮小しない)
  ```
- アプリ画面の撮影は `docs-verify/` で自動化してある (`task e2e:shots`)。
  **自動生成された画像は手動で撮り直さない**。逆に、手で作った図 (注釈付きの図など) は
  撮影で上書きされない仕組みがある (→ [docs-verify/PLAYBOOK.md](docs-verify/PLAYBOOK.md))。
  全景は 1280 px 幅で `width` を付けず、
  要素の切り抜きは Retina の 2x のまま保存して `width` にピクセル幅の半分を指定する。
  拡大して見る価値のある画像には `.on-glb` (glightbox) を付ける。
- 動画・大型 GIF はリポジトリに入れない (GitHub Releases への添付か外部埋め込みを使う)。
- 将来リポジトリが肥大化した場合は `git lfs migrate` で移行可能ですが、履歴書き換えを伴うため
  寄稿者が少ないうちに判断すること。

### スクリーンショットの TODO

未撮影の箇所は本文に admonition の撮影枠と `<!-- TODO(screenshot): ... -->` コメントを置いています。
撮影対象の一覧は次のコマンドで得られます。

```sh
grep -rn "TODO(screenshot)" docs/
```

## 英語版

英語版は日本語版の**翻訳**です。事実の正本は日本語版 (さらにその正本は cuemol2 の実装) で、
英語版で事実を足したり省いたりしません。

### ページの作り方

- パスは日本語版と同じ (`docs/ja/ui/inspector.md` → `docs/en/ui/inspector.md`)。
  画像の相対パス (`../../assets/images/...`) もそのまま使えます。
- 構成 (見出し・表・admonition・画像・`TODO(...)` コメント) は日本語版をそのまま写し、
  本文と画像の alt テキストを訳します。
- 1 行目に**出典マーカー**を置きます。訳した (追随させた) 時点の日本語版のコミットです。

  ```
  <!-- source: ja/ui/inspector.md @ 6cacee7 -->
  ```

- 日本語版にフッタがあれば、英語版にも同じ版番号で付けます。日本語版が旧書式
  (`*最終確認: <日付> / 確認対象: 開発版 (tritium)*`) のページは、英語版も旧書式を訳して
  `*Last checked: <日付> / Verified against: development build (tritium)*` とします
  (版番号が無いため)。

  ```
  *Verified against: CueMol3 2.4.0.546*
  ```

- リンクは英語版の中の相対パスで書きます (`../menu/index.md`)。未訳のページは
  日本語版にフォールバックして表示されます。**未訳ページへのアンカーは日本語の見出しの slug
  のまま** (`../reference/settings.md#general`、`cli.md#ステータスバーの-cli`)、訳済みページへの
  アンカーは英語の見出しの slug にします。
- 訳したページは `mkdocs.yml` の en の `nav` に英語の表示名で追加します
  (未訳ページは nav に載せません)。

### 遅れの検出

```sh
task i18n:status     # 日本語版が出典マーカー以降に変わった英語版ページを列挙
task i18n:status -- -v   # 未訳ページの一覧も出す
```

日本語版を直した PR では英語版を直さず、追随は別の PR でまとめて行います。
追随したら出典マーカーの hash を更新します。

### 訳語

| 日本語 | English |
|---|---|
| Renderer / Object / Coloring | Renderer / Object / Coloring (日本語版と同じく大文字始まりの用語として扱う) |
| シーン / ビュー | scene / view |
| シーンツリー | scene tree |
| 分子ビュー (MolView) | molecular view (MolView) |
| メインウィンドウ / レンダリングウィンドウ | main window / rendering window |
| ツールバー / ツールパレット | toolbar / tool palette |
| アクティビティバー | activity bar |
| サイドパネル / 下部パネル | side panel / bottom panel |
| プロパティインスペクタ | property inspector |
| 選択ビルダー | selection builder |
| タブバー / ステータスバー / 通知センター | tab bar / status bar / notification center |
| 選択 / 選択式 | selection / selection expression |
| 名前付き選択 | named selection |
| 着色 / 色を塗る | coloring / color |
| 密度マップ / 電子密度マップ | density map / electron density map |
| 分子表面 | molecular surface |
| 静電ポテンシャル | electrostatic potential |
| レイトレース / レイトレーシング | ray tracing (動詞は ray-trace) |
| 配布物 | release assets (文脈により build / package) |
| 署名 / 公証 | code signing / notarization |
| 外部ツール | external tools |
| 開発版 | development build |
| 「開発中」バッジ + 「現在のバージョンでは動作しません」 | `<span class="badge-wip">In development</span>` + "This item does not work in the current version." |
| 〜を参照してください / (→ [X](...)) | see [X](...) / (→ [X](...)) |

- GUI のラベル (メニュー項目・ボタン・プロパティ名) は日本語版でも英語のまま太字で書いているので、
  そのまま写します。メニューのパスは **File &gt; Open File...** の書式を保ちます。
- 文体は平叙の現在形、二人称 (you) は必要なときだけ。「〜できます」は "You can ..." より
  "... can be ..." や命令形の手順で簡潔に書きます。

## 残タスク

- **ロゴは暫定版** (`docs/assets/images/cuemol3-logo*.png` / `docs/assets/favicon.png`)。
  アイコン候補 `cuemol3-icontest-260810-1.png` を切り抜き・縮小したもので、確定版ではありません。
- スクリーンショットはクイックツアー以外は未撮影 (上記 `TODO(screenshot)` 参照)。
  クイックツアーの画像は `task e2e:shots` で自動生成しており、手動では編集しない。
- チュートリアル (`docs/ja/tutorials/`) とリファレンス (`docs/ja/reference/`) はスタブ。
- 英語版は、リファレンスの scene / objects / camera / animation / styles / rendering-npr /
  actions / qsc-format と CueMol2 からの変更点 (`changes/*`) が未訳。更新履歴は訳さない。

## ライセンス

MIT License (LICENSE 参照)。
