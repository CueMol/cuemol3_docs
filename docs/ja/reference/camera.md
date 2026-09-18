# カメラ

**カメラ**は視点の状態 (位置・向き・拡大率・スラブ) を名前を付けて保存したものです。
サイドパネルの **View &gt; Camera** に一覧表示され、いつでも呼び出して同じ視点に戻せます。

!!! info "準備中"
    このページは骨組みのみです。各項目の詳細は今後追加されます。

## カメラの操作

アクティビティバーの **View** を選ぶと現れる **Camera パネル**で操作します
(→ [サイドパネル](../ui/side-panels.md#camera-パネル))。
よく使う 6 つはツールバーのボタンに、それ以外は行の右クリックメニューにあります。

下表の「右クリック」の列はメニューの項目名、「ツールバー」の列はボタンのツールチップです。

| 右クリックメニュー | ツールバー | 内容 |
|---|---|---|
| New Camera... | New camera from view | 現在の視点から新しいカメラを作ります。同じ名前のカメラがあると確認なしで上書きされます |
| Save from view | Save from view | 選んでいるカメラに現在の視点を上書きします |
| Save from scene (with vis flags) | Save from view with show/hide | 同上。表示フラグも一緒に保存します |
| Apply to view | Apply to view | 保存した視点に戻します |
| Apply to scene (with vis flags) | Apply to view with show/hide | 同上。表示フラグも復元します。行のダブルクリックでも行えます |
| Delete | Delete | カメラを削除します。++delete++ / ++backspace++ キーでも行えます |
| Rename... | — | 名前を変更します。++f2++ でも行えます |
| Copy / Paste Camera | — | カメラをコピー・貼り付けます。Edit メニューと ++cmd+c++ / ++cmd+v++ でも行えます |
| Camera file &gt; Load... / Reload / Save / Save As... | — | カメラファイル (`.cam`) を読み書きします。**Reload** はファイルから読み込んだカメラでのみ選べます |
| Edit vis flags... / Clear vis flags | — | 表示フラグを編集・消去します。**Clear vis flags** はフラグを持つカメラでのみ選べます |

一覧の順序は行をドラッグして変更でき、シーンファイルに保存されます。
`__current` は先頭に固定され、並べ替えの対象外です。

!!! note "CueMol2 (UXP 版) ではカメラの順序が保たれません"
    順序は CueMol3 で導入されたものです。順序を付けたシーンを CueMol2 で保存し直すと、
    カメラは名前順に戻ります。

## カメラが保持する情報

<!-- TODO(content): カメラのプロパティ (中心位置 / 回転 / ズーム / スラブなど) を
     C++ の Camera 定義から起こす -->

## カメラファイル (`.cam`)

現在のビューのカメラは、File メニューの **Save current view...** で
`.cam` ファイルに書き出せます (→ [File メニュー](../menu/file.md))。

<!-- TODO(content): .cam ファイルの読み込み経路と、Camera パネルのカメラとの関係 -->

## 表示フラグ

カメラには、そのカメラを適用したときに各 Renderer を表示するかどうかの
フラグを持たせられます。視点ごとに見せる要素を切り替えたい場合に使います。

<!-- TODO(content): 表示フラグの編集ダイアログ (EditCameraVisFlags) の項目を記載 -->

## 関連項目

- [アニメーション](animation/index.md) — [CamMotion](animation/cammotion.md) はカメラを対象にします
- [File メニュー](../menu/file.md)
- [サイドパネル](../ui/side-panels.md#camera-パネル)

---

*確認対象: CueMol3 2.3.15.530*
