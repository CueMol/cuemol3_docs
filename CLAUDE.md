# CLAUDE.md — cuemol3_docs

CueMol3 (tritium) のユーザードキュメントサイト (mkdocs-material、ja 主導 + en fallback)。

## 役割分担 (最重要)

**「事実」と「表現」で正本を分ける。**

- **事実 (ソフトウェアの実際の挙動) の正本は cuemol2 リポジトリ**
  (`~/proj64/cuemol2` の `tritium/` ソースと `docs/migration/`)。
  ユーザーが書いた文章であっても、現在の実装と食い違っていれば **obsolete であり、書き換える**。
  古い記述を「ユーザーの文章だから」と放置してはならない。
- **表現 (言い回し・文体・構成・訳語の選択) の正本はこのリポジトリ**。
  事実の変更に必要な範囲を超えて書き直さない。書き換えるときも前後の文体・トーンに合わせる。
- mapping (`docs/migration/mapping/`) は実装より古いことがある。記述の根拠は必ず
  tritium のソース (`menuTemplate.ts` / `menuActionMap.ts` / コマンド登録) で裏取りする。

## ドキュメント更新の手順 (cuemol2 側の開発進行を反映するとき)

1. 下記「同期記録」のコミットから現在までの差分を確認する:
   `git -C ~/proj64/cuemol2 diff <前回同期hash>..HEAD -- docs/migration/ tritium/react-gui/src/shared/`
2. **事実が変わった箇所だけ**を特定し、該当ページに **Edit による最小限の修正**を行う。
   - 記述が実装と**明確に矛盾**している場合は、ユーザーの文章でも書き換える (obsolete の解消)。
   - **意図的な簡略化・省略なのか obsolete なのか判断がつかない**場合は書き換えず、
     同期レポート (下記) に挙げてユーザーの判断を仰ぐ。
   - ページ・節の全面書き換え (Write による上書き) は禁止。
   - 事実の変更に必要な範囲を超えて、既存の文章表現・語順・文体・構成を変えない。
     誤字や表現の「改善」はしない (それはユーザーの領分)。
   - 直前の行に `<!-- keep -->` コメントがある段落・表は書き換え禁止。
     矛盾を見つけた場合はレポートで指摘するに留める。
3. 修正したページ末尾のフッタを更新する (書式は下記「ページ末尾のフッタ」を参照)。
4. 下記の同期記録を更新する。
5. **同期レポート**を書く (PR の説明、または作業報告)。事実起因の書き換えは 1 件ずつ
   「ページ / 旧記述の要旨 → 新しい事実 / 根拠 (cuemol2 側の変更)」の形式で列挙する。
   判断を保留した箇所も同じ形式で「要判断」として挙げる。
   ユーザーはこの一覧を軸に diff をレビューする。
6. 変更は**ブランチで行い、ユーザーが diff を確認してから** main へ。push はユーザーの確認後
   (main への push は即デプロイされる。PR には check.yml の strict build が走る)。

## ページ末尾のフッタ

実装状況に追随するページは、末尾に確認対象のバージョンを記載する。

```
*確認対象: CueMol3 <version>*
```

`<version>` は cuemol2 の `src/_version.h` の `QM_VERSION` (例: `2.3.7.489`)。
CI の配布物名 (`CueMol3_<version>_mac_arm64`) および **Help &gt; About CueMol3** の
Version 表示と同じ値なので、ユーザーは手元のビルドと直接照合できる。

- **この書式に移行済みのページを修正したときは、そのページのバージョンを
  修正時点の `QM_VERSION` に更新する。**
- 旧書式 (`*最終確認: <日付> / 確認対象: 開発版 (tritium)*`) のページが残っている。
  移行はページを修正する機会に行い、**一括置換はしない**。修正しないページの
  フッタには触れない。

## 同期記録

- 前回同期: 2026-08-10 / cuemol2 コミット: `d4c35ba9e9ca` (branch: feat/app-icon-refresh)
- 追加反映: 2026-08-10 / cuemol2 `b706529c` (branch: develop) + **未コミットの作業ツリー変更**
  (object Save File As の改良: `listSavableObjects` / `saveWriterName`)。
  次回同期時、この変更がコミットされたら通常の差分確認に含めること。
- レンダリング系のみ反映: 2026-08-16 / cuemol2 `41effb33` (branch: develop) /
  umbreon `169ab1c` (branch: main) / CueMol3 `2.3.7.489`。
  Umbreon を既定バックエンドとする記述への更新。**レンダリング以外の差分は未確認**なので、
  次回はこの hash ではなく `b706529c` から通常の差分確認を行うこと。

## E2E 検証と画像生成 (docs-verify/)

`docs-verify/` は、クイックツアーなどの手順を実アプリ (tritium) 上で Playwright により
自動実行し、ドキュメントと実装の齟齬を機械検出する仕組み (`task e2e`、ローカル専用)。
ドキュメント用のスクリーンショットも同じ spec から生成する (`task e2e:shots`)。

**新しいページに spec や画像を用意するとき、既存の spec を直すときは、
[`docs-verify/PLAYBOOK.md`](docs-verify/PLAYBOOK.md) に従うこと。**
作業手順・セレクタの調べ方 (使い捨て DOM ダンプ spec)・セレクタ台帳・既知の落とし穴を
まとめてあり、これを読めば再調査は不要。以下はそこから外せない要点のみ:

- **spec はページの写像**。1 spec = 1 ページ、test 名 = h2 の節、`test.step` 名 = 見出しと
  一字一句一致。**ページを改稿したら spec を追随させる** (逆も同じ)。
- spec が書けないページは、ページ自体が曖昧。題材・操作対象・値・**結果の見え方**を
  特定し、手順は順序付きリストで **1 ステップ = 1 GUI 操作**にしてから spec を書く。
- **spec が落ちて、原因がページの記述と実装の食い違いだった場合はページを直す**
  (これが docs-verify の目的。実例: 「Start」→ 実際は Start Render)。
  意図的な簡略化か obsolete か判断がつかないときは書き換えず報告する。
- 画像は `docs/assets/images/<spec の docShot id>.webp` に自動生成される。
  **手動編集・手動撮影で置き換えないこと** (再生成は `task e2e:shots`)。
- 撮影した画像は必ず目視確認する (Read で `.webp` を開く)。
- 仕上げは `task build` (strict) / `task check:images` / `task e2e` の 3 点。
  `test-results/` や `.last-run.json` をコミットしない。

## その他の規約

- 執筆規約 (画像は LFS 不使用・1 枚 300 KB 目安、`TODO(screenshot)` の書式) は README.md を参照。
- 動作しないメニュー項目には `<span class="badge-wip">開発中</span>` + 定型文
  「現在のバージョンでは動作しません」(凡例は `docs/ja/menu/index.md`)。
- 配色は `docs/stylesheets/extra.css` で定義 (アイコン由来、基調 #269999 / 背景 #f7ffff)。
  mkdocs.yml の palette は `custom` のまま変えない。
- コミットメッセージは英語、Co-Authored-By 行なし。
