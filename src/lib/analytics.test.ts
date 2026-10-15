import { afterEach, expect, test, vi } from 'vitest';

function browser(hostname = 'kaddopur.github.io') {
  const location = { hostname, href: `https://${hostname}/type_instructor/#/zh/` };
  const dataLayer: ArrayLike<unknown>[] = [];
  const append = vi.fn();
  const script = { async: false, src: '' };
  vi.stubGlobal('window', { location, dataLayer });
  vi.stubGlobal('document', {
    title: '首頁 | Type Instructor', referrer: 'https://example.com/',
    createElement: vi.fn(() => script), head: { append }
  });
  return { location, dataLayer, append, script, commands: () => dataLayer.map(command => Array.from(command)) };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

test('queues GA4 page views with titles, full hash URLs and referrers without waiting for Google', async () => {
  vi.resetModules();
  vi.stubEnv('PROD', true);
  const page = browser();
  const { trackPageView } = await import('./analytics.js');
  trackPageView();
  trackPageView(); // StrictMode repeat.
  expect(page.script.async).toBe(true);
  expect(page.script.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-8QLYXMMJSV');
  expect(page.commands()[0][0]).toBe('js');
  expect(page.commands()[1]).toEqual(['config', 'G-8QLYXMMJSV', { send_page_view: false }]);
  expect(page.commands()[2]).toEqual(['event', 'page_view', {
    send_to: 'G-8QLYXMMJSV', page_location: page.location.href,
    page_title: document.title, page_referrer: document.referrer
  }]);
  expect(page.dataLayer).toHaveLength(3);
  const home = page.location.href;
  page.location.href = home.replace('/zh/', '/zh/menu');
  document.title = '選單 | Type Instructor';
  trackPageView();
  expect(page.commands()[3]).toEqual(['event', 'page_view', {
    send_to: 'G-8QLYXMMJSV', page_location: page.location.href,
    page_title: document.title, page_referrer: home
  }]);
  const menu = page.location.href;
  page.location.href = home;
  trackPageView();
  expect(page.commands()[4][2]).toMatchObject({ page_location: home, page_referrer: menu });
  expect(page.append).toHaveBeenCalledTimes(1);
});

test('development and local production previews do not initialize tracking', async () => {
  for (const [production, host] of [[false, 'kaddopur.github.io'], [true, 'localhost'], [true, '127.0.0.1']] as const) {
    vi.resetModules();
    vi.stubEnv('PROD', production);
    const page = browser(host);
    const { trackPageView } = await import('./analytics.js');
    trackPageView();
    expect(page.dataLayer).toHaveLength(0);
    expect(page.append).not.toHaveBeenCalled();
  }
});
