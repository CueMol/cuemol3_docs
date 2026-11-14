# SimpleSpin

視点を指定した軸のまわりに回転させるアニメーションです。
分子を回して見せる、もっとも基本的な要素です。

!!! info "準備中"
    このページは骨組みのみです。各項目の詳細は今後追加されます。

## プロパティ

共通のプロパティ (名前・開始時刻・継続時間など) は
[アニメーション](index.md#共通のプロパティ) を参照してください。

Rotation angle
:   回転する角度。範囲は無く、負の値では逆向きに回り、360° で 1 周します。

Spin axis
:   回転軸のベクトル (X / Y / Z)

<!-- TODO(content): simplespin の各項目の値の範囲・既定値を
     AnimElementInspector.tsx と C++ の qif 定義から起こす -->

設定の異なる SimpleSpin を複数並べることで、回転の向きや速さが
途中で変わるアニメーションを作れます。

## 関連項目

- [アニメーションの一覧](index.md)
- [RockSpin](rockspin.md)
- [下部パネル](../../ui/bottom-panels/index.md)

---

*確認対象: CueMol3 3.0.2.560*
