
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
      list.innerHTML = '';
      h.forEach(k => {
        const span = document.createElement('span');
        span.className = 'history-item';
        span.textContent = k;
        span.onclick = function() { doSearchWith(k); };
        list.appendChild(span);
      });
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
