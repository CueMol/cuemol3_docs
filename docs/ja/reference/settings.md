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

→ [マウス・トラックパッド操作](../ui/mouse-input.md)

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
    それ以外はアプリケーションの設定として保存されます。

## 関連項目

- [Edit メニュー](../menu/edit.md)
- [外部ツールの設定](../install/external-tools.md)
- [レンダリング](rendering.md)
- [マウス・トラックパッド操作](../ui/mouse-input.md)

---

*確認対象: CueMol3 2.3.7.489*
