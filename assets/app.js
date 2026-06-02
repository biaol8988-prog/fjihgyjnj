document.addEventListener('DOMContentLoaded', async () => {
  console.log('AI Myth Universe loaded (dynamic mode + i18n + detail system)');

  const grid = document.getElementById('grid');
  const langBtn = document.getElementById('langToggle');
  const subtitle = document.getElementById('subtitle');
  const footerText = document.getElementById('footerText');

  let lang = 'en';
  let worldData = null;

  // ===== i18n =====
  const i18n = {
    en: {
      subtitle: 'AI Myth Universe · Dynamic Archive System',
      footer: 'Powered by AI Myth Universe Engine',
      region: 'Region',
      faction: 'Faction',
      entity: 'Entity',
      searchPlaceholder: 'Search entities...',
      failed: 'Failed to load world data'
    },
    zh: {
      subtitle: 'AI 神话宇宙 · 动态档案系统',
      footer: 'AI 神话宇宙引擎驱动',
      region: '区域',
      faction: '势力',
      entity: '存在体',
      searchPlaceholder: '搜索神话实体...',
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

  // ===== render =====
  function renderWorld(data) {
    grid.innerHTML = '';

    data.regions.forEach(r => {
      grid.appendChild(createCard(r, 'Region'));
    });

    data.factions.forEach(f => {
      grid.appendChild(createCard(f, 'Faction'));
    });

    data.primordial_entities.forEach(e => {
      grid.appendChild(createCard(e, 'Entity'));
    });

    worldData = data;
  }

  // ===== language =====
  function applyLang() {
    subtitle.textContent = i18n[lang].subtitle;
    footerText.textContent = i18n[lang].footer;

    if (worldData) renderWorld(worldData);
  }

  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'zh' : 'en';
    applyLang();
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