# タンパク質のリボン図を作る

タンパク質を cartoon (いわゆるリボン図) で表示し、リガンドを ballstick で重ね、
色と輪郭線を整えて 1 枚の図に仕上げるまでの流れを追います。題材にはチャネルロドプシンの結晶構造
(PDB ID: **3UG9**) を使います。

このチュートリアルは、[クイックツアー](../getting-started/quick-tour.md) の内容
(起動・読み込み・視点操作の基本) を前提にしています。

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。3UG9 の cartoon (ドメインごとに塗り分け) + レチナールの ballstick、白背景 + エッジライン -->

## 1. 構造を取得する

**File &gt; Get PDB...** で構造をネットワークから取得します。

1. **PDB Accession Code** に `3UG9` を入力します
2. **Fetch coord file** にチェックが入っていることを確認します (形式は既定の **RCSB (mmCIF)** のまま)
3. 取得が終わると、Object 名と Renderer を指定する画面が出ます
4. **Renderer type** から **cartoon** を選び、そのほかは既定のまま作成します

タンパク質部分が、二次構造を反映した cartoon 表示で描かれます
(→ [cartoon](../reference/renderers/cartoon.md))。

<!-- TODO(screenshot): Get PDB ダイアログ (3UG9 入力済み) と、取得後の Renderer 指定画面 -->

!!! tip "プリセットなら一度で作れます"
    **Renderer type** の Presets にある **Default preset 2** を選ぶと、タンパク質の cartoon・
    核酸・それ以外 (リガンドなど) の ballstick をまとめた Renderer グループが一度に作られます。
    このチュートリアルでは仕組みを追うため、Renderer を 1 つずつ作っていきます。

## 2. 視点を合わせる

分子ビュー上の左ドラッグで回転、ホイールでズームして、分子全体が見える向きにします
(→ [マウス・トラックパッド操作](../ui/mouse-input.md))。

視点を分子全体に合わせ直すには、左サイドパネルの **Explorer &gt; Scene** ツリー
(シーンツリー → [サイドパネル](../ui/side-panels.md)) で
Object (3UG9) を選び、パネル上部の **Focus** ボタンを押します。

## 3. cartoon の見た目を調整する

シーンツリーで cartoon の Renderer を選ぶと、右側の**プロパティインスペクタ**に設定が
表示されます。値を変えると分子ビューに即座に反映され、++cmd+z++ / ++ctrl+z++ で
取り消せます。

ヘリックスの幅・厚みは **Helix**、シートは **Sheet**、ループは **Coil** の各セクションで
調整します。たとえば、後の手順で重ねるリガンドがヘリックスに隠れて見えにくいときは、
**Helix** の幅を細めにすると内側が見通せます。各プロパティの意味と既定値は
[cartoon](../reference/renderers/cartoon.md) を参照してください。

## 4. ドメインごとに色を塗り分ける

3UG9 に含まれる分子は 1 つ (chain A) です。N 末端ドメイン・膜貫通部・C 末端ドメインの
3 つの領域を、残基番号の範囲で塗り分けます。

1. 左サイドパネルの **Explorer &gt; Color** パネルを開きます
2. 上部で cartoon の Renderer を選びます
3. Coloring の種類から **Paint** を選びます
4. 表に次の 3 行を作り、それぞれ好みの色を指定します

| 領域 | 選択式 |
|---|---|
| N 末端ドメイン | `A.49:83.*` |
| 膜貫通部 | `A.84:317.*` |
| C 末端ドメイン | `A.318:342.*` |

Paint は上の行から順に評価され、最初にマッチした行の色が使われます
(→ [Coloring](../reference/coloring.md))。`A.49:83.*` は「chain A の残基番号 49〜83 の
全原子」を表す書き方です (→ [選択式の文法](../reference/selection.md))。

<!-- TODO(screenshot): Color パネルで Paint にドメイン 3 行を設定した状態と、塗り分け後の分子ビュー -->

!!! note "CueMol2 との違い"
    CueMol2 にも Paint のパネルはありましたが、行 (エントリ) の編集は別のダイアログで
    行う必要がありました。CueMol3 では**表のセルを直接編集**できます
    (→ [機能の統合・改名・廃止](../changes/features.md))。

