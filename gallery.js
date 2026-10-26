'use strict';
const $ = id => document.getElementById(id);
const state = { manifest: null, selected: null, layers: [], refs: new Map(), cardRefs: new Map(), assets: new Map(), filteredCards: [], libraryLimit: 30, libraryItems: [] };
let resizeObserver;
const factionNames = { wei: '魏', shu: '蜀', wu: '吴', qun: '群雄', huangjin: '黄巾', han: '汉', neutral: '中立' };
const gradeNames = { C: '绿色边框', B: '蓝色边框', A: '紫色边框', S: '橙色边框', U: '红色边框' };
const categoryNames = { frame: '共用品级色边框与分隔带', background: '全卡共用米色底板', footer: '全卡共用黑色尾页', faction: '国家菱形', role: '资源标识', resourceBadge: '资源圆形角标', roleBase: '共用兵种徽章底', roleIcon: '独立兵种图标', portrait: '人物头像', resourceArt: '资源插图', approvedResourceCard: '已确认资源整卡', name: '透明标题', divider: '分隔线', character: '人物' };
function node(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
function filePath(value) { if (typeof value !== 'string' || !value.trim()) throw new Error('清单缺少PNG文件路径'); return value; }
function kindOf(card) { return card.kind === 'resource' ? 'resource' : ['soldier', 'troop', 'minion'].includes(card.kind) ? 'soldier' : 'hero'; }
function kindName(card) { return { hero: '英雄', soldier: '小兵', resource: '资源卡' }[kindOf(card)]; }
function gradeName(card) { return card.gradeDisplay || gradeNames[card.grade] || '未设边框'; }
function cardChapters(card) { return [...new Set((card.chapters || []).map(c => Number(typeof c === 'object' ? c.chapter : c)).filter(Number.isFinite))]; }
function assetCategory(asset) { return asset.category || 'other'; }
function categoryName(value) { return categoryNames[value] || value || '其他'; }
function currentCounts() { const refs = new Map(); (state.selected?.recipe || []).forEach(entry => refs.set(entry.assetId, (refs.get(entry.assetId) || 0) + 1)); return refs; }
function downloadJSON(value, filename) { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' })); const a = node('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); }

function buildIndices(manifest) {
  state.assets = new Map(manifest.assets.map(asset => [asset.id, asset]));
  state.refs = new Map(manifest.assets.map(asset => [asset.id, 0]));
  state.cardRefs = new Map(manifest.assets.map(asset => [asset.id, new Set()]));
  manifest.cards.forEach(card => {
    if (!Array.isArray(card.recipe)) throw new Error(`卡牌缺少组件配方：${card.id}`);
    card.recipe.forEach(entry => {
      if (!state.assets.has(entry.assetId)) throw new Error(`未知组件 ${entry.assetId}，卡牌 ${card.id}`);
      state.refs.set(entry.assetId, state.refs.get(entry.assetId) + 1);
      state.cardRefs.get(entry.assetId).add(card.id);
    });
  });
}

function resizeCard() {
  if (!state.selected) return;
  const { width, height } = state.selected;
  const mobile = window.innerWidth <= 680;
  const surfaceTop = $('preview-surface').getBoundingClientRect().top;
  const previewHeight = Math.max(mobile ? 290 : 320, Math.min(650, window.innerHeight - Math.max(0, surfaceTop) - 78));
  document.documentElement.style.setProperty('--preview-height', `${previewHeight}px`);
  const availableWidth = Math.max(80, $('preview-surface').clientWidth - 28);
  const availableHeight = previewHeight - 30;
  const scale = $('zoom').value === 'fit' ? Math.min(1.15, availableWidth / width, availableHeight / height) : Number($('zoom').value);
  $('scaled-card').style.width = `${width * scale}px`;
  $('scaled-card').style.height = `${height * scale}px`;
  $('card-stack').style.transform = `scale(${scale})`;
  $('preview-surface').style.justifyContent = width * scale > availableWidth ? 'flex-start' : 'center';
  $('preview-surface').style.alignItems = height * scale > availableHeight ? 'flex-start' : 'center';
}

