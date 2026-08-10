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

## 執筆規約

### 言語と構成

- 日本語が主で、`docs/ja/` 以下に置きます。ファイル名は英語スラッグ、nav の表示名は日本語。
- 英語版は `docs/en/` に置きます。存在しないページは `fallback_to_default: true` により
  日本語版にフォールバックするので、翻訳できたページだけを追加してください。
- 記述内容は **CueMol3 の実装状況** に従います。CueMol2 にあっても CueMol3 で
  未実装・廃止された機能を、動くかのように書かないこと。

### ページ末尾の確認バージョン

メニューリファレンスなど実装状況に追随するページには、末尾に確認日と確認対象を記載します。
実装が進んだら日付を更新してください。

### 画像 (Git LFS は使いません)

このリポジトリは画像を **通常の git 管理** にしています (CueMol2 側の docs は LFS 管理ですが、
CI 帯域の消費と運用事故を避けるため踏襲しません)。次の規約を守ってください。

- スクリーンショットは WebP または圧縮 PNG。**1 枚 300 KB 以内**を目安に、
  ページ表示幅に合わせてリサイズしてから追加する。
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
- スクリーンショットは未撮影 (上記 `TODO(screenshot)` 参照)。
- チュートリアル (`docs/ja/tutorials/`) とリファレンス (`docs/ja/reference/`) はスタブ。
- 英語版は `docs/en/index.md` のみ。

## ライセンス

MIT License (LICENSE 参照)。