!!! tip "1 本鎖なら Rainbow も定番です"
    N 末端から C 末端へ虹色に変化させる **Rainbow** も、鎖の走行を示す図の定番です。
    Coloring の種類から Rainbow を選ぶだけで適用されます。

!!! tip "複数の図で色を揃えるにはスタイルが使えます"
    色や選択の定義に名前を付けて共通化しておくと、複数のシーンを通して一貫した
    色遣いの図を作れます (→ [スタイル](../reference/styles.md))。

## 5. リガンドを ballstick で表示

cartoon は主鎖の走行だけを描くため、リガンドは表示されません。
3UG9 が持つレチナール (残基名 `RET`) を、ballstick (棒と球のモデル) で重ねて表示します。

1. シーンツリーで Object (3UG9) を右クリックし、**New Renderer** を選びます
2. **Renderer type** から **ballstick** を選びます
3. **Selection** にチェックを入れ、選択式に `r; RET` を入力します
4. **Create** を押すと、cartoon に重ねてレチナールが ballstick で描かれます

1 つの Object には、このように複数の Renderer を重ねられます。各 Renderer の表示対象は
選択式で絞り込みます (`r;` は残基名による選択の省略形です →
[選択式の文法](../reference/selection.md))。

残基名がわからないときは、**Selection &gt; Molecular structure** パネルのツリーから
残基を探して選択することもできます (→ [サイドパネル](../ui/side-panels.md))。
また、全体図でリガンドが小さすぎて見えにくい場合は、ballstick の代わりに
**cpk** (空間充填モデル) で表示するのも定番です。

<!-- TODO(screenshot): New Renderer ダイアログ (ballstick + r; RET) と、レチナールが重なった分子ビュー -->

## 6. 背景と輪郭線で仕上げる

論文の図では、白い背景に輪郭線 (エッジライン) を組み合わせるのが定番です。
エッジラインを付けると、白背景でも各要素の境界がはっきりします。

1. **Scene &gt; Background &gt; White** で背景を白にします
2. シーンツリーで cartoon の Renderer を右クリックします
3. **Style &gt; Edge line (normal)** を選びます。エッジ線の種類と太さがまとめて設定されます
4. ballstick の Renderer にも、同じ操作 (手順 2〜3) を繰り返します

線を太く / 細くしたいときは、同じメニューから **Edge line (thick)** /
**Edge line (thin)** を選び直します。外すときは **No edge line** を選びます
(→ [エッジライン](../reference/renderers/edge-lines.md))。

!!! tip "白背景ではリガンドの色を確かめてください"
    白背景にすると、明るい色の原子が背景に溶け込んで見えにくいことがあります。
    気になるときは **Color** パネルの **CPK** で炭素の色を暗め (例: `#404040`) にします
    (→ [色の記法](../reference/color-syntax.md))。

<!-- TODO(screenshot): 白背景 + エッジライン適用後の完成図 (適用前後の比較でも可) -->

## 7. カメラとシーンを保存する

視点が決まったら、カメラとして保存しておくと、後で同じ構図に戻せます。

1. シーンツリーの **Cameras** 行を右クリックし、**New Camera...** を選びます
2. 名前を付けて作成します

カメラ行のダブルクリックで、いつでもその視点に戻れます
(→ [カメラ](../reference/camera.md))。

最後に **File &gt; Save Scene** (++cmd+s++ / ++ctrl+s++) でシーンを `.qsc` ファイルに
保存します。保存すると、そのときの視点も `__current` という名前のカメラとして記録され、
次に開いたときに適用されます。また、保存オプションの**データの埋め込み**を有効にすると、
分子データも `.qsc` に取り込まれ、ファイル単体で持ち運べるようになります
(→ [File メニュー](../menu/file.md))。

## 次のステップ

- [論文用の高解像度画像を書き出す](publication-images.md) — この図をレイトレースで仕上げる
- [Coloring](../reference/coloring.md) / [選択式の文法](../reference/selection.md) — 塗り分けと選択の詳細
- [Renderer 一覧](../reference/renderers/index.md) — 他の表示方法を知る

---

*確認対象: CueMol3 2.3.8.494*
