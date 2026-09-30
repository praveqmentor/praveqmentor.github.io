// Paper turns for section navigation and browser back/forward.
(() => {
  const sections = [...document.querySelectorAll('main > section')];
  sections.forEach(section => { section.classList.remove('page-turn'); section.classList.add('page-open'); });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let running = false;
  const stamp = y => ({ ...history.state, praveqScroll: y });
  history.replaceState(stamp(scrollY), '', location.href);

  function targetY(target) {
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight,
      target.getBoundingClientRect().top + scrollY - (target.id === 'top' ? 0 : offset)));
  }
  function paperTurn(destination, after) {
    if (running) return;
    const origin = scrollY;
    if (reduced.matches || Math.abs(destination - origin) < 80) {
      scrollTo({top:destination, behavior:'instant'}); after?.(); return;
    }
    running = true;
    const width = document.documentElement.clientWidth;
    const height = innerHeight;
    const forward = destination > origin;
    const count = width < 760 ? 12 : 18;
    const stripWidth = width / count;
    const overlay = document.createElement('div');
    overlay.className = 'paper-flip'; overlay.setAttribute('aria-hidden','true');
    overlay.inert = true;
    const shadow = document.createElement('div'); shadow.className = 'paper-shadow'; overlay.append(shadow);
    const template = document.createElement('div');
    template.className = 'paper-document';
    template.style.top = -origin + 'px';
    template.style.background = getComputedStyle(document.body).backgroundColor;
    for (const node of [...document.body.children]) {
      if (['HEADER','MAIN','FOOTER'].includes(node.tagName)) template.append(node.cloneNode(true));
    }
    template.querySelectorAll('.page-turn').forEach(node => node.classList.add('page-open'));
    template.querySelectorAll('[autofocus]').forEach(node => node.removeAttribute('autofocus'));
    const strips = [];
    for (let i = 0; i < count; i++) {
      const strip = document.createElement('div'); strip.className = 'paper-strip';
      strip.style.width = stripWidth + 1 + 'px';
      const front = document.createElement('div'); front.className = 'paper-front';
      const content = document.createElement('div'); content.className = 'paper-content';
      content.style.width = width + 'px'; content.style.left = -i * stripWidth + 'px';
      content.append(template.cloneNode(true));
      const shade = document.createElement('div'); shade.className = 'paper-shade';
      front.append(content,shade);
      const back = document.createElement('div'); back.className = 'paper-back';
      strip.append(front,back); overlay.append(strip);
      strips.push({strip,shade});
    }
    document.body.append(overlay);
    document.documentElement.classList.add('paper-turning');
    scrollTo({top:destination,behavior:'instant'});
    after?.();
    const start = performance.now(), duration = 1050;
    let frame;
    const stopInput = e => e.preventDefault();
    window.addEventListener('wheel',stopInput,{passive:false});
    window.addEventListener('touchmove',stopInput,{passive:false});
    const cleanup = () => {
      cancelAnimationFrame(frame); overlay.remove();
      document.documentElement.classList.remove('paper-turning');
      window.removeEventListener('wheel',stopInput);
      window.removeEventListener('touchmove',stopInput);
      running = false;
    };
    const tick = now => {
      const t = Math.min(1,(now-start)/duration);
      const p = t*t*(3-2*t);
      let x = forward ? 0 : width, z = 0;
      // Integrate strips into one curved sheet, hinged at the page edge.
      for (let step = 0; step < count; step++) {
        const i = forward ? step : count - 1 - step;
        const s = (step+.5)/count;
        const angle = Math.PI * Math.min(1, p + .22 * Math.sin(Math.PI*p) * s);
        const sign = forward ? -1 : 1;
        const left = forward ? x : x - stripWidth*Math.cos(angle);
        const depth = forward ? z : z + stripWidth*Math.sin(angle);
        strips[i].strip.style.transform =
          'translate3d('+left+'px,0,'+depth+'px) rotateY('+sign*angle+'rad)';
        strips[i].shade.style.opacity = .2*Math.sin(angle);
        x += (forward ? 1 : -1)*stripWidth*Math.cos(angle);
        z += stripWidth*Math.sin(angle);
      }
      shadow.style.opacity = .65*Math.sin(Math.PI*p);
      if (t < 1) frame = requestAnimationFrame(tick); else cleanup();
    };
    frame = requestAnimationFrame(tick);
    // Background tabs and reduced-motion changes must never leave an overlay behind.
    setTimeout(() => { if (overlay.isConnected) cleanup(); },duration+500);
  }

  document.addEventListener('click',event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href,location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    const from = sections.find(section => scrollY+innerHeight*.35 >= section.offsetTop &&
      scrollY+innerHeight*.35 < section.offsetTop+section.offsetHeight);
    const to = target.closest('main > section');
    if (from === to && target.id !== 'top') return;
    event.preventDefault();
    if (running) return;
    history.replaceState(stamp(scrollY),'',location.href);
    const y = targetY(target);
    paperTurn(y,() => history.pushState(stamp(y),'',url.href));
  });
  window.addEventListener('popstate',event => {
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const y = event.state?.praveqScroll ?? (target ? targetY(target) : 0);
    paperTurn(y);
  });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
})();
