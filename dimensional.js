// Restrained pointer depth for the hero; keyboard and reduced-motion users see the static composition.
(() => {
  const scene = document.querySelector('.hero-scene');
  if (!scene || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;
  const hero = scene.closest('.hero');
  let frame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 13;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * -9;
      scene.style.setProperty('--scene-x', x.toFixed(2) + 'deg');
      scene.style.setProperty('--scene-y', y.toFixed(2) + 'deg');
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => {
    scene.style.setProperty('--scene-x', '0deg');
    scene.style.setProperty('--scene-y', '0deg');
  });
})();