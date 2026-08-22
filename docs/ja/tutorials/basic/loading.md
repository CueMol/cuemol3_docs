# 構造の読み込みと表示

分子構造を読み込んで表示するまでの操作と、CueMol3 の中心にある
**Scene / Object / Renderer** の考え方を学びます。
題材には 1.2 Å 分解能のリゾチームの結晶構造 (PDB ID: **1QIO**) を使います。

基本操作コースの各ページは、この順に進めると前のページの状態を引き継げます。

## 1. 構造を読み込む

**File &gt; Get PDB...** を開き、**PDB Accession Code** に `1QIO` と入力して取得します。
手元のファイルを開く場合は **File &gt; Open File...** (++cmd+o++) を使います
(→ [File メニュー](../../menu/file.md))。

![Get PDB ダイアログ](../../../assets/images/tutorials/basic/loading/1-getpdb.webp){ width="380" .on-glb }

ダウンロード中は `Downloading 1QIO…` という進捗画面が出ます。**Cancel** を押せば中断できます。
存在しない ID を入れた場合は **Get PDB failed** というエラーが表示されます。

取得が終わると、**Open File Options** の画面が出ます。いちばん上にはこれから読み込む
ファイル名 (`1qio.cif`) と、CueMol3 が判別したファイル形式 (`mmCIF`) が表示されます。

1. **Object name** を `lysozyme` に変更します。読み込まれたデータは **Object** と呼ばれ、
   CueMol の中ではこの名前で識別されます (既定ではファイル名由来の名前が入っています)
2. **Renderer type** から **simple** を選びます
3. **Renderer name** は選んだ種類から自動で決まります (`simple1`)。ここでは既定のままにします。
   この名前はシーンツリーやチュートリアルの以降の説明でそのまま使います
4. そのほかは既定のまま **Open** を押します

![Open File Options (Object name = lysozyme, Renderer type = simple)](../../../assets/images/tutorials/basic/loading/1-open-options.webp){ width="480" .on-glb }

分子が線画 (stick モデル) で表示されます。

![1QIO を lysozyme という名前で simple 表示したところ](../../../assets/images/tutorials/basic/loading/1-loaded.webp){ .on-glb }

### Renderer type の種類

よく使う表示方法には次のようなものがあります。

simple
:   線画の stick モデル。軽く、細部を確認する用途に向きます

trace
:   Cα (タンパク質) / リン原子 (核酸) を直線でつないだ最も軽い表示

ballstick
:   原子を球、結合を円柱で描くモデル

cpk
:   空間充填モデル

tube
:   主鎖を滑らかなチューブで描く表示

ribbon / cartoon
:   二次構造を反映したリボン表示。cartoon はヘリックスを筒状に描きます

nucl
:   核酸向けの主鎖チューブ + 塩基表示

全種類の一覧と詳細は [Renderer 一覧](../../reference/renderers/index.md) を参照してください。

**Renderer type** のリストの先頭には、**Presets** というグループがあります。ここから
**Default preset 1** などを選ぶと、Renderer を 1 つではなく、タンパク質は ribbon、核酸は
nucl、それ以外は ballstick、というように**複数の Renderer をまとめたグループ**が一度に
作られます。プリセットを選んだときは、下の **Selection** は使えなくなります。

### そのほかのオプション

- **Renderer name** — 作られる Renderer の名前。種類を選ぶと自動で埋まります
  (プリセットの場合はグループ名になります)
- **Selection** — チェックを入れると隣の欄が有効になり、**表示する範囲**を選択式で
  絞れます。読み込み自体は分子全体に対して行われるので、後から表示範囲を
  変更できます (→ [分子の一部を選択する](selection.md))
- **Center view on molecule after loading** — 読み込んだ分子へ視点を移動します。
  現在の視点を変更したくないときはチェックを外します
