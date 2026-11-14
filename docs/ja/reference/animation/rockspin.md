# RockSpin (揺れ)

視点を揺らすアニメーションです。
Animation パネルの追加メニューの **Rock** で追加します。PyMOL や ChimeraX の
rock / nutate / wobble にあたる動きを、1 つの要素で作ることができます。

!!! info "撮影予定"

<!-- TODO(screenshot): Rock のストリップとインスペクタ (Pattern / Axis / Swing angle / Cycles / Phase / Envelope) -->

## プロパティ

共通のプロパティ (名前・開始時刻・継続時間など) は
[アニメーション](index.md#共通のプロパティ) を参照してください。

Pattern
:   揺れ方。既定は Rock です。

    | Pattern | 動き |
    |---|---|
    | **Rock** | Axis のまわりの揺動 |
    | **Nutate** | 視線が円を描くように回転 |
    | **Wobble** | 8 の字を描くように揺動 |

Axis
:   揺らす軸。**X axis** / **Y axis** (既定) / **Z axis** か、**Cartesian** で
    (x, y, z) を指定します。軸は画面の座標系 (x が右、y が上、z が手前) で表します。

Swing angle
:   振れ幅の全体 (度)。既定は 30° で、実際にはその半分ずつ両側に振れます。
    範囲は無く、負の値では逆方向に振動します。

Cycles
:   要素の継続時間の中で繰り返す回数。既定は 1 で、小数も指定できます。

Phase
:   揺れの始まりの位相 (度)。既定は 0° です。

Aspect
:   Nutate / Wobble のときだけ表示されます。Axis と視線の両方に垂直な 2 つ目の軸の振れ幅の、Axis の振れ幅に対する比です。
    Pattern を切り替えると、その Pattern の既定 (Nutate は 1、Wobble は 0.3) に戻ります。

Envelope
:   振れ幅の時間変化。**None** (既定) では振れ幅は一定です。**Grow** では要素の開始時の 0 から
    次第に大きくなり、**Shrink** では次第に小さくなって要素の終了時に 0 になります。

## 開始時と終了時の視点

- 要素は直前の視点から動き始めます。Pattern・Phase・Envelope をどう設定しても、要素の開始時に
  視点が急に変わることはありません。
- そのため Nutate では、視線が描く円は直前の視点を中心とせず、直前の視点を通ります。直前の視点を円の中心に
  したいときは、Envelope を Grow にします。
- Envelope が None で Cycles が整数なら、要素の終了時に元の視点に戻ります。

## 関連項目

- [アニメーションの一覧](index.md)
- [SimpleSpin](simplespin.md)
- [Animation パネル](../../ui/bottom-panels/animation.md)
- [ChX console](../plugins/console/chx_console.md) / [PyM console](../plugins/console/pymconsole.md) —
  `rock` などのコマンドでこの要素を追加できます。

---

*確認対象: CueMol3 3.0.2.560*
