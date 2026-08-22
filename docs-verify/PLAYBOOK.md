# PLAYBOOK — docs ページから spec と画像を作る手順

クイックツアーで確立した手順を、他のページ (チュートリアル基本コース、目的別チュートリアル、
画面構成など) に**再調査なしで**適用するための作業書。実行方法や環境変数は
[README.md](README.md) を参照。

前提となる考え方: **spec はページの写像**である。ページに書かれた操作をそのまま実行し、
ページに書かれたラベル・値・結果を突き合わせる。したがって spec が書けないページは、
ページ自体が曖昧だということ (下記の 1 を参照)。

## 全体の流れ

1. **ページを具体化する** — spec が書ける粒度になっているか点検し、足りなければ先にページを直す
2. **セレクタを調べる** — 使い捨ての DOM ダンプ spec で当たりを付ける (下記「セレクタの調べ方」)
3. **spec を書く** — ページの見出しと 1:1 に対応させる
4. **`task e2e` で通す** — ここで実装との齟齬が出たら、それはページ側のバグなので**ページを直す**
5. **`docShot` を仕込み `task e2e:shots` で撮影する** — 画像を目視確認する
6. **ページに画像を埋め込む** — 手順の各ステップに切り抜き、節目に全景
7. **検証** — `task build` (strict) / `task check:images` / `task e2e` (既定ウィンドウでの回帰)
8. ページ末尾のフッタを当時の `QM_VERSION` に更新し、ブランチで PR を出す

## 1. ページを具体化する

spec を書き始める前に、ページが次を満たしているか確認する。満たしていなければ
**先にページを直す** (クイックツアーでは、この工程を後回しにしたため spec を書き直す
手戻りが発生した)。

- 題材が特定されている (「タンパク質を読み込む」ではなく「1CRN を読み込む」)
- 操作対象と値が特定されている (「プロパティを変える」ではなく「Atom radius を 0.3 から 0.5 に」)
- **操作の結果どう見えるか**が書かれている (「虹色に塗り替わる」「球が大きくなる」)
- 手順は**順序付きリスト**で、**1 ステップ = 1 つの GUI 操作**
  (「A を選んで B にチェックを入れ C を押す」は 3 ステップに分ける)

内容面では、**実務でその操作をするか**を必ず確認する。動くだけの例は書かない。
クイックツアーのレビューで実際に指摘された例:

- 分子全体に ballstick を出すことは普通しない → 選択式で対象を絞る例にする
  (ついでに選択ビルダーの実例にもなる)
- ballstick の球の半径を円柱より細くしても意味がない → 半径を大きくする例にする
- Renderer 側を Rainbow にするより **Object 側の Coloring** を変えるのが実務的
  (Renderer の既定色は `$molcol` を参照するので、ballstick の炭素まで追従する)
- 役目を終えた Renderer は目のアイコンで非表示にする、まで書く

## 1.5 cuemol2_docs との対応を取る

CueMol3 のチュートリアルは CueMol2 の対応ページを下敷きにしている。ページを書く前に
**対応する CueMol2 ページ (`~/works/cuemol2_docs/docs/ja/Documents/GUIのチュートリアル(CueMol2)/`)
を開き、図と説明を洗い出して突き合わせる**。

- **図**: CueMol2 が図を出している対象 (ダイアログ、パネル、ステータスバー、コンテキスト
  メニュー、ツールバーのボタンなど) には、こちらでも図を用意する。**被写体は同じでも、
  画面は CueMol3 のものを撮る** (`docShot`)。
- **文章**: 実装が変わっていない部分は、**言い回しも CueMol2 と同じにする**。表現を変えるのは
  実装が変わった箇所だけ。
- **流用**: 内容が変わっていない図 (概念図など) は CueMol2 の画像をそのままコピーして使う
  (例: `scene_concept_small2.png` → `tutorials/basic/loading/scene-concept.png`)。