- **&lt;形式&gt;-specific options** — いちばん下の折りたたみです。開くと、その形式に固有の
  読み込み設定 (mmCIF / PDB なら **Load MODEL records**、**Load anisotropic U (ANISOU)**、
  **Load alternate conformations**、**Calculate secondary structure** など) が並びます。
  既定のままなら見出しの右に `(defaults)`、変更すると `(modified)` と表示されます

## 2. 視点を操作する

読み込んだ分子を、いろいろな向きから眺めてみます。

1. 分子ビュー上を**左ドラッグ**します。ドラッグした向きに分子が回転します
2. **ホイール**を回すと、表示が拡大・縮小されます
3. 左サイドパネルの **Explorer &gt; View** パネルで、**Zoom / Slab** の **Zoom** の値を
   クリックし、`40` と入力して ++enter++ を押すと、Zoom が 40 に設定されます

    ![View パネルの Zoom](../../../assets/images/tutorials/basic/loading/2-view-zoom.webp){ width="213" }

Zoom は分子ビューに映す範囲の高さ (Å) です。値を小さくすると、その分だけ分子が
大きく表示されます。マウスで動かすより正確に視点を合わせたいときに使います。

View パネルの各行は、次の 3 通りで操作できます。

- **左右の矢印**を押すと 1 段ずつ増減します
- 数値の上を**左右にドラッグ**すると連続して変化します
- 数値を**クリック**すると直接入力できる状態になり、++enter++ で確定します

**Rotation** (RotX / RotY / RotZ) は**相対値**で、操作するとその角度だけ回り、値は 0 に
戻ります。**Translation** (TraX / TraY / TraZ、Å) と **Zoom / Slab** (Zoom・Slab・Dist、Å) は
**絶対値**で、現在の視点の値がそのまま表示されます。

![View パネル。回転させた後でも Rotation は 0 に戻っており、Zoom には入力した 40 が残っている](../../../assets/images/tutorials/basic/loading/2-view-pane.webp){ width="237" .on-glb }

平行移動やスラブ (手前と奥を切り抜いて表示する範囲) の操作を含めた一覧は
[マウス・トラックパッド操作](../../ui/mouse-input.md)、View パネルの各項目は
[サイドパネル](../../ui/side-panels.md) を参照してください。

原子の上でクリックすると、その原子の名前がラベルとして分子ビューに表示されます
(もう一度クリックすると消えます)。同時に、**ウィンドウ最下部のステータスバー**と
**Output パネル**に、Object 名・チェイン・残基・原子名に加えて、占有率 (O)・温度因子 (B)・
座標が出ます。

右クリックするとメニューが開きます。**先頭の行はいま指している原子の情報**で、選んでも
何も起きません。その下の **Center at this atom** を選ぶと、その原子がビューの中央に来る
ように視点が移ります。さらに下には選択のための項目が並びます
(→ [分子の一部を選択する](selection.md))。

## 3. もう 1 つ分子を読み込む

同じシーンには複数の Object を読み込めます。ここでは `1G59`
(グルタミル tRNA 合成酵素と tRNA の複合体) を追加します。

1. **File &gt; Get PDB...** を開き、**PDB Accession Code** に `1G59` と入力して
   **Download** を押します
2. **Renderer type** から **trace** を選びます

    ![Renderer type に trace を選ぶ](../../../assets/images/tutorials/basic/loading/3-open-options.webp){ width="480" .on-glb }

3. **Object name** は既定のまま (`1g59`) にして **Open** を押します

タンパク質は Cα 原子、核酸はリン原子だけをつないだ軽量な表示で描かれます。1G59 の
非対称単位には複合体が 2 組 (タンパク質 2 本 + tRNA 2 本) 入っているので、同じ形が
2 つ現れます。

読み込むと視点は新しい分子へ移る (**Center view on molecule after loading** が既定でオン)
ため、この時点ではリゾチームは見えません。両方を同時に見るには、§2 と同じ要領で View
パネルの 2 つの値を広げます。

1. **Zoom** に `300` と入力します
2. **Slab** に `300` と入力します

