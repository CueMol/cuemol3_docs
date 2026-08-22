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

## 残タスク

- **ロゴは暫定版** (`docs/assets/images/cuemol3-logo*.png` / `docs/assets/favicon.png`)。
  アイコン候補 `cuemol3-icontest-260810-1.png` を切り抜き・縮小したもので、確定版ではありません。
- スクリーンショットはクイックツアー以外は未撮影 (上記 `TODO(screenshot)` 参照)。
  クイックツアーの画像は `task e2e:shots` で自動生成しており、手動では編集しない。
- チュートリアル (`docs/ja/tutorials/`) とリファレンス (`docs/ja/reference/`) はスタブ。
- 英語版は `docs/en/index.md` のみ。

## ライセンス

MIT License (LICENSE 参照)。
