// Drag the central logo in either direction; click or press Enter/Space for a full turn.
(() => {
  const rotor = document.querySelector('.scene-rotor');
  if (!rotor) return;
  let yaw = 0;
  let pitch = 0;
  let pointer = null;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let moved = false;
  const render = () => {
    rotor.style.setProperty('--yaw', yaw + 'deg');
    rotor.style.setProperty('--pitch', pitch + 'deg');
  };
  const spin = () => {
    rotor.classList.remove('is-dragging');
    yaw += 360;
    render();
  };
  rotor.addEventListener('pointerdown', event => {
    if (pointer !== null) return;
    pointer = event.pointerId;
    startX = lastX = event.clientX;
    startY = lastY = event.clientY;
    moved = false;
    rotor.classList.add('is-dragging');
    rotor.setPointerCapture(pointer);
  });
  rotor.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > 5) moved = true;
    if (moved) {
      yaw += dx * 2;
      pitch = Math.max(-65, Math.min(65, pitch - dy * .65));
      render();
    }
    lastX = event.clientX;
    lastY = event.clientY;
  });
  const finish = event => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    rotor.classList.remove('is-dragging');
    if (event.type === 'pointerup' && !moved) spin();
  };
  rotor.addEventListener('pointerup', finish);
  rotor.addEventListener('pointercancel', finish);
  rotor.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      spin();
    }
  });
})();
