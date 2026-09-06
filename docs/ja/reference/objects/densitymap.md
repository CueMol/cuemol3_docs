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

### マップの種類 (Map type)

結晶学的マップ (周期的) とクライオ電子顕微鏡マップ (非周期的) を区別して扱います。
種類はファイルのヘッダから自動的に判別され、表示範囲の既定値
(→ [contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) の **Region**)、
等高線レベルの単位 (下記)、Renderer に適用される既定のスタイル (*Default* / *Cryo-EM*)
がこれで決まります。

判別結果を変えたいときは、ファイルを開くときのオプション画面 (CCP4/MRC の場合) の **Map type** で
*Auto (from header)* / *Crystallographic (periodic)* / *Cryo-EM (whole map, level of detail)*
のいずれかを指定します (→ [File メニュー](../../menu/file.md))。読み込んだあとは
プロパティインスペクタの **Properties** タブの **Density map** セクションにある **Map type**
で変更できます。判別の結果は同じセクションの **Effective kind** に表示されます。
Map type を変えると、contour / isosurf のスタイルも *Default* と *Cryo-EM* の間で
入れ替わります (自分で別のスタイルにした Renderer は変わりません)。

等高線レベルは、マップの種類に応じた単位で持ちます。結晶学的マップでは σ (マップの
標準偏差を 1 とする単位、既定 1.1)、クライオ電子顕微鏡マップでは格子点の値の上位何 % を
囲むか (既定は上位 1 %) です。Density map パネルの **Level** では、この単位でも
絶対値でも指定できます (→ [サイドパネル](../../ui/side-panels.md))。

MRC ファイルの ORIGIN も読み込むので、原点が 0 でないマップも、そこに当てはめた
モデルと正しく重なります。

## 対応する Renderer

[contour](../renderers/contour.md) / [isosurf](../renderers/isosurf.md) /
[gpu_mapmesh](../renderers/gpu_mapmesh.md)

表示範囲や等高線レベルは Density map パネルからも調整できます
(→ [サイドパネル](../../ui/side-panels.md))。

## 関連項目

- [Object の一覧](index.md)
- [Renderer](../renderers/index.md)

---

*確認対象: CueMol3 2.3.13.523*
