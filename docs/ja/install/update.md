# アップデート

**macOS (Apple Silicon)** 版の CueMol3 は、新しいリリースをアプリの中から確認して
入れ替えられます。Windows / Linux 版は、新しい配布物をダウンロードしてインストールし直してください
(→ [ダウンロード](index.md#ダウンロード))。

!!! warning "2.3.21.544 以前からは、一度だけ手動でインストールしてください"
    アプリ内のアップデートは 2.4.0.546 から入った機能です。2.3.21.544 以前の CueMol3 には
    この仕組みが無いため、2.4.0.546 以降の配布物を一度[手動でインストール](macos.md)
    してください。それ以降のリリースは、アプリの中から入れ替えられます。

!!! info "撮影予定"

<!-- TODO(screenshot): 新しいリリースの通知と、Settings > General > Updates の Check for Updates の行 -->

## 新しいリリースを確認する

- **起動時の確認**: 起動してしばらくすると、GitHub に新しいリリースがあるかを確認します。
  あれば通知で知らせます。確認できなかったとき (オフラインなど) は何も表示しません。
  **Settings &gt; General &gt; Updates** の **Check for Updates at Startup** で止められます
  (既定は ON)。
- **手動の確認**: アプリケーションメニューの **Check for Updates...** か、
  **Settings &gt; General &gt; Updates** の **Check Now** で、いつでも確認できます。
  最新版を使っているときは、そのことが表示されます。

Windows / Linux でも **Help &gt; Check for Updates...** はありますが、
「Updates are not available in this build.」と表示されるだけです。

## 更新する

1. 新しいリリースの通知 (または Settings の行) で **Update** を押します。
   **Release Page** を押すと、そのリリースの GitHub のページを開きます。
2. ダウンロードが始まり、進み具合が表示されます (**Cancel** で取り消せます)。
   ダウンロードしたファイルは検証されます。
3. **Install Update** ダイアログにリリースノートが表示されます。**Restart and Update** を押すと、
   保存していないシーンの確認を経て CueMol3 が終了し、新しい版に置き換わってから起動し直します。
   **Later** を押した場合は、あとで通知の **Restart to Update** から続けられます。
4. 起動すると、「CueMol3 has been updated to &lt;バージョン&gt;.」と表示されます。

新しい版が起動しなかった場合は、元の版に戻して起動し直し、そのことを通知で知らせます。
戻した版は、起動時の確認では再び案内されません。

アプリが取得した配布物には quarantine 属性が付かないため、
[初回起動時の警告](macos.md#初回起動時の警告を回避する)は出ません。

### Update が表示されない場合

次の場合はその場で置き換えられないため、**Update** は表示されず **Release Page** だけになります。
配布物をダウンロードして、手動でインストールしてください。

- アプリのあるフォルダに書き込む権限がない場合
- ダウンロードした場所から移動せずに起動している場合 (App Translocation)。
  `CueMol3.app` を `Applications` フォルダに移してから起動してください

## 通知センター

アップデートの通知は、ステータスバー右端の**ベル**のアイコンから開く通知センターに
まとまります。未読の通知があるとベルに印が付き、ダウンロード中はベルの横に進み具合が
表示されます。新しい通知は画面の右下にも表示されます。

## Settings &gt; General &gt; Updates

| 項目 | 既定値 | 説明 |
|---|---|---|
| Check for Updates at Startup | ON | 起動後に新しいリリースを確認し、あれば通知します。OFF でも、手動の確認はできます |
| Check for Updates | — | 今の版と状態を表示します。**Check Now** / **Release Page** / **Update** のボタンがあり、ここから更新できます |

## 関連項目

- [macOS へのインストール](macos.md)
- [更新履歴](../releases.md) — リリースごとの主な変更点
- [設定項目](../reference/settings.md#general)

---

*確認対象: CueMol3 2.4.0.546*
