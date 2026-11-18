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

保存オプションの **Compatibility** で、どのバージョンで開けるファイルにするかを選びます。

| Compatibility | 内容 |
|---|---|
| Ver 3.0 or later (既定) | CueMol3 の見た目 (→ [Scene](scene.md#compatibility)) を、アプリに同梱のスタイルファイルへの参照として書きます。 |
| Ver 2.3 or later | CueMol3 の見た目をシーンファイルに埋め込みます。 |
| Ver 2.2 or later | 同上。データの埋め込みには旧形式 (QDF0) を使います。 |

Ver 3.0 or later で保存したシーンファイルは、3.0.3.565 より前の CueMol2 では開けません。
古い CueMol2 で開く必要があるときは、Ver 2.3 or later 以前を選んで保存します。

<!-- TODO(content): CueMol3 で追加された要素を CueMol2 で開いた場合の挙動 -->

## 関連項目

- [File メニュー](../menu/file.md)
- [対応ファイル形式](../getting-started/index.md#対応ファイル形式)

---

*確認対象: CueMol3 3.0.3.565*
