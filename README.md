# ⚡ 損得・コスト逆算シミュレーター自動量産システム (`auto-niche-tools`)

**維持費0円・完全自動**で、検索需要が高く競合が弱い「何年で元が取れる？」「どのスペック・プランが一番得？」を計算するWebシミュレーターを毎日自動生成・公開し、AmazonアソシエイトやGoogle AdSenseでストック収益を得るシステムです。

---

## 🎯 なぜこのジャンルなのか？
大手メディアや個人ブロガーは「文字の比較記事」しか書けず、**「自分の数値を入れると3秒で損益分岐点が出る計算ツール」**を作れません。
さらに、「元が取れるか計算している人＝まさに今買おうか迷っている人」なので、計算結果のすぐ下にAmazonリンクや関連サービスを置くと非常に高い確率でクリック・購入されます。

---

## 🔑 ステップ1：無料のGemini APIキーを取得する（所要時間：約1分・クレカ不要）

1. Googleアカウントで **[Google AI Studio (https://aistudio.google.com/apikey)](https://aistudio.google.com/apikey)** にアクセスします。
2. **「Create API key（APIキーを作成）」** ボタンをクリックします。
3. 表示された `AIza...` から始まる文字列をコピーします（完全無料枠で1日最大1,500回まで利用可能です）。

### 自分のPC上で今すぐAI生成を試す場合（PowerShell）
```powershell
$env:GEMINI_API_KEY="ここにコピーしたAPIキーを貼り付け"
npm run generate
```
これだけで、`data/topics_queue.json` から未作成のテーマを1つ選び、AIが自動で「動く計算機HTML/JS ＋ SEO解説記事 ＋ Amazonおすすめ商品リンク」を生成して `public/` フォルダを更新します！
（※キューのテーマがすべて終わっても、AIが自動で新しいブルーオーシャンテーマを考案して無限に増やし続けます）

---

## 💰 ステップ2：自分の収益化ID（アフィリエイト・広告）を設定する

[`config/monetization.json`](./config/monetization.json) を開き、以下の箇所を自分のIDに書き換えるだけで、**過去・未来すべてのツールページに一括反映**されます。

* `affiliate.amazonAssociateTag`: あなたのAmazonアソシエイトID（例: `myname-22`）
* `adsense.enabled`: Google AdSense審査通過後に `true` に変更し、`clientId` を入力

書き換えたら `npm run build` を実行すると全ページが即座に更新されます。

---

## 🤖 ステップ3：完全放置（毎日自動生成＆無料公開）にする手順

1. GitHub（無料）で新しいリポジトリを作成し、このフォルダの中身をプッシュします。
2. GitHubリポジトリの **Settings > Pages** を開き、**Build and deployment > Source** を **`GitHub Actions`** に設定します。
3. **Settings > Secrets and variables > Actions** を開き、**New repository secret** から以下を登録します：
   * Name: `GEMINI_API_KEY`
   * Secret: ステップ1で取得したAPIキー
4. これで設定完了です！毎日朝7時にGitHubが自動でAIを起動し、新しい計算機ページを作ってサイトに公開し続けます。
