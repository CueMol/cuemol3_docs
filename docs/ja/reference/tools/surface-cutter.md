# 分子表面の切断 (Mol surface cutter)

分子表面 (MolSurfObj) を平面で切断し、断面を作ります。
**Tools &gt; Mol surface cutter...** で **Mol surface cutter** ダイアログを開きます。

!!! info "撮影予定"

<!-- TODO(screenshot): スラブで切った分子表面と、切断後の表面 -->

## 切断面を決める

切断面は、分子ビューの**手前側のスラブ面**です。ダイアログを開く前に、視線の方向・
視点の位置・スラブを調節して、スラブで表面が切れて中が見える状態にしておきます
(→ [マウス・トラックパッド操作](../../ui/mouse-input.md))。

## ダイアログの項目

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Target surface** | — | 切断する分子表面の Object |
| **Cross section** | Complete | 断面の扱い (下表) |
| **Section mesh density (/A)** | 5.0 | 断面に作る三角メッシュの密度。大きくすると細かくなりますが、計算に時間がかかります |

**Cross section** の選択肢は次のとおりです。

| Cross section | 内容 |
|---|---|
| **Complete** | 切断した表面と断面を、同じ Object にまとめます |
| **Separately** | 切断した表面と断面を、別々の Object にします。断面は `sect_<元の名前>` という新しい Object になります。断面だけ違う色にしたい場合に使います |
| **Section only** | 断面だけを残します |
| **No section** | 切断した表面だけを残します (断面の無い、穴の開いた表面になります) |

## 実行と結果

**OK** を押すと、今のスラブの面で表面が切断されます。切断は 1 回の Undo で元に戻せます。

OK を押した直後は、スラブによる切り取りと重なって、何も起きていないように見えることがあります。
分子を回転させるか、スラブを広げると、切断されているのを確認できます。

切断した表面は、シーンを `.qsc` に保存すると、切断された状態のまま保存されます。

!!! warning "切断する前にシーンを保存してください"
    一度切断した面と干渉する面で切断し直すと、エラーになって断面が作られないことがあります。

## Console から使う

[Console](../plugins/console/index.md) の native モードでは `cut_surface` で同じ処理を行えます。
`mode` で断面の扱い (`full` / `separate` / `sect` / `body`) を指定します
(→ [Console のコマンド一覧](../plugins/console/commands.md))。

## 関連項目

- [Tools メニュー](../../menu/tools.md)
- [分子表面の生成](mol-surface.md) / [MolSurfObj (分子表面)](../objects/molsurf.md)

---

*確認対象: CueMol3 2.4.0.546*