- CueMol2 が説明していて CueMol3 に存在しない GUI (ロック列など) は、**存在しないことを
  確認してから**「CueMol2 との違い」に書く。確認できなければ書かない。

## 2. セレクタの調べ方 (使い捨て DOM ダンプ)

production コードに `data-testid` は無いので、セレクタは可視テキスト・aria-label・
Blueprint クラスで組む。当てずっぽうで `getByText` を書くと 30 秒タイムアウトを
繰り返すことになるので、**先に DOM を吐かせる**。

`specs/_dom.spec.ts` (先頭 `_` は使い捨ての印。**調査後に必ず削除する**) を作る:

```ts
/** TEMPORARY: dumps container structure for selectors. Delete after use. */
import { test, expect, type Locator } from '@playwright/test';
import * as path from 'node:path';
import { CueMolHarness } from '../fixtures/app';
import { sceneRow } from '../helpers/sceneTree';
import { dialog } from '../helpers/dialogs';

const TINY_PDB = path.join(__dirname, '..', 'fixtures', 'data', 'tiny.pdb');

async function dump(tag: string, loc: Locator): Promise<void> {
    try {
        const info = await loc.first().evaluate((el) => {
            const parts: string[] = [];
            let n: Element | null = el;
            for (let i = 0; n && i < 10; i++) {
                const cls = (typeof n.className === 'string' ? n.className : '')
                    .split(' ').slice(0, 5).join('.');
                parts.push(`${n.tagName.toLowerCase()}${cls ? '.' + cls : ''}`);
                n = n.parentElement;
            }
            return { chain: parts.join('  <-  '), html: el.outerHTML.slice(0, 180) };
        }, undefined, { timeout: 5_000 });
        console.log(`\n=== ${tag} ===\nchain: ${info.chain}\nhtml: ${info.html}`);
    } catch {
        console.log(`\n=== ${tag} === NOT FOUND`);
    }
}

test('dump DOM containers', async () => {
    const harness = await CueMolHarness.launch({ extraFiles: [TINY_PDB] });
    try {
        // argv で渡したファイルも Open File Options を通る。
        const options = dialog(harness.window, 'Open File Options');
        if (await options.isVisible({ timeout: 10_000 }).catch(() => false)) {
            await options.getByRole('button', { name: 'Open', exact: true }).click();
        }
        await expect(sceneRow(harness.window, 'tiny')).toBeVisible({ timeout: 30_000 });
        await dump('調べたい要素', harness.window.getByText('...', { exact: true }));
    } finally {
        await harness.close();
    }
});
```

`npx playwright test specs/_dom.spec.ts` で実行し、出力された祖先チェーンから
**意味のあるクラス名** (`.selbuilder`、`.render-panel-bar` など) を選んでセレクタにする。
汎用クラス (`.bp5-button`、`allotment-module_*`) は使わない。

補足:

- `dump()` に見つからない要素を渡すと `NOT FOUND` になるだけなので、候補をまとめて投げてよい。
- `tiny.pdb` を argv で渡すとネット不要で分子を 1 つ用意できる。既定の Renderer は `anisou1`。
- パネルは `.sp-pane` が上から Scene / Color / View の順。
- 実装ソース側を読むほうが速いこともある: 対象コンポーネントを
  `~/proj64/cuemol2/tritium/react-gui/src/renderer/` から grep し、`aria-label` / `title` /
  クラス名を確認する (`data-testid` は無いが `aria-label` は 100 箇所以上ある)。
- 調査コードから `app.evaluate` を使う場合、**tsx の単体スクリプトでは動かない**
  (バンドル由来の `__name is not defined`)。必ず Playwright ランナー経由で実行する。

## 3. spec を書く

### ページとの対応規約

