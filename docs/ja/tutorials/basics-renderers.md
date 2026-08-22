# Renderer の追加・削除と設定

1 つの Object に複数の Renderer を付けて表示を重ねる操作と、
インスペクタでの設定変更を練習します。
前のページ ([分子の一部を選択する](basics-selection.md)) に続けて、
`lysozyme` の Val2〜Phe3 (`A.2:3.*`) が選択された状態から始めます。

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

## 1. 選択部分に Renderer を追加する

選択した 2 残基だけを ballstick で表示してみます。

1. シーンツリーで `lysozyme` を右クリックし、**New Renderer** を選びます
2. **Renderer type** から **ballstick** を選びます
3. **Selection** には、現在の選択に対応する式 (`A.2:3.*`) が最初から入っています。
   そのままにします
4. **Renderer name** には、使われていない名前 (`ballstick1` など) が自動で
   提案されています。わかりやすい名前を付けたい場合はここで変更します
5. **Create** を押すと、Val2〜Phe3 の部分だけが ballstick で表示されます

<!-- TODO(screenshot): New Renderer ダイアログ (ballstick, Selection = A.2:3.*) と、2 残基だけ ballstick になった表示 -->

## 2. 分子全体に Renderer を追加する

現在の選択にかかわらず全体に付けたい場合は、**Selection** のチェックを外します。

1. もう一度 `lysozyme` の **New Renderer** から **ribbon** を選びます
2. **Selection** のチェックを外します
3. **Create** を押すと、分子全体がリボン表示で重なります

simple の線画・2 残基の ballstick・全体の ribbon が重なった状態になりました。
シーンツリーで simple1 の目のアイコンを閉じると、図が整理されて見やすくなります。

## 3. 表示する範囲を後から変える

ballstick1 の表示範囲を、Val2〜Phe3 から Val2〜Glu7 に広げてみます。

1. **Molecular structure** パネルで残基 2〜7 を範囲選択し、**Select** を押します
   (選択式 `A.2:7.*` を Selection パネルで適用しても同じです)
2. シーンツリーで `ballstick1` を右クリックし、**Change sel &gt; Current** を選びます

Renderer の表示範囲が現在の選択に置き換わり、Glu7 まで広がります。
**Change sel** には **All** (全体) や **Protein** / **Water** / **Ligand** などの
定番の範囲も用意されています。

## 4. Renderer を削除する

シーンツリーで行を選び、パネル上部の **Delete** ボタンを押すと削除できます。
右クリックメニューからも削除できます。削除は Undo (++cmd+z++ / ++ctrl+z++) で
戻せるので、気軽に試して構いません (ここでは ballstick1 を残しておきます)。

## 5. プロパティを調整する

Renderer の見た目の細部は**プロパティ**で決まっており、右側の
**プロパティインスペクタ**で編集します (→ [プロパティインスペクタ](../ui/inspector.md))。

1. シーンツリーで `ballstick1` を選びます
2. インスペクタの **Properties** タブに、ballstick 用のセクションが表示されます
3. **Bond width** (結合の棒の太さ、Å 単位) と **Atom radius** (原子の球の半径) を
   `0.4` にしてみてください。ずんぐりしたモデルに変わります
4. **Show ring** を有効にすると、Phe3 の芳香環に板が表示されます

値を変えると分子ビューに**即座に反映**されます。OK / Apply ボタンはなく、
取り消したいときは Undo です。

種類別のセクションが用意されていないプロパティは、**Generic** タブからすべて
編集できます。各値には既定値が定義されており、既定値から変えた項目だけを
リセットすることもできます (→ [プロパティインスペクタ](../ui/inspector.md))。

<!-- TODO(screenshot): インスペクタで ballstick の Bond width / Atom radius を変更した前後 -->

!!! note "CueMol2 との違い"
    CueMol2 ではプロパティは Renderer ごとのダイアログを開いて編集し、OK で
    確定する方式でしたが、CueMol3 では常設のインスペクタで結果を見ながら
    編集します (→ [操作パラダイムの変更](../changes/ui-paradigm.md))。

## 次のステップ

- [Renderer を着色する](basics-coloring.md) — Coloring の種類と塗り分け
- [Renderer 一覧](../reference/renderers/index.md) — 各種類のプロパティの詳細

---

*確認対象: CueMol3 2.3.8.494*
