/**
 * B 站快捷搜索 - 稳定版
 * 直接跳转到 B 站搜索结果页
 */

const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>B 站快捷搜索</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(180deg,#f0f7ff 0%,#fff 100%);min-height:100vh;color:#333}
.nav{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:rgba(255,255,255,.8);backdrop-filter:blur(10px);border-bottom:1px solid #e5e7eb}
.nav-logo{font-size:18px;font-weight:700;color:#00a1d6}
.nav-links{display:flex;gap:20px;font-size:14px}
.nav-links a{color:#666;text-decoration:none}
.nav-links a:hover{color:#00a1d6}
.container{max-width:700px;margin:0 auto;padding:60px 20px}
.header{text-align:center;margin-bottom:40px}
.header h1{font-size:36px;font-weight:700;margin-bottom:12px}
.header h1 span{color:#00a1d6}
.header p{color:#666;font-size:15px}
.search-box{display:flex;gap:12px;margin-bottom:40px}
.search-box input{flex:1;padding:14px 18px;border:2px solid #e5e7eb;border-radius:10px;font-size:16px;outline:none;transition:border-color .2s}
.search-box input:focus{border-color:#00a1d6}
.search-box button{padding:14px 32px;background:#00a1d6;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;transition:background .2s}
.search-box button:hover{background:#008ebf}
.section-title{font-size:15px;font-weight:600;color:#333;margin-bottom:16px;display:flex;align-items:center;gap:6px}
.category-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
.category-item{padding:14px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;cursor:pointer;text-align:center;font-size:14px;color:#555;transition:all .2s}
.category-item:hover{border-color:#00a1d6;color:#00a1d6;transform:translateY(-2px)}
.category-item.active{border-color:#00a1d6;color:#00a1d6}
.tips{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:40px}
.tips-title{font-size:14px;font-weight:600;margin-bottom:12px;color:#333}
.tips ul{list-style:none;font-size:13px;color:#666;line-height:2}
.footer{text-align:center;padding:24px;font-size:12px;color:#999;border-top:1px solid #f0f0f0}
.footer a{color:#666;text-decoration:none}
.footer a:hover{color:#00a1d6}
.history-section{margin-bottom:32px}
.history-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.history-item{padding:6px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;color:#555;cursor:pointer;transition:all .2s}
.history-item:hover{border-color:#00a1d6;color:#00a1d6}
.clear-btn{padding:4px 10px;background:none;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;color:#999;cursor:pointer;transition:all .2s}
.clear-btn:hover{border-color:#ef4444;color:#ef4444}
@media(max-width:640px){.header h1{font-size:28px}.category-grid{grid-template-columns:repeat(2,1fr)}.search-box{flex-direction:column}}
</style>
</head>
<body>
<nav class="nav">
  <div class="nav-logo">📺 B 站快捷搜索</div>
  <div class="nav-links">
    <a href="/">搜索</a>
    <a href="https://gh.aoterniu.online" target="_blank">GitHub 代理</a>
    <a href="https://img.aoterniu.online" target="_blank">图床</a>
    <a href="https://blog.aoterniu.online" target="_blank">博客</a>
  </div>
</nav>

<div class="container">
  <div class="header">
    <h1>B 站<span>快捷搜索</span></h1>
    <p>输入关键词，直接跳转到 B 站搜索结果页</p>
  </div>

  <div class="search-box">
    <input type="text" id="keyword" placeholder="输入关键词..." autofocus>
    <button id="searchBtn">🔍 搜索</button>
  </div>

  <div id="historySection" class="history-section" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div class="section-title" style="margin:0">🕐 搜索历史</div>
      <button class="clear-btn" onclick="clearHistory()">清空</button>
    </div>
    <div class="history-list" id="historyList"></div>
  </div>

  <div class="section-title">🔥 热门搜索</div>
  <div style="margin-bottom:32px">
    <span class="history-item" onclick="doSearchWith('原神')">原神</span>
    <span class="history-item" onclick="doSearchWith('崩坏星穹铁道')">崩坏星穹铁道</span>
    <span class="history-item" onclick="doSearchWith('黑神话悟空')">黑神话悟空</span>
    <span class="history-item" onclick="doSearchWith('GTA6')">GTA6</span>
    <span class="history-item" onclick="doSearchWith('Python')">Python</span>
    <span class="history-item" onclick="doSearchWith('AI')">AI</span>
    <span class="history-item" onclick="doSearchWith('音乐')">音乐</span>
    <span class="history-item" onclick="doSearchWith('美食')">美食</span>
  </div>

  <div class="section-title">📂 分类搜索</div>
  <div class="category-grid">
    <div class="category-item active" data-type="video" onclick="selectType(this,'video')">🎬 视频</div>
    <div class="category-item" data-type="bangumi" onclick="selectType(this,'bangumi')">📺 番剧</div>
    <div class="category-item" data-type="live" onclick="selectType(this,'live')">📡 直播</div>
    <div class="category-item" data-type="user" onclick="selectType(this,'user')">👤 用户</div>
    <div class="category-item" data-type="article" onclick="selectType(this,'article')">📝 专栏</div>
    <div class="category-item" data-type="audio" onclick="selectType(this,'audio')">🎵 音频</div>
    <div class="category-item" data-type="photo" onclick="selectType(this,'photo')">📷 相簿</div>
    <div class="category-item" data-type="game" onclick="selectType(this,'game')">🎮 游戏</div>
  </div>

  <div class="tips">
    <div class="tips-title">💡 使用技巧</div>
    <ul>
      <li>• 按 <code>Enter</code> 快速搜索</li>
      <li>• 搜索历史自动保存，点击可直接跳转</li>
      <li>• 支持视频、番剧、用户、专栏等分类搜索</li>
      <li>• 所有搜索结果在 B 站原站打开，安全可靠</li>
    </ul>
  </div>
</div>

<div class="footer">
  <div style="margin-bottom:8px">
    <a href="https://gh.aoterniu.online" target="_blank">GitHub 代理</a> ·
    <a href="https://img.aoterniu.online" target="_blank">图床</a> ·
    <a href="https://blog.aoterniu.online" target="_blank">技术笔记</a>
  </div>
  <div>B 站快捷搜索 · bili.aoterniu.online · 仅做跳转，不存储任何数据 · © 2026</div>
</div>

<script>
const keywordInput = document.getElementById('keyword');
const searchBtn = document.getElementById('searchBtn');
const historyKey = 'bili_search_history';
let currentType = 'video';

function doSearch() {
  const keyword = keywordInput.value.trim();
  if (!keyword) { keywordInput.focus(); return; }
  let url;
  if (currentType === 'video') {
    url = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword);
  } else {
    url = 'https://search.bilibili.com/' + currentType + '?keyword=' + encodeURIComponent(keyword);
  }
  window.open(url, '_blank');
  saveHistory(keyword);
}

function doSearchWith(keyword) {
  keywordInput.value = keyword;
  saveHistory(keyword);
  let url;
  if (currentType === 'video') {
    url = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(keyword);
  } else {
    url = 'https://search.bilibili.com/' + currentType + '?keyword=' + encodeURIComponent(keyword);
  }
  window.open(url, '_blank');
}

function selectType(el, type) {
  document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  currentType = type;
  keywordInput.focus();
}

function saveHistory(keyword) {
  try {
    let h = JSON.parse(localStorage.getItem(historyKey) || '[]');
    h = h.filter(k => k !== keyword);
    h.unshift(keyword);
    h = h.slice(0, 10);
    localStorage.setItem(historyKey, JSON.stringify(h));
    loadHistory();
  } catch(e) {}
}

function loadHistory() {
  try {
    const h = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    if (h.length > 0) {
      section.style.display = 'block';
      list.innerHTML = h.map(k =>
        '<span class="history-item" onclick="doSearchWith(\'' + k.replace(/'/g, "\\'") + '\')">' + k + '</span>'
      ).join('');
    } else {
      section.style.display = 'none';
    }
  } catch(e) {}
}

function clearHistory() {
  localStorage.removeItem(historyKey);
  loadHistory();
}

searchBtn.addEventListener('click', doSearch);
keywordInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') doSearch(); });
loadHistory();
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    return new Response('Not Found', { status: 404 });
  }
};
