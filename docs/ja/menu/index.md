# メニューリファレンス

CueMol3 のメニューバーにある全項目の一覧です。CueMol2 から改名・移動・廃止された項目については
[機能の統合・改名・廃止](../changes/features.md) も参照してください。

## OS による違い

メニューの内容は OS によって少し異なります。

| | macOS | Windows / Linux |
|---|---|---|
| メニューバーの位置 | 画面上部のシステムメニューバー (OS ネイティブ) | ウィンドウ内の上部 |
| アプリケーションメニュー | あり (下記参照) | なし |
| 設定を開く項目 | アプリケーションメニュー &gt; **Preferences...** | **Edit &gt; Options** |
| 終了 | アプリケーションメニュー &gt; **Quit CueMol3** | **File &gt; Quit** |
| **About CueMol3** | アプリケーションメニュー内 | **Help** メニュー内 |
| **Help** メニュー | 表示されない (項目が About だけで、それが App メニューにあるため) | 表示される |

修飾キーの表記は macOS では ++cmd++、Windows / Linux では ++ctrl++ に読み替えてください。
本リファレンスでは ++cmd++ で表記し、必要に応じて併記します。

## macOS アプリケーションメニュー

macOS では、アプリケーション名 (**CueMol3**) のメニューに次の項目があります。

| 項目 | 説明 | ショートカット |
|---|---|---|
| About CueMol3 | バージョン情報を表示します | |
| Preferences... | Settings タブを開きます (すでに開いていればそのタブに切り替えます) | ++cmd+comma++ |
| Services | macOS の Services メニュー | |
| Hide CueMol3 | ウィンドウを隠します | ++cmd+h++ |
| Hide Others | 他のアプリのウィンドウを隠します | ++cmd+opt+h++ |
| Show All | すべてのウィンドウを再表示します | |
| Quit CueMol3 | CueMol3 を終了します。未保存のシーンがある場合は確認します | ++cmd+q++ |

## 各メニュー

<div class="grid cards" markdown>

- **[File](file.md)** — シーン・オブジェクトの読み書き、タブ操作
- **[Edit](edit.md)** — 取り消し、分子の編集、設定
- **[Rendering](rendering.md)** — 画像・動画の出力、シーンのエクスポート
- **[Scene](scene.md)** — 背景色、シーンのプロパティ
- **[View](view.md)** — 投影方式、中心マーク、ビューのプロパティ
- **[Tools](tools.md)** — 解析・計算ツール
- **[Window / Help](window-help.md)** — ウィンドウの切り替え、バージョン情報

</div>

## 凡例

各ページの表では、次の記号を使います。

| 記号 | 意味 |
|---|---|
| <span class="badge-wip">開発中</span> | メニューには存在しますが、**現在のバージョンでは動作しません**。選んでも何も起こりません |
| *(CueMol3 で追加)* | CueMol2 にはなく、CueMol3 で新設された項目 |
| *(CueMol3 で改名)* | CueMol2 から名前が変わった項目 |

CueMol2 にあって CueMol3 のメニューから**なくなった**項目は、本リファレンスには掲載していません。
移動先や代替手段は [機能の統合・改名・廃止](../changes/features.md) にまとめています。

---

*最終確認: 2026-08-10 / 確認対象: 開発版 (tritium)*
