document.addEventListener('DOMContentLoaded', async () => {
  console.log('AI Myth Universe loaded (dynamic mode + i18n + detail system + search + map)');

  const grid = document.getElementById('grid');
  const mapView = document.getElementById('mapView');
  const langBtn = document.getElementById('langToggle');
  const mapBtn = document.getElementById('mapToggle');
  const subtitle = document.getElementById('subtitle');
  const footerText = document.getElementById('footerText');
  const searchBox = document.getElementById('searchBox');

  let lang = 'en';
  let worldData = null;
  let viewMode = 'world';

  // ===== i18n =====
  const i18n = {
    en: {
      subtitle: 'AI Myth Universe · Dynamic Archive System',
      footer: 'Powered by AI Myth Universe Engine',
      region: 'Region',
      faction: 'Faction',
      entity: 'Entity',
      searchPlaceholder: 'Search entities...',
      map: 'Map',
      world: 'World',
      failed: 'Failed to load world data'
    },
    zh: {
      subtitle: 'AI 神话宇宙 · 动态档案系统',
      footer: 'AI 神话宇宙引擎驱动',
      region: '区域',
      faction: '势力',
      entity: '存在体',
      searchPlaceholder: '搜索神话实体...',
      map: '地图',
      world: '世界',
      failed: '世界数据加载失败'
    }
  };

  // ===== Modal =====
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0,0,0,0.8)';
  modal.style.display = 'none';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '9999';
  modal.innerHTML = `<div id="modalBox" style="background:#111;padding:20px;border-radius:10px;max-width:400px;color:#fff"></div>`;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  function openModal(item, typeLabel) {
    const box = modal.querySelector('#modalBox');
    box.innerHTML = `
      <h2>${item.name}</h2>
      <p><b>${typeLabel}</b></p>
      <p>${item.type || item.role || item.class || ''}</p>
    `;
    modal.style.display = 'flex';
  }

  // ===== world loader =====
  async function loadWorld() {
    const res = await fetch('./data/world.json');
    return await res.json();
  }

  // ===== card =====
  function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';

    let label = type;
    const t = type.toLowerCase();

    if (t.includes('region')) label = i18n[lang].region;
    if (t.includes('faction')) label = i18n[lang].faction;
    if (t.includes('entity')) label = i18n[lang].entity;

    card.innerHTML = `
      <h2>${item.name}</h2>
      <p>${item.type || item.role || item.class || ''}</p>
      <small style="opacity:0.6">${label}</small>
    `;

    card.addEventListener('click', () => {
      openModal(item, label);
    });

    return card;
  }

  // ===== render world =====
  function renderWorld(data) {
    grid.innerHTML = '';

    data.regions.forEach(r => grid.appendChild(createCard(r, 'Region')));
    data.factions.forEach(f => grid.appendChild(createCard(f, 'Faction')));
    data.primordial_entities.forEach(e => grid.appendChild(createCard(e, 'Entity')));

    worldData = data;
  }

  // ===== render map =====
  function renderMap(data) {
    mapView.innerHTML = '';

    data.regions.forEach(r => {
      const node = document.createElement('div');
      node.className = 'card';
      node.innerHTML = `<h2>${r.name}</h2><p>${r.type}</p><small>${i18n[lang].map}</small>`;
      node.addEventListener('click', () => openModal(r, i18n[lang].region));
      mapView.appendChild(node);
    });
  }

  function switchView(mode) {
    viewMode = mode;

    if (mode === 'world') {
      grid.style.display = 'grid';
      mapView.style.display = 'none';
    } else {
      grid.style.display = 'none';
      mapView.style.display = 'grid';
      if (worldData) renderMap(worldData);
    }
  }

  // ===== language =====
  function applyLang() {
    subtitle.textContent = i18n[lang].subtitle;
    footerText.textContent = i18n[lang].footer;
    searchBox.placeholder = i18n[lang].searchPlaceholder;

    if (worldData) {
      renderWorld(worldData);
      if (viewMode === 'map') renderMap(worldData);
    }
  }

  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'zh' : 'en';
    applyLang();
  });

  mapBtn.addEventListener('click', () => {
    switchView(viewMode === 'world' ? 'map' : 'world');
  });

  searchBox.addEventListener('input', () => {
    if (!worldData) return;

    const q = searchBox.value.trim().toLowerCase();
    const filter = (arr) => arr.filter(i => (i.name || '').toLowerCase().includes(q));

    if (viewMode === 'world') {
      grid.innerHTML = '';
      filter(worldData.regions).forEach(r => grid.appendChild(createCard(r, 'Region')));
      filter(worldData.factions).forEach(f => grid.appendChild(createCard(f, 'Faction')));
      filter(worldData.primordial_entities).forEach(e => grid.appendChild(createCard(e, 'Entity')));
    } else {
      renderMap({ regions: filter(worldData.regions) });
    }
  });

  // ===== init =====
  try {
    const world = await loadWorld();
    renderWorld(world);
    applyLang();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:red">${i18n[lang].failed}</p>`;
  }
});