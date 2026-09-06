# アニメーション

シーンの見せ方を時間に沿って変化させるしくみです。
下部パネルの **Animation** パネルにタイムラインが表示され、
そこにアニメーション要素 (anim obj) を並べて構成します
(→ [下部パネル](../../ui/bottom-panels.md))。

作成したアニメーションは、レンダリングウィンドウの動画モードで
動画として書き出せます (→ [レンダリングウィンドウ](../../ui/rendering-window.md))。

## 種類の一覧

Animation パネルの追加メニューから、次の要素を追加できます。

| 追加メニュー | クラス | 内容 |
|---|---|---|
| Simple spin | [SimpleSpin](simplespin.md) | 視点を指定軸まわりに回転させる |
| Camera motion | [CamMotion](cammotion.md) | 保存したカメラへ視点を移動させる |
| Show / Hide | [ShowHideAnim](showhide.md) | Renderer をフェードイン / フェードアウトさせる |
| Slide in / Slide out | [SlideInOutAnim](slideinout.md) | Renderer をスライドさせて出し入れする |
| Mol morphing | [MolAnim](molanim.md) | 2 つの構造の間を補間して変形させる |
| No operation | — | 何もしない要素。時間の間隔を空けるために使います |

## 共通のプロパティ

どの種類の要素にも、次の設定があります。
シーンツリーまたはタイムラインで要素を選ぶと、インスペクタに表示されます。

Name
:   要素の名前。空にしたり、ほかの要素と同じ名前にしたりすることはできません

Disabled
:   ON にするとその要素は再生されません

Relative to
:   開始時刻の基準。*(absolute)* でタイムラインの先頭からの絶対時刻になり、ほかの要素を
    選ぶとその要素の終了時刻が基準になります。基準が循環するような指定は、理由を示して
    拒否されます。基準にしていた要素が無くなると *(missing: 名前)* と表示され、直すまで
    そのアニメーションは再生できません

Start time
:   開始時刻。ドラッグしている間はタイムラインのストリップが追従し、離した時点で
    1 回の Undo になります (→ [時刻の入力](../../ui/inspector.md#時刻の入力))

Duration
:   継続時間。入力の仕方は Start time と同じです

Quadric
:   時間に対する変化の加減速の度合い。値を変えると、
    等速ではなく緩やかに始まって緩やかに終わるような動きになります

## 関連項目

- [下部パネル](../../ui/bottom-panels.md) — Animation パネルの操作
- [レンダリングウィンドウ](../../ui/rendering-window.md) — 動画としての書き出し
- [カメラ](../camera.md)

---

*確認対象: CueMol3 2.3.13.523*
