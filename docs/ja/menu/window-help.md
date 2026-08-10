# Window / Help メニュー

## Window メニュー

*(CueMol3 で追加)*

CueMol3 はメインウィンドウとレンダリングウィンドウの 2 つのトップレベルウィンドウを持ちます。
このメニューで前面に出すウィンドウを切り替えます。

| 項目 | 説明 | ショートカット |
|---|---|---|
| Main Window | メインウィンドウを前面に出します。最小化・非表示になっている場合は復帰させます | |
| Rendering Window | レンダリングウィンドウを前面に出します。開いていない場合は開いてから前面に出します | |

!!! note "OS による違い"
    macOS ではメニューバーが OS 側 (アプリ全体で共有) にあるため、レンダリングウィンドウが前面のときも
    このメニューでメインウィンドウに戻れます。

    Windows / Linux ではメニューバーがメインウィンドウ内にあるため、レンダリングウィンドウから
    メインウィンドウに戻る場合はウィンドウを直接クリックしてください
    (レンダリングウィンドウは子ウィンドウではなく独立したウィンドウです)。

!!! info "CueMol2 の Window メニューとは別物です"
    CueMol2 の Window メニュー (Show/Hide Topbar / Clear log contents / Restore default panel location) は
    CueMol3 の UI 構成に対応しないため廃止されました。CueMol3 の Window メニューは
    ウィンドウ切り替え専用の新しいメニューです
    (→ [機能の統合・改名・廃止](../changes/features.md))。

## Help メニュー

**Windows / Linux のみ**表示されます。macOS では項目が About だけになるため、
アプリケーションメニューに統合されメニュー自体が表示されません。

| 項目 | 説明 | ショートカット |
|---|---|---|
| About CueMol3 | バージョン情報を表示します | |

!!! info "Mozilla 固有の項目は廃止されました"
    CueMol2 の Help メニューにあった About plugins... / About config... / Addon manager... / Console /
    Check for updates は、いずれも Mozilla XULRunner に固有の機能だったため、
    Electron ベースの CueMol3 では廃止されました。

---

*最終確認: 2026-08-10 / 確認対象: 開発版 (tritium)*
