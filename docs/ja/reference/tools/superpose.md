# 分子の重ね合わせ (Molecular superposition)

2 つの分子を重ね合わせます。**Tools &gt; Molecular superposition...** で
**Molecular superposition** ダイアログを開き、動かさない分子 (Reference) と動かす分子
(Moving) を指定します。重ね合わせると Moving 分子の座標が動きます。

!!! info "撮影予定"

<!-- TODO(screenshot): Molecular superposition ダイアログ (Method が US-align の状態) -->

## 重ね合わせの手法

**Algorithm** の **Method** で、3 つの手法から選べます。

| Method | 対象 | 特徴 |
|---|---|---|
| **US-align** (既定) | タンパク質・核酸 (RNA / DNA) | 構造の似ている部分を自動で対応づけて重ね合わせます。選択範囲を細かく気にせず使えます |
| **SSM** | タンパク質のみ | 二次構造をもとに対応する部分を自動で判断して重ね合わせます |
| **LSQ** | どの分子にも使える | 選んだ原子を順に対応づけて、最小二乗法で重ね合わせます。重ね合わせる原子を正しく指定する必要があります |

### US-align

US-align は、構造の似ている部分を自動的に探して対応づけ、重ね合わせます。SSM と違って、
タンパク質だけでなく **RNA / DNA** も重ね合わせられます。

**Pivot atom** で、残基の代表にする原子を選べます (US-align のときだけ選べます)。

| Pivot atom | 内容 |
|---|---|
| Auto (CA / C3') (既定) | アミノ酸では CA、ヌクレオチド (修飾塩基を含む) では C3' を使います |
| CA / C3' / C4' / P | 指定した原子を使います |

### SSM

Secondary Structure Matching (SSM) は、タンパク質の二次構造 (ヘリックス・シートなど) を
もとに類似部分を判断して重ね合わせます。

- 選択範囲は基本的に `*` (全原子) で構いません。Reference の chain A にだけ重ね合わせたい
  場合は、Selection に `chain A` などと指定します。
- SSM は主鎖の原子 (主鎖アミド窒素・カルボニル基) から二次構造を判定するため、選択を
  Cα 原子だけ (`name CA`) にすると重ね合わせできません。主鎖原子をすべて含めてください
  (`name C,N,O,CA` など)。
- 同じ理由で、Cα の座標しかない分子や、核酸などタンパク質以外のポリマーは重ね合わせできません。
  核酸には US-align を使います。

### LSQ

最小二乗法 (Least Square Fitting) で重ね合わせます。どのような分子にも使えますが、
Reference と Moving の Selection について、次の点に注意して指定する必要があります。

- 選択される原子の数が、両方の分子で同じになっていること
- 各分子の対応する部分が選ばれていること (例: 同じ残基範囲の `name CA`)

## ダイアログの項目

| 項目 | 説明 |
|---|---|
| **Algorithm** &gt; **Method** | 重ね合わせの手法 (US-align / SSM / LSQ) |
| **Algorithm** &gt; **Pivot atom** | US-align で残基の代表にする原子 |
| **Reference** &gt; Molecule / Selection | 動かさない分子と、重ね合わせに使う部分。Selection が空のときは全原子です |
| **Moving** &gt; Molecule / Selection | 動かす分子と、重ね合わせに使う部分 |
| **Auto recenter** | ON (既定) にすると、重ね合わせたあと Moving 分子の選択部分に視点を合わせます |
| **Use xformMat property** | ON にすると、座標を書き換えずに、重ね合わせの変換を分子の xformMat プロパティとして保存します (既定は OFF) |

- Method・Pivot atom・2 つのスイッチと分子の指定は、次にダイアログを開いたときに引き継がれます。
  Selection は毎回空になります。
- Selection の入力欄では、右端の ▼ から名前付き選択・入力の履歴・選択ビルダーを使えます
  (→ [選択ビルダー](../../ui/selection-builder.md))。

## 実行と結果

**OK** を押すと重ね合わせが実行され、Moving 分子が移動します。重ね合わせは 1 回の Undo で
元に戻せます。失敗した場合は、ダイアログ内にエラーが表示されます。

結果は、下部パネルの **Output** にログとして出力されます。US-align の場合は次のような形式です。

```
===== US-align superpose result =====
 Ref: <分子名> (<残基数> residues), Mov: <分子名> (<残基数> residues)
 Pivot: auto, type: protein
 TM-score: ... (normalized by Ref), ... (normalized by Mov)
 RMSD: ... angstrom
 Nalgn: ...
 SeqID: ...
(アラインメント)
========================
```

- **TM-score**: 構造の類似度。Reference と Moving のそれぞれの長さで正規化した 2 つの値が出ます
- **RMSD**: 対応づけた残基の代表原子の RMSD
- **Nalgn**: 対応づけた (アラインメントできた) 残基の数
- **SeqID**: 対応づけた残基のうち、残基の種類が一致する割合

SSM では `RMSD` (Cα 原子の RMSD)、`Nalgn` (対応づけた残基数)、`Ngaps` (アラインメント中の
ギャップの数) が、LSQ では `RMSD` と `Nfit` (重ね合わせに使った原子の数) が出力されます。

## Console から使う

[Console](../plugins/console/index.md) の native モードでは `superpose` コマンドで同じ処理を行えます。
`algo` で手法 (`USalign` / `SSM` / `LSQ`)、`pivot` で Pivot atom を指定します。
PyMOL 互換モードの `align` / `super` は US-align、`pair_fit` は LSQ で重ね合わせます
(→ [PyMOL 互換モード](../plugins/console/pymconsole.md#対応コマンド))。

## 関連項目

- [Tools メニュー](../../menu/tools.md)
- [アニメーションを作って動画に出力する](../../tutorials/animation-movie.md) — SSM で重ね合わせてからモーフィングを作る例
- [選択式の文法](../selection.md)

---

*確認対象: CueMol3 2.4.0.546*
