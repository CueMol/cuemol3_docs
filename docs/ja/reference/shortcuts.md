# キーボードショートカット

CueMol3 で使えるキーボードショートカットの一覧です。
macOS では ++cmd++、Windows / Linux では ++ctrl++ に読み替えてください。

!!! note "キーバインドは変更できません"
    現在のバージョンでは、ショートカットキーをユーザーが変更する機能はありません
    (→ [機能の統合・改名・廃止](../changes/features.md))。

## ファイル操作

| 操作 | ショートカット |
|---|---|
| New Tab | ++cmd+t++ |
| Open File... | ++cmd+o++ |
| Open Scene... | ++cmd+shift+o++ |
| Close Tab | ++cmd+w++ |
| Reload Scene | ++cmd+r++ |
| Save Scene | ++cmd+s++ |
| Save Scene As... | ++cmd+shift+s++ |

→ [File メニュー](../menu/file.md)

## 編集

| 操作 | ショートカット |
|---|---|
| Undo | ++cmd+z++ |
| Redo | ++ctrl+y++ (Windows / Linux)<br/>++cmd+shift+z++ (macOS) |
| Cut | ++cmd+x++ |
| Copy | ++cmd+c++ |
| Paste | ++cmd+v++ |
| Select All | ++cmd+a++ |

Cut / Copy / Paste はテキスト入力欄などに対する OS 標準の編集操作です。
シーンツリー上の Object や Renderer のコピー & ペーストは、
シーンツリーの右クリックメニューから行います。

++cmd+a++ (Select All) は、フォーカスのある場所によって働きが変わります。

→ [Edit メニュー](../menu/edit.md)

## 設定・終了

| 操作 | ショートカット |
|---|---|
| Preferences... (macOS) | ++cmd+comma++ |
| Options (Windows / Linux) | ++ctrl+k++ |
| Quit (Windows / Linux) | ++ctrl+q++ |
| Quit CueMol3 (macOS) | ++cmd+q++ |

## ツールパレットの切り替え

分子ビュー左端のツールパレットは、単独のアルファベットキーで切り替えられます。
テキスト入力欄にフォーカスがあるときや、修飾キーを押しているときは働きません。

| ツール | キー |
|---|---|
| Navigate | ++n++ |
| Rect Select | ++b++ |
| Lasso | ++l++ |
| Distance | ++d++ |
| Angle | ++a++ |
| Torsion | ++t++ |
| Add Bond | ++e++ |

→ [ツールバーとツールパレット](../ui/toolbar-tools.md)

## その他

| 操作 | キー |
|---|---|
| メニューを閉じる (Windows / Linux のメニューバー) | ++escape++ |

マウス・トラックパッドによる視点操作は
[マウス・トラックパッド操作](../ui/mouse-input.md) を参照してください。

## 関連項目

- [メニューリファレンス](../menu/index.md)
- [ツールバーとツールパレット](../ui/toolbar-tools.md)
- [マウス・トラックパッド操作](../ui/mouse-input.md)

---

*最終確認: 2026-08-11 / 確認対象: 開発版 (tritium)*
