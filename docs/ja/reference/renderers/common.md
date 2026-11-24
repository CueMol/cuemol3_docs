# Renderer 共通プロパティ

すべての Renderer が持つプロパティです。プロパティインスペクタの **Properties** タブの
先頭にある **Basic settings** と **Edge lines** のセクションに表示されます
(→ [プロパティインスペクタ](../../ui/inspector.md))。

## 基本設定

Name
:   Renderer の名前。シーン内で一意である必要があります。

Selection
:   この Renderer が描画する範囲を指定する[選択式](../selection.md)。
    分子 (MolCoord) を対象とする Renderer のみで有効です。

Visible
:   表示 / 非表示の切り替え。シーンツリーの目のアイコンと連動します。

Locked
:   ロック。ON にすると編集操作の対象から外れます。

## 質感と透明度

Material
:   質感を指定します。既定は空 (指定なし) で、この場合 `default` が適用されます。
    → [マテリアル](material.md)

Opacity
:   不透明度。1 で完全に不透明、0 に近づくほど透明になります。

### 半透明の Renderer の重なり方

Opacity を 1 より小さくした Renderer は、分子ビューでも、レンダリングウィンドウ (Umbreon) と
同じ方式で背景に重ねられます。

- 1 つの Renderer の中では、いちばん手前の面だけが見えます。自分の裏側の面が透けて
  まだらに見えることはありません。
- 半透明の Renderer どうしが重なっても、描く順番によらず同じ色になります。
- ラベルの **Label on top** を ON にしたものは、半透明の Renderer の上に表示されたままになります。
- 半透明の Renderer はアンビエントオクルージョンの陰影を落としません。分子を半透明の表面で
  包んでも、中の構造が暗くなりません。半透明の Renderer 自身にも、アンビエントオクルージョンは
  掛かりません。

レンダリングウィンドウでの重ね方の設定は、[レンダリング](../rendering.md#transparency) の
**Transparency** を参照してください。

## エッジライン

Edge type
:   エッジ線の種類 (None / Edges / Silhouette)

Width
:   エッジ線の太さ (Å 単位)

Color
:   エッジ線の色

面を持たない Renderer (simple / trace / spline / contour / gpu_mapmesh、選択のハイライト、
単位格子、[namelabel](namelabel.md)) には、エッジラインの設定は表示されません。
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

*確認対象: CueMol3 3.0.5.576*
