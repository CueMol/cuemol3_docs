# CLAUDE.md — cuemol3_docs

CueMol3 (tritium) のユーザードキュメントサイト (mkdocs-material、ja 主導 + en fallback)。

## 役割分担 (最重要)

- **文章の正本はこのリポジトリ**。ユーザーが手で直した日本語・言い回し・構成は成果物そのものであり、
  ドキュメント更新の際に機械的に書き直してはならない。
- cuemol2 リポジトリ (`~/proj64/cuemol2` の `docs/migration/` と `tritium/` ソース) は
  **事実関係の一次ソース**にすぎない。実装状況の裏取りに使うが、そこからページを再生成しない。
- mapping (`docs/migration/mapping/`) は実装より古いことがある。記述の根拠は必ず
  tritium のソース (`menuTemplate.ts` / `menuActionMap.ts` / コマンド登録) で裏取りする。

## ドキュメント更新の手順 (cuemol2 側の開発進行を反映するとき)

1. 下記「同期記録」のコミットから現在までの差分を確認する:
   `git -C ~/proj64/cuemol2 diff <前回同期hash>..HEAD -- docs/migration/ tritium/react-gui/src/shared/`
2. **事実が変わった箇所だけ**を特定し、該当ページに **Edit による最小限の修正**を行う。
   - ページ・節の全面書き換え (Write による上書き) は禁止。
   - 事実の変更に必要な範囲を超えて、既存の文章表現・語順・文体・構成を変えない。
   - 誤字や表現の「改善」はしない (それはユーザーの領分)。
3. 修正したページ末尾の「最終確認: <日付>」を更新する。
4. 下記の同期記録を更新する。
5. 変更は**ブランチで行い、ユーザーが diff を確認してから** main へ。push はユーザーの確認後
   (main への push は即デプロイされる。PR には check.yml の strict build が走る)。

## 同期記録

- 前回同期: 2026-08-10 / cuemol2 コミット: `d4c35ba9e9ca` (branch: feat/app-icon-refresh)

## その他の規約

- 執筆規約 (画像は LFS 不使用・1 枚 300 KB 目安、`TODO(screenshot)` の書式) は README.md を参照。
- 動作しないメニュー項目には `<span class="badge-wip">開発中</span>` + 定型文
  「現在のバージョンでは動作しません」(凡例は `docs/ja/menu/index.md`)。
- 配色は `docs/stylesheets/extra.css` で定義 (アイコン由来、基調 #269999 / 背景 #f7ffff)。
  mkdocs.yml の palette は `custom` のまま変えない。
- コミットメッセージは英語、Co-Authored-By 行なし。
