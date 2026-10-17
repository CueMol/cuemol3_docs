# 静電ポテンシャルの計算 (APBS elepot calculation)

[APBS](https://www.poissonboltzmann.org/) を使って、分子の静電ポテンシャルマップを計算します。
**Tools &gt; APBS elepot calculation...** で **APBS electrostatic potential** ダイアログを開きます。
計算したマップは [ElePotMap (静電ポテンシャル)](../objects/elepot.md) の Object になり、
分子表面の着色などに使えます。

!!! info "撮影予定"

<!-- TODO(screenshot): APBS electrostatic potential ダイアログ (実行中の進捗表示) -->

## 準備

計算には APBS と、電荷と原子半径を割り当てる pdb2pqr を使います。macOS / Windows の配布物には
同梱されており、通常は設定不要です。同梱されていないビルドでは、**Settings &gt; Tools &gt;
APBS / PDB2PQR** で実行ファイルのパスを指定します (→ [外部ツールの設定](../../install/external-tools.md))。

パスが設定されていないときは、ダイアログの上部に警告が表示され、**Start** は押せません。

表面を着色に使う場合は、先に[分子表面を生成](mol-surface.md)しておきます。

## ダイアログの項目

### Target

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Molecule** | — | 計算する分子 |
| **Use selection** / 選択 | OFF | ON にすると、選択式で指定した部分だけで計算します。水分子やイオンを除くには `protein` などを指定します |
| **Elepot name** | `pot_<分子名>` | 作られる静電ポテンシャルマップの Object の名前。分子を選ぶと自動で入ります |

### Charge method

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Method** | Use PDB2PQR | 電荷の割り当て方法 (下記) |
| **Force field** | Settings の値 (既定は `charmm`) | Use PDB2PQR のとき、電荷の割り当てに使う力場 (`charmm` / `amber` / `tyl06` / `peoepb` / `swanson`) |
| **Use hydrogen atoms** | OFF | Use internal のとき、分子中の水素原子を使います |

- **Use PDB2PQR**: pdb2pqr で電荷と原子半径を割り当ててから計算します。
- **Use internal**: CueMol の電荷割り当てを使います。pdb2pqr は不要ですが、タンパク質の
  N 末端・C 末端が正しく扱われず、水素原子が無い場合は水素の付いた原子に電荷を足し合わせる
  簡易な方法で割り当てるため、お勧めできません。分子に水素原子がある場合は **Use hydrogen atoms** を
  ON にすると、この問題を避けられます。

### APBS options

APBS の計算条件です。通常は変える必要はありません。詳しくは APBS のドキュメントを参照してください。

| 項目 | 既定値 | 説明 |
|---|---|---|
| **Solve non-linear PBE** | OFF | 非線形の Poisson-Boltzmann 方程式を解きます |
| **Temperature (K)** | 298.15 | 温度 |
| **Max grid size (A)** | 1.0 | グリッドの間隔 (Å) |
| **Water dielectric** | 78.54 | 溶媒の誘電率 |
| **Protein dielectric** | 2.0 | 分子内部の誘電率 |

## 実行と結果

**Start** を押すと計算が始まり、進捗が表示されます (pdb2pqr → APBS の順に実行されます)。
分子が大きい場合は時間がかかります。実行中は **Stop** で中止できます。

計算が終わると、静電ポテンシャルマップの Object がシーンに追加され、ダイアログは閉じます。
追加は 1 回の Undo で元に戻せます。

- マップには、計算した範囲を枠で示す `unitcell` Renderer が付きます。範囲が十分なことを
  確かめたら、非表示にするか削除して構いません。
- 計算したマップは、シーンを `.qsc` に保存すると一緒に保存されます。

## 分子表面を着色する

Color パネルで molsurf Renderer を選び、Coloring の種類から **Electrostatic potential** を選んで、
計算したマップを指定します。**By SAS** を ON にし、**High** / **Low** を ±2 程度 (単位は kT/e) に
すると、分布が見やすくなります。詳しい手順は
[分子表面を静電ポテンシャルで着色する](../../tutorials/surface-elepot.md) を、設定項目は
[Coloring](../coloring.md) を参照してください。

## Console から使う

[Console](../plugins/console/index.md) の native モードでは `calc_elepot` で同じ処理を行えます
(→ [Console のコマンド一覧](../plugins/console/commands.md))。

## 関連項目

- [Tools メニュー](../../menu/tools.md)
- [ElePotMap (静電ポテンシャル)](../objects/elepot.md)
- [外部ツールの設定](../../install/external-tools.md)
- [分子表面の生成](mol-surface.md)

---

*確認対象: CueMol3 2.4.0.546*
