# docs-verify — ドキュメント E2E 検証

クイックツアーやチュートリアルの手順を、実アプリ (tritium = Electron 版 CueMol3) 上で
Playwright により自動実行します。アプリの E2E 検証と、「ドキュメントの記述が現在の実装と
一致しているか」の機械検証を兼ねます。spec の `test.step` 名は対応する docs ページの
見出しと一致させてあり、ページを改稿したら対応 spec を追随させます (逆も同じ)。

## 前提

- macOS + 実ディスプレイ (実 GL コンテキストが必要なためヘッドレス/CI では動きません)
- cuemol2 リポジトリのビルド済み dev bundle:
  `<cuemol2>/build_scripts` で `task build_tritium` 済みであること
- go-task と Node.js (npm)
- `BUNDLE_APPS` (povray/apbs/ffmpeg の deplibs)。既定は `~/tmp/proj64_deplibs`

`npm run doctor` (または `task e2e` の冒頭) が前提を検査します。

## 実行方法 (リポジトリルートから)

```sh
task e2e          # smoke + クイックツアー (@net: Get PDB で実ネットワークを使う)
task e2e:offline  # ネット不要の smoke のみ
task e2e:slow     # 重いステップ (Umbreon レイトレース実行) も含める
task e2e:shots    # ドキュメント用スクリーンショットを撮影し docs/assets/images に書き出す
task e2e:report   # 直近の HTML レポートを開く
```

テスト対象アプリは `CUEMOL_FRESH_PREFS=1` で起動され、設定は一時ディレクトリに
隔離されます。通常使用中の CueMol3 と並走できます (single-instance ロックも衝突しません)。

## 環境変数

| 変数 | 既定 | 意味 |
|---|---|---|
| `CUEMOL2_REPO` | `~/proj64/cuemol2` | アプリ側リポジトリの場所 |
| `LIBCUEMOL2_ROOT` | `$CUEMOL2_REPO/.build_out/cuemol2` | libcuemol2 のインストール先 |
| `BUNDLE_APPS` | `~/tmp/proj64_deplibs` | 同梱外部バイナリ群 |
| `E2E_SLOW` | (未設定) | 1 でレイトレース実行などの重いステップを有効化 |
| `DOCSHOT` | (未設定) | 1 で docShot がスクリーンショットを docs/assets/images に書き出す |
| `E2E_WINDOW` | `1600x1000` | メインウィンドウのサイズ (e2e:shots は 1280x800 で撮影) |
| `DEBUG_E2E` | (未設定) | 1 でアプリの main プロセスログをコンソールに流す |
| `PWDEBUG` | (未設定) | Playwright inspector でステップ実行 |

## 構成

```
support/   環境解決 (env.ts)・ログ収集 (log.ts)
fixtures/  CueMolHarness (起動・準備完了待ち・終了レシピ・restart) とテストデータ
helpers/   UI 操作 (メニュー / ダイアログ / シーンツリー / インスペクタ / Color パネル / 分子ビュー)
specs/     smoke (ハーネス自己検証、ネット不要) と各 docs ページの spec
scripts/   doctor (プリフライト)
```

設計メモ:

- 1 spec = 1 連続シナリオ = 1 アプリプロセス (`describe.serial`)。`workers: 1` 固定。
- アプリケーションメニューは Electron の Menu API 経由でラベルを辿ってクリックする
  (`helpers/menu.ts`)。**docs に書かれたメニューラベルが実装から消えると失敗する**のが狙い。
- native の open/save ダイアログは main プロセスで応答キュー方式にスタブされる
  (`helpers/dialogs.ts`)。キューに応答を積まずにダイアログが開くと即失敗する。
- 終了はシーン未保存時の確認ダイアログを "Don't Save" で歩き、最後は SIGKILL 保険
  (`fixtures/app.ts`。tritium/CLAUDE.md 記載のレシピ)。
- 重いステップは grep タグではなく `E2E_SLOW` の env ゲートで、シナリオの連続性を保ったまま
  スキップされる (スキップは annotation に記録)。
- `helpers/docShot.ts` はドキュメント用スクリーンショットの撮影パイプライン。通常の検証実行では
  no-op で、`task e2e:shots` (DOCSHOT=1 + 1280x800 ウィンドウ) のときだけ、撮影 → WebP 変換 →
  300 KB 検査を経て `docs/assets/images/<id>.webp` に直接書き出す。全景はウィンドウの CSS 幅
  (1280 px) に縮小し、要素切り抜き (`clip` オプション: 単一要素、または複数要素の外接矩形 + pad)
  は Retina の 2x デバイスピクセルのまま保存して、ページ側の `width` 指定で原寸表示する。
  **ページの画像は手動編集せず、この仕組みで再生成する。**

## 実装中に得たセレクタ知見

- シーンツリーの行テキストは `名前 (型)` 形式 (例: `1crn (MolCoord)`、`(*selection)`)。
- ダイアログは accessible name (タイトル) で特定する。ダウンロード進捗とオプション画面など
  複数ダイアログが同時に存在しうる。
- インスペクタはツリー行の**ダブルクリック**で対象を表示。種類別セクションはアコーディオンで、
  数値は DragNumericField (値クリック → type=number 入力 = role spinbutton → Enter 確定)。
- Color パネルの種類メニューのトリガは accessible name「Coloring」。
- レンダリングウィンドウは別 BrowserWindow (`render.html`)。実行ボタンは「Start Render」、
  結果画像は `alt="Render result"`。

## upstream (cuemol2) への要望リスト

セレクタが位置依存・実装詳細依存になっている箇所。data-testid (または aria-label) の
付与を上流に提案したい:

- Scene パネルのツールバーボタン (Add / Focus / Delete / Property) — 現状 class + 位置で特定
- シーンツリーの行 (名前と型を分離して取得できる属性)
- アクティビティバーの各アイコン
- `window.__cm` は「TEMPORARY」宣言のため未使用。検証用に安定した読み取り専用ブリッジが
  あると、モデル状態のアサーションが可能になる
