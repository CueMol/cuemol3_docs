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
| POV-Ray | 旧バックエンド。**非推奨** |

配布されているビルドには Umbreon が組み込まれているため、ウィンドウを開いた時点で
Umbreon が選ばれています。一度手で切り替えると、その選択がウィンドウを閉じるまで残ります。

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

GI quality
:   大域照明の品質。Lighting が Global Illumination のときだけ表示されます

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

### GI quality

Lighting が **Global Illumination** のときに表示されます。

| GI quality | 内容 |
|---|---|
| Low | 下書き向け |
| Medium | 標準 (**既定**) |
| High | |
| Reference | 最終出力向け |

段を上げても**明るさや陰影のコントラストは変わりません**。変わるのはノイズの少なさだけです。
下書きで構図と明るさを決めてから最後に段を上げる、という使い方ができます。

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

### Ambient Occlusion

Lighting が Ambient Occlusion のときだけ表示されます。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Enable AO | OFF | | Lighting セレクタが操作するため、通常は直接触りません |
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
| Crease limit | -1.0 | -1〜180 | 折れ線とみなす角度 (度)。-1 で自動 |
| Edge rise | 0.5 | 0〜5 | POV-Ray 用の設定です。**Umbreon では使われません** |
| Contact edges | OFF | | 別々の Renderer が交わる線を描きます (下記) |

**Contact edges** は、ある Renderer の形状が別の Renderer の表面に突き刺さっている箇所
(たとえばリボンに入り込む棒球モデルの結合) の交線を描きます。既定では、この交線は
Umbreon でも分子ビューでも描かれません。そのため Edge type が Silhouette の Renderer では、
他の Renderer と接する部分で輪郭が途切れます。この設定を ON にすると、その線が描かれます。

### Global Illumination

Lighting が Global Illumination のときだけ表示されます。

| 項目 | 既定値 | 範囲 | 説明 |
|---|---|---|---|
| Enable GI | OFF | | Lighting セレクタが操作するため、通常は直接触りません |
| GI samples | 32 | 1〜256 | 1 ピクセルあたりのサンプル数。多いほどノイズが減り低速 |
| GI intensity | 1.0 | 0〜3 | 間接光の強さ |
| GI environment | 1.0 | 0〜3 | 環境光の強さ |
| Denoise | OIDN | | ノイズ除去の方法。**OIDN** / **A-trous** / **None** |

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

!!! warning "指定できるのはサイズとカメラだけです"
    それ以外の設定は既定値 (Supersampling 3 / アンビエントオクルージョン・影・大域照明は
    いずれも無効) に固定されます。また、**原子ラベルなどの文字は描画されません**。
    細かく指定したい場合はレンダリングウィンドウをお使いください。

## 設定の保存

レンダリングウィンドウの設定は、**ウィンドウを閉じると初期値に戻ります**。
シーンファイルにも保存されません。

ただし、レンダリング結果の履歴には実行時の設定が一緒に記録されており、結果画像を
さかのぼると設定も一緒に復元されます (→ [レンダリングウィンドウ](../ui/rendering-window.md))。
動画の出力先の設定だけは、次にウィンドウを開いたときにも保持されます。

## 関連項目

- [レンダリングウィンドウ](../ui/rendering-window.md) — ウィンドウの構成と操作
- [Rendering メニュー](../menu/rendering.md) — メニュー項目と Export scene
- [マテリアル](renderers/material.md) / [エッジライン](renderers/edge-lines.md)
- [Scene](scene.md) — 分子ビュー側のアンビエントオクルージョンとアンチエイリアシング
- [設定項目](settings.md) — Settings タブの全項目

---

*確認対象: CueMol3 2.3.7.489*
