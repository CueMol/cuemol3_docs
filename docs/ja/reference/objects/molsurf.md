# MolSurfObj (分子表面)

分子の溶媒排除表面 (SES) のポリゴンデータを保持する Object です。

!!! info "準備中"
    このページは骨組みのみです。プロパティの一覧は今後追加されます。

## 作成

Tools メニューの **Mol surface generation...** で分子から生成するか、
MSMS の表面ファイル (`.face` / `.vert`) や PLY ファイルを読み込みます
(→ [Tools メニュー](../../menu/tools.md))。

生成後は Tools &gt; **Mol surface cutter...** で平面による切断、
シーンツリーの右クリックメニューから再生成ができます。

## プロパティ

<!-- TODO(content): molsurfobj のプロパティ表 (名前 / 型 / 説明) を
     C++ の qif 定義とインスペクタから起こす -->

## 対応する Renderer

[molsurf](../renderers/molsurf.md)

## 関連項目

- [Object の一覧](index.md)
- [Renderer](../renderers/index.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
