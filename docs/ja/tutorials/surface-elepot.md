# 分子表面を静電ポテンシャルで色分けする

分子表面を生成し、APBS で計算した静電ポテンシャルで色分けして、
分子の電荷の偏りを示す図を作る手順を追います。
題材にはリゾチーム (PDB ID: **1QIO**) を使います。塩基性のタンパク質なので、
正電荷に偏った表面がはっきり見えます。

!!! info "撮影予定"
    このページには操作の流れを示すスクリーンショットを追加予定です。

<!-- TODO(screenshot): 完成イメージ。静電ポテンシャルで色分けされた分子表面 (正負の偏りがわかる向き) -->

## 1. 構造を読み込む

**File &gt; Get PDB...** で `1QIO` を取得します (座標のみで構いません)。
Renderer は **cartoon** を選んでおきます。

## 2. 分子表面を生成する

**Tools &gt; Mol surface generation...** を開きます。

1. **Target** の **Molecule** で 1QIO を選びます。分子の一部だけの表面を作る場合は
   **Use selection** で選択範囲を指定します (今回は分子全体のまま)
2. **Surface** の **Object name** (作られる Object の名前)、**Point density (/A)** (細かさ)、
   **Probe radius (A)** は既定のままで構いません
3. OK を押すと、分子表面の Object と molsurf Renderer が作られ、表面が表示されます

<!-- TODO(screenshot): Mol surface generation ダイアログと、生成直後の分子表面 -->

表面の Object と Renderer の詳細は [MolSurf](../reference/objects/molsurf.md) /
[molsurf](../reference/renderers/molsurf.md) を参照してください。

## 3. 静電ポテンシャルを計算する

**Tools &gt; APBS elepot calculation...** を開きます。

1. **Target** の **Molecule** で 1QIO を選びます
2. **Elepot name** (作られる電位マップ Object の名前) は既定のままで構いません
3. **Charge method** は既定の **Use PDB2PQR** のままにします
4. **Start** を押すと、pdb2pqr → apbs の順に計算が走り、進捗が表示されます。
   完了すると電位マップ (ElePotMap) の Object がシーンに追加されます

APBS と pdb2pqr は macOS / Windows の配布物に同梱されており、通常はインストールや
設定は不要です。同梱されていないビルド (Linux など) では、別途インストールして
Settings でパスを指定します (→ [外部ツールの設定](../install/external-tools.md))。

<!-- TODO(screenshot): APBS elepot calculation ダイアログ (実行中の進捗表示) -->

温度や誘電率などの計算条件は **APBS options** で変更できます。
電位マップ Object の詳細は [ElePotMap](../reference/objects/elepot.md) を参照してください。

## 4. 表面を電位で色分けする

1. 左サイドパネルの **Explorer &gt; Color** パネルを開きます
2. 上部で molsurf の Renderer を選びます
3. Coloring の種類から **Electrostatic potential** を選びます
4. **Potential** で、手順 3 で作った電位マップを選びます

表面が電位に応じたグラデーションで塗り分けられます。

- **High** / **Mid** / **Low** の各行で、電位の値とそのときの色を指定します。
  範囲を狭めるとコントラストが強くなります
- **By SAS** を有効にすると、溶媒接触面 (SAS) 上の電位で色を付けます

設定項目の詳細は [Coloring](../reference/coloring.md) を参照してください。

<!-- TODO(screenshot): Color パネルの Electrostatic potential 設定と、色分けされた表面 -->

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

*確認対象: CueMol3 2.3.8.494*
