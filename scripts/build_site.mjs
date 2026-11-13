import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ディレクトリパスの解決
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_TOOLS_DIR = path.join(ROOT_DIR, 'data', 'tools');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUBLIC_TOOLS_DIR = path.join(PUBLIC_DIR, 'tools');
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'monetization.json');

/**
 * 共通CSSスタイルを生成する関数
 */
function getCommonStyles() {
  return `
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --accent: #f59e0b;
      --text: #0f172a;
      --muted: #475569;
      --border: #e2e8f0;
      --good: #16a34a;
      --neg: #dc2626;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
    }
    header {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #fff;
      padding: 1.2rem 1rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .container {
      max-width: 920px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .site-title {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 800;
    }
    .site-title a {
      color: #fff;
      text-decoration: none;
    }
    .site-sub {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    main {
      padding: 2rem 0 3rem;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    }
    .category-badge {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: 1.55rem;
      line-height: 1.4;
      margin: 0.3rem 0 0.75rem;
    }
    .summary {
      color: var(--muted);
      margin-top: 0;
    }
    .calc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-weight: 700;
      font-size: 0.88rem;
      margin-bottom: 0.35rem;
      color: #1e293b;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 0.7rem 0.8rem;
      font-size: 1rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      background: #fff;
      transition: border-color 0.15s;
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }
    .result-box {
      background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
      border: 2px solid #93c5fd;
      border-radius: 12px;
      padding: 1.35rem;
      margin-top: 1rem;
    }
    .result-headline {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    .result-headline strong {
      font-size: 1.5rem;
      color: var(--primary-dark);
      background: #fef08a;
      padding: 0.1rem 0.45rem;
      border-radius: 6px;
    }
    .verdict-line {
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .badge-good { color: #15803d; }
    .badge-mid { color: #b45309; }
    .badge-low { color: #b91c1c; }
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.9rem;
    }
    .metric-card {
      background: #fff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 0.95rem 1rem;
      display: flex;
      flex-direction: column;
    }
    .metric-card span {
      font-size: 0.82rem;
      color: var(--muted);
    }
    .metric-card strong {
      font-size: 1.35rem;
      margin: 0.2rem 0;
      color: var(--text);
    }
    .metric-card strong.pos { color: var(--good); }
    .metric-card strong.neg { color: var(--neg); }
    .metric-card small {
      font-size: 0.76rem;
      color: #64748b;
    }
    .affiliate-section {
      border: 2px solid #fde68a;
      background: #fffbeb;
      border-radius: 12px;
      padding: 1.25rem;
      margin: 1.5rem 0;
    }
    .affiliate-badge {
      font-weight: 800;
      color: #b45309;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      display: block;
    }
    .aff-item {
      background: #fff;
      border: 1px solid #fcd34d;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .aff-item:last-child { margin-bottom: 0; }
    .aff-item-title {
      font-weight: 700;
      font-size: 1rem;
      color: #0f172a;
    }
    .aff-item-desc {
      font-size: 0.88rem;
      color: var(--muted);
      margin: 0;
    }
    .aff-btn {
      display: inline-block;
      align-self: flex-start;
      background: #f59e0b;
      color: #fff;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      padding: 0.55rem 1.1rem;
      border-radius: 8px;
      margin-top: 0.25rem;
      transition: background 0.15s;
    }
    .aff-btn:hover { background: #d97706; }
    .article-content h2 {
      font-size: 1.25rem;
      border-left: 4px solid var(--primary);
      padding-left: 0.7rem;
      margin-top: 1.75rem;
    }
    .article-content h3 {
      font-size: 1.08rem;
      color: #1e3a8a;
      margin-top: 1.3rem;
    }
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.1rem;
    }
    .tool-link-card {
      display: block;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.2rem;
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }
    .tool-link-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.09);
    }
    .tool-link-card h3 {
      margin: 0.35rem 0 0.5rem;
      font-size: 1.05rem;
      color: var(--primary-dark);
    }
    .tool-link-card p {
      margin: 0;
      font-size: 0.86rem;
      color: var(--muted);
    }
    footer {
      text-align: center;
      padding: 2rem 1rem;
      color: #64748b;
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
      background: #fff;
    }
  `;
}

/**
 * Amazon検索アフィリエイトURLを生成する関数
 */
function buildAmazonSearchUrl(query, associateTag) {
  const encoded = encodeURIComponent(query);
  const tagParam = associateTag ? `&tag=${encodeURIComponent(associateTag)}` : '';
  return `https://www.amazon.co.jp/s?k=${encoded}${tagParam}`;
}

/**
 * AdSense広告タグを生成する関数（有効時のみ出力）
 */
function buildAdSenseSlot(config, slotId) {
  if (!config.adsense || !config.adsense.enabled) {
    return '';
  }
  return `
    <div style="margin: 1.25rem 0; text-align: center;">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="${config.adsense.clientId}"
           data-ad-slot="${slotId}"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  `;
}

/**
 * 各ツールの個別HTMLページを生成する関数
 */
