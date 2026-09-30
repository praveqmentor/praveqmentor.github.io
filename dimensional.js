// Frame-rate independent, restrained tilt with a smooth return to center.
(() => {
  const rotor = document.querySelector('.scene-rotor');
  if (!rotor) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pointer = null;
  let startX = 0, startY = 0, moved = false;
  let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
  let frame = 0, previousTime = 0, tapTimer = 0;
  const paint = () => {
    rotor.style.setProperty('--yaw', yaw.toFixed(3) + 'deg');
    rotor.style.setProperty('--pitch', pitch.toFixed(3) + 'deg');
  };
  const tick = time => {
    const dt = Math.min(previousTime ? time - previousTime : 16.67, 50);
    previousTime = time;
    const blend = 1 - Math.exp(-dt / (pointer === null ? 170 : 95));
    yaw += (targetYaw - yaw) * blend;
    pitch += (targetPitch - pitch) * blend;
    if (Math.abs(targetYaw - yaw) + Math.abs(targetPitch - pitch) < .008) {
      yaw = targetYaw;
      pitch = targetPitch;
      paint();
      frame = 0;
      previousTime = 0;
      return;
    }
    paint();
    frame = requestAnimationFrame(tick);
  };
  const aim = (nextYaw, nextPitch) => {
    targetYaw = nextYaw;
    targetPitch = nextPitch;
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      yaw = targetYaw;
      pitch = targetPitch;
      paint();
    } else if (!frame) {
      previousTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const reset = () => {
    clearTimeout(tapTimer);
    rotor.classList.remove('is-dragging');
    aim(0, 0);
  };
  const nudge = () => {
    if (reducedMotion.matches) return;
    clearTimeout(tapTimer);
    aim(9, -3);
    tapTimer = setTimeout(() => aim(0, 0), 240);
  };
  rotor.addEventListener('pointerdown', event => {
    if (pointer !== null || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    clearTimeout(tapTimer);
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
    // Soft limits avoid an abrupt stop at the ends of a long drag.
    aim(15 * Math.tanh(dx * .075 / 15), 10 * Math.tanh(-dy * .055 / 10));
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
  rotor.addEventListener('lostpointercapture', finish);
  window.addEventListener('blur', () => { pointer = null; reset(); });
  reducedMotion.addEventListener('change', () => { pointer = null; reset(); });
  rotor.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!event.repeat) { reset(); nudge(); }
    }
  });
})();
