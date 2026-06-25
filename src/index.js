/**
 * B 站快捷搜索 - 搜索跳转工具
 * 输入关键词 → 直接跳转到 B 站搜索结果页
 * 不调用 B 站 API，不会被封
 */

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>B 站快捷搜索</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;background:#f5f7fa;color:#333;min-height:100vh}
.navbar{background:#fff;border-bottom:1px solid #e5e7eb;height:56px;display:flex;align-items:center;padding:0 24px}
.navbar .logo{font-size:1.1rem;font-weight:700;color:#00a1d6}
.navbar .nav{margin-left:auto;display:flex;gap:20px;font-size:.88rem}
.navbar .nav a{color:#6b7280;font-weight:500;padding:4px 0;border-bottom:2px solid transparent;transition:all .2s}
.navbar .nav a:hover,.navbar .nav a.on{color:#00a1d6;border-bottom-color:#00a1d6}
.hero{text-align:center;padding:60px 20px 40px;background:linear-gradient(180deg,#f0f9ff 0%,#f5f7fa 100%)}
.hero h1{font-size:2rem;font-weight:700;color:#1f2937}
.hero h1 span{color:#00a1d6}
.hero p{color:#6b7280;font-size:1rem;margin-top:8px}
.search-box{max-width:640px;margin:24px auto 0;display:flex;gap:10px}
.search-box input{flex:1;height:52px;padding:0 18px;border:2px solid #e5e7eb;border-radius:10px;font-size:1rem;outline:none;transition:border .2s}
.search-box input:focus{border-color:#00a1d6}
.search-box button{height:52px;padding:0 28px;background:#00a1d6;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;transition:background .2s}
.search-box button:hover{background:#008bbd}
.container{max-width:960px;margin:0 auto;padding:0 20px 60px}
.section{margin-top:32px}
.section h3{font-size:1rem;font-weight:600;margin-bottom:14px;color:#374151;display:flex;align-items:center;gap:8px}
.tags{display:flex;flex-wrap:wrap;gap:10px}
.tag{display:inline-block;padding:8px 16px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;font-size:.9rem;color:#4b5563;cursor:pointer;transition:all .2s}
.tag:hover{border-color:#00a1d6;color:#00a1d6;background:#f0f9ff}
.category-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.category{padding:14px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:.92rem;color:#374151;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:10px}
.category:hover{border-color:#00a1d6;background:#f0f9ff;transform:translateY(-2px)}
.category .icon{font-size:1.2rem}
.history{margin-top:24px}
.history-list{display:flex;flex-wrap:wrap;gap:8px}
.history-item{padding:6px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;font-size:.85rem;color:#6b7280;cursor:pointer;transition:all .2s}
.history-item:hover{border-color:#00a1d6;color:#00a1d6}
.clear-btn{padding:6px 12px;background:none;border:1px solid #e5e7eb;border-radius:6px;font-size:.82rem;color:#9ca3af;cursor:pointer;transition:all .2s}
.clear-btn:hover{border-color:#ef4444;color:#ef4444}
.tip{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-top:32px;font-size:.88rem;color:#6b7280;line-height:1.7}
.tip h4{font-size:.92rem;color:#374151;margin-bottom:8px}
.tip code{background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:.82rem}
footer{text-align:center;padding:24px;color:#9ca3af;font-size:.78rem;border-top:1px solid #e5e7eb}
footer a{color:#6b7280}
@media(max-width:640px){.hero h1{font-size:1.5rem}.search-box{flex-direction:column}.category-grid{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<nav class="navbar">
  <div class="logo">📺 B 站快捷搜索</div>
  <div class="nav">
    <a href="/" class="on">搜索</a>
    <a href="https://gh.aoterniu.online" target="_blank">GitHub 代理</a>
    <a href="https://img.aoterniu.online" target="_blank">图床</a>
    <a href="https://blog.aoterniu.online" target="_blank">博客</a>
  </div>
</nav>

<div class="hero">
  <h1>B 站<span>快捷搜索</span></h1>
  <p>输入关键词，直接跳转到 B 站搜索结果页</p>

  <div class="search-box">
    <input type="text" id="keyword" placeholder="输入关键词..." onkeydown="if(event.key==='Enter')doSearch()" autofocus>
    <button onclick="doSearch()">🔍 搜索</button>
  </div>
</div>

<div class="container">

  <div id="historySection" class="history" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <h3>🕐 搜索历史</h3>
      <button class="clear-btn" onclick="clearHistory()">清空</button>
    </div>
    <div class="history-list" id="historyList"></div>
  </div>

  <div class="section">
    <h3>🔥 热门搜索</h3>
    <div class="tags" id="trendingTags"></div>
  </div>

  <div class="section">
    <h3>📂 分类搜索</h3>
    <div class="category-grid">
      <div class="category" onclick="searchCategory('视频','totalrank')"><span class="icon">🎬</span> 视频</div>
      <div class="category" onclick="searchCategory('番剧','totalrank')"><span class="icon">📺</span> 番剧</div>
      <div class="category" onclick="searchCategory('直播','totalrank')"><span class="icon">📡</span> 直播</div>
      <div class="category" onclick="searchCategory('用户','totalrank')"><span class="icon">👤</span> 用户</div>
      <div class="category" onclick="searchCategory('专栏','totalrank')"><span class="icon">📝</span> 专栏</div>
      <div class="category" onclick="searchCategory('音频','totalrank')"><span class="icon">🎵</span> 音频</div>
      <div class="category" onclick="searchCategory('相簿','totalrank')"><span class="icon">📷</span> 相簿</div>
      <div class="category" onclick="searchCategory('游戏','totalrank')"><span class="icon">🎮</span> 游戏</div>
    </div>
  </div>

  <div class="tip">
    <h4>💡 使用技巧</h4>
    <p>• 按 <code>Enter</code> 快速搜索</p>
    <p>• 搜索历史自动保存，点击可直接跳转</p>
    <p>• 支持视频、番剧、用户、专栏等分类搜索</p>
    <p>• 所有搜索结果在 B 站原站打开，安全可靠</p>
  </div>
</div>

<footer>
  <div class="links">
    <a href="https://gh.aoterniu.online">GitHub 代理</a> ·
    <a href="https://img.aoterniu.online">图床</a> ·
    <a href="https://blog.aoterniu.online">技术笔记</a>
  </div>
  B 站快捷搜索 · bili.aoterniu.online · 仅做跳转，不存储任何数据 · © 2026
</footer>

<script>
// 热门搜索（静态数据，不调用 API）
const trending = [
  '原神', '崩坏星穹铁道', '黑神话悟空', 'GTA6', 'AI', 'Python',
  'Vue', 'React', '游戏', '动漫', '音乐', '科技', '美食', '旅行'
];

const historyKey = 'bili_search_history';

// 加载热搜标签
document.getElementById('trendingTags').innerHTML = trending.map(
  t => '<span class="tag" onclick="doSearchWith(\'' + t.replace(/'/g, "\\'") + '\')">' + t + '</span>'
).join('');

// 加载搜索历史
loadHistory();

function loadHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    if (history.length > 0) {
      section.style.display = 'block';
      list.innerHTML = history.map(
        h => '<span class="history-item" onclick="doSearchWith(\'' + h.replace(/'/g, "\\'") + '\')">' + h + '</span>'
      ).join('');
    } else {
      section.style.display = 'none';
    }
  } catch(e) {}
}

function saveHistory(keyword) {
  try {
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history = history.filter(h => h !== keyword);
    history.unshift(keyword);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(historyKey, JSON.stringify(history));
    loadHistory();
  } catch(e) {}
}

function clearHistory() {
  localStorage.removeItem(historyKey);
  loadHistory();
}

// 搜索跳转
function doSearch() {
  const keyword = document.getElementById('keyword').value.trim();
  if (!keyword) return;
  saveHistory(keyword);
  window.open('https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword), '_blank');
}

function doSearchWith(keyword) {
  document.getElementById('keyword').value = keyword;
  saveHistory(keyword);
  window.open('https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword), '_blank');
}

// 分类搜索
function searchCategory(keyword, order) {
  document.getElementById('keyword').value = keyword;
  saveHistory(keyword);
  window.open('https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword) + '&order=' + order, '_blank');
}
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
};
