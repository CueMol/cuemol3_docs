# macOS へのインストール

対象: **macOS / Apple Silicon (arm64)**。配布物は `CueMol3-<version>-arm64.dmg` です。

!!! warning "アドホック署名のみで、配布元は証明されていません"
    アプリには **アドホック署名** (`codesign --sign -`) が付いています。これは Apple Silicon で
    アプリを起動可能にするために必要なもので、**配布元を証明するものではありません**。
    Developer ID 署名と notarization は行っていないため、Web からダウンロードした dmg には
    quarantine 属性が付き、そのままでは起動できません。下記の手順で回避してください。

## 手順

1. `CueMol3-<version>-arm64.dmg` をダブルクリックしてマウントする
2. 表示された `CueMol3.app` を `Applications` フォルダにドラッグしてコピーする
3. 初回起動は次のいずれかの方法で行う (下記参照)

<!-- TODO(screenshot): dmg をマウントしたウィンドウ (CueMol3.app と Applications へのドラッグ) -->

## 初回起動時の警告を回避する

「"CueMol3" は、開発元を検証できないため開けません。」というダイアログが出た場合、
次のどちらかの方法で起動できます。

### 方法 A: 右クリックから開く (推奨)

1. Finder で `/Applications/CueMol3.app` を **右クリック** (または ++ctrl++ + クリック)
2. メニューから **「開く」** を選ぶ
3. 表示された確認ダイアログで、もう一度 **「開く」** を押す

一度この方法で起動すれば、次回以降は通常どおりダブルクリックで起動できます。

### 方法 B: quarantine 属性を除去する

ターミナルで次を実行します。

```sh
xattr -dr com.apple.quarantine /Applications/CueMol3.app
```

!!! note
    ローカルで自分でビルドした dmg には quarantine 属性が付かないため、この警告は出ません。

## 外部ツールの同梱について

CI がビルドした macOS 配布物には POV-Ray / ffmpeg / APBS・PDB2PQR が同梱されます。
手元でパッケージングした場合など、同梱されていないビルドでは Settings でパスを指定してください。

→ [外部ツールの設定](external-tools.md)

## アンインストール

`/Applications/CueMol3.app` をゴミ箱に移動してください。
