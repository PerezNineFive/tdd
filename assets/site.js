(() => {
  const nav = document.getElementById('nav');
  const onScroll = () => nav && nav.classList.toggle('sc', scrollY > 40);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // reveal: content is readable at rest; motion only adds a lift
  document.documentElement.classList.add('armed');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12});
  document.querySelectorAll('.rv').forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); else io.observe(el); });

  // countdown (homepage): active step and rocket climb follow scroll
  const steps = [...document.querySelectorAll('.step')];
  const tval = document.getElementById('tval'), tname = document.getElementById('tname');
  const rocket = document.getElementById('rocket'), track = document.getElementById('track'), list = document.getElementById('steps');
  if (steps.length && tval && rocket && track && list) {
    const tick = () => {
      const mid = innerHeight * .5; let active = steps[0];
      for (const s of steps) if (s.getBoundingClientRect().top < mid) active = s;
      steps.forEach(s => s.classList.toggle('on', s === active));
      tval.textContent = active.dataset.t; tname.textContent = active.dataset.n;
      const r = list.getBoundingClientRect(), p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      rocket.style.setProperty('--lift', (p * Math.max(0, track.offsetHeight - 170)).toFixed(0));
    };
    addEventListener('scroll', tick, {passive:true}); tick();
  }

  // work filters: filter case studies and the live-websites list together,
  // report the result, keep the choice in the URL (#websites, #brand-identity, #ux)
  const filters = [...document.querySelectorAll('.filter[data-filter]')];
  if (filters.length) {
    const cards = [...document.querySelectorAll('.work-card[data-type]')];
    const sites = [...document.querySelectorAll('.site-list [data-type]')];
    const sitesSection = document.querySelector('[data-filter-section="website"]');
    const status = document.getElementById('work-status');
    const results = document.getElementById('work-results');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    const apply = (btn, {scroll = false, updateUrl = true} = {}) => {
      const f = btn.dataset.filter;
      filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      cards.forEach(c => {
        const on = f === 'all' || c.dataset.type.split(' ').includes(f);
        c.hidden = !on;
        if (on) { shown++; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
      });
      const showSites = f === 'all' || f === 'website';
      if (sitesSection) sitesSection.hidden = !showSites;
      const siteCount = showSites ? sites.length : 0;
      if (results) results.hidden = shown === 0;
      if (status) {
        const label = f === 'all' ? 'all ' : '';
        const parts = [shown ? `${label}${plural(shown, 'project', 'projects')}` : '', siteCount ? plural(siteCount, 'live website', 'live websites') : ''].filter(Boolean);
        status.textContent = 'Showing ' + parts.join(' and ');
      }
      if (updateUrl) history.replaceState(null, '', btn.dataset.hash ? '#' + btn.dataset.hash : location.pathname);
      if (scroll) {
        const target = f === 'website' && sitesSection ? sitesSection : status;
        const top = target.getBoundingClientRect().top + scrollY - 96;
        if (Math.abs(top - scrollY) > 40) scrollTo({top, behavior: reduce ? 'auto' : 'smooth'});
      }
    };
    filters.forEach(btn => btn.addEventListener('click', () => apply(btn, {scroll: true})));
    const fromHash = () => {
      const h = location.hash.slice(1);
      const btn = filters.find(b => b.dataset.hash && b.dataset.hash === h);
      if (btn) apply(btn, {scroll: h === 'websites', updateUrl: false});
    };
    fromHash(); addEventListener('hashchange', fromHash);
  }
})();
