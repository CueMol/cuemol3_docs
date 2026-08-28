# DensityMap (密度マップ)

電子密度マップなどの 3 次元スカラー場を保持する Object です。

!!! info "準備中"
    このページは骨組みのみです。プロパティの一覧は今後追加されます。

## 作成

File メニューの **Open File...** で密度マップファイルまたは
構造因子ファイルを読み込むか、**Get PDB...** で取得します
(→ [File メニュー](../../menu/file.md))。

## プロパティ

<!-- TODO(content): densitymap のプロパティ表 (名前 / 型 / 説明) を
     C++ の qif 定義とインスペクタから起こす -->

<!-- TODO(content): cryo-EM マップモード (2.3.11.507 で追加)。map_type
     (Auto (from header) / Crystallographic (periodic) / Cryo-EM (whole map,
     level of detail)。読み込み後はインスペクタの Generic タブから変更する) と、
     MRC の ORIGIN の読み取り。仕様が変わる可能性があるため保留 -->

## 対応する Renderer

[contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) /
[gpu_mapmesh](../renderers/gpu_mapmesh.md)

表示範囲や等高線レベルは Density map パネルからも調整できます
(→ [サイドパネル](../../ui/side-panels.md))。

## 関連項目

- [Object の一覧](index.md)
- [Renderer](../renderers/index.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
