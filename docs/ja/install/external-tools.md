# 外部ツールの設定

CueMol3 の一部の機能は、外部プログラムを呼び出して実行します。
配布物に同梱されている場合はそのまま使えますが、同梱されていないビルドでは
**Settings** で実行ファイルのパスを指定する必要があります。

## Settings タブを開く

Settings は独立したウィンドウではなく、コンテンツ領域の**タブ**として開きます。

| OS | 操作 |
|---|---|
| macOS | アプリケーションメニュー &gt; **Preferences...** (++cmd+comma++) |
| Windows / Linux | **Edit &gt; Options** (++ctrl+k++) |
| 共通 | 左端アクティビティバー下部の歯車アイコン |

すでに Settings タブが開いている場合は、そのタブがアクティブになります。

<!-- TODO(screenshot): Settings タブ (左のカテゴリツリーと右の設定項目) -->

## 外部ツールと設定項目

### Display &gt; Rendering

レンダリングウィンドウで使うツールです。

!!! note "レイトレーシングに外部ツールは不要です"
    CueMol3 の既定のレンダリングバックエンドは内蔵レイトレーサの **Umbreon** で、
    ライブラリに組み込まれているため設定は不要です。下記のうち POV-Ray と blendpng は、
    旧バックエンドである POV-Ray を選んだ場合にだけ使われます
    (→ [レンダリング](../reference/rendering.md))。

| 設定項目 | 対象 | 用途 |
|---|---|---|
| POV-Ray Executable | POV-Ray 本体 | POV-Ray バックエンドによるレイトレーシング |
| POV-Ray Include Directory | POV-Ray の標準インクルードファイルのディレクトリ | 同上 |
| blendpng Executable | blendpng | POV-Ray バックエンドでのレンダリング結果のレイヤ合成 |
| ffmpeg Executable | ffmpeg | 動画 (Movie) 出力のエンコード。バックエンドによらず必要です |

### Tools &gt; APBS / PDB2PQR

静電ポテンシャルマップの計算 (**Tools &gt; APBS elepot calculation...**) で使います。

| 設定項目 | 用途 |
|---|---|
| APBS Executable | APBS 本体のパス |
| pdb2pqr Executable | pdb2pqr のパス (電荷と半径の割り当て) |
| pdb2pqr Force Field | pdb2pqr が使う既定の力場 |

!!! warning
    APBS と pdb2pqr のパスが未設定の場合、APBS ダイアログの **Start** ボタンは押せません。

## パスの指定方法

各項目の入力欄にはファイル選択ボタンが付いています。ボタンからファイル (または
POV-Ray Include Directory の場合はディレクトリ) を選ぶか、パスを直接入力してください。
設定はアプリケーションに永続化され、次回起動時にも保持されます。

## 同梱状況

| OS | ffmpeg / APBS・PDB2PQR / POV-Ray |
|---|---|
| macOS (CI ビルド) | 同梱 |
| Windows (CI ビルド) | 同梱 |
| Linux | 同梱されない (別途導入が必要) |
| 手元でパッケージングしたビルド | 準備状況によっては同梱されない |

同梱されていない場合でも、対象のプログラムを別途インストールして上記のパスを設定すれば機能します。

Umbreon はライブラリの一部として組み込まれているため、この表には含まれません。
どの OS の配布物でも、レイトレーシングは追加の導入なしに使えます。
