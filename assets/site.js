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

  // work filters: show cards whose data-type matches
  const filters = document.querySelectorAll('.filter[data-filter]');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const f = btn.dataset.filter;
    document.querySelectorAll('.work-card[data-type]').forEach(c => { c.hidden = f !== 'all' && !c.dataset.type.split(' ').includes(f); });
  }));
})();
