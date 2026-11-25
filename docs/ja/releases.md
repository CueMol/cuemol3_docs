# 更新履歴

リリースごとの主な変更点です。お使いのバージョンは **Help &gt; About CueMol3** で確認できます。

!!! info "詳細は GitHub のリリースノートにあります"
    このページは、ふだん使ううえで知っておくとよい点だけをまとめたものです。
    修正の一件一件や内部の変更まで含む完全な記録は
    [GitHub の Releases](https://github.com/CueMol/cuemol3/releases) にあります。

    CueMol3 と CueMol2 は同じリリースで一緒に配布されるため、リリースノートには
    CueMol2 (UXP 版) の変更も含まれています。

このページには直近の 5 リリースを載せています。それより前は
[過去のリリース](releases-archive.md)を参照してください。

## 3.0.6.577 (2026-11-25)

### 分子の色を選ぶ

- **Coloring の種類の Paint coloring で、分子の主色をパレットの色から選ぶことができるようになりました。**
  Okabe-Ito・Paul Tol (Tol bright / vibrant / muted / light)・ColorBrewer (Brewer Set2 / Dark2)・
  Tableau 10 の各テーマの色が、名前と色見本付きで並びます。選んだ色で helix と sheet を塗り、
  核酸は色相を少しずらした色、コイルなどは白っぽくした色で塗ります。→ [Coloring](reference/coloring.md#paint)
- CueMol2 と CueMol1 の既定の配色 (**CueMol2 default** / **CueMol1 (woody)**) も、同じメニューから
  選ぶことができます。単色の配色 (Red など) は色相の順に並ぶようになりました。
- 分子の色に従う **Molecule color** は、Coloring の種類の先頭の項目になりました。
  Renderer の右クリックメニューの **Coloring** にも同じ項目が並びます。
- Paint の **Default** の項目は無くなりました。読み込んだ分子には、これまでどおり分子ごとの色が
  自動で付きます。
- Console の `set_renderer_coloring` で `paintColor` (`okabeito_3` などのテーマの色、または
  `cuemol2` / `cuemol1`) を指定できるようになりました。テーマとその色の一覧は
  `list_coloring_styles` で得ることができます。

### 分子ビューと分子表面

- **Fast GI の既定の明るさが上がりました。** GTAO とアンビエントオクルージョンなしの明るさは
  変わりません。→ [Scene](reference/scene.md#ambient-occlusion)
- dsurface の **Algorithm** の既定が **MeshMS (analytic SES)** になりました。Surface type が
  Solvent excluded 以外のときなど MeshMS を使えない場合は、これまでどおり距離場に切り替えて作ります。
  → [dsurface](reference/renderers/dsurface.md#algorithm)

### cuetty (コマンドラインでのレンダリング)

- **Linux 用のポータブル版 (`cuetty-3.0.6.577-linux-x64.tar.gz`) を配布するようになりました。**
  展開するだけで、GPU やディスプレイの無いクラスタの計算ノードで使うことができます。
- **シーンのアニメーションを、動画のフレーム (連番の PNG) として書き出すことができるようになりました**
  (`--movie`)。フレームを複数のジョブに分けて描くこと (`--frames` / `--shard`) や、中断したジョブの
  続きから描くこと (`--skip-existing`) もできます。
- スレッドの数を `--threads` で指定できるようになりました。指定しない場合は、Slurm の割り当て
  (`SLURM_CPUS_PER_TASK`) か `OMP_NUM_THREADS` に従います。
  → [コマンドラインでのレンダリング (cuetty)](reference/cuetty.md)

!!! warning "以前のバージョンから変わる点"
    - **Algorithm を設定せずに保存したシーンの dsurface は、MeshMS (analytic SES) で開きます。**
      以前と同じ作り方にするには、Algorithm を **Distance field** にしてください。
    - **cuetty は、データを読み込みきれないシーン (参照先のファイルが無い、埋め込んだデータが
      読めないなど) をエラーで終了するようになりました。** 以前は欠けたまま描画していました。

## 3.0.5.576 (2026-11-24)

### 分子ビューの陰影 (Fast GI)

- **アンビエントオクルージョンに新しい方式 Fast GI が加わり、既定になりました。** 分子表面・CPK・
  cartoon の凹みやサブユニットの間がはっきり暗くなり、奥行き感が強く出ます。Scene のプロパティの
  **Ambient occlusion &gt; Method** で、以前からの GTAO と切り替えることができます。
  → [Scene](reference/scene.md#ambient-occlusion)
- Fast GI では、照り返しの強さ (**Indirect light**) と大きな凹みの陰影の強さ (**Baked occlusion**) を
  調整できます。
- Scene のプロパティに **Lighting &gt; Brightness** が加わりました。陰影の付き方を保ったまま、
  シーン全体の明るさを変えることができます。→ [Scene](reference/scene.md#lighting)
- 新しいシーンは、アンチエイリアシングが **High**、アンビエントオクルージョンが**有効**
  (Preset は **Medium**) で作られるようになりました。New Tab ダイアログで保存した既定はそのまま使われます。

### マテリアル

- **Renderer のマテリアル (質感) が分子ビューにも反映されるようになりました。** 以前は
  レンダリングウィンドウで書き出す画像にだけ反映されていました。レンダリングウィンドウの見え方も、
  分子ビューに合わせて調整されています。→ [マテリアル](reference/renderers/material.md)
- 釉薬のかかった陶器のような **`ceramic`**、磨いたプラスチックの **`plastic`**、つや消しの
  **`matte_plastic`** が加わりました。既定 (`default`) は `matte_plastic` と同じ、つや消しの
  プラスチックになりました。
- 金属 (`diff_metal` / `spec_metal`) は空のグラデーションを映し、ハイライトに地の色が付くように
  なりました。`toon1` / `toon2` は、アンビエントオクルージョンが無効のとき POV-Ray に近い平らな
  階調になります。

### 半透明の Renderer

- **半透明の Renderer が、分子ビューでもレンダリングウィンドウと同じ方式で重なるようになりました。**
  1 つの Renderer の中ではいちばん手前の面だけが見え、半透明の Renderer どうしが重なっても
  描く順番によらず同じ色になります。**Label on top** のラベルは上に表示されたままです。
- 半透明の表面で分子を包んでも、Fast GI で中の構造が暗くならなくなりました。
  → [半透明の Renderer の重なり方](reference/renderers/common.md#半透明の-renderer-の重なり方)

### 密度マップ

- **Density map パネルの Level が、マップの密度のヒストグラムになりました。** ヒストグラム上の
  マーカーをドラッグするかクリックしてレベルを決めます (++shift++ で細かく、++esc++ で取り消し)。
  値を入力欄に打ち込むこともできます。→ [サイドパネル](ui/side-panels.md#density-map-パネル)

### 動画

- **H.264 / H.265 の動画を、画質の段階 (Quality: High / Standard / Small file) で
  エンコードするようになりました。** 以前の既定の 1024 kbps では、細い線や輪郭がブロック状に
  崩れていました。一定のビットレートで指定する場合は **Rate control** で Bit rate を選びます
  (既定 10240 kbps)。→ [レンダリングウィンドウ](ui/rendering-window.md#動画-movie-モード)

!!! warning "以前のバージョンから変わる点"
    - **新しいシーンの見た目が変わります。** アンビエントオクルージョン (Fast GI) が有効になり、
      既定のマテリアルにも弱いハイライトが付きます。以前のように陰影なしで始めたいときは、
      New Tab ダイアログでアンビエントオクルージョンを無効にしてください。
    - **3.0.3.565 以前に保存したシーンは、GTAO と当時の設定で開きます。** 保存し直しても
      同じ見た目のままです。Fast GI にするには、Scene のプロパティで **Method** を切り替えてください。
    - **マテリアルを指定していない Renderer も、レンダリングウィンドウでの見え方が変わります。**
      既定のマテリアルが、つや消しのプラスチックになったためです。

## 3.0.3.565 (2026-11-18)

### シーンの見た目 (CueMol3 / Legacy mode)

- **シーンごとに、CueMol3 の見た目と CueMol2 の見た目 (Legacy mode) を持つようになりました。**
  CueMol2 で作ったシーンファイルは、CueMol2 で表示したときと同じ見た目 (ribbon と nucl の形、
  既定の色) で開きます。新しいシーンは CueMol3 の見た目で作られます。
- 開いているシーンは、Scene のプロパティの **Compatibility &gt; Legacy mode (CueMol2 look)** で
  切り替えることができます (1 回の Undo で戻せます)。既にある Renderer の形もすぐに変わり、以後に
  読み込む分子の色も見た目に従います。→ [Scene](reference/scene.md#compatibility)
- New Tab ダイアログと **Settings &gt; Display &gt; Compatibility** で、新しいシーンを Legacy mode で
  作るように設定できます。→ [設定項目](reference/settings.md#compatibility)
- シーンの保存オプションの **Compatibility** に **Ver 3.0 or later** (既定) が加わりました。
  → [シーンの保存](reference/save-scene.md#互換性-compatibility)

### カメラ

- **カメラをインスペクタに表示できるようになりました。** Camera パネルの **Property** ボタンか、
  右クリックメニューの **Properties...** で開き、名前・読み込み元・保存した視点・表示フラグを
  確認できます。行のダブルクリックは今までどおり適用です。
- **表示フラグはインスペクタの Visibility で編集するようになりました** (専用のダイアログは
  無くなりました)。1 回の変更が 1 回の Undo になり、**Capture** でシーンの現在の表示状態を
  記録できます。→ [カメラ](reference/camera.md#表示フラグ)
- **`__current` カメラは、どのシーンにも作成時からあるようになりました。** 現在の視点を表し、
  削除・名前の変更・上書き・適用はできません。Undo の対象ではなく、**Save current view...** で
  シーンが変更ありになることも無くなりました。→ [カメラ](reference/camera.md#__current)

### 画面と操作

- **時間のかかる処理 (シーンの保存・読み込み、ファイルの読み込み、分子表面の生成、書き出し、
  MD トラジェクトリの読み込み) の間、処理の名前と経過秒数が表示されるようになりました。**
  ステータスバーには「Busy」の代わりに同じ内容が表示され、5 秒以上かかった処理はかかった時間が残ります。
  → [画面構成](ui/index.md#時間のかかる処理)
- Animation パネルで帯をドラッグすると、長さと開始・終了の時刻が表示され、端が目盛りの 1/10 に
  揃うようになりました (++alt++ / ++option++ で自由に動かせます)。
  → [Animation パネル](ui/bottom-panels/animation.md#要素を編集する)
- ツールバーの **Save As** ボタンは **Save File As** になりました。

!!! warning "以前のバージョンから変わる点"
    - **3.0.2.560 以前の CueMol3 で保存したシーンは、Legacy mode (CueMol2 の見た目) で開きます。**
      CueMol3 の見た目に戻すには、Scene のプロパティで **Legacy mode** を OFF にしてください。
    - **Ver 3.0 or later で保存したシーンファイルは、3.0.3.565 より前の CueMol2 では開けません。**
      古い CueMol2 で開く必要があるときは、保存オプションで **Ver 2.3 or later** を選んでください。
      また、このシーンを CueMol2 で保存し直すと、Ver 3.0 の形式のまま保存されることがあります。

## 3.0.2.560 (2026-11-14)

### アニメーション

- **アニメーションの要素に Rock が追加されました。** 視点を振動させるアニメーションです。
  **Pattern** で Rock (1 軸の往復) / Nutate (視線が円を描く) / Wobble (8 の字) を選択し、振れ幅・回数・
  位相・振れ幅の時間変化 (Grow / Shrink) 等を設定することが可能です。
  → [RockSpin](reference/animation/rockspin.md)
- **Animation パネルで、要素を Cut / Copy / Paste できるようになりました** (**Edit** メニューと
  ++cmd+x++ / ++cmd+c++ / ++cmd+v++)。貼り付けた要素は、選んでいる要素の直後に
  挿入されます (長さはコピー元と同じです)。別のシーンへの貼り付けも可能です。→ [Animation パネル](ui/bottom-panels/animation.md)
- **Simple spin の Rotation angle に範囲が無くなりました。** 負の値で逆向きに回り、360° で 1 周します。

### Console からの視点の動き

- **ChX console の `turn` に `frames` を付けると、その回転をアニメーションの要素として追加し、
  1 回再生するようになりました。** `roll` / `rock` / `wobble` は `stop` までループで再生します
  (`stop` でループの設定は元に戻ります)。
- **PyM console の `movie.add_roll` / `movie.add_rock` / `movie.add_nutate` / `movie.roll` /
  `movie.rock` / `movie.nutate` / `movie.tdroll` が、アニメーションに要素を追加するようになりました**
  (`mplay` で再生します)。`rock` で揺れを開始・停止できます。
- 速さや位相は ChimeraX / PyMOL とおおよそ合わせてあるだけで、同じではありません。
  → [ChX console](reference/plugins/console/chx_console.md) /
  [PyM console](reference/plugins/console/pymconsole.md)

### Styles ビュー

- **アクティビティバーに Styles ビューが加わりました。** シーンから見えるスタイルセットを名前を探す順に
  並べ、選んだスタイルセットの名前付きの色 (**Colors**) と名前付き選択 (**Selections**) をその場で
  編集できます。スタイルセットはシーンツリーに表示されなくなりました。
  → [サイドパネル](ui/side-panels.md#styles)

### MD トラジェクトリ (MD Tools)

- **トラジェクトリのファイル (`.xtc` / `.dcd` / `.trr` / `.nc`) をドロップすると、開いている分子に
  付けられるようになりました。** 原子数の合う分子から付け先を選ぶと、その分子はトラジェクトリになり、
  元の座標が最初のフレームになります。
- **トポロジーだけのファイル (prmtop / PSF) を、座標の無い分子として開けるようになりました。**
  座標 (AMBER の restart、NAMD の `.coor`) やトラジェクトリは、あとからドロップして付けます。
  **File &gt; Open MD Trajectory...** でもトポロジーに prmtop / PSF を選択できます。
  → [Trajectory パネル](ui/bottom-panels/trajectory.md)

### 画面と操作

- **Get PDB で、リガンドを CCD コードで取得できるようになりました** (**CCD (ligand)**、RCSB の理想座標)。
  ChX console では `open ccd:ATP` で取得できます。→ [PDB からの取得](reference/get-pdb.md#ccd-ligand)
- nucl の **Base type** に、塩基を表示せずチューブだけを残す **None** が加わりました。
  → [nucl](reference/renderers/nucl.md)
- **履歴が 20 ステップを超えると、GUI で同じ値を続けて編集したステップが 1 つにまとめられるように
  なりました** (History パネルでは `×N` と表示されます)。
  → [操作の記録と再生](reference/actions.md#history-パネル)
- ChX console で、`alphafold` / `pae` などの AlphaFold のパレットを使えるようになりました。

!!! warning "以前のバージョンから変わる点"
    - **NAMD の `.coor` を PSF と一緒に開いたシーン (`srctype="namdcoor"`) は読み込めなくなりました。**
      PSF を開き、`.coor` をドロップして付け直してください。
    - **Console の native モードの `load_namd` は `load_psf` になりました** (PSF を開き、`coordFile` で
      `.coor` を指定します)。

## 3.0.1.555 (2026-11-10)

### PDB からの取得

- **Get PDB で、取得元のデータベースを選べるようになりました** (**Database**)。PDB / EMDB に加えて、
  **AlphaFold DB** (UniProt accession で予測構造を取得) と **PubChem** (CID で化合物の 3D 配座を取得) を選べます。
  入力すると、タンパク質名・生物種・平均の pLDDT や、化合物名・分子式・分子量が表示されます。
- **PDB のエントリの座標を、RCSB のほか PDBe / PDBj / PDB-REDO から取得できるようになりました** (**Server**)。
  電顕マップの取得元にも **PDBj** が加わりました。
- AlphaFold DB から取得した構造は、予測の信頼度 (pLDDT) の色で表示されます。PubChem の化合物は
  ball &amp; stick で表示されます。
- Console の native モードに、`fetch_entry` (上記のデータベースからの取得) と `fetch_map_url`
  (URL にある CCP4 / MRC のマップの取得) が加わりました。
  → [PDB からの取得](reference/get-pdb.md)

### B-factor の多色のグラデーション

- **Color パネルの Bfac/Occ で、複数の色を経由するグラデーションを使えるようになりました**
  (**Multi-colour gradient**)。原子の値のヒストグラムを見ながら、色の区切りを編集できます。
  編集は Undo で戻せ、シーンに保存されます。
- プリセットに、AlphaFold の pLDDT を ChimeraX と同じ色で塗る **AlphaFold pLDDT** が加わりました。
- PyM console の `spectrum b` / `spectrum q` に 3 色以上のパレット (`rainbow` など) を指定すると、
  PyMOL と同じく多色のグラデーションで塗るようになりました。
  → [Coloring](reference/coloring.md#bfacocc)

### 視点の合わせ方

- **シーンツリーの Focus で、表示しているものに合わせるようになりました。** 分子は表示中の Renderer が
  描いている原子に、密度マップは表示中の等高線に合わせます。小さなものでも、表示の幅は 15 Å より
  狭くしません。
- **読み込んだときの視点 (Center view on molecule after loading) も、Focus と同じく大きさまで合わせる
  ようになりました** (以前は中心だけを移していました)。電顕マップは、表示している等値面に合わせます。
  → [サイドパネル](ui/side-panels.md#explorer)

### ChX console

- **対応していないコマンドや書き方は、警告を出して飛ばし、スクリプトの残りを実行するようになりました**
  (ChimeraX の公式チュートリアルや図のスクリプトを最後まで流せます)。
- `open` で、`pdbe:` / `pdbj:` / `redo:` / `alphafold:` / `pubchem:` / `emdb:` などのデータベースの接頭辞、
  URL、複数の名前、`from eds` (2Fo-Fc マップ) を使えるようになりました。視点を合わせるのは、空のシーンに
  最初に開いたときだけです (ChimeraX と同じ)
- `volume` / `lighting` / `camera` / `nucleotides` / `ribbon` / `unitcell` / `dssp` / `preset` / `wait` /
  `color modify` / `color bfactor` / `color byattribute` などのコマンドと、ColorBrewer のパレットが加わりました。
- 隠した原子をもう一度表示すると、隠す前のスタイルで表示されるようになりました。
- Settings &gt; Plugins の表示名が **PyM console** / **ChX console** になりました。
  → [ChX console](reference/plugins/console/chx_console.md)

### 起動スクリプトとスタイルファイル

- **`~/.cuemol/` に置いたスクリプト (`startup.txt` / `.qax` / `.pml` / `.cxc`) を、起動のたびに
  Console で実行するようになりました。** 1 つのファイルが 1 回の Undo にまとまります。実行中は
  ステータスバーに表示が出て、そこから止められます。
- `~/.cuemol/styles/` に置いたスタイルファイル (`.xml`) を、起動時に読み取り専用のスタイルセットとして
  読み込むようになりました。
  → [ユーザーディレクトリ (~/.cuemol)](reference/dotfiles.md)

!!! warning "以前のバージョンから変わる点 (ChX console)"
    - **コマンド名の `c` は `camera` の省略になりました** (以前は `cartoon`)。`cartoon` は `car` などと
      打ってください。
    - **`color random` は拒否されるようになりました** (警告を出して飛ばします)。
    - **閉じた model の番号は、次に開いたものに再び使われるようになりました** (ChimeraX と同じ)

---

3.0.0.554 以前のリリースは[過去のリリース](releases-archive.md)にまとめてあります。

## 関連項目

- [過去のリリース](releases-archive.md) — 3.0.0.554 以前の更新履歴
- [CueMol2 からの変更点](changes/index.md) — CueMol2 と CueMol3 の違い
- [開発状況と未実装機能](changes/status.md) — 現時点で残っている制限
- [ダウンロード](install/index.md#ダウンロード) — 配布物の入手方法

---

*確認対象: CueMol3 3.0.6.577*
