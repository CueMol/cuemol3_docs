# MolAnim (構造変化)

同一分子の異なる 2 つの構造の間を補間して、変形 (morphing) を
アニメーションとして表示します。線形補間による変形で、
局所的な構造変化のアニメーション化に向いています。

!!! warning "作成用のツールは現在動作しません"
    Tools メニューの **Mol morphing animation...** は
    現在のバージョンでは動作しません
    (→ [開発状況と未実装機能](../../changes/status.md))。
    CueMol2 で作成したシーンを読み込んだ場合には再生・編集できます。

!!! info "準備中"
    このページは骨組みのみです。各項目の詳細は今後追加されます。

## プロパティ

共通のプロパティ (名前・開始時刻・継続時間など) は
[アニメーション](index.md#共通のプロパティ) を参照してください。

Target MorphMol
:   変形を表す MorphMol Object。補間する構造の組を保持します

Start value
:   補間パラメータの開始値

<!-- TODO(content): molanim の各項目の値の範囲・既定値を
     AnimElementInspector.tsx と C++ の qif 定義から起こす -->

## 関連項目

- [アニメーションの一覧](index.md)
- [下部パネル](../../ui/bottom-panels.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
