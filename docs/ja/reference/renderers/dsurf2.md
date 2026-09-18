# dsurf2 (分子表面・距離場)

!!! info "dsurface に統合されました"
    距離場 (distance field) による分子表面は、[dsurface](dsurface.md) の
    **Algorithm** の選択肢のひとつ (**Distance field**) になりました。
    そのため **dsurf2 は New Renderer の一覧に表示されません**。
    新しく作る場合は dsurface を選び、Algorithm に **Distance field** を指定してください。

    2 つは元々同じプロパティを持つ同じ Renderer で、違いはメッシュの作り方だけでした。
    一覧に両方が並んでいても、どちらを選べばよいかを示すものがありませんでした。

## 既存のシーンについて

`dsurf2` を含むシーンファイル (`.qsc`) は今までどおり開けます。読み込むと
**Algorithm が Distance field の dsurface** になります。これは dsurf2 が行っていた
描画そのものなので、見た目は変わりません。

一方、**もともと `dsurface` で保存されたシーンは、開くと Algorithm が
Distance field (新しい既定) になります**。以前の dsurface はボクセルによる
実装だったため、メッシュの見え方と Detail の効き方が変わります。以前の見た目に
戻すには、Algorithm に **EDTSurf (voxel)** を指定してください。

## 関連項目

- [dsurface](dsurface.md) — プロパティの説明はこちら
- [Renderer の一覧](index.md)
- [molsurf](molsurf.md)

---

*確認対象: CueMol3 2.3.15.530*
