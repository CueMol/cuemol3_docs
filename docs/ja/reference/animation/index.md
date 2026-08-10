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
:   要素の名前

Disabled
:   ON にするとその要素は再生されません

Relative to
:   開始時刻の基準。直前の要素の終了時刻を基準にするか、
    タイムラインの先頭からの絶対時刻にするかを選びます

Start time
:   開始時刻

Duration
:   継続時間

Quadric
:   時間に対する変化の加減速の度合い。値を変えると、
    等速ではなく緩やかに始まって緩やかに終わるような動きになります

## 関連項目

- [下部パネル](../../ui/bottom-panels.md) — Animation パネルの操作
- [レンダリングウィンドウ](../../ui/rendering-window.md) — 動画としての書き出し
- [カメラ](../camera.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
