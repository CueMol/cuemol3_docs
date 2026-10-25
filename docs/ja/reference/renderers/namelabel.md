# namelabel (名前ラベル)

分子ビューで原子に名前のラベルを付ける Renderer です。対象 Object: 分子 (MolCoord)。

!!! note "ラベルを付けると自動的に作成されます"
    namelabel は、分子ビューで原子をクリックして名称を表示したときに自動的に作られる
    内部用の Renderer です。シーンツリーでは名前のない `(*namelabel)` の行として表示されます
    (→ [分子を読み込んで表示する](../../tutorials/basic/loading.md))。
    New Renderer ダイアログの一覧には表示されません。

!!! info "準備中"
    表示例の図は今後追加されます。

## 概要

<!-- TODO(screenshot): namelabel の表示例 (揃え位置を変えたラベル) -->

ラベルの文字は画面上に描かれる平面の文字で、3D の形状を持ちません。このため、
プロパティインスペクタに[エッジライン](edge-lines.md)の設定は表示されません。

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Name label

| 項目 | 既定値 | 説明 |
|---|---|---|
| Format | (空) | ラベルの文字の書式。空のときは `{chain} {resn}{resi} {name}` の形になります |
| Color | 黄 | ラベルの文字の色 |
| Label on top | OFF | ON にすると、手前にある形状に隠されず、常にラベルが見えます |
| Max labels | 50 | ラベルの数の上限 (1〜1000)。超えると古いものから消えます |
| Horizontal align | Left | ラベルのどの位置を原子に合わせるか (横方向: Left / Center / Right) |
| Vertical align | Bottom | ラベルのどの位置を原子に合わせるか (縦方向: Top / Middle / Bottom) |
| Offset X / Offset Y | 0 px | ラベルを原子の位置から画面上でずらす量 (-100〜100 px) |

- **Format** には、`{resn}{resi} {name}` のように `{}` で囲んだ項目名を並べます。
  使える項目名は[選択式](../selection.md)の語と同じで、`name` (原子名)・`resn` (残基名)・
  `resi` (残基番号)・`chain` (チェイン名)・`elem` (元素記号)・`bfac` (B-factor)・
  `occ` (占有率)・`alt` (altloc)・`aid` (原子 ID)・`molname` (分子名) です。
  `{bfac:.2f}` のように、`:` の後ろに数値の書式を付けられます。
- **Format** は、書式を持たないラベルの既定の文字です。ラベルが個別に書式や文字を
  持っている場合 (Console の `label` コマンドで付けたものなど) は、そちらが使われます。
- **Horizontal align** / **Vertical align** の既定 (Left / Bottom) は、ラベルの左下が
  原子に来る従来の配置です。原子の位置を **Offset X** / **Offset Y** でずらした点が基準になります。

### Font

| 項目 | 既定値 | 説明 |
|---|---|---|
| Font size | 12 pt | 文字の大きさ (1〜72 pt) |
| Font name | sans-serif | システムにインストールされているフォントの一覧から選びます |
| Font style | Normal | Normal / Italic |
| Font weight | Normal | Normal / Bold |

新しく作られるラベルの色とフォントの既定は、**Settings** の **Atom Labels** で変えられます
(→ [設定項目](../settings.md#atom-labels))。

## 制限事項

- 揃え位置 (Horizontal align / Vertical align) は POV-Ray の出力にも反映されますが、
  LW viewer への出力では反映されず、ラベルは左下揃えのままです。
- [コマンドラインでのレンダリング](../rendering.md#コマンドラインでのレンダリング)では、
  ラベルは描かれません。

## 関連項目

- [Renderer の一覧](index.md)
- [atomintr (計測表示)](atomintr.md) — 計測値のラベル
- [設定項目](../settings.md#atom-labels)

---

*確認対象: CueMol3 2.3.21.544*
