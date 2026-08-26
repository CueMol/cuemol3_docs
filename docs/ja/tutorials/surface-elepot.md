# 分子表面を静電ポテンシャルで着色する

分子表面を生成し、APBS で計算した静電ポテンシャルで着色して、
分子の電荷の偏りを示す図を作る手順を追います。
題材にはリゾチーム (PDB ID: **1QIO**) を使います。塩基性のタンパク質なので、
正電荷に偏った表面がはっきり見えます。

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。静電ポテンシャルで着色された分子表面 (正負の偏りがわかる向き) -->

## 1. 構造を読み込む

**File &gt; Get PDB...** で `1QIO` を取得します (座標のみで構いません)。
Renderer は **cartoon** を選んでおきます。

## 2. 分子表面を生成する

**Tools &gt; Mol surface generation...** を開きます。

1. **Target** の **Molecule** で 1QIO を選びます
2. **Use selection** を有効にし、選択式に `protein` を指定します。結晶構造には
   水分子が含まれており、そのままでは水の粒まで表面が計算されてしまうためです
3. **Point density (/A)** を **5** に上げます。表面の細かさの設定で、1QIO のような
   小さなタンパク質では上げるときれいな表面になります (巨大な分子では既定の 1 の
   ままの方が軽快です)
4. **Object name** と **Probe radius (A)** (水分子の半径 1.4 Å) は既定のままで構いません
5. **Algorithm** も既定の **Auto** のままで構いません (→
   [MolSurfObj (分子表面)](../reference/objects/molsurf.md#生成アルゴリズム-algorithm))
6. OK を押すと、分子表面の Object と molsurf Renderer が作られ、表面が表示されます

<!-- TODO(screenshot): Mol surface generation ダイアログと、生成直後の分子表面 -->

MolSurf Object は表面の形状だけを保持しており、molsurf Renderer はインスペクタの
**Selection mol** に指定された分子 (生成元の 1QIO) を参照して着色や選択を行います。
表面の一部だけを表示したいときは **Selection** で範囲を指定できます。
詳細は [MolSurf](../reference/objects/molsurf.md) /
[molsurf](../reference/renderers/molsurf.md) を参照してください。

## 3. 静電ポテンシャルを計算する

**Tools &gt; APBS elepot calculation...** を開きます。

1. **Target** の **Molecule** で 1QIO を選びます
2. こちらも **Use selection** を有効にし、`protein` を指定します
   (水やイオンを除いて計算するのが普通です)
3. **Elepot name** (作られる静電ポテンシャルマップ Object の名前) は既定のままで構いません
4. **Charge method** は既定の **Use PDB2PQR** のままにします
5. **Start** を押すと、pdb2pqr → apbs の順に計算が走り、進捗が表示されます。
   分子が大きい場合は時間がかかります。完了すると静電ポテンシャルマップ (ElePotMap) の
   Object がシーンに追加されます

APBS と pdb2pqr は macOS / Windows の配布物に同梱されており、通常はインストールや
設定は不要です。同梱されていないビルド (Linux など) では、別途インストールして
Settings でパスを指定します (→ [外部ツールの設定](../install/external-tools.md))。

<!-- TODO(screenshot): APBS elepot calculation ダイアログ (実行中の進捗表示) -->

温度や誘電率などの計算条件は **APBS options** で変更できます。
シーンには、マップが計算された範囲を示す枠 (`*unitcell` Renderer) も追加されます。
範囲が十分なことを確かめたら、非表示にして構いません。
静電ポテンシャルマップ Object の詳細は [ElePotMap](../reference/objects/elepot.md) を
参照してください。

## 4. 表面を静電ポテンシャルで着色する

1. 左サイドパネルの **Explorer &gt; Color** パネルを開きます
2. 上部で molsurf の Renderer を選びます
3. Coloring の種類から **Electrostatic potential** を選びます
4. **Potential** で、手順 3 で作った静電ポテンシャルマップを選びます
5. **By SAS** を有効にします。表面 (SES) 上の値そのままでは電荷のある原子に近すぎて
   まだらな着色になりがちなので、表面から水分子の半径 (1.4 Å) だけ外側の
   溶媒接触表面 (SAS) 上の値で着色します
6. **High** を **2**、**Low** を **-2** 程度にします。値の単位は kT/e で、
   既定の ±10 のままでは色がほとんど付きません。範囲を狭めるほど
   コントラストが強くなります

設定項目の詳細は [Coloring](../reference/coloring.md) を参照してください。

<!-- TODO(screenshot): Color パネルの Electrostatic potential 設定と、着色された表面 -->

## 5. 半透明の表面と cartoon を重ねる

表面の内側の構造も見せたい場合は、表面を半透明にして cartoon と重ねます。

1. 左サイドパネルの **Explorer &gt; Scene** ツリー (シーンツリー) で
   molsurf の Renderer を選びます
2. プロパティインスペクタの **Common** セクションで **Opacity** を 0.5 前後に下げます

表面越しに主鎖の走行が見える、定番の重ね図になります。
仕上げと書き出しは [論文用の高解像度画像を書き出す](publication-images.md) を参照してください。

<!-- TODO(screenshot): 半透明表面 + cartoon の重ね図 -->

## 次のステップ

- [論文用の高解像度画像を書き出す](publication-images.md) — この図をレイトレースで仕上げる
- [Coloring](../reference/coloring.md) — 静電ポテンシャルの設定項目
- [MolSurf](../reference/objects/molsurf.md) / [ElePotMap](../reference/objects/elepot.md) — 生成される Object の詳細

---

*確認対象: CueMol3 2.3.10.504*