Zoom だけを広げても見えるようにはなりません。**Slab** (奥行き方向に表示する厚み) が
既定の 50 Å のままだと、1G59 から 100 Å ほど離れた位置にあるリゾチームは奥行きで
切り落とされてしまうためです。両方を広げると、1G59 の複合体 2 組と、その左側に
小さくリゾチームが入ります。

![1g59 の複合体 2 組と lysozyme (左側の小さな塊) が入った表示](../../../assets/images/tutorials/basic/loading/3-two-objects.webp){ .on-glb }

特定の Object だけを見たいときは、シーンツリーでその行を選び、パネル上部の **Focus**
ボタンを押します。その Object に合わせて Zoom と Slab が自動で調整されます。

## 4. Scene・Object・Renderer・View

ここまでに登場した概念を整理します。

Object
:   分子座標・電子密度・静電ポテンシャルなどの**データ**。それ自身は画面に現れません

Renderer
:   Object を画面に**表示する**役割。1 つの Object に複数の Renderer を付けられるので、
    同じ分子を ribbon と ballstick で同時に表示する、といったことができます

Scene
:   Object と Renderer をまとめた 1 つの作業単位。ウィンドウ上部の**タブ**が
    シーンに対応し、複数のシーンを開いても互いに干渉しません

View
:   シーンを映す画面 (分子ビュー) のこと。1 つのシーンに複数の View を
    接続することもできます (→ [File メニュー](../../menu/file.md) の New Tab)

![Scene / Object / Renderer / View の関係](../../../assets/images/tutorials/basic/loading/scene-concept.png){ .on-glb }

シーンとは、複数の Object と、それらに接続された Renderer を含む全体だと捉えてください。

## 5. シーンツリーで全体を把握する

左サイドパネルの **Explorer &gt; Scene** ツリー (シーンツリー) には、シーン内の
Object とその配下の Renderer が階層で表示されます (→ [サイドパネル](../../ui/side-panels.md))。

行の表記は **`名前 (型)`** です。名前の左の**三角**をクリックすると、その Object に
接続された Renderer の一覧を開いたり閉じたりできます。いまのツリーは次のように読みます。

- シーン `Untitled 1` に `lysozyme` と `1g59` の 2 つの Object がある
  (Get PDB で読み込むと、Object 名は PDB ID の小文字になります)
- `1g59 (MolCoord)` — Object `1g59` の型は MolCoord (分子座標) である
- `trace1 (trace)` — `1g59` に接続された Renderer `trace1` の型は trace である
- `(*selection)` — 名前のない Renderer は括弧と型だけが表示されます。これは選択部分を
  ハイライト表示するための Renderer で、分子を読み込むと自動で作られます

いちばん下の **Camera** と **Styles** は、それぞれ保存した視点とスタイルの置き場所です
(→ [カメラとシーンの保存](camera-scene.md))。

### 目のアイコンとパネル上部のボタン

- 行の**目のアイコン**で Renderer の表示・非表示を切り替えられます。Object 行で
  切り替えると、配下の Renderer がまとめて切り替わります
- パネル上部には 4 つのボタンがあります (ポインタを載せると名前が出ます)

| ボタン | 動作 |
|---|---|
| **Add** | 選んでいる Object に Renderer を追加します (右クリックの New Renderer と同じ) |
| **Focus** | 選んでいる Object や Renderer に合わせて視点 (Zoom と Slab) を調整します |
| **Delete** | 選んでいる Object や Renderer を削除します。Undo で戻せます |
| **Property** | 選んでいる項目をプロパティインスペクタに表示します |

シーン行を右クリックすると **Background color** から背景色を変えられます。

![シーンツリー (lysozyme / 1g59 と各 Renderer)](../../../assets/images/tutorials/basic/loading/5-scene-tree.webp){ width="253" .on-glb }

## 次のステップ

- [分子の一部を選択する](selection.md) — 操作対象を選ぶ方法
- [マウス・トラックパッド操作](../../ui/mouse-input.md) / [サイドパネル](../../ui/side-panels.md)

---

*確認対象: CueMol3 2.3.8.495*