| ページ | spec |
|---|---|
| 1 ページ | 1 spec ファイル (`specs/<page-slug>.spec.ts`)、`test.describe.serial` |
| h2 の節 | `test('2. 構造を読み込む', ...)` — 節番号込みで見出しと一致させる |
| h3 の見出し・手順のまとまり | `test.step('Renderer を追加する', ...)` — 見出しと一字一句一致 |
| ページ本文の記述 | その操作の直前にコメントで引用する (`// 「Atom radius を 0.3 から 0.5 に」`) |

先頭コメントに対象ページのパスを書き、`afterEach` で
`testInfo.annotations.push({ type: 'doc', description: 'docs/ja/...' })` を積む。
ネットワークを使う spec には `{ tag: '@net' }` を付ける (`task e2e:offline` で除外される)。

### 骨格

```ts
test.describe.serial('ページ名', { tag: '@net' }, () => {
    test.beforeAll(async () => { harness = await CueMolHarness.launch(); });
    test.afterAll(async () => {
        await assertDialogQueuesEmpty(harness.app);   // 想定したダイアログが実際に開いたか
        await harness.close();
    });
    // 失敗時に window スクショと main ログを添付する afterEach は quick-tour.spec.ts を複製
});
```

1 spec = 1 連続シナリオ = 1 アプリプロセス。`workers: 1` / `retries: 0` 固定なので、
待ちは固定 sleep ではなく必ず条件待ち (`expect(...).toBeVisible()`、`expect.poll`、
`logs.waitForLine`) で書く。例外は `helpers/molView.ts` の `VIEW_SETTLE_MS` のみ。

### アサーションの優先順位

1. **ユーザーに見える UI** — シーンツリーの行、ダイアログの開閉、インスペクタの読み戻し
2. **生成されたファイル** — PNG のマジックナンバー、`.qsc` の存在 (出力先は `artifacts()`)
3. **main プロセスのログ** — UI に出ない結果 (下記)
4. ピクセル比較はしない (GL 描画は環境差が出る)

ログを使うと「操作が実際に効いたか」を検証できる。選択が効いているかの例:

```ts
const mark = harness.logs.mark();
// ... resn CYS の ballstick を作る ...
const line = await harness.logs.waitForLine('BallStickRenderer> rendered', { from: mark });
const atoms = Number(/rendered (\d+) atoms/.exec(line)?.[1]);
expect(atoms).toBeGreaterThan(0);
expect(atoms).toBeLessThan(100);   // 全 327 原子ではないこと
```

### 重い操作

レイトレース実行のように時間のかかるステップは grep タグではなく `E2E_SLOW` の
env ゲートにし、無効時は `annotations` に `skipped-step` を記録して**シナリオは続行**する。

## 4. 実装との齟齬が出たら

spec が落ちたとき、原因が**ページの記述が実装と違うこと**である場合がある。
これは docs-verify の本来の目的なので、**ページを直す** (クイックツアーでは
「Start」→ 実際は **Start Render**、「Encode」→ 実際は **Re-encode** を検出し、
`ui/rendering-window.md` など 4 ページを修正した)。

判断がつかない場合 (意図的な簡略化か obsolete か) は書き換えず、報告してユーザーの判断を仰ぐ
(ルートの CLAUDE.md「役割分担」に従う)。

## 5. 画像を作る

### どこで何を撮るか

| 対象 | 撮り方 | ページでの見せ方 |
|---|---|---|
| 順序付きリストの各ステップ | **操作対象の要素だけ**を切り抜き | ステップ直下に小さく |
| 節の始め・操作の結果 | ウィンドウ全景 | 本文中に幅いっぱい |

手順の各ステップには、原則として操作対象の GUI 要素の切り抜きを付ける。
全景を並べても、どこを操作するのか読者にはわからない。

### docShot の使い方

id は `<ページのスラッグ>/<節番号>-<内容>` (例: `getting-started/quick-tour/3-inspector`)。
`docs/assets/images/<id>.webp` に書き出される。

