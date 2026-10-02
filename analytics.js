// PRAVEQ analytics: anonymous intent events and a browser-specific opt-out.
(() => {
  const measurementId = 'G-DLDB3NJZLS';
  const storageKey = 'praveq.analytics.disabled';
  const url = new URL(window.location.href);
  const mode = url.searchParams.get('praveq_analytics');
  let disabled = mode === 'off';
  try {
    if (mode === 'off') localStorage.setItem(storageKey, '1');
    else if (mode === 'on') localStorage.removeItem(storageKey);
    if (mode !== 'on') disabled = disabled || localStorage.getItem(storageKey) === '1';
  } catch (_) {
    // Storage may be unavailable; explicit off still disables this page.
  }
  window['ga-disable-' + measurementId] = disabled;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    if (!disabled) window.dataLayer.push(arguments);
  };
  if (disabled) return;
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  // Only constant labels are sent: never form values or mailto URLs.
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || event.defaultPrevented) return;
    const href = link.getAttribute('href');
    if (href === 'https://cal.com/shu-eiken/free-consultation') {
      window.gtag('event', 'consultation_booking_click', { contact_method: 'booking' });
    } else if (href === '#contact') {
      window.gtag('event', 'contact_click', {
        button_location: link.classList.contains('floating-contact') ? 'floating' : 'navigation'
      });
    } else if (href && href.startsWith('mailto:')) {
      window.gtag('event', href.includes('?') ? 'email_draft_retry' : 'email_link_click', {
        contact_method: 'email'
      });
    }
  }, true);
})();
