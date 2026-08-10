# Renderer 共通プロパティ

すべての Renderer が持つプロパティです。プロパティインスペクタの **Properties** タブの
先頭にある **Common** セクションに表示されます
(→ [プロパティインスペクタ](../../ui/inspector.md))。

## 基本設定

Name
:   Renderer の名前。シーン内で一意である必要があります

Selection
:   この Renderer が描画する範囲を指定する[選択式](../selection.md)。
    分子 (MolCoord) を対象とする Renderer のみで有効です

Visible
:   表示 / 非表示の切り替え。シーンツリーの目のアイコンと連動します

Locked
:   ロック。ON にすると編集操作の対象から外れます

## 質感と透明度

Material
:   質感を指定します。既定は空 (指定なし) で、この場合 `default` が適用されます
    → [マテリアル](material.md)

Opacity
:   不透明度。1 で完全に不透明、0 に近づくほど透明になります

## エッジライン

Edge type
:   エッジ線の種類 (None / Edges / Silhouette)

Width
:   エッジ線の太さ (Å 単位)

Color
:   エッジ線の色

→ [エッジライン](edge-lines.md)

!!! info "準備中"
    各プロパティの既定値・値の範囲・プロパティ名 (Generic タブでのキー) の一覧は
    今後追加されます。

<!-- TODO(content): RendererCommonSection.tsx と C++ Renderer.qif から
     プロパティ表 (インスペクタ表記 / プロパティ名 / 型 / 既定値) を起こす -->

## 関連項目

- [Renderer の一覧](index.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)
- [選択式の文法](../selection.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
