# 設定項目

**Settings** タブの設定項目の一覧です。macOS ではアプリケーションメニューの
**Preferences...** (++cmd+comma++)、Windows / Linux では **Edit &gt; Options**
(++ctrl+k++) で開きます。

設定は左側のツリーで分類を選び、右側で値を編集します。

## Display

### Theme

| 項目 | 既定値 | 説明 |
|---|---|---|
| Dark Mode | ON | ダークテーマとライトテーマを切り替えます |

### Atom Labels

分子ビューに表示される原子ラベルの書式です。

| 項目 | 既定値 | 説明 |
|---|---|---|
| Atom Label Font | sans-serif | ラベルのフォント。システムにインストールされているフォントから選びます |
| Atom Label Size | 12 px | フォントサイズ (6〜72 px) |
| Atom Label Color | `#FFFF00` | ラベル文字の色 |
| Atom Label Bold | OFF | 太字にします |
| Atom Label Italic | OFF | 斜体にします |

### Rendering

レンダリングウィンドウが使う外部ツールのパスです。
配布物に同梱されている場合は既定値のままで動作します
(→ [外部ツールの設定](../install/external-tools.md))。

| 項目 | 説明 |
|---|---|
| POV-Ray Executable | POV-Ray の実行ファイルのパス |
| POV-Ray Include Directory | POV-Ray の標準インクルードファイルがあるディレクトリ |
| blendpng Executable | レンダリング結果のレイヤを合成する blendpng のパス |
| ffmpeg Executable | 動画のエンコードに使う ffmpeg のパス |

!!! note "既定のレンダリングには設定不要です"
    既定のレンダリングバックエンドである内蔵レイトレーサ **Umbreon** はライブラリに
    組み込まれているため、Settings に項目がありません。上表の POV-Ray と blendpng は、
    旧バックエンドの POV-Ray を選んだ場合にだけ使われます
    (→ [レンダリング](rendering.md))。

## Input

### Mouse & Navigation

| 項目 | 既定値 | 説明 |
|---|---|---|
| Pointing device | Auto-detect | スクロール入力を視点操作にどう対応づけるか。**Mouse** はホイールでズーム、**Mac trackpad** は 2 本指スクロールで平行移動・ピンチでズーム、**Auto-detect** はスクロールの特徴から推定します |
| XY Rotation Sensitivity | 0.8 | X / Y 軸まわりの回転の感度 (0.1〜5.0) |
| Pick Precision | 10 px | 原子や Object をクリックで拾うときの許容半径 (1〜50 px) |
| GPU Picking | ON | 描かれた形状そのものから当たり判定を行います。OFF にすると従来の原子の位置による判定に戻ります。動作の遅いマシン向けの逃げ道です。切り替えは即時に効きます |
| Hover Info | ON | ポインタの下にあるものを分子ビューの隅に表示します。OFF にすると当たり判定の呼び出し自体が止まります |
| Hover Highlight | ON | ポインタの下の要素を分子ビュー上で強調します。GPU Picking と Hover Info の両方が必要です |

→ [ピッキングとホバー表示](../ui/mouse-input.md#ピッキングとホバー表示)

## General

### Files

読み込んだファイルを、現在のシーンに加えるか新しいシーンで開くかを、経路ごとに指定します。

| 項目 | 既定値 | 説明 |
|---|---|---|
| Drag and drop opens into | Current scene | ウィンドウにドラッグ &amp; ドロップしたファイルの読み込み先。**Current scene** はアクティブなタブのシーンに加えます。**New scene** は専用のタブで開きます |
| File manager opens into | Current scene | ファイルマネージャ (Finder / エクスプローラ) からの「開く」、コマンドラインでの指定、起動中に別のインスタンスから渡されたファイルの読み込み先 |

- **File &gt; Open File... と Open Recent は、この設定によらず常に現在のシーンに
  読み込みます。** メニューを選ぶときはシーンを見ているので、行き先が変わると
  かえって驚くためです。
- シーンファイル (`.qsc`) はこの設定の対象外で、従来どおりの規則で開きます。
- **New scene** を選んでいても、アクティブなシーンが空 (何も読み込まれておらず、
  変更もされていない) の場合はそのシーンに読み込みます。
- まとめて開いた複数のファイルは 1 つのシーンを共有します。

## Tools

### APBS / PDB2PQR

静電ポテンシャルの計算に使う外部ツールの設定です
(→ [外部ツールの設定](../install/external-tools.md))。

| 項目 | 説明 |
|---|---|
| APBS Executable | 静電ポテンシャルマップを計算する APBS のパス |
| pdb2pqr Executable | 電荷と半径を割り当てる pdb2pqr のパス |
| pdb2pqr Force Field | pdb2pqr が電荷の割り当てに使う既定の力場 |

!!! note "設定の保存先"
    原子ラベルと視点操作の値はウィンドウを閉じるときにユーザースタイルとして保存され、
    それ以外はアプリケーションの設定として保存されます。API キーだけは例外で、
    OS の安全な保管領域に暗号化して保存されます。

## Plugins

### Installed

プラグインを有効・無効で切り替えます。行のラベルがプラグイン名、右のスイッチが
有効・無効です (→ [プラグイン](plugins/index.md))。

| 項目 | 既定値 | 説明 |
|---|---|---|
| AI Agent | OFF | 文章での指示からシーンを組み立てるチャットパネル (→ [AI Agent](plugins/ai-agent.md)) |
| MD Tools | OFF | **File &gt; Open MD Trajectory...** と下部パネルの **Trajectory** タブ |
| PyM Console | OFF | PyMOL 互換のコマンドライン (→ [PyM Console](plugins/pymconsole.md)) |
| Component Catalog | OFF | 画面部品のカタログ (CueMol3 の UI 開発用) |

切り替えられないプラグイン (Get PDB / Sequence Panel) は、この一覧には並びません。

### AI Agent

**AI Agent** を有効にすると現れるページです。使用するモデルと API キーを設定します。
項目の一覧は [AI Agent](plugins/ai-agent.md) を参照してください。

## 関連項目

- [Edit メニュー](../menu/edit.md)
- [外部ツールの設定](../install/external-tools.md)
- [レンダリング](rendering.md)
- [マウス・トラックパッド操作](../ui/mouse-input.md)

---

*確認対象: CueMol3 2.3.15.530*
