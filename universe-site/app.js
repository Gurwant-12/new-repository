/* Cosmic Atlas — Interactive logic */
(function () {
  const planets = [
    {
      id: 'mercury', name: 'Mercury', type: 'terrestrial',
      massEarths: 0.055, radiusKm: 2439.7, distanceAu: 0.39,
      dayHours: 4222.6 / 24, yearDays: 87.97, moons: 0,
      description: 'Smallest planet and closest to the Sun; a cratered, airless world with extreme temperature swings.'
    },
    {
      id: 'venus', name: 'Venus', type: 'terrestrial',
      massEarths: 0.815, radiusKm: 6051.8, distanceAu: 0.72,
      dayHours: 5832.5, yearDays: 224.7, moons: 0,
      description: 'Earth’s twin in size, but with a dense CO₂ atmosphere and surface hot enough to melt lead.'
    },
    {
      id: 'earth', name: 'Earth', type: 'terrestrial',
      massEarths: 1, radiusKm: 6371, distanceAu: 1,
      dayHours: 24, yearDays: 365.25, moons: 1,
      description: 'Our home world, the only known planet to harbor life, with liquid water oceans and a protective atmosphere.'
    },
    {
      id: 'mars', name: 'Mars', type: 'terrestrial',
      massEarths: 0.107, radiusKm: 3389.5, distanceAu: 1.52,
      dayHours: 24.6, yearDays: 687, moons: 2,
      description: 'The Red Planet, home to the largest volcano and canyon in the Solar System; once hosted flowing water.'
    },
    {
      id: 'jupiter', name: 'Jupiter', type: 'gas-giant',
      massEarths: 317.8, radiusKm: 69911, distanceAu: 5.2,
      dayHours: 9.9, yearDays: 4333, moons: 95,
      description: 'The largest planet; a gas giant with powerful storms like the Great Red Spot and dozens of moons.'
    },
    {
      id: 'saturn', name: 'Saturn', type: 'gas-giant',
      massEarths: 95.2, radiusKm: 58232, distanceAu: 9.58,
      dayHours: 10.7, yearDays: 10759, moons: 83,
      description: 'Famous for its spectacular ring system composed of ice and rock; a low-density gas giant.'
    },
    {
      id: 'uranus', name: 'Uranus', type: 'ice-giant',
      massEarths: 14.5, radiusKm: 25362, distanceAu: 19.2,
      dayHours: 17.2, yearDays: 30687, moons: 27,
      description: 'An ice giant tipped on its side, likely due to an ancient collision; methane gives it a cyan hue.'
    },
    {
      id: 'neptune', name: 'Neptune', type: 'ice-giant',
      massEarths: 17.1, radiusKm: 24622, distanceAu: 30.05,
      dayHours: 16.1, yearDays: 60190, moons: 14,
      description: 'The farthest known planet; supersonic winds and deep blue color due to methane in the atmosphere.'
    },
    {
      id: 'pluto', name: 'Pluto', type: 'dwarf',
      massEarths: 0.0022, radiusKm: 1188.3, distanceAu: 39.5,
      dayHours: 153.3, yearDays: 90560, moons: 5,
      description: 'A dwarf planet in the Kuiper Belt with a heart-shaped glacier; explored by New Horizons in 2015.'
    }
  ];

  const typeLabels = {
    'terrestrial': 'Terrestrial planet',
    'gas-giant': 'Gas giant',
    'ice-giant': 'Ice giant',
    'dwarf': 'Dwarf planet'
  };

  const colorMap = {
    mercury: ['#b0b3bd', '#6b6f7a'],
    venus: ['#eac27b', '#b87c3a'],
    earth: ['#5cc3ff', '#1b7faa'],
    mars: ['#c66a3d', '#7a3320'],
    jupiter: ['#d1b48e', '#9a6f3a'],
    saturn: ['#e7d4a3', '#b99c68'],
    uranus: ['#9de0e8', '#4cb2bd'],
    neptune: ['#5b7cff', '#243fa3'],
    pluto: ['#c9c1bb', '#7a6e68']
  };

  let currentType = 'all';
  let currentSearch = '';

  const grid = document.getElementById('planet-grid');
  const searchInput = document.getElementById('search');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');

  function setThemeFromPreference() {
    const saved = localStorage.getItem('theme');
    let theme = saved;
    if (!theme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const curr = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  function formatNumber(n, options) {
    try { return new Intl.NumberFormat(undefined, options).format(n); } catch { return String(n); }
  }

  function planetColors(id) {
    const [c1, c2] = colorMap[id] || ['#9aaaba', '#475569'];
    return { c1, c2 };
  }

  function createPlanetCard(p) {
    const { c1, c2 } = planetColors(p.id);
    const el = document.createElement('article');
    el.className = 'planet-card';
    el.innerHTML = `
      <div class="planet-head">
        <div class="planet-icon" style="--planet-c1:${c1}; --planet-c2:${c2};" aria-hidden="true"></div>
        <div>
          <h3 class="planet-title">${p.name}</h3>
          <p class="planet-type">${typeLabels[p.type] || p.type}</p>
        </div>
      </div>
      <dl class="kv">
        <dt>Mass</dt><dd>${p.massEarths} Earths</dd>
        <dt>Radius</dt><dd>${formatNumber(p.radiusKm)} km</dd>
        <dt>Distance</dt><dd>${p.distanceAu} AU</dd>
        <dt>Moons</dt><dd>${p.moons}</dd>
      </dl>
      <p>${p.description}</p>
      <div class="card-actions">
        <button class="button primary" data-id="${p.id}" data-action="details">Learn more</button>
      </div>
    `;
    el.querySelector('[data-action="details"]').addEventListener('click', () => openDetails(p));
    return el;
  }

  function render(planetsToShow) {
    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    planetsToShow.forEach(p => frag.appendChild(createPlanetCard(p)));
    grid.appendChild(frag);
    grid.setAttribute('aria-busy', 'false');
  }

  function applyFilters() {
    const term = currentSearch.trim().toLowerCase();
    const filtered = planets.filter(p => {
      const termOk = !term || p.name.toLowerCase().includes(term) || (p.description.toLowerCase().includes(term));
      const typeOk = currentType === 'all' || p.type === currentType;
      return termOk && typeOk;
    });
    render(filtered);
  }

  function openDetails(p) {
    const { c1, c2 } = planetColors(p.id);
    modalBody.innerHTML = `
      <div class="modal-body-grid">
        <div class="planet-icon" style="--planet-c1:${c1}; --planet-c2:${c2};" aria-hidden="true"></div>
        <div>
          <h3 id="modal-title" class="modal-title">${p.name}</h3>
          <p class="modal-sub">${typeLabels[p.type] || p.type}</p>
          <div class="kv" style="margin-top:8px">
            <dt>Mass</dt><dd>${p.massEarths} Earths</dd>
            <dt>Radius</dt><dd>${formatNumber(p.radiusKm)} km</dd>
            <dt>Distance from Sun</dt><dd>${p.distanceAu} AU</dd>
            <dt>Length of day</dt><dd>${formatNumber(p.dayHours)} h</dd>
            <dt>Orbital period</dt><dd>${formatNumber(p.yearDays)} days</dd>
            <dt>Moons</dt><dd>${p.moons}</dd>
          </div>
          <p style="margin-top:8px">${p.description}</p>
        </div>
      </div>
    `;
    modal.setAttribute('aria-hidden', 'false');
    // Focus management
    const closeBtn = modal.querySelector('[data-close]');
    closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
  }

  function bindEvents() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      window.requestAnimationFrame(applyFilters);
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        currentType = chip.dataset.type || 'all';
        applyFilters();
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  function init() {
    setThemeFromPreference();
    render(planets);
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();