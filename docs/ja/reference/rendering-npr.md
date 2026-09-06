# NPR (インク画風レンダリング)

**Umbreon (NPR)** は、写実的なレイトレーシングの代わりに、陰影を**ハッチング**
(線や点の集まり) で表すレンダリングバックエンドです。紙の上にインクで描いた図に
仕上がります。

内蔵の Umbreon をそのまま使うため、[レンダリング](rendering.md)と同じく
外部プログラムの用意もパスの設定も不要です。

!!! info "撮影予定"

<!-- TODO(screenshot): Umbreon (NPR) で出力したタンパク質の図 (richardson スタイル) -->

## 使い方

[レンダリングウィンドウ](../ui/rendering-window.md)の実行バーの **Backend** で
**Umbreon (NPR)** を選びます。Render タブに **Hatching** のセクションが現れ、
Render Settings に **Detail** タブが追加されます。

まず Hatching の **Style** で全体の描き味を選び、必要なら **Mark density** と
**Mark width** で線や点の密度と太さを加減します。ここまでで足りない場合に、
Detail タブでスタイルの中身を編集します。

## Hatching (Render タブ)

| 項目 | 既定値 | 説明 |
|---|---|---|
| Style | richardson | 描き味のテンプレート (下記) |
| Coloring | Style default | インクと紙の色の組み合わせ方 (下記) |
| Mark density | 1.0 (0.25〜4) | 線・点の間隔をまとめて割る倍率。2 にすると本数・点の数が倍になります |
| Mark width | 1.0 (0.25〜4) | 線の太さと点の大きさの倍率 |
| Custom ink color / Ink color | OFF / `#000000` | ON のときだけインクの色を明示します |
| Custom paper color / Paper color | OFF / `#ffffff` | ON のときだけ紙の色を明示します |
| Default contour edges | ON | エッジラインを設定していない Renderer にも輪郭線を描きます |

Mark density と Mark width は、スタイルが持つレイヤごとの値に**一律に掛かる倍率**です。
複数のレイヤからなるスタイルでも、レイヤ間の間隔の比は保たれます。

### Style

はじめの 3 つ (richardson / ink-cross / manga) は、階調の作り方とインクの色まで含めて
1 つの絵柄を決めます。残りの 6 つは**マークの並べ方**だけを決めるもので、紙とインクの色は
Coloring で選びます。

| Style | 内容 |
|---|---|
| richardson | Jane Richardson 風の色鉛筆リボン図。紙の下地に Object の色のインク、同一色相の 3 本の鉛筆、明るい部分は紙のまま (**既定**) |
| ink-cross | 素のペン画。白い紙に黒のクロスハッチング |
| manga | 部位ごとのベタ塗り + スクリーントーンの点と硬いインク線 |
| pen-cross | 硬いクロスハッチングの線を 3 枚 (45 / -45 / 0 度)、揺らぎなし |
| pencil | 柔らかい鉛筆の線を 2 枚。揺らぎ、太さの変化、先細りのストローク、紙の目 |
| engraving | 1 方向の線を細かく分割した銅版画風 |
| stipple | 大きさの揃った点をばらまき、点の数で階調を表す (科学図の点描) |
| screentone-60 | 45 度の網点スクリーン |
| manga-square | 45 度の角ドットスクリーン |

### Coloring

インクと下地 (紙 / 塗り) の組み合わせを、スタイルとは独立に選びます。

| Coloring | 内容 |
|---|---|
| Style default | スタイル自身の設定に任せます (**既定**) |
| Ink on paper | 紙の上に黒インク。ペン画 |
| Colored ink on paper | 紙の上に色付きのインク。色鉛筆画 |
| Ink on color fill | Renderer の色でベタ塗りした上に黒インク。コミック調 |
| Colored ink on color fill | ベタ塗りの上に色付きのインク。印刷物風 |

!!! note "Style default 以外を選ぶと、スタイルの色は使われません"
    richardson は暖色の紙と部位ごとのインク色を自前で持っています。Coloring で
    明示的な組み合わせを選ぶと、それらは上書きされます。逆に、マークの並べ方だけを
    決める Style (pen-cross 以下) を **Style default** のまま使うと、白い紙に黒インクの
    組み合わせに固定されます。

### Quality の違い

Umbreon (NPR) の **Quality** セクションは、写実側の Umbreon から次の点が異なります。

- **Lighting** は **Raytrace only** (**既定**) と **Ambient Occlusion** の 2 つだけです。
  ハッチングを行うと大域照明は無効になるため、**GI lighting の軸はありません**。
- **Supersampling** の意味は同じです。ハッチングの最小間隔は出力ピクセルではなく
  スーパーサンプリング後の格子で決まるため、細かいスタイルではここを上げると効きます。

そのほかの個別設定 (Lights / Ambient Occlusion / Shadows / Edges) は
[レンダリング](rendering.md#個別の設定)と共通です (Lights の既定値だけは Light intensity 1.55 /
Flash fraction 0.6 と、写実側の Umbreon と異なります)。

