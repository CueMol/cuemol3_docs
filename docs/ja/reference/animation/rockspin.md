# RockSpin (揺れ)

要素を置いた時点の向きを中心に、視点を揺らすアニメーションです。
Animation パネルの追加メニューの **Rock** で追加します。PyMOL や ChimeraX の
rock / nutate / wobble にあたる動きを、1 つの要素で作れます。

!!! info "撮影予定"

<!-- TODO(screenshot): Rock のストリップとインスペクタ (Pattern / Axis / Swing angle / Cycles / Phase / Envelope) -->

## プロパティ

共通のプロパティ (名前・開始時刻・継続時間など) は
[アニメーション](index.md#共通のプロパティ) を参照してください。

Pattern
:   揺れ方。既定は Rock です。

    | Pattern | 動き |
    |---|---|
    | **Rock** | Axis のまわりに行って戻る往復 |
    | **Nutate** | 視線が円を描くように回る |
    | **Wobble** | 8 の字を描くように揺れる |

Axis
:   揺らす軸。**X axis** / **Y axis** (既定) / **Z axis** か、**Cartesian** で
    (x, y, z) を指定します。軸は画面の座標系 (x が右、y が上、z が手前) で表します

Swing angle
:   振れ幅の全体 (度)。既定は 30° で、実際にはその半分ずつ両側に振れます。
    範囲は無く、負の値では逆向きに振れます

Cycles
:   要素の継続時間の中で繰り返す回数。既定は 1 で、小数も指定できます

Phase
:   揺れの始まりの位相 (度)。既定は 0° です

Aspect
:   Nutate / Wobble のときだけ表示されます。2 つ目の向きの振れ幅の比です。
    Pattern を切り替えると、その Pattern の既定 (Nutate は 1、Wobble は 0.3) に戻ります

Envelope
:   振れ幅の時間変化。**None** (既定) は一定、**Grow** は 0 から広がり、**Shrink** は 0 へ縮みます

## 動きの特徴

- どの Pattern・Phase・Envelope でも、要素は直前の向きから跳ばずに始まります。
  そのため Nutate の円は、直前の向きを通る円になります (直前の向きを円の中心にしたいときは、
  Envelope を Grow にします)。
- Envelope が None で Cycles が整数なら、要素が終わったときに元の向きに戻ります。
- [SimpleSpin](simplespin.md) と同じ時間に置くと、回りながら揺れる動きになります。

## 関連項目

- [アニメーションの一覧](index.md)
- [SimpleSpin](simplespin.md)
- [Animation パネル](../../ui/bottom-panels/animation.md)
- [ChX console](../plugins/console/chx_console.md) / [PyM console](../plugins/console/pymconsole.md) —
  `rock` などのコマンドでこの要素を追加できます

---

*確認対象: CueMol3 3.0.2.560*
