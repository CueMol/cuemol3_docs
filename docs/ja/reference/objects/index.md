# Object

**Object** は、分子構造や電子密度マップなどのデータを保持する要素です。
Object 自体は画面への表示を行わず、表示は Object に取り付けられた
[Renderer](../renderers/index.md) が担当します。

Object はシーン内で一意な**名前**を持ちます。ファイルを読み込んで Object を作成するとき
などに名前が決まり、同名の Object がすでに存在する場合はエラーになります。

## 種類の一覧

| クラス | 説明 | 作成方法 | 主な Renderer |
|---|---|---|---|
| [MolCoord](molcoord.md) | 分子構造 (原子座標) | File &gt; Open File... / Get PDB... | [ribbon](../renderers/ribbon.md) ほか分子系すべて |
| [DensityMap](densitymap.md) | 電子密度マップなどのスカラー場 | File &gt; Open File... / Get PDB... | [contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) |
| [ElePotMap](elepot.md) | 静電ポテンシャルマップ | Tools &gt; APBS elepot calculation... / OpenDX の読み込み | [contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) |
| [MolSurfObj](molsurf.md) | 分子表面 (SES) | Tools &gt; Mol surface generation... / MSMS・PLY の読み込み | [molsurf](../renderers/molsurf.md) |

DensityMap と ElePotMap はどちらもスカラー場 (ScalarObject) の一種で、
密度マップ用の Renderer はどちらにも取り付けられます。

<!-- TODO(verify): MD トラジェクトリ (Open MD Trajectory...) の読み込みで生成される
     Object のクラス。MolCoord 派生ならこのページに節を追加、別クラスならページを追加する -->

## Object の操作

- **作成** — File メニューからファイルを読み込む、または Tools メニューの生成系ツールを使う
  (→ [File メニュー](../../menu/file.md)、[Tools メニュー](../../menu/tools.md))
- **保存** — File &gt; Save File As... で Object 単体をファイルに書き出せます。
  対象になるのは対応する保存形式を持つ Object だけです
- **削除・名前の変更・コピー** — シーンツリーの右クリックメニュー
  (→ [サイドパネル](../../ui/side-panels.md))
- **プロパティの編集** — プロパティインスペクタ
  (→ [プロパティインスペクタ](../../ui/inspector.md))

## 関連項目

- [Renderer](../renderers/index.md)
- [対応ファイル形式](../../getting-started/index.md#対応ファイル形式)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