```ts
// 全景 (1280 px 幅に縮小して保存)
await docShot(harness.window, 'tutorials/basic/loading/2-loaded');

// 単一要素の切り抜き
await docShot(harness.window, '.../2-toolbar-getpdb', {
    clip: harness.window.getByRole('button', { name: 'Get PDB', exact: true }),
    pad: 6,                       // pad を付けると外接矩形方式になり余白が入る
});

// 複数要素の外接矩形 (ボタンと開いたメニュー、パネルの先頭と末尾のフィールドなど)
await docShot(harness.window, '.../3-coloring-menu', {
    clip: [window.getByRole('button', { name: 'Coloring' }), menu],
});
```

パネル全体を `clip` に渡すと下部の空白まで入るので、**先頭要素と末尾要素の外接矩形**で
切ると収まりが良い (`4-render-settings` は `.render-window-settings-header` と
`Transparent background` ラベルの 2 点で切っている)。

撮影は操作の**途中**に挟む。ダイアログは値を入れた後・Create を押す前、メニューは
開いた状態で撮る。そのためにヘルパーへフックを足してよい (`chooseColoring` の
`beforeSelect`、spec 内 `addRenderer` の `shotId` / `configure`)。ただし
**検証の本筋 (操作順序とアサーション) を撮影の都合で変えない**。

### 寸法とページ側の `width`

- **全景**: 2x で撮って 1280 px 幅に縮小 (`TARGET_WIDTH`)。`width` は付けず `.on-glb` を付ける。
- **切り抜き**: Retina の 2x のまま保存する (縮小しない)。ページでは
  **`width` = ファイルのピクセル幅 ÷ 2** を指定すると原寸かつ鮮明になる。
  例: 456 px のファイル → `{ width="228" }`。

```sh
sips -g pixelWidth -g pixelHeight docs/assets/images/<id>.webp   # 寸法の確認
```

`.on-glb` は glightbox (manual モード) の対象にするクラス。拡大して見る価値のある画像
(全景・ダイアログ・メニュー) に付け、ボタン 1 個のような小片には付けない。

順序付きリストの中に画像を置くときは **4 スペース字下げ + 前後に空行**:

```markdown
1. **File > Get PDB...** を選びます

    ![ツールバーの Get PDB ボタン](../../assets/images/.../2-toolbar-getpdb.webp){ width="94" }

2. ...
```

### 撮影と確認

```sh
task e2e:shots      # DOCSHOT=1 E2E_SLOW=1 E2E_WINDOW=1280x800 で spec を実行 → 画像を書き出し
```

`e2e:shots` は撮影後に `task check:images` (300 KB 制限) まで実行する。
品質は 82→46 の順に落として 300 KB 以内に収める実装なので、通常は制限に当たらない。

**書き出した画像は必ず目視確認する** (Read ツールで `.webp` を開く)。狙った要素が
入っているか、余白が過大でないか、状態 (チェック済み・非表示など) が意図どおりかを見る。

新しいページの spec を撮影対象にするときは、`Taskfile.yml` の `e2e:shots` の
spec 指定を増やす。

## 6. 検証と仕上げ

```sh
task build          # mkdocs strict (画像リンク切れもここで出る)
task check:images   # 300 KB / LFS 不使用の検査
task e2e            # 既定ウィンドウ (1600x1000) での回帰。撮影用サイズ依存を作っていないか
```

安定性が不安なときは `npx playwright test --repeat-each=3`。
`docs-verify/test-results/` や `.last-run.json` を**コミットしない** (ルートで実行すると
リポジトリ直下に作られることがある)。

## 既知の落とし穴 (再調査不要)

