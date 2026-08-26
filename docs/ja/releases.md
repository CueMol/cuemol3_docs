# 更新履歴

リリースごとの主な変更点です。お使いのバージョンは **Help &gt; About CueMol3** で確認できます。

!!! info "詳細は GitHub のリリースノートにあります"
    このページは、ふだん使ううえで知っておくとよい点だけをまとめたものです。
    修正の一件一件や内部の変更まで含む完全な記録は
    [GitHub の Releases](https://github.com/CueMol/cuemol2/releases) にあります。

    CueMol3 と CueMol2 は同じリリースで一緒に配布されるため、リリースノートには
    CueMol2 (UXP 版) の変更も含まれています。

## 2.3.10.504 (2026-08-26)

### 描画

- **インク画風のレンダリングを作り込めるようになりました。** Umbreon (NPR)
  バックエンドに **Detail** タブが加わり、ハッチングのレイヤ (線の角度・間隔・太さ、
  点の大きさなど) と陰影の付き方を編集できます。**Mark width** が網点や点描の
  スタイルにも効くようになりました → [NPR (インク画風レンダリング)](reference/rendering-npr.md)

### 分子表面

- **新しい生成アルゴリズム (MeshMS) を選べるようになりました。** 生成・再生成の
  ダイアログの **Algorithm** で切り替えます。既定の *Auto* のままで構いません
  → [MolSurfObj (分子表面)](reference/objects/molsurf.md#生成アルゴリズム-algorithm)
- **密度だけを変える再生成が速くなりました。** 密度に依存しない計算が再利用されます。

### 編集・コピー

- **CueMol2 との間でコピー &amp; ペーストができるようになりました。** OS のクリップボードを
  経由するようになったためです。Renderer・Object・カメラ・スタイル・Paint の行を、
  一方のアプリでコピーしてもう一方に貼り付けられます
  → [Edit メニュー](menu/edit.md#クリップボード)
- **++cmd+c++ / ++cmd+x++ / ++cmd+v++ がフォーカスに応じて働くようになりました。**
  テキスト入力欄ではテキスト、シーンツリーではノード、Paint の表では行に作用します。
  シーンツリーの **Cut** は新しく追加されたものです。
- **++cmd+z++ がテキスト入力中にシーンを巻き戻さなくなりました。**
- **Edit &gt; Clear undo data** が動作するようになりました。

### 画面と操作

- **シーンツリーで ++shift++ + クリックの範囲選択**ができるようになりました。
  複数選択したままコピーも行えます → [サイドパネル](ui/side-panels.md)
- **Paint の表に Delete all と Cut / Copy / Paste** が加わりました。
- **プロパティインスペクタの Generic タブ**で、色・ベクトル・時刻の値を編集できる
  ようになりました → [プロパティインスペクタ](ui/inspector.md)
- **ウィンドウのタイトルに、開いているシーンとビューの名前**が出るようになりました。
- 動作しなかったツールバーの **Save** ボタンと、Tools &gt; **Performance measure** は
  取り除かれました。

### 分子ツール

- **Create SYMM mol** を 3D ビューから使えるようになりました。対称分子の原子を
  右クリックすると、その対称コピーを新しい分子として取り出せます
  → [対称分子・単位格子を表示する](tutorials/symmetry.md)
- **Mol morphing animation** のダイアログが使えるようになりました。対象を MorphMol に
  変換してから、PDB ファイルやシーン中の分子をフレームとして追加します
  → [アニメーションを作って動画に出力する](tutorials/animation-movie.md)

### 配布物

- **ファイル名から対象の OS と役割が分かる**ようになりました
  (例: `CueMol3-2.3.10.504-macOS-arm64-Installer.dmg`) → [インストール](install/index.md#配布物一覧)
- **Windows と Linux でもファイルの関連付けが登録される**ようになりました。
  エクスプローラーの「プログラムから開く」やファイルマネージャの "Open With" に
  CueMol3 が並びます → [ファイルの関連付け](install/index.md#ファイルの関連付け)

!!! warning "Windows / Linux の x86-64 版は AVX2 対応の CPU が必要になりました"
    Intel Haswell / AMD Zen 以降 (おおむね 2013 年以降) の CPU が必要です。
    これより古い CPU では、**分子表面を生成したときに異常終了します**。
    macOS (Apple Silicon) は影響を受けません。

## 2.3.8.494 (2026-08-18)

### 描画

- **レイトレーサ Umbreon が配布ビルドに同梱**され、外部プログラムなしで使えるように
  なりました。以前のビルドでは無効化されていました → [レンダリング](reference/rendering.md)
- **インク画風の Umbreon (NPR) バックエンド**が追加されました
  → [NPR (インク画風レンダリング)](reference/rendering-npr.md)
- **動画の出力が復活しました。** レンダリングウィンドウに Still / Movie のモードが
  でき、ffmpeg でのエンコードまで行えます (配布物に同梱)
  → [レンダリングウィンドウ](ui/rendering-window.md)
- レンダリング結果は直近 50 件が履歴として残り、そのときの設定ごと呼び出せます。
- アンビエントオクルージョンがほとんど効かない、アンチエイリアシングが AO を有効に
  しないと働かない、エッジ線が 2 倍の太さで描かれる、といった不具合が修正されました。

### 分子動力学 (MD)

- **MD トラジェクトリの読み込みと再生**に対応しました。DCD / GROMACS XTC・TRR /
  AMBER NetCDF を読み込めます。**File &gt; Open MD Trajectory...** で開き、下部パネルの
  **Trajectory** タブで再生します → [下部パネル](ui/bottom-panels.md)

### 表示と着色

- 等値面の表示が大幅に高速になりました。
- **Multi-gradient (多色グラデーション) の編集**が、数値を入力するダイアログから、
  ヒストグラムの上でストップを直接ドラッグする形になりました
  → [Coloring](reference/coloring.md)
- 着色の設定が Coloring パネルに集約されました。

### ファイルと画面

- **ファイルをウィンドウにドラッグ &amp; ドロップ**して開けるようになりました。
  シェルやコマンドラインからも開けます → [File メニュー](menu/file.md)
- **選択ビルダー**が Named / History / Term / Mod の 4 タブになり、`protein` のような
  定義済みの選択を 1 クリックで適用できるようになりました
  → [選択ビルダー](ui/selection-builder.md)
- **APBS による静電ポテンシャル計算**が使えるようになりました (実行ファイルは同梱)
  → [分子表面を静電ポテンシャルで着色する](tutorials/surface-elepot.md)
- Windows の配布物が**ウィザード型のインストーラー**になりました
  → [Windows へのインストール](install/windows.md)

---

これ以前のリリース (2.3.7.484 など) については、
[GitHub の Releases](https://github.com/CueMol/cuemol2/releases) を参照してください。

## 関連項目

- [CueMol2 からの変更点](changes/index.md) — CueMol2 と CueMol3 の違い
- [開発状況と未実装機能](changes/status.md) — 現時点で残っている制限
- [ダウンロード](install/index.md#ダウンロード) — 配布物の入手方法

---

*確認対象: CueMol3 2.3.10.504*
