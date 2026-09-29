// A restrained, tactile tilt. Release always brings the glass back to center.
(() => {
  const rotor = document.querySelector('.scene-rotor');
  if (!rotor) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pointer = null;
  let startX = 0;
  let startY = 0;
  let moved = false;
  let tapAnimation;
  const reset = () => {
    rotor.classList.remove('is-dragging');
    rotor.style.setProperty('--yaw', '0deg');
    rotor.style.setProperty('--pitch', '0deg');
  };
  const nudge = () => {
    if (reducedMotion.matches) return;
    tapAnimation?.cancel();
    tapAnimation = rotor.animate([
      { transform: 'rotateX(0deg) rotateY(0deg)' },
      { transform: 'rotateX(-4deg) rotateY(11deg)', offset: .38 },
      { transform: 'rotateX(0deg) rotateY(0deg)' }
    ], { duration: 1000, easing: 'ease-in-out' });
  };
  rotor.addEventListener('pointerdown', event => {
    if (pointer !== null) return;
    tapAnimation?.cancel();
    pointer = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
    rotor.setPointerCapture(pointer);
  });
  rotor.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.hypot(dx, dy) > 5) moved = true;
    if (!moved) return;
    rotor.classList.add('is-dragging');
    const yaw = Math.max(-15, Math.min(15, dx * .075));
    const pitch = Math.max(-10, Math.min(10, -dy * .055));
    rotor.style.setProperty('--yaw', yaw.toFixed(2) + 'deg');
    rotor.style.setProperty('--pitch', pitch.toFixed(2) + 'deg');
  });
  const finish = event => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    const tapped = event.type === 'pointerup' && !moved;
    reset();
    if (tapped) nudge();
  };
  rotor.addEventListener('pointerup', finish);
  rotor.addEventListener('pointercancel', finish);
  rotor.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reset();
      nudge();
    }
  });
})();
