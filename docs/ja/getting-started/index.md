# はじめに

## CueMol3 とは

**CueMol3** (開発コードネーム *tritium*) は、生体高分子 (タンパク質・核酸など) の立体構造を
可視化するためのソフトウェアです。X 線結晶構造解析やクライオ電子顕微鏡で得られた分子モデルを、
電子密度マップや分子表面と重ねて表示し、論文用の図を作成できます。

CueMol3 は CueMol2 の後継です。可視化エンジン (libcuemol2) は CueMol2 と共通のものを使っており、
シーンファイル (`.qsc`) の互換性が保たれています。一方で **GUI は全面的に作り直され**、
CueMol2 が採用していた Mozilla XULRunner から **Electron + React** に置き換わりました。

CueMol2 から何がどう変わったかは [CueMol2 からの変更点](../changes/index.md) を参照してください。

## 対応ファイル形式

libcuemol2 が読み書きできる形式で、CueMol2 と共通です。
ビルド構成によっては一部の形式が組み込まれていない場合があります。

### 分子座標 (読み込み)

| 形式 | 拡張子 |
|---|---|
| PDB | `.pdb` / `.ent` / `.pdb.gz` |
| mmCIF | `.cif` / `.cif.gz` |
| SYBYL Mol2 | `.mol2` |
| MOL / SDF | `.mol` / `.sdf` |

### 電子密度・ポテンシャルマップ (読み込み)

| 形式 | 拡張子 |
|---|---|
| CCP4 密度マップ | `.map` / `.ccp4` / `.mrc` / `.ccp4.gz` |
| XPLOR / CNS 密度マップ | `.map` / `.cns` |
| BRIX 密度マップ | `.brix` / `.omap` |
| MTZ 構造因子 | `.mtz` |
| mmCIF マップ係数 | `.cif` / `.cif.gz` |
| APBS 静電ポテンシャルマップ (OpenDX) | `.dx` |

### 分子表面・その他 (読み込み)

| 形式 | 拡張子 |
|---|---|
| MSMS 表面ファイル | `.face` / `.vert` |
| PLY ポリゴンファイル | `.ply` |

### MD トラジェクトリ (読み込み)

CueMol3 では File メニューの **Open MD Trajectory...** から MD シミュレーションの
トラジェクトリを読み込めます。

| 形式 | 拡張子 |
|---|---|
| AMBER トポロジー | `.prmtop` / `.parm7` / `.top` |
| AMBER NetCDF トラジェクトリ | `.nc` |
| DCD バイナリトラジェクトリ | `.dcd` |
| GROMACS 座標 / XTC / TRR | `.gro` / `.xtc` / `.trr` |
| NAMD 座標 | `.coor` |

### シーン (読み込み)

これらは File メニューの **Open Scene...** から読み込みます (Open File... には出てきません)。

| 形式 | 拡張子 |
|---|---|
| PyMOL セッション | `.pse` |
| CueMol シーン | `.qsc` |

### 書き出し

| 形式 | 用途 |
|---|---|
| CueMol シーン (`.qsc`) | シーン全体の保存。CueMol2 と互換 |
| PNG 画像 | 画面のスナップショット (Rendering &gt; Export scene) |
| Umbreon レイトレース画像 (PNG) | 内蔵レイトレーサによる高品位画像 (既定のレンダリング方式) |
| POV-Ray SDL (`.pov`) | 外部の POV-Ray 用シーン記述 (`.inc` も同時出力) |
| STL (`.stl`) | 3D プリンタ等の形状データ |
| Metasequoia (`.mqo`) | 3D モデリングソフト用 |
| PDB / MOL・SDF / PQR / XYZR | 分子 Object 単体の保存 (File &gt; Save File As...) |

## 動作環境

| OS | 配布形式 | 備考 |
|---|---|---|
| macOS (Apple Silicon / arm64) | `.dmg` | アドホック署名のみ。初回起動に手順が必要 |
| Windows (x64) | `.exe` (NSIS インストーラー) | 未署名のため SmartScreen 警告が出る |
| Linux (x64) | `.AppImage` / `.deb` | |

3D 表示に OpenGL が利用できる環境が必要です。

外部ツール (ffmpeg / APBS・PDB2PQR / 旧バックエンドの POV-Ray) は一部の機能でのみ使用します。
配布物に同梱されていない場合は Settings で実行ファイルのパスを指定してください
(→ [外部ツールの設定](../install/external-tools.md))。
レイトレーシングは内蔵の Umbreon で行うため、外部プログラムは不要です。

## ライセンス

CueMol は **MIT License** のもとで配布されています。**無保証**であり、利用は自己責任でお願いします。

- 非営利 (アカデミック) 組織のユーザーは、バイナリ・ソースコードともに無償で利用できます。
- 営利組織のユーザーも無償で利用できますが、主な用途をご連絡いただけると幸いです。

## 次のステップ

- [クイックツアー](quick-tour.md) — 起動から画像出力までの最短の流れ
- [インストール](../install/index.md) — 入手方法と OS ごとの手順