function renderToolPage(tool, allTools, config) {
  const associateTag = config.affiliate?.amazonAssociateTag || '';
  const recommendations = Array.isArray(tool.affiliateRecommendations) && tool.affiliateRecommendations.length > 0
    ? tool.affiliateRecommendations
    : [
        {
          name: `「${tool.affiliateSearchQuery || tool.title}」関連の人気アイテム`,
          description: '計算結果をもとに、Amazonの売れ筋モデル・口コミ評価を比較できます。',
          searchQuery: tool.affiliateSearchQuery || tool.title
        }
      ];

  const affiliateHtml = recommendations.map(rec => {
    const url = buildAmazonSearchUrl(rec.searchQuery || tool.affiliateSearchQuery, associateTag);
    return `
      <div class="aff-item">
        <div class="aff-item-title">${rec.name}</div>
        <p class="aff-item-desc">${rec.description}</p>
        <a class="aff-btn" href="${url}" target="_blank" rel="nofollow sponsored noopener">
          ${config.affiliate?.customCtaBanner?.defaultButtonText || 'Amazonで最新価格・口コミを見る'} →
        </a>
      </div>
    `;
  }).join('');

  const otherToolsHtml = allTools
    .filter(t => t.slug !== tool.slug)
    .slice(0, 6)
    .map(t => `
      <a class="tool-link-card" href="../tools/${t.slug}.html">
        <span class="category-badge">${t.category}</span>
        <h3>${t.title}</h3>
        <p>${t.summary}</p>
      </a>
    `).join('');

  const adsenseHead = config.adsense?.enabled
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense.clientId}" crossorigin="anonymous"></script>`
    : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.title} | ${config.siteName}</title>
  <meta name="description" content="${tool.summary}">
  <meta name="keywords" content="${(tool.targetKeywords || []).join(', ')}">
  ${adsenseHead}
  <style>${getCommonStyles()}</style>
</head>
<body>
  <header>
    <div class="container">
      <p class="site-title"><a href="../index.html">⚡ ${config.siteName}</a></p>
      <p class="site-sub">${config.siteDescription}</p>
    </div>
  </header>
  <main class="container">
    <div class="card">
      <span class="category-badge">${tool.category}</span>
      <h1>${tool.title}</h1>
      <p class="summary">${tool.summary}</p>
      ${buildAdSenseSlot(config, config.adsense?.slotIdTop)}
      ${tool.calculatorHtml}
    </div>

    <div class="affiliate-section">
      <span class="affiliate-badge">${config.affiliate?.customCtaBanner?.badgeText || '💡 計算結果とあわせてチェック（PR）'}</span>
      ${affiliateHtml}
    </div>

    <div class="card article-content">
      ${tool.articleHtml}
      ${buildAdSenseSlot(config, config.adsense?.slotIdBottom)}
    </div>

    <section>
      <h2>他の損得・コスト逆算シミュレーター</h2>
      <div class="tools-grid">
        ${otherToolsHtml}
      </div>
    </section>
  </main>
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${config.siteName} | <a href="../index.html">トップページへ戻る</a></p>
    </div>
  </footer>
  <script>
    ${tool.calculatorJs}
  </script>
</body>
</html>`;
}

/**
 * トップページ（index.html）を生成する関数
 */
function renderIndexPage(allTools, config) {
  const cardsHtml = allTools.map(tool => `
    <a class="tool-link-card" href="./tools/${tool.slug}.html">
      <span class="category-badge">${tool.category}</span>
      <h3>${tool.title}</h3>
      <p>${tool.summary}</p>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.siteName} - 無料の損益分岐点・スペック逆算ツール集</title>
  <meta name="description" content="${config.siteDescription}">
  <style>${getCommonStyles()}</style>
</head>
<body>
  <header>
    <div class="container">
      <h1 class="site-title"><a href="./index.html">⚡ ${config.siteName}</a></h1>
      <p class="site-sub">${config.siteDescription}</p>
    </div>
  </header>
  <main class="container">
    <div class="card">
      <h2>公開中のシミュレーター一覧（全 ${allTools.length} ツール）</h2>
      <p class="summary">気になるツールを選んで数値を入力すると、その場で即座に「何年で元が取れるか」「毎月いくら節約できるか」を計算できます。</p>
      <div class="tools-grid">
        ${cardsHtml}
      </div>
    </div>
  </main>
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${config.siteName}</p>
    </div>
  </footer>
</body>
</html>`;
}

/**
 * サイト全体をビルドするメイン関数
 */
export function buildSite() {
  fs.mkdirSync(PUBLIC_TOOLS_DIR, { recursive: true });
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

  const files = fs.readdirSync(DATA_TOOLS_DIR).filter(f => f.endsWith('.json'));
  const allTools = files.map(file => {
    const raw = fs.readFileSync(path.join(DATA_TOOLS_DIR, file), 'utf-8');
    return JSON.parse(raw);
  }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  // 各ツールページの出力
  for (const tool of allTools) {
    const html = renderToolPage(tool, allTools, config);
    fs.writeFileSync(path.join(PUBLIC_TOOLS_DIR, `${tool.slug}.html`), html, 'utf-8');
  }

  // トップページの出力
  const indexHtml = renderIndexPage(allTools, config);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), indexHtml, 'utf-8');

  // サイトマップ（SEO用）の出力
  const urls = [
    `${config.baseUrl}/`,
    ...allTools.map(t => `${config.baseUrl}/tools/${t.slug}.html`)
  ];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  console.log(`✅ サイトビルド完了: 全 ${allTools.length} ツールを public/ に出力しました。`);
}

// 直接実行された場合はビルドを実行
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  buildSite();
}
