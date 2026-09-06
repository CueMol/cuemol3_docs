# atomintr (計測表示)

原子間の距離・角度・二面角や、水素結合などの相互作用を線とラベルで表示する
Renderer です。対象 Object: 分子 (MolCoord)。

!!! note "ふだんは計測ツールから自動的に作成されます"
    atomintr は、ツールパレットの計測ツール (Distance / Angle / Torsion) や
    Tools メニューの **Interaction...** を使うと自動的に作成されます
    (→ [ツールバーとツールパレット](../../ui/toolbar-tools.md)、
    [Tools メニュー](../../menu/tools.md))。
    New Renderer ダイアログからも作成できますが、計測を追加するまで何も描かれません。
    ファイルを開くときの Renderer type の一覧には表示されません。

!!! info "準備中"
    このページは骨組みのみです。各プロパティの詳細は今後追加されます。

## 概要

<!-- TODO(screenshot): atomintr の表示例 -->

## プロパティ

共通プロパティは [Renderer 共通プロパティ](common.md) を参照してください。

### Interaction

### Dashed line

### 3D tube

### Value label

**Font name** は、システムにインストールされているフォントの一覧から選びます
(Settings の Atom Label Font と同じ一覧です → [設定項目](../settings.md))。

<!-- TODO(content): プロパティ表 (インスペクタ表記 / プロパティ名 / 既定値 /
     説明) を atomintr のインスペクタセクションと C++ 定義から起こす -->

## 関連項目

- [Renderer の一覧](index.md)
- [マテリアル](material.md) / [エッジライン](edge-lines.md)

---

*確認対象: CueMol3 2.3.13.523*
