import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build_site.mjs';

// パス設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT_DIR, 'data', 'topics_queue.json');
const TOOLS_DIR = path.join(ROOT_DIR, 'data', 'tools');

/**
 * Gemini APIを呼び出してJSONレスポンスを取得する関数（外部パッケージ不要）
 */
async function callGeminiJson(prompt, apiKey) {
  // モデル名は環境変数 GEMINI_MODEL で上書き可能。混雑時は順に予備モデルへ切り替える
  // 予備モデルは ListModels で利用可能を確認済みのもの（2026-11時点）
  const models = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];
  const maxAttemptsPerModel = 2;
  let lastError;

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      const response = await fetch(endpoint, {
        method: 'POST',
        // APIキーはURLに含めずヘッダーで送信（ログ流出防止）
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Gemini APIから有効なテキストが返されませんでした。');
        }
        return JSON.parse(rawText);
      }

      const errText = await response.text();
      lastError = new Error(`Gemini APIエラー (${response.status}, ${model}): ${errText}`);

      // 混雑(503)・レート制限(429)・一時障害(500)のみ再試行し、それ以外は即終了
      if (![429, 500, 503].includes(response.status)) {
        throw lastError;
      }
      const waitSec = 10 * attempt;
      console.log(`⏳ ${model} が混雑中 (${response.status})。${waitSec}秒後に再試行します (${attempt}/${maxAttemptsPerModel})`);
      await new Promise(r => setTimeout(r, waitSec * 1000));
    }
    console.log(`🔁 ${model} が応答しないため、予備モデルに切り替えます。`);
  }
  throw lastError;
}

/**
 * キューが空になった場合、AI自身が新しいブルーオーシャンテーマを3件自動企画する関数
 */
async function replenishTopicsQueue(existingSlugs, apiKey) {
  console.log('🧠 キュー内のテーマがすべて完了したため、AIが新しいニッチ計算機テーマを自動発掘しています...');
  const prompt = `
あなたはSEOとアフィリエイト収益化のプロフェッショナルです。
個人ブログや大手メディアが「文字の記事」しか書いておらず、まだWeb上に使いやすい計算機が少ない「損益分岐点（何年で元が取れる？）・維持費比較・必要スペック逆算」のWebシミュレーター企画を3つ考案してください。

既に作成済みのスラッグ一覧（重複禁止）:
${existingSlugs.join(', ')}

以下のJSON配列形式で出力してください:
[
  {
    "slug": "英数字とハイフンのみのURLスラッグ",
    "title": "検索ユーザーの目を引く具体的なツールタイトル",
    "category": "カテゴリ名（例：家電・エネルギー、暮らし・節約、ガジェット・PC）",
    "targetKeywords": ["検索キーワード1", "検索キーワード2", "検索キーワード3"],
    "affiliateSearchQuery": "Amazonで関連商品を検索するためのキーワード",
    "status": "pending"
  }
]`;
  return await callGeminiJson(prompt, apiKey);
}

/**
 * メイン処理：1件のWebツールをAIで自動生成してサイトを再ビルドする
 */
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ 環境変数 GEMINI_API_KEY が設定されていないため、AI新規生成をスキップし既存データでサイトをビルドします。');
    buildSite();
    return;
  }

  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'));
  const existingFiles = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.json'));
  const existingSlugs = existingFiles.map(f => f.replace(/\.json$/, ''));

  let nextTopic = queue.find(item => item.status === 'pending' && !existingSlugs.includes(item.slug));

  // 未生成テーマがない場合はAIで自動補充
  if (!nextTopic) {
    const newTopics = await replenishTopicsQueue(existingSlugs, apiKey);
    for (const t of newTopics) {
      queue.push({ ...t, status: 'pending' });
    }
    fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf-8');
    nextTopic = queue.find(item => item.status === 'pending');
  }

  console.log(`🚀 新規ツールの自動生成を開始します: 「${nextTopic.title}」`);

  const toolPrompt = `
あなたは優秀なフロントエンドエンジニア兼SEOライターです。
以下のテーマに基づき、ブラウザ上で即座に動く実用的な「損得・コスト・スペック逆算シミュレーター」のHTML/JSコードと解説記事JSONを作成してください。

【作成テーマ】
- スラッグ: ${nextTopic.slug}
- タイトル: ${nextTopic.title}
- カテゴリ: ${nextTopic.category}
- 狙うキーワード: ${nextTopic.targetKeywords.join(', ')}
- 関連商品キーワード: ${nextTopic.affiliateSearchQuery}

【必須デザイン・実装ルール】
1. calculatorHtml には <div class="calc-grid"> の中に <div class="form-group"><label>...</label><input ...> (または <select>)</div> を配置し、最後に <div id="calcResult" class="result-box"></div> を配置すること。
2. input や select には初期値（value）を設定し、oninput または onchange で即座に再計算されるようにすること。
3. calculatorJs には、計算ロジックの関数と document.addEventListener('DOMContentLoaded', 関数名) を記述し、ページ読み込み直後から初期値での計算結果が #calcResult に表示されるようにすること。
4. #calcResult の中は <div class="result-headline">結論：<strong>...</strong></div> と <div class="metrics-row"><div class="metric-card"><span>項目名</span><strong>数値</strong><small>補足</small></div>...</div> のクラス構造を使うこと。

【出力JSONスキーマ】
{
  "slug": "${nextTopic.slug}",
  "title": "${nextTopic.title}",
  "category": "${nextTopic.category}",
  "summary": "検索結果やSNSでクリックしたくなる100文字前後の要約文",
  "targetKeywords": ${JSON.stringify(nextTopic.targetKeywords)},
  "affiliateSearchQuery": "${nextTopic.affiliateSearchQuery}",
  "affiliateRecommendations": [
    {
      "name": "計算結果を見たユーザーが欲しくなる具体的な関連アイテム・サービス名1",
      "description": "なぜそれを導入するとさらに得をするのかの簡潔な説明",
      "searchQuery": "Amazon検索用の具体的なキーワード"
    },
    {
      "name": "関連アイテム・サービス名2",
      "description": "簡潔な説明",
      "searchQuery": "Amazon検索用の具体的なキーワード"
    }
  ],
  "calculatorHtml": "シミュレーター部分のHTML文字列",
  "calculatorJs": "シミュレーターを動かすJavaScriptコード文字列（<script>タグ自体は含めない）",
  "articleHtml": "<h2>〜</h2><p>〜</p><h3>〜</h3><p>〜</p>で構成された、判断基準や節約のコツを詳しく解説するSEO記事HTML（800〜1200文字程度）"
}`;

  const generatedTool = await callGeminiJson(toolPrompt, apiKey);
  generatedTool.slug = nextTopic.slug;
  generatedTool.createdAt = new Date().toISOString().slice(0, 10);

  // ツールJSONの保存
  const outputPath = path.join(TOOLS_DIR, `${nextTopic.slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(generatedTool, null, 2), 'utf-8');
  console.log(`✨ ツールデータを保存しました: ${outputPath}`);

  // キューのステータスを done に更新
  nextTopic.status = 'done';
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf-8');

  // サイト全体の再ビルド
  buildSite();
}

main().catch(err => {
  console.error('❌ エラーが発生しました:', err.message);
  // Windowsでのprocess.exit()によるアサーションエラーを避けるため exitCode を使用
  process.exitCode = 1;
});
