# シーンファイル (`.qsc`)

CueMol のシーンファイル `.qsc` の構造についてのリファレンスです。
CueMol2 と互換で、CueMol2 で作成したシーンを CueMol3 で開けます。

!!! info "準備中"
    このページは骨組みのみです。内容は今後追加されます。

## 概要

<!-- TODO(content): qsc が XML ベースであること、拡張子と MIME、
     SceneXMLReader / SceneXMLWriter が正本であることを記載 -->

## 全体の構造

<!-- TODO(content): scene / object / renderer / camera / style / anim の
     各要素の入れ子構造を、src/qsys/SceneXMLReader.cpp と
     SceneXMLWriter.cpp から起こす -->

## データの埋め込みと外部参照

シーンの保存時に、分子座標や密度マップのデータをシーンファイル自体に埋め込むか、
元のファイルへの参照だけを残すかを選べます
(→ [File メニュー](../menu/file.md) の Save Scene As...)。

<!-- TODO(content): 埋め込み時の格納形式 (QDF) と、外部参照時のパス解決の規則 -->

## 圧縮と文字エンコーディング

保存オプションで、圧縮方式と文字エンコーディングを指定できます。

<!-- TODO(content): 圧縮方式の選択肢と既定値 (QDF1 + xz)、
     QDF0 を選んだ場合の制約を QscWriterOptionDialog から起こす -->

## CueMol2 との互換性

<!-- TODO(content): 互換性オプションの選択肢と、CueMol3 で追加された要素を
     CueMol2 で開いた場合の挙動 -->

## 関連項目

- [File メニュー](../menu/file.md)
- [対応ファイル形式](../getting-started/index.md#対応ファイル形式)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
