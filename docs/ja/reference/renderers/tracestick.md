# tracestick

主鎖の pivot 原子 (タンパク質では Cα、核酸では P) を球で描き、つながった残基のあいだを
円柱で結ぶ Renderer です。[trace](trace.md) を [ballstick](ballstick.md) の形で描いたもので、
主鎖が途切れる場所も trace と同じです。対象 Object: 分子 (MolCoord)。

!!! info "準備中"
    このページは骨組みです。表示例の図は今後追加されます。

## 概要

<!-- TODO(screenshot): tracestick の表示例 -->

分子ビューでポインタを重ねたときのホバー表示は、trace や cartoon と同じく残基単位です
(→ [ピッキングとホバー表示](../../ui/mouse-input.md#ピッキングとホバー表示))。

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Trace stick

| 項目 | 既定値 | 説明 |
|---|---|---|
| Detail | 10 | 球と円柱の分割の細かさ |
| Bond width | 0.25 Å | 円柱の半径 (0〜3 Å) |
| Atom radius | 0.25 Å | pivot 原子の球の半径 (0〜3 Å) |

既定値は、作成時に適用されるスタイル **Default** の値です。

### スタイル

形状のスタイルが 4 つ用意されています (→ [スタイル](../styles.md))。

| スタイル | Bond width | Atom radius |
|---|---|---|
| Default | 0.25 Å | 0.25 Å |
| Thick | 0.5 Å | 0.5 Å |
| Ball &amp; stick | 0.2 Å | 0.4 Å |
| Thick ball &amp; stick | 0.35 Å | 0.7 Å |

Default と Thick は球と円柱が同じ太さのスティック、Ball &amp; stick と
Thick ball &amp; stick は球を太くした表示です。

## 関連項目

- [Renderer の一覧](index.md)
- [trace](trace.md)
- [ballstick](ballstick.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.20.539*