function mergedFrameNode(asset, entry) {
  const outer = node('div', 'merged-frame');
  outer.style.position = 'absolute';
  const w = entry.width ?? asset.width, h = entry.height ?? asset.height;
  const k = asset.frameLayout.cornerSize;
  const [dl, dr] = asset.frameLayout.dividerInsets ?? [22,22];
  const join = asset.frameLayout.sideJoin;
  function appendPiece(sx, sy, sw, sh, dx, dy, dw, dh) {
    const clip = node('span');
    Object.assign(clip.style, {position:'absolute', left:`${dx}px`, top:`${dy}px`, width:`${dw}px`, height:`${dh}px`, overflow:'hidden'});
    const image = node('img'); image.src = filePath(asset.file); image.alt = '';
    Object.assign(image.style, {left:`${-sx*dw/sw}px`, top:`${-sy*dh/sh}px`, width:`${asset.width*dw/sw}px`, height:`${asset.height*dh/sh}px`});
    image.addEventListener('error', () => { $('image-error').hidden = false; $('image-error').textContent = `组件读取失败：${asset.file}`; });
    clip.append(image); outer.append(clip);
  }
  asset.frameLayout.regions.forEach(region => {
    const [sx, sy, sw, sh] = region.sourceRect;
    const positions = {
      'top-left': [0, 0, k, k], top: [k, 0, w - 2*k, k], 'top-right': [w-k, 0, k, k],
      left: [0, k, sw, h - 2*k], right: [w-sw, k, sw, h - 2*k],
      'bottom-left': [0, h-k, k, k], bottom: [k, h-k, w - 2*k, k],
      'bottom-right': [w-k, h-k, k, k], divider: [dl, entry.dividerY, w-dl-dr, sh]
    };
    const [dx, dy, dw, dh] = positions[region.placement];
    if (join && ['left','right'].includes(region.placement)) {
      const iw = join.innerWidth, jy = join.sourceY, jh = join.height;
      const isLeft = region.placement === 'left';
      appendPiece(isLeft ? sx : sx+iw, sy, sw-iw, sh, isLeft ? dx : dx+iw, dy, sw-iw, dh);
      const ix = isLeft ? sx+sw-iw : sx, idx = isLeft ? dx+sw-iw : dx;
      [[sy,jy,k,entry.dividerY], [jy,jy+jh,entry.dividerY,entry.dividerY+jh],
       [jy+jh,sy+sh,entry.dividerY+jh,h-k]].forEach(([a0,a1,b0,b1]) => {
        appendPiece(ix,a0,iw,a1-a0,idx,b0,iw,b1-b0);
      });
    } else appendPiece(sx,sy,sw,sh,dx,dy,dw,dh);
  });
  return outer;
}

function updateLayerCount() { $('layer-count').textContent = `显示 ${state.layers.filter(layer => layer.visible).length} / ${state.layers.length} 个图层实例`; }

