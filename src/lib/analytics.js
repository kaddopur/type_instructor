const measurementId = 'G-8QLYXMMJSV';
let previousLocation;

export function trackPageView() {
  if (!import.meta.env.PROD || window.location.hostname !== 'kaddopur.github.io') return;
  const pageLocation = window.location.href;
  if (pageLocation === previousLocation) return;

  if (previousLocation === undefined) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Also disable history-based page views in GA4 Enhanced Measurement (README).
    window.gtag('config', measurementId, { send_page_view: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }

  window.gtag('event', 'page_view', {
    send_to: measurementId,
    page_location: pageLocation,
    page_title: document.title,
    page_referrer: previousLocation ?? document.referrer
  });
  previousLocation = pageLocation;
}
