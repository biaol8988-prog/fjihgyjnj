document.addEventListener('DOMContentLoaded', async () => {
  console.log('AI Myth Universe loaded (dynamic mode + i18n)');

  const grid = document.getElementById('grid');
  const langBtn = document.getElementById('langToggle');
  const subtitle = document.getElementById('subtitle');
  const footerText = document.getElementById('footerText');

  let lang = 'en';

  const i18n = {
    en: {
      subtitle: 'AI Myth Universe · Dynamic Archive System',
      footer: 'Powered by AI Myth Universe Engine',
      region: 'Region',
      faction: 'Faction',
      entity: 'Entity',
      failed: 'Failed to load world data'
    },
    zh: {
      subtitle: 'AI 神话宇宙 · 动态档案系统',
      footer: 'AI 神话宇宙引擎驱动',
      region: '区域',
      faction: '势力',
      entity: '存在体',
      failed: '世界数据加载失败'
    }
  };

  function applyLang() {
    subtitle.textContent = i18n[lang].subtitle;
    footerText.textContent = i18n[lang].footer;
    renderLast?.();
  }

  async function loadWorld() {
    const res = await fetch('./data/world.json');
    const data = await res.json();
    return data;
  }

  function createCard(title, subtitle, type) {
    const card = document.createElement('div');
    card.className = 'card';

    const t = type.toLowerCase();
    let label = type;

    if (t.includes('region')) label = i18n[lang].region;
    if (t.includes('faction')) label = i18n[lang].faction;
    if (t.includes('entity')) label = i18n[lang].entity;

    card.innerHTML = `
      <h2>${title}</h2>
      <p>${subtitle || ''}</p>
      <small style="opacity:0.6">${label}</small>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });

    return card;
  }

  let renderLast = null;

  function renderWorld(data) {
    grid.innerHTML = '';

    data.regions.forEach(r => {
      grid.appendChild(createCard(r.name, r.type, 'Region'));
    });

    data.factions.forEach(f => {
      grid.appendChild(createCard(f.name, f.role, 'Faction'));
    });

    data.primordial_entities.forEach(e => {
      grid.appendChild(createCard(e.name, e.class, 'Entity'));
    });

    renderLast = () => renderWorld(data);
  }

  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'zh' : 'en';
    applyLang();
  });

  try {
    const world = await loadWorld();
    renderWorld(world);
    applyLang();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:red">${i18n[lang].failed}</p>`;
  }
});