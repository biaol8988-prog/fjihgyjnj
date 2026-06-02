document.addEventListener('DOMContentLoaded', async () => {
  console.log('AI Myth Universe loaded (dynamic mode)');

  const grid = document.getElementById('grid');

  async function loadWorld() {
    const res = await fetch('./data/world.json');
    const data = await res.json();
    return data;
  }

  function createCard(title, subtitle, type) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h2>${title}</h2>
      <p>${subtitle || ''}</p>
      <small style="opacity:0.6">${type}</small>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });

    return card;
  }

  function renderWorld(data) {
    grid.innerHTML = '';

    // Regions
    data.regions.forEach(r => {
      grid.appendChild(createCard(r.name, r.type, 'Region'));
    });

    // Factions
    data.factions.forEach(f => {
      grid.appendChild(createCard(f.name, f.role, 'Faction'));
    });

    // Entities
    data.primordial_entities.forEach(e => {
      grid.appendChild(createCard(e.name, e.class, 'Entity'));
    });
  }

  try {
    const world = await loadWorld();
    renderWorld(world);
  } catch (err) {
    console.error('Failed to load world data:', err);
    grid.innerHTML = '<p style="color:red">Failed to load world data</p>';
  }
});