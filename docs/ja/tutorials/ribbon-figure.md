# タンパク質のリボン図を作る

タンパク質を cartoon で表示し、リガンドを棒球モデルで重ね、色と輪郭線を整えて
1 枚の図に仕上げるまでの流れを追います。題材にはチャネルロドプシンの結晶構造
(PDB ID: **3UG9**) を使います。

このチュートリアルは、[クイックツアー](../getting-started/quick-tour.md) の内容
(起動・読み込み・視点操作の基本) を前提にしています。

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。3UG9 の cartoon (鎖ごとに塗り分け) + レチナールの棒球モデル、白背景 + エッジライン -->

## 1. 構造を取得する

**File &gt; Get PDB...** で構造をネットワークから取得します。

1. **PDB Accession Code** に `3UG9` を入力します
2. **Fetch coord file** にチェックが入っていることを確認します (形式は既定の **RCSB (mmCIF)** のまま)
3. 取得が終わると、Object 名と Renderer を指定する画面が出ます。
   **Renderer type** から **cartoon** を選び、そのほかは既定のまま作成します

タンパク質部分が、二次構造を反映した cartoon 表示で描かれます
(→ [cartoon](../reference/renderers/cartoon.md))。

<!-- TODO(screenshot): Get PDB ダイアログ (3UG9 入力済み) と、取得後の Renderer 指定画面 -->

!!! tip "プリセットなら一度で作れます"
    **Renderer type** の Presets にある **Default preset 2** を選ぶと、タンパク質の cartoon・
    核酸・それ以外 (リガンドなど) の棒球モデルをまとめた Renderer グループが一度に作られます。
    このチュートリアルでは仕組みを追うため、Renderer を 1 つずつ作っていきます。

## 2. 視点を合わせる

分子ビュー上の左ドラッグで回転、ホイールでズームして、分子全体が見える向きにします
(→ [マウス・トラックパッド操作](../ui/mouse-input.md))。

視点を分子全体に合わせ直すには、左サイドパネルの **Explorer &gt; Scene** ツリーで
Object (3UG9) を選び、パネル上部の **Focus** ボタンを押します。

## 3. cartoon の見た目を調整する

シーンツリーで cartoon の Renderer を選ぶと、右側の**プロパティインスペクタ**に設定が
表示されます。値を変えると分子ビューに即座に反映され、++cmd+z++ / ++ctrl+z++ で
取り消せます。

ヘリックスの幅・厚みは **Helix**、シートは **Sheet**、ループは **Coil** の各セクションで
調整します。各プロパティの意味と既定値は [cartoon](../reference/renderers/cartoon.md) を
参照してください。

## 4. 鎖ごとに色を塗り分ける

3UG9 は 2 本の鎖 (A / B) からなる二量体です。鎖ごとに色を変えて塗り分けます。

1. 左サイドパネルの **Explorer &gt; Color** パネルを開きます
2. 上部で cartoon の Renderer を選びます
3. Coloring の種類から **Paint** を選びます
4. 表で、選択式 `c; A` の行に 1 色目、`c; B` の行に 2 色目を指定します

Paint は上の行から順に評価され、最初にマッチした行の色が使われます
(→ [Coloring](../reference/coloring.md))。`c;` はチェイン名による選択の省略形です
(→ [選択式の文法](../reference/selection.md))。

<!-- TODO(screenshot): Color パネルで Paint に鎖 A / B の 2 行を設定した状態と、塗り分け後の分子ビュー -->

!!! note "CueMol2 との違い"
    CueMol2 では Paint の設定は専用ダイアログでしたが、CueMol3 では **Color パネルの
    Paint 表**に集約され、表のセルを直接編集します
    (→ [機能の統合・改名・廃止](../changes/features.md))。

!!! tip "1 本鎖なら Rainbow も定番です"
    N 末端から C 末端へ虹色に変化させる **Rainbow** も、鎖の走行を示す図の定番です。
    Coloring の種類から Rainbow を選ぶだけで適用されます。

## 5. リガンドを棒球モデルで重ねる

cartoon は主鎖の走行だけを描くため、リガンドは表示されません。
3UG9 が持つレチナール (残基名 `RET`) を、棒球モデル (ballstick) で重ねて表示します。

1. シーンツリーで Object (3UG9) を右クリックし、**New Renderer** を選びます
2. **Renderer type** から **ballstick** を選びます
3. **Selection** にチェックを入れ、選択式に `r; RET` を入力します
4. **Create** を押すと、cartoon に重ねてレチナールが棒球モデルで描かれます

1 つの Object には、このように複数の Renderer を重ねられます。各 Renderer の表示対象は
選択式で絞り込みます (`r;` は残基名による選択の省略形です →
[選択式の文法](../reference/selection.md))。

<!-- TODO(screenshot): New Renderer ダイアログ (ballstick + r; RET) と、レチナールが重なった分子ビュー -->

## 6. 背景と輪郭線で仕上げる

論文の図では白背景が定番です。**Scene &gt; Background &gt; White** で背景を白にします。

輪郭線 (エッジライン) を付けると、白背景でも各要素の境界がはっきりします。
cartoon と ballstick の各 Renderer をインスペクタで開き、**Common** セクションの
**Edge type** を **Edges** にします (→ [エッジライン](../reference/renderers/edge-lines.md))。

<!-- TODO(screenshot): 白背景 + エッジライン適用後の完成図 (適用前後の比較でも可) -->

## 7. カメラとシーンを保存する

視点が決まったら、カメラとして保存しておくと、後で同じ構図に戻せます。

1. シーンツリーの **Cameras** 行を右クリックし、**New Camera...** を選びます
2. 名前を付けて作成します。カメラ行のダブルクリックでいつでもその視点に戻れます
   (→ [カメラ](../reference/camera.md))

最後に **File &gt; Save Scene** (++cmd+s++ / ++ctrl+s++) でシーンを `.qsc` ファイルに
保存します。

## 次のステップ

- [論文用の高解像度画像を書き出す](publication-images.md) — この図をレイトレースで仕上げる
- [Coloring](../reference/coloring.md) / [選択式の文法](../reference/selection.md) — 塗り分けと選択の詳細
- [Renderer 一覧](../reference/renderers/index.md) — 他の表示方法を知る

---

*確認対象: CueMol3 2.3.8.494*
