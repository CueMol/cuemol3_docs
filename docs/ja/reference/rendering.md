# レンダリング

[レンダリングウィンドウ](../ui/rendering-window.md)でレイトレーシング出力を行うときの設定項目です。
CueMol3 の既定のレンダリングバックエンドは、内蔵レイトレーサ **Umbreon** です。

Umbreon は可視化ライブラリ (libcuemol2) に組み込まれているため、**外部プログラムの用意も
パスの設定も不要**です。ウィンドウの開き方や実行の手順は
[レンダリングウィンドウ](../ui/rendering-window.md)を参照してください。

## バックエンド

レンダリングウィンドウ下部の実行バーの **Backend** で選びます。

| Backend | 内容 |
|---|---|
| Umbreon | 内蔵レイトレーサ。**既定**。外部プログラム不要 |
| Umbreon (NPR) | 同じレイトレーサで、陰影をハッチングで表すインク画風の出力 → [NPR (インク画風レンダリング)](rendering-npr.md) |
| POV-Ray | 旧バックエンド。**非推奨** |

配布されているビルドには Umbreon が組み込まれているため、ウィンドウを開いた時点で
Umbreon が選ばれています。手で切り替えた選択は、ほかの設定と同じくシーンに保存されます
(→ [設定の保存](#設定の保存))。

このページで扱うのは写実的な出力を行う **Umbreon** の設定です。Umbreon (NPR) の
Hatching グループと Detail タブについては
[NPR (インク画風レンダリング)](rendering-npr.md) を参照してください
(Quality の Lighting と Supersampling、個別の設定は共通です)。

!!! info "POV-Ray は当面のあいだ残します"
    POV-Ray は CueMol2 から使われてきたバックエンドですが、CueMol3 では非推奨です。
    外部の POV-Ray 本体を別途必要とし、Umbreon にある陰影の機能 (アンビエントオクルージョン /
    大域照明) がありません。過去のシーンを同じ見た目で再現したい場合のために選択肢として
    残していますが、新しく作る画像では Umbreon をお使いください。

    POV-Ray を使う場合は、実行ファイルのパスを Settings で設定してください
    (→ [外部ツールの設定](../install/external-tools.md))。

### Umbreon で使われない共通設定

**Image** タブと **Camera** の設定のうち、次の項目は Umbreon が参照しません。
Umbreon を選んでいるあいだは設定欄そのものが隠れます。

| 項目 | 隠れる理由 |
|---|---|
| Stereo mode / Stereo depth | Umbreon は立体視出力に対応していません |
| CPU threads | Umbreon はプロセス内で並列に描画するため、スレッド数の指定を受け付けません |
| Post-render alpha blending | 半透明の合成を Umbreon 自身が行うため、外部の blendpng を使いません |
| Pixel labels | POV-Ray 専用の機能です |

## Quality (品質)

**Render** タブの先頭にあるセクションです。品質は 1 本のつまみではなく、**互いに独立した
軸**の組み合わせで決まるため、軸ごとに 1 つのドロップダウンが用意されています。

Lighting
:   陰影の付け方。既定は **Global Illumination**

Supersampling
:   基本画質。既定は **3x**

AO quality
:   アンビエントオクルージョンの品質。Lighting が Ambient Occlusion のときだけ表示されます

GI lighting
:   大域照明の光の配分。Lighting が Global Illumination のときだけ表示されます

Shadows
:   影の落とし方。既定は **Off**

各ドロップダウンは、下の個別設定の値をまとめて書き換えます。逆に個別設定を手で変更すると、
その値に一致する段がなくなるため、その軸の表示は **Custom** に変わります。

### Lighting

分子の凹んだ部分を暗く、出っ張った部分を明るくして立体感を出す方法を選びます。

| Lighting | 内容 |
|---|---|
| Raytrace only | 陰影付けなし。もっとも高速で、平坦な見た目になります |
| Ambient Occlusion | 周囲の遮蔽から陰影を求めます |
| Global Illumination | 光の跳ね返りを追跡して陰影を求めます (**既定**) |

Ambient Occlusion と Global Illumination は**どちらか一方**しか選べません。
どちらも同じ目的 (陰影による立体感) を別の方法で達成するものだからです。

!!! tip "既定が Global Illumination である理由"
    Global Illumination はノイズ除去 (デノイザ) を内蔵しているため、サンプル数が少なくても
    きれいに仕上がります。同程度の立体感を出す場合、Ambient Occlusion の High より
    はるかに短時間で済みます。

### Supersampling

出力サイズの整数倍で描画してから縮小することで、輪郭のギザギザを抑えます。

| Supersampling | 内容 |
|---|---|
| 1x (off) | 拡大なし。もっとも高速 |
| 2x | |
| 3x | **既定** |
| 4x | もっとも高品質 |

計算量は**倍率の 2 乗**で増えます (4x は 1x の 16 倍)。

[エッジライン](renderers/edge-lines.md)の品質もこの倍率で決まります。エッジ線が
ギザギザに見える場合は、まずここを上げてください。既定が 3x なのはこのためです。

### AO quality

Lighting が **Ambient Occlusion** のときに表示されます。

| AO quality | 内容 |
|---|---|
| Low | サンプル数を抑えた下書き向け |
| Medium | 標準 (**既定**) |
| High | 陰影を 1 点ごとに厳密に計算します |

!!! warning "High は極端に時間がかかります"
    Low と Medium は出力ピクセル単位でまとめて計算しますが、High は描画点ごとに
    計算し直すため、Medium との差は数十倍になります。仕上げの 1 枚以外では
    Medium で十分です。

### GI lighting

Lighting が **Global Illumination** のときに表示されます。正面からの光 (ヘッドライト) の
エネルギーを、斜め上からのキーライトと大域照明の照り返しにどれだけ移すかを段階で選びます。

| GI lighting | 内容 |
|---|---|
| 0 (raytrace match) | Raytrace only と同じ配光。大域照明の照り返しは最小になります |
| 1 | |
| 2 | |
| 3 | |
| 4 (max GI) | ヘッドライトをほぼ消し、キーライトと照り返しで陰影を付けます (**既定**) |

段を変えても**平均の明るさは変わりません**。変わるのは陰影の付き方です。ノイズの少なさは
この軸ではなく、個別設定の **GI samples** で決まります。段は個別設定の Light intensity /
Flash fraction / Ambient fraction をまとめて書き換えるもので、これらを手で変えると表示が
**Custom** に変わります。

### Shadows

光源からの落ち影です。Lighting とは独立に設定できます。

| Shadows | 内容 |
|---|---|
| Off | 影なし (**既定**) |
| Hard | 輪郭のはっきりした影 |
| Soft | ぼけた影 |
| Very soft | よりぼけた影 |

!!! note "影はメッシュにのみ落ちます"
    球や円柱で描かれる部分 ([cpk](renderers/cpk.md) や [ballstick](renderers/ballstick.md) の
    原子・結合) には影が落ちません。分子の表現では Lighting だけで立体感が出るため、
    既定は Off です。

## 個別の設定

Quality セクションの下にあるアコーディオンです。プリセットで足りない場合にここを開きます。
個別に変更すると、対応する軸の表示が Custom に変わります。

### Antialiasing

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Supersampling | 3 | 1〜8 | Quality の Supersampling と同じ値です |

### Lights

Lighting の方式によらず効く光源の設定です。Umbreon (NPR) にも同じグループがあります。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Light intensity | 1.2 | 0〜3 | 光源全体の強さ |
| Flash fraction | 0.05 | 0〜1 | 直接光のうち、視点方向からのヘッドライトに割り当てる割合。残りが斜め上からのキーライトになります。小さいほど陰影がはっきりします |

Lighting が Global Illumination のときは **GI lighting** の段がこの 2 つを書き換えます。
Raytrace only か Ambient Occlusion を選ぶと 1.55 / 0.6 に戻ります。Umbreon (NPR) の既定も
1.55 / 0.6 です。

### Ambient Occlusion

Lighting が Ambient Occlusion のときだけ表示されます。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| AO samples | 64 | 1〜256 | 1 点あたりのサンプル数。多いほど滑らかで低速 |
| AO distance (0 = auto) | 0 | 0〜1000 | 遮蔽を探す半径。0 でシーンの大きさから自動的に決めます |
| AO intensity | 1.0 | 0〜1 | 陰影の強さ |
| AO on direct light | 1.0 | 0〜1 | 直接光にも陰影を掛ける割合。0 にすると陰影がほとんど見えなくなります |
| Multi-scale AO | ON | | 大小の半径を組み合わせ、細かい凹凸と全体の形の両方を強調します |
| Bent normal | ON | | 遮蔽の方向を考慮して環境光を当てます |
| Low-discrepancy sampling | ON | | サンプルを均等に散らしてノイズを減らします |
| AO gather | Per output pixel | | 陰影の計算単位。**Per output pixel** は出力ピクセル単位 (高速)、**Per shading hit** は描画点ごと (厳密・低速) |

!!! tip "AO distance は 0 (自動) のままで構いません"
    0 のときはシーン全体の大きさから半径を導出するため、小さなペプチドでも大きな複合体でも
    同じように陰影が付きます。特定の半径に固定したい場合だけ正の値を入れてください。

### Shadows

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Cast shadows | OFF | | 影の有無 |
| Shadow samples | 1 | 1〜64 | 影のサンプル数。多いほど滑らかで低速 |
| Light radius (deg) | 0.0 | 0〜30 | 光源の見かけの大きさ (度)。0 より大きくするとぼけた影になります |

Light radius を大きくするほど影の縁が広くぼけ、ノイズも出やすくなるため、
あわせて Shadow samples を増やしてください。

### Edges

[エッジライン](renderers/edge-lines.md)の描き方に関する、Umbreon 固有の設定です。
エッジ線の**有無・太さ・色**は Renderer 側の共通プロパティで指定します。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Crease angle (deg) | Off | Off / 15 / 30 / 45 / 60 / 90 / 120 | 折れ線として描く面の折れ角の下限 (度)。Edge type が Edges のときに効き、角度を大きくするほど、はっきりした折れ目だけが描かれます。Off で折れ線を描きません |
| Contact edges | ON | | 別々の Renderer が交わる線を描きます (下記) |
| Outline far depth | 0.2 | 0〜1 | Edge type が Silhouette のとき、フォグで薄れた面の奥にある輪郭を描き始める深さ。フォグの範囲に対する割合で、0 がビュー中心、1 がフォグの終端です |

**Contact edges** は、ある Renderer の形状が別の Renderer の表面に突き刺さっている箇所
(たとえば ribbon に入り込む ballstick の結合) の交線を描きます。エッジ線の設定
(種類・太さ・色) が同じ Renderer はひとまとまりとして扱われ、交線はまとまりの間にだけ
描かれます (1 つの cartoon を構成する Renderer どうしの間には描かれません)。
分子ビューにはこの交線は描かれません。この設定を OFF にすると交線が描かれなくなり、
Edge type が Silhouette の Renderer では、他の Renderer と接する部分で輪郭が途切れます。

### Global Illumination

Lighting が Global Illumination のときだけ表示されます。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| GI samples | 32 | 8 / 32 / 64 / 256 | 1 ピクセルあたりのサンプル数。多いほどノイズが減り低速 |
| Denoise | OIDN | | ノイズ除去の方法。**OIDN** / **A-trous** / **None** |
| Ambient fraction | 0.4 | 0〜1 | 光全体のうち、大域照明の照り返しとして集める割合。**GI lighting** の段が書き換えます |
| Sky gradient | ON | | 照り返しの光源となる空を、上が白く下が Ground color に近づくグラデーションにします。面の向きによって照り返しの明るさが変わるようになります (全体の明るさは変わりません) |
| Ground color | #666666 | | Sky gradient の地面側の色 |

Denoise を None にすると、GI samples を大きくしない限りざらついた画像になります。
通常は OIDN のままにしてください。

## エッジラインとマテリアル

Renderer 側の共通プロパティのうち、レイトレーシング出力にだけ効くものがあります。

[マテリアル](renderers/material.md)
:   Umbreon はマテリアル名から質感を解決します。POV-Ray とは一部の質感が異なります

[エッジライン](renderers/edge-lines.md)
:   Edge type の **Silhouette** は、Umbreon では**外周の輪郭だけ**を描くモードになります。
    **Edges** は輪郭に加えて内側の折れ線も描きます。
    エッジ線は分子ビューにも描かれ、できるだけ同じ見た目になるよう調整されています

## コマンドラインでのレンダリング

GUI を使わずにシーンファイル (`.qsc`) から画像を書き出すこともできます。
どちらの経路も Umbreon を使います。

```sh
cuetty --input scene.qsc --render out.png --width 1920 --height 1080
```

```sh
python -m cuemol.umbreon_render scene.qsc out.png -W 1920 -H 1080
```

`--camera` (`-c`) でシーンに保存されたカメラを指定できます。省略した場合は、
GUI がシーン保存時に書き込む現在のビュー (`__current`) を使います。

どちらも、シーンに保存されたレンダリングウィンドウの設定 (→ [設定の保存](#設定の保存))
をそのまま使って描画します。設定が保存されていないシーンは既定値 (Lighting が
Global Illumination、1200×1200 px) で描画され、投影方式はカメラのものに従います。
`--width` / `--height` (`-W` / `-H`) は保存されたサイズを上書きします。

!!! warning "原子ラベルなどの文字は描画されません"
    ラベルの入った図が必要な場合はレンダリングウィンドウをお使いください。

## 設定の保存

レンダリングウィンドウの設定 (Backend の選択と Image / Render / Detail タブの内容) は
**シーンに保存され**、シーンファイル (`.qsc`) と一緒に読み書きされます。Target を
切り替えると、そのシーンの設定が表示されます。書き込まれるのは既定値から変えた値だけです。

設定の変更はシーンの編集として Undo の対象になります。レンダリングウィンドウ内でも
++cmd+z++ / ++cmd+shift+z++ (Windows / Linux では ++ctrl+z++ / ++ctrl+y++) が効きます
(テキスト入力欄にフォーカスがあるときは入力欄の取り消しになります)。

レンダリング結果の履歴には実行時の設定が一緒に記録されています。履歴の矢印で切り替わる
のは画像だけで、**Use settings** ボタンを押すと、その画像を描いたときの設定がエディタと
シーンに戻ります (1 回の Undo で戻せます) (→ [レンダリングウィンドウ](../ui/rendering-window.md))。
動画の出力先の設定はシーンではなくアプリケーション側に保持され、次にウィンドウを
開いたときにも残ります。

## 関連項目

- [レンダリングウィンドウ](../ui/rendering-window.md) — ウィンドウの構成と操作
- [NPR (インク画風レンダリング)](rendering-npr.md) — Umbreon (NPR) バックエンドの設定
- [Rendering メニュー](../menu/rendering.md) — メニュー項目と Export scene
- [マテリアル](renderers/material.md) / [エッジライン](renderers/edge-lines.md)
- [Scene](scene.md) — 分子ビュー側のアンビエントオクルージョンとアンチエイリアシング
- [設定項目](settings.md) — Settings タブの全項目

---

*確認対象: CueMol3 2.3.13.523*