function selectCard(card, options = {}) {
  state.selected = card;
  document.querySelectorAll('.card-choice').forEach(button => { const active = button.dataset.cardId === card.id; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  const chapters = cardChapters(card);
  $('selected-name').textContent = card.name;
  $('selected-meta').textContent = `${gradeName(card)} · ${kindName(card)} · ${factionNames[card.factionId] || card.faction || card.factionId || '—'} · ${chapters.length ? chapters.map(c => `第${c}章`).join(' / ') : '通用'} · ${card.width} × ${card.height} px`;
  $('download-selected').href = filePath(card.image);
  $('download-selected').download = card.image.split('/').pop();
  $('open-native').href = card.image;
  $('card-stack').style.width = `${card.width}px`;
  $('card-stack').style.height = `${card.height}px`;
  $('card-stack').setAttribute('aria-label', `${card.name}，由独立PNG图层实际组装`);
  $('card-stack').replaceChildren();
  $('layer-controls').replaceChildren();
  $('image-error').hidden = true;
  $('image-error').textContent = '';
  state.layers = [];
  const refs = currentCounts();
  const entries = card.recipe.map((entry, index) => ({ ...entry, originalIndex: index })).sort((a, b) => (a.z ?? a.originalIndex) - (b.z ?? b.originalIndex));
  entries.forEach(entry => {
    const asset = state.assets.get(entry.assetId);
    const img = asset.frameLayout ? mergedFrameNode(asset, entry) : node('img');
    if (!asset.frameLayout) { img.src = filePath(asset.file); img.alt = ''; }
    img.dataset.assetId = asset.id; img.dataset.instanceId = entry.id || String(entry.originalIndex);
    img.style.left = `${entry.x || 0}px`; img.style.top = `${entry.y || 0}px`;
    img.style.width = `${entry.width ?? asset.width}px`; img.style.height = `${entry.height ?? asset.height}px`;
    img.style.zIndex = entry.z ?? entry.originalIndex; img.style.opacity = entry.opacity ?? 1;
    if (entry.rotation) img.style.transform = `rotate(${entry.rotation}deg)`;
    img.addEventListener('error', () => { if (state.selected === card) { $('image-error').hidden = false; $('image-error').textContent += `组件读取失败：${asset.file}；`; } });
    $('card-stack').append(img);
    const layer = { entry, asset, img, visible: entry.visible !== false };
    img.hidden = !layer.visible;
    state.layers.push(layer);
  });
  const numbered = new Map();
  [...state.layers].reverse().forEach(layer => {
    const { entry, asset, img } = layer;
    const instance = (numbered.get(asset.id) || 0) + 1; numbered.set(asset.id, instance);
    const label = node('label', 'layer-control');
    const check = node('input'); check.type = 'checkbox'; check.checked = layer.visible;
    const text = node('span');
    text.append(node('span', 'layer-title', entry.label || `${asset.label || asset.id}${refs.get(asset.id) > 1 ? ` · 实例 ${instance}` : ''}`), node('span', 'layer-id', asset.id), node('span', 'layer-position', `x ${entry.x || 0} · y ${entry.y || 0}`));
    label.append(check, text); label.classList.toggle('off', !layer.visible);
    check.addEventListener('change', () => { layer.visible = check.checked; img.hidden = !layer.visible; label.classList.toggle('off', !layer.visible); updateLayerCount(); });
    layer.check = check; layer.label = label; $('layer-controls').append(label);
  });
  updateLayerCount();
  const sharedInCard = [...refs].filter(([id]) => state.cardRefs.get(id).size > 1 || state.refs.get(id) > 1);
  $('composition-note').textContent = `${refs.size} 个独立PNG · ${entries.length} 个图层实例 · 中央预览直接叠加这些文件`;
  const repeated = [...refs].filter(([, count]) => count > 1);
  $('reuse-summary').textContent = `${sharedInCard.length} 个组件在全库中重复引用。${repeated.map(([id, count]) => `“${state.assets.get(id).label || id}”为同一个PNG，本卡引用 ${count} 次。`).join('')}`;
  if (options.updateHash !== false) history.replaceState(null, '', `#card=${encodeURIComponent(card.id)}`);
  state.libraryLimit = 30;
  renderLibrary();
  resizeCard();
}

function filterCards() {
  const kind = $('kind-filter').value, chapter = $('chapter-filter').value, grade = $('grade-filter').value, query = $('card-search').value.trim().toLowerCase();
  state.filteredCards = state.manifest.cards.filter(card => (kind === 'all' || kindOf(card) === kind) && (chapter === 'all' || cardChapters(card).includes(Number(chapter))) && (grade === 'all' || card.grade === grade) && (!query || [card.name, card.id, card.factionId, card.faction, factionNames[card.factionId], gradeName(card)].filter(Boolean).join(' ').toLowerCase().includes(query)));
  $('filter-count').textContent = `${state.filteredCards.length} / ${state.manifest.cards.length} 张`;
  $('roster-count').textContent = `${state.filteredCards.length} 张`;
  $('roster').replaceChildren();
  $('empty-roster').hidden = state.filteredCards.length !== 0;
  state.filteredCards.forEach(card => {
    const button = node('button', 'card-choice'); button.type = 'button'; button.dataset.cardId = card.id;
    const selected = state.selected?.id === card.id; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); button.setAttribute('aria-label', `${card.name} ${gradeName(card)} ${kindName(card)}`);
    const image = node('img', 'card-thumb'); image.src = filePath(card.image); image.alt = ''; image.loading = 'lazy';
    button.append(image, node('strong', '', card.name), node('span', 'card-sub', `${gradeName(card)} · ${kindName(card)}`));
    button.addEventListener('click', () => selectCard(card));
    $('roster').append(button);
  });
  if (state.filteredCards.length && !state.filteredCards.some(card => card.id === state.selected?.id)) selectCard(state.filteredCards[0]);
}

function filteredAssets() {
  const scope = $('library-scope').value, category = $('category-filter').value, query = $('asset-search').value.trim().toLowerCase();
  const current = currentCounts();
  return state.manifest.assets.filter(asset => (scope === 'all' || (scope === 'current' ? current.has(asset.id) : state.refs.get(asset.id) > 1)) && (category === 'all' || assetCategory(asset) === category) && (!query || [asset.label, asset.id, asset.file, asset.category].filter(Boolean).join(' ').toLowerCase().includes(query))).sort((a,b) => {
    if (scope === 'shared') return (state.cardRefs.get(b.id).size - state.cardRefs.get(a.id).size) || (state.refs.get(b.id) - state.refs.get(a.id));
    return 0;
  });
}

function renderLibrary() {
  if (!state.manifest) return;
  const items = filteredAssets(), displayed = items.slice(0, state.libraryLimit), current = currentCounts();
  state.libraryItems = items;
  $('components').replaceChildren(); $('reuse-table').replaceChildren();
  $('library-count').textContent = `显示 ${displayed.length} / ${items.length} 个`;
  $('empty-components').hidden = items.length !== 0;
  $('more-components').hidden = displayed.length === items.length;
  $('more-components').textContent = `显示更多组件（剩余 ${items.length - displayed.length} 个）`;
  displayed.forEach(asset => {
    const references = state.refs.get(asset.id), cardReferences = state.cardRefs.get(asset.id).size;
    const article = node('article', 'component-card');
    const preview = node('a', 'component-image'); preview.href = filePath(asset.file); preview.target = '_blank'; preview.rel = 'noopener'; preview.setAttribute('aria-label', `打开${asset.label || asset.id}原始PNG`);
    const img = node('img'); img.src = asset.file; img.alt = asset.label || asset.id; img.loading = 'lazy'; preview.append(img);
    const info = node('div', 'component-info'), title = node('div', 'component-title');
    title.append(node('h3', '', asset.label || asset.id), node('span', 'uses', `${cardReferences}卡 / ${references}次`));
    const meta = node('div', 'component-meta'); meta.append(node('span', '', `${asset.width} × ${asset.height} px`));
    const download = node('a', '', '下载PNG'); download.href = asset.file; download.download = asset.file.split('/').pop(); meta.append(download);
    info.append(title, node('p', 'component-id', asset.id), meta); article.append(preview, info); $('components').append(article);
    const row = node('tr'), label = node('td', '', asset.label || asset.id); label.append(node('span', 'table-asset-id', asset.id));
    const path = node('td'), link = node('a', '', asset.file); link.href = asset.file; link.target = '_blank'; link.rel = 'noopener'; path.append(link);
    row.append(label, node('td', 'count-value', String(current.get(asset.id) || 0)), node('td', 'count-value', String(cardReferences)), node('td', 'count-value', String(references)), path); $('reuse-table').append(row);
  });
}

function populateFilters(manifest) {
  $('chapter-filter').replaceChildren(new Option('全部章节', 'all'));
  const chapters = [...new Set(manifest.cards.flatMap(cardChapters))].sort((a,b) => a-b);
  chapters.forEach(chapter => { const meta = manifest.chapters?.find(entry => Number(entry.chapter) === chapter); $('chapter-filter').append(new Option(`第${chapter}章${meta?.name ? ` · ${meta.name}` : ''}`, chapter)); });
  $('grade-filter').replaceChildren(new Option('全部边框颜色', 'all'));
  const grades = [...new Set(manifest.cards.map(card => card.grade).filter(Boolean))].sort((a,b) => (['C','B','A','S','U'].indexOf(a) - ['C','B','A','S','U'].indexOf(b)));
  grades.forEach(grade => $('grade-filter').append(new Option(gradeNames[grade] || '其他边框', grade)));
  $('category-filter').replaceChildren(new Option('全部类别', 'all'));
  [...new Set(manifest.assets.map(assetCategory))].forEach(category => $('category-filter').append(new Option(categoryName(category), category)));
}

async function load() {
  try {
    const response = await fetch(`manifest.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`素材清单尚未就绪（HTTP ${response.status}）`);
    const manifest = await response.json();
    if (!Array.isArray(manifest.cards) || !manifest.cards.length || !Array.isArray(manifest.assets)) throw new Error('素材清单缺少 cards 或 assets');
    state.manifest = manifest; buildIndices(manifest); populateFilters(manifest);
    const counts = { hero: 0, soldier: 0, resource: 0 };
    manifest.cards.forEach(card => counts[kindOf(card)]++);
    const kinds = [['hero', '英雄卡'], ['soldier', '小兵卡'], ['resource', '资源卡']];
    $('intro').textContent = `${kinds.filter(([kind]) => counts[kind]).map(([kind, label]) => `${counts[kind]} 张${label}`).join(' ＋ ')}，共 ${manifest.cards.length} 张`;
    $('component-total').textContent = `${manifest.assets.length} 个独立PNG`;
    const downloadComponents = $('download-components');
    if (downloadComponents) downloadComponents.href = manifest.downloads?.roleIcons || 'role-icons-transparent-png.zip';
    const notes = Array.isArray(manifest.limitations) ? manifest.limitations : manifest.limitations ? [manifest.limitations] : [];
    $('limitations-content').replaceChildren();
    notes.forEach(note => $('limitations-content').append(node('p', '', typeof note === 'string' ? note : note.description || note.note || JSON.stringify(note))));
    $('limitations').hidden = notes.length === 0;
    $('gallery').hidden = false; $('load-error').hidden = true;
    const hash = new URLSearchParams(location.hash.replace(/^#/, '')).get('card');
    const first = manifest.cards.find(card => card.id === hash) || manifest.cards.find(card => card.id === 'hero:CH09_N10') || manifest.cards.find(card => card.grade === 'U' && /关羽/.test(card.name)) || manifest.cards[0];
    selectCard(first); filterCards();
    if (resizeObserver) resizeObserver.disconnect();
    resizeObserver = new ResizeObserver(resizeCard); resizeObserver.observe($('preview-surface'));
  } catch (error) { $('load-error').querySelector('span').textContent = error.message; $('load-error').hidden = false; $('intro').textContent = '卡牌与组件准备中'; }
}

document.querySelectorAll('[data-background]').forEach(button => button.addEventListener('click', () => { $('preview-surface').className = `preview-surface bg-${button.dataset.background}`; document.querySelectorAll('[data-background]').forEach(other => { const active = button === other; other.classList.toggle('selected', active); other.setAttribute('aria-pressed', String(active)); }); }));
['kind-filter','chapter-filter','grade-filter'].forEach(id => $(id).addEventListener('change', filterCards));
$('card-search').addEventListener('input', filterCards);
$('reset-filter').addEventListener('click', () => { $('kind-filter').value = 'all'; $('chapter-filter').value = 'all'; $('grade-filter').value = 'all'; $('card-search').value = ''; filterCards(); });
['library-scope','category-filter'].forEach(id => $(id).addEventListener('change', () => { state.libraryLimit = 30; renderLibrary(); }));
$('asset-search').addEventListener('input', () => { state.libraryLimit = 30; renderLibrary(); });
$('more-components').addEventListener('click', () => { state.libraryLimit += 30; renderLibrary(); });
$('zoom').addEventListener('change', resizeCard); window.addEventListener('resize', resizeCard);
$('reset-layers').addEventListener('click', () => { state.layers.forEach(layer => { layer.visible = true; layer.img.hidden = false; layer.check.checked = true; layer.label.classList.remove('off'); }); updateLayerCount(); });
$('download-recipe').addEventListener('click', () => { if (state.selected) downloadJSON({ card: { id: state.selected.id, name: state.selected.name, width: state.selected.width, height: state.selected.height }, assets: [...currentCounts().keys()].map(id => state.assets.get(id)), recipe: state.selected.recipe }, `${state.selected.id.replace(/[^\p{L}\p{N}_-]/gu, '-')}-recipe.json`); });
$('reload').addEventListener('click', load);
load();