| 症状 | 原因と対処 |
|---|---|
| メニュー項目がすべて disabled | argv に main エントリの絶対パスを渡すと、アプリがそれを分子ファイルとして開こうとして "Cannot open file: index.js" ダイアログが出て menuBlock が全メニューを無効化する。`args: ['.']` (cwd = react-gui) を使う |
| `.bp5-dialog` が strict mode violation | ダウンロード進捗とオプション画面のようにダイアログは同時に複数開く。必ず accessible name (タイトル) で絞る (`dialog(window, 'Get PDB')`) |
| シーンツリーの行が見つからない | 行テキストは `名前 (型)` (例 `1crn (MolCoord)`)。Get PDB のオブジェクト名は**小文字**になる。`sceneRow()` を使う |
| インスペクタに何も出ない | 行の**ダブルクリック**で表示。プロパティは種類別アコーディオンの中 |
| 数値プロパティが入力できない | DragNumericField。値表示をクリック → `role=spinbutton` に `fill` → Enter。`setNumericProperty()` を使う |
| レンダリングウィンドウのボタンが見つからない | 別 BrowserWindow (`render.html`)。`app.windows()` を `expect.poll` で待って取得する |
| `harness.app.process()` が `_object` で TypeError | `close()` 後は取得できない。close の**前**に `const proc = harness.app.process()` |
| シーンツリーの右クリックメニューが操作できない | native Menu なので Playwright からクリックできない。Scene パネルのツールバー Add ボタンが同じ New Renderer フローを開くので代替する (spec にその旨のコメントを残す) |
| ネイティブの open/save ダイアログでハングする | `expectOpenDialog` / `expectSaveDialog` で応答をキューに積んでから操作する。積み忘れは即エラーになる |
| 撮影サイズでしか通らない spec を書いてしまう | 座標依存の操作を書かない。最後に `task e2e` (1600x1000) で回帰確認する |
| `docShot` が `no visible clip target` / `not an HTMLElement` で落ちる | 対象が `display: contents` の要素だと矩形を持たない (View パネルの `.h3-form-grid-row` がこれ)。内側の実体 (ラベルとコントロール) を配列で渡す |
| View パネルに入れた回転角が読み戻せない | Rotation (RotX/RotY/RotZ) は相対ダイヤルで、確定すると 0 に戻る。読み戻しで検証できるのは Translation / Zoom / Slab / Dist |
| ホイール操作がズームにならず視点が平行移動する | 合成したホイールイベントは **Mac trackpad と自動判定**され、2 本指スクロール = 平行移動として扱われる (ステータスバーに `Input device auto-detected: Mac trackpad` と出る)。中心を狙ったクリックはホイール操作の**前**に行う |
| 原子クリックの結果がログに出ない | クリックの報告は**ステータスバー (`.status-left`) と Output パネル** (`.bottom-panel-content pre[data-select-scope]`) に出る。main プロセスの stdout には流れないので `logs.waitForLine` では待てない |
| `--grep` で 1 test だけ流すと落ちる | `describe.serial` の前提となる test (分子の読み込みなど) が走らないため。分子が無い状態では原子ピックは必ず失敗する。切り分けのときも spec 全体を流す |
| ログ行の待ち受けが別の行に当たる | `waitForLine` は部分一致。`'read '` は `thread read (2047) ok` に、`'> read '` は `LoadSymLib> read 266 s.g.s` に当たる。読み込み確認は `' atoms'` を待って `/read \d+ atoms/` で検証する |

## セレクタ台帳

実際に使っている安定セレクタ。ヘルパーに集約してあるので、**spec には生セレクタを書かない**。

