# Tools メニュー

構造の解析や計算を行うツールを集めたメニューです。

!!! info "結合の編集はツールパレットに移動しました"
    CueMol2 の Tools &gt; Mol bond editor... は、CueMol3 では分子ビュー左端の**ツールパレット**にある
    **Add Bond** ツールに置き換わりました。メニュー項目はありません
    (→ [ツールバーとツールパレット](../ui/toolbar-tools.md))。

## 解析・生成ツール

| 項目 | 説明 | ショートカット |
|---|---|---|
| Molecular superposition... | 2 つの分子を重ね合わせます (LSQ / SSM)。結果の RMSD が表示されます | |
| Interaction... | 原子間の相互作用 (距離・水素結合) を検出し、ラベルとして表示します。対象分子と選択範囲、距離の範囲、ラベル数の上限を指定できます | |
| Reassign secondary str... | タンパク質の二次構造を再計算して割り当て直します | |
| Mol morphing animation... <span class="badge-wip">開発中</span> | 2 つの構造間を補間するモーフィングアニメーションを作成します。**現在のバージョンでは動作しません** | |
| Mol surface generation... | 分子表面 (SES) Object を生成します。対象分子・選択範囲・メッシュ密度・プローブ半径を指定します | |
| Mol surface cutter... | 分子表面を平面で切断します。断面の扱い (本体のみ / 断面のみ / 2 つの Object に分割) を選べます | |
| APBS elepot calculation... | APBS を使って静電ポテンシャルマップを計算します。pdb2pqr で電荷と半径を割り当ててから APBS を実行し、結果を読み込みます | |

!!! warning "APBS の利用には設定が必要です"
    APBS と pdb2pqr の実行ファイルのパスが Settings で未設定の場合、ダイアログの **Start** は押せません
    (→ [外部ツールの設定](../install/external-tools.md))。

## 計測

| 項目 | 説明 | ショートカット |
|---|---|---|
| Performance measure <span class="badge-wip">開発中</span> | 描画性能の計測を切り替えます。**現在のバージョンでは動作しません** | |

!!! tip "距離・角度・二面角の計測"
    原子間の距離・角度・二面角の計測はメニューではなく、分子ビュー左端の**ツールパレット**にある
    Distance / Angle / Torsion ツールで行います
    (→ [ツールバーとツールパレット](../ui/toolbar-tools.md))。

---

*最終確認: 2026-08-10 / 確認対象: 開発版 (tritium)*