## Detail タブ

Render タブで選んだ Style を**テンプレートとして読み込み**、その中身を編集します。
タブ上部に `Style template: <スタイル名>` と表示されます。

- 編集すると **Edited** のバッジが付きます。
- **Reset to style** でテンプレートの状態に戻ります。
- Render タブで Style を切り替えると、編集内容は確認なしで破棄されます。

!!! note "編集内容はシーンに保存されます"
    Detail タブの編集内容は、ほかのレンダリング設定と同じくシーンに保存されます
    (→ [設定の保存](rendering.md#設定の保存))。未編集のスタイルは、この機能が無かったときと
    まったく同じ経路で描画されます。

<!-- TODO(screenshot): Detail タブ (Layers セクションを展開し、Edited バッジが出た状態) -->

### Layers

ハッチングは複数の**レイヤ**を重ねて作ります。レイヤごとに 1 つの格子があり、
その上に線や点を並べます。セクション見出しの **Line** / **Dot** ボタンでレイヤを追加、
各レイヤの見出しから複製・削除ができます。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Kind | | | **Line** (線) / **Dot screen** (網点) / **Stipple** (点描) |
| Angle | 45 | -180〜180 度 | 格子の向き |
| Spacing | 10 | 0.25〜64 px | 格子の間隔 |
| Width | 1.1 | 0.1〜8 px | 線の太さ (Line のみ) |
| Dot scale | 1 | 0.1〜8 | 点の大きさ (Dot screen / Stipple のみ) |
| Tone high | 0.95 | 0〜1 | 最初のマークが現れる明るさ |
| Tone low | 0.55 | 0〜1 | 最後のマークが現れる明るさ。これより暗くてもマークは増えません |
| Fade (0 = auto) | 16 | 0〜64 | マークが現れてから最大の大きさになるまでの速さ。0 で自動 |
| Opacity | 1 | 0〜1 | レイヤの不透明度 |
| Ink darkness | 1 | 0〜1 | インクの濃さ |

**Randomness / Advanced** を開くと、手描きらしさを出す揺らぎと、より細かい形状の設定が
並びます。Kind に関係のない項目は表示されません。

| Kind | Randomness / Advanced の項目 |
|---|---|
| 共通 | Edge softness / Seed / Position jitter / Paper tooth / Tooth scale |
| Line / Dot screen | Nesting levels |
| Line | Wobble / Wobble wavelength / Width jitter / Stroke length / Stroke gap / Stroke taper / Angle jitter / Length jitter |
| Dot screen / Stipple | Shape exponent / Aspect / Dot angle |
| Dot screen | Merge to solid |

**Nesting levels** は格子の入れ子の段数です。暗くなるにつれて、既にあるマークの**間に**
新しいマークが挿入されていきます。マークが消えたり動いたりすることはないので、
明るさが連続的に変わってもちらつきません。

### Shading

明るさをどれだけのインク量に変換するかを決めます。常に表示されるのは 2 つです。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Strength | 1 | 0.25〜3 | インク量の全体的な増減。上げると全体が濃くなります |
| Curve | 1 | 0.5〜2 | 中間調の寄せ方 |

**Advanced** には、階調の作り方 (Diffuse weight / Ambient / Wrap / Contour darkening /
Contour power / Contour light bias / Contact AO / Shape AO / Black point / White point /
Highlight knee / Highlight softness / Gamma / Specular cut / Tone levels) と、
インクのモデル (Mode / Base / Ink / Ink color / Paper color / Min contrast / Ink shade /
Tone fog / Fill posterize) が入っています。

!!! tip "全体が薄いときは Strength を上げます"
    分子ビューの照明は明るく平坦なため、スタイルによっては既定のままだと
    ハッチングが疎になります。まず Strength、次に Curve を調整してください。

### 効かない設定は出ません

画に影響しない項目は、**隠れる**か**無効**になります。

- その Kind に対応しない項目 (Dot screen での Stroke length など) は表示されません。
- 他の値によって無効になる項目は、押せない状態で残ります
  (Contour darkening が 0 のときの Contour power、揺らぎを使っていないときの Seed など)。
- Spacing がスーパーサンプリング後の最小間隔 (2 px) に達したレイヤは、その旨を表示します。
  Supersampling を上げると解消します。

### 実効値の表示

Mark density と Mark width は Render タブ側の倍率のままで、レイヤの値には焼き込まれません。
倍率が 1 でないとき、Detail タブは**倍率を掛けたあとの値**を併せて表示します。
編集を巻き戻せる形にするためです。

## 関連項目

- [レンダリング](rendering.md) — Umbreon (写実) の設定項目
- [レンダリングウィンドウ](../ui/rendering-window.md) — ウィンドウの構成と操作
- [エッジライン](renderers/edge-lines.md) — Renderer 側の輪郭線の設定

---

*確認対象: CueMol3 2.3.13.523*