| 対象 | セレクタ | ヘルパー |
|---|---|---|
| アプリケーションメニュー | Electron Menu API のラベル走査 | `clickMenu(app, ['File', 'Get PDB...'])` |
| File &gt; Get PDB... 一式 | Get PDB ダイアログ (`#get-pdb-id`) → Download → Open File Options (`#rend-objname` / `#rend-type` / `#rend-name`) → Open | `getPdb(app, window, { id, rendType, objectName? })` |
| View パネルの数値欄 | `.view-pane` → ラベルで絞った `.h3-form-grid-row` → `.h3-form-drag` をクリック → `input.h3-form-drag-input` | `setViewValue` / `viewPaneRowParts` |
| Blueprint ダイアログ | `getByRole('dialog', { name })` | `dialog` / `clickDialogButton` / `expectDialogClosed` |
| シーンツリーの行 | `getByText(/^名前 \(/)` | `sceneRow` / `selectRow` / `openInInspector` |
| 行の目のアイコン | 行の `.bp5-tree-node-content` 内 `.visibility-toggle` (class に `visible` / `hidden`) | `toggleRowVisibility` / `rowVisibilityToggle` |
| Scene パネルのツールバー | `.section-action-btn` の位置 (Add=0 / Focus=1 / Delete=2 / Property=3) | `clickSceneToolbar` |
| インスペクタのタブ列 | `.inspector-mode-bar` | — |
| インスペクタの数値欄 | Decrement ボタンの次要素 → `role=spinbutton` | `setNumericProperty` |
| Color パネルの対象 | `.color-enum-select select` (`ribbon1 (ribbon)` / `1crn (object)`) | `selectColorTarget` |
| Coloring メニュー | ボタン名 `Coloring` → `.bp5-menu` | `chooseColoring` |
| 選択式の入力欄 | `getByPlaceholder('* (all atoms)')` | — |
| 選択ビルダーを開く | ボタン `aria-label="Build selection"` (欄の右端の ▼) | — |
| 選択ビルダー本体 | `.selbuilder`。タブは `role=radio` の `Named` / `History` / `Term` / `Mod` | — |
| Term のキーワード | `getByLabel('Term keyword')` (値は `resn` / `chain` / `resid` など) | — |
| Term の値候補 | トリガ `title="Show candidate values"` → `.h3-form-combobox-menu` | — |
| Term の適用ボタン | 名前 `/^Set/` など (原子数バッジが付くので exact にしない) | — |
| 選択の確定 | ビルダーを閉じる (再度 ▼) と入力欄に反映される | — |
| レンダリングウィンドウ | `app.windows()` から `url().includes('render.html')` | — |
| 実行ボタン / 結果 | `Start Render` / `getByAltText('Render result')` | — |
| Lighting の選択 | `getByText('Lighting').locator('xpath=following::select[1]')` (既定は Global Illumination) | — |

## 次に適用する対象 (未着手)

spec があるのは `getting-started/quick-tour.md` と `tutorials/basic/loading.md`。適用の優先順:

1. `tutorials/basic/` の残り 5 ページ (selection / renderers / coloring / camera-scene /
   measure)。原子ピック、ダブルクリック選択、`harness.restart()` を使う camera-scene が
   ここで初めて必要になる。
   **基本操作コースはページ間で状態を引き継ぐ**構成なので、前ページの到達状態は
   `fixtures/course.ts` に足していく (`setupLoadingPage.run()` が loading.md の終状態を作る)。
   前ページの spec と手順を二重に持たないこと。
2. 目的別チュートリアル 6 ページ (ribbon-figure / publication-images / density-map /
   symmetry / surface-elepot / animation-movie)。APBS・ffmpeg・レイトレースを伴うため
   `E2E_SLOW` ゲートの対象が増える。
3. `ui/` の画面構成ページ (撮影のみで spec 化しない選択肢もある)。

packaged (.app) ターゲットは `support/env.ts` の `resolveTarget` に差し込む口だけ用意してある
(現状は未実装で例外を投げる)。

## upstream (cuemol2) への要望リスト

セレクタが位置依存・実装詳細依存になっている箇所。`data-testid` (または aria-label) の
付与を上流に提案したい:

- Scene パネルのツールバーボタン (Add / Focus / Delete / Property) — 現状 class + 位置で特定
- シーンツリーの行 (名前と型を分離して取得できる属性)
- 行の目のアイコン (現状 class 名 `visibility-toggle` と状態クラス)
- アクティビティバーの各アイコン
- `window.__cm` は「TEMPORARY」宣言のため未使用。検証用に安定した読み取り専用ブリッジが
  あると、モデル状態のアサーションが可能になる
