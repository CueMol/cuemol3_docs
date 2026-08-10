# ShowHideAnim (表示・非表示)

Renderer を半透明にしながら徐々に表示・非表示にするアニメーションです。
オプションで、半透明にせず突然切り替えることもできます。

!!! info "準備中"
    このページは骨組みのみです。各項目の詳細は今後追加されます。

## プロパティ

共通のプロパティ (名前・開始時刻・継続時間など) は
[アニメーション](index.md#共通のプロパティ) を参照してください。

Target renderers
:   表示・非表示を切り替える対象の Renderer

Show/Hide
:   表示にするか非表示にするか

Fade
:   ON にすると不透明度を連続的に変化させます。
OFF にすると瞬間的に切り替わります

Target opacity
:   変化後の不透明度

<!-- TODO(content): showhide の各項目の値の範囲・既定値を
     AnimElementInspector.tsx と C++ の qif 定義から起こす -->

## 関連項目

- [アニメーションの一覧](index.md)
- [下部パネル](../../ui/bottom-panels.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
