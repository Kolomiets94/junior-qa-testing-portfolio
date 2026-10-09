const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
let browser;
before(async () => { browser = await chromium.launch({ headless: true }); });
after(async () => { if (browser) await browser.close(); });
async function session(t, viewport) {
  const context = await browser.newContext({ viewport: viewport || { width: 1280, height: 800 } });
  t.after(() => context.close());
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  return page;
}
async function home(page) {
  await page.goto(`${base}/#/`);
  await page.locator('article.card').nth(7).waitFor();
}
async function count(page, n) {
  await page.waitForFunction(expected => document.querySelectorAll('article.card').length === expected, n);
}
test('TC-01: local catalogue contains eight distinct films', async t => {
  const p = await session(t); await home(p);
  assert.equal(await p.locator('article.card').count(), 8);
  const names = await p.locator('article h3').allTextContents();
  assert.equal(new Set(names).size, 8);
  assert.ok(names.includes('Брат'));
});
test('TC-02/03: search ignores case and surrounding spaces', async t => {
  const p = await session(t); await home(p);
  await p.getByRole('textbox', { name: 'Search shows' }).fill('  бРаТ  ');
  await count(p, 2);
  assert.deepEqual(await p.locator('article h3').allTextContents(), ['Брат', 'Брат 2']);
});
test('TC-04/05: empty result and clearing search', async t => {
  const p = await session(t); await home(p);
  const input = p.getByRole('textbox', { name: 'Search shows' });
  await input.fill('несуществующий-фильм-987');
  await p.getByText('No shows found. Try another search.', { exact: true }).waitFor();
  assert.equal(await p.locator('article.card').count(), 0);
  await input.fill(''); await count(p, 8);
});
test('TC-06/07: favourite persists after reload and is removed', async t => {
  const p = await session(t); await home(p);
  const heart = p.locator('article').filter({ has: p.getByRole('link', { name: 'Брат', exact: true }) }).getByRole('button', { name: 'Toggle favorite' });
  await heart.click();
  assert.equal(await p.locator('.counter').innerText(), '♥ 1');
  await p.reload(); await count(p, 8);
  assert.deepEqual(await p.evaluate(() => JSON.parse(localStorage.getItem('movie-favorites'))), [1000001]);
  assert.equal(await heart.innerText(), '♥');
  await heart.click();
  assert.equal(await p.locator('.counter').innerText(), '♥ 0');
  assert.deepEqual(await p.evaluate(() => JSON.parse(localStorage.getItem('movie-favorites'))), []);
});
test('TC-08/09: favourites filter and search intersection', async t => {
  const p = await session(t); await home(p);
  await p.locator('article').filter({ has: p.getByRole('link', { name: 'Брат', exact: true }) }).getByRole('button').click();
  await p.getByRole('button', { name: 'Избранное', exact: true }).click(); await count(p, 1);
  assert.equal(await p.locator('article h3').innerText(), 'Брат');
  await p.getByRole('textbox', { name: 'Search shows' }).fill('Холоп');
  await p.getByText('No favorite shows yet. Add some with the heart button.', { exact: true }).waitFor();
  assert.equal(await p.locator('article').count(), 0);
});
test('TC-10/11: local details and shared favourite state', async t => {
  const p = await session(t); await home(p);
  await p.getByRole('link', { name: 'Брат', exact: true }).click();
  await p.getByRole('heading', { name: 'Брат', exact: true }).waitFor();
  assert.ok(p.url().endsWith('#/movie/1000001'));
  assert.ok((await p.locator('.detail').innerText()).includes('1997'));
  await p.getByRole('button', { name: 'В избранное', exact: true }).click();
  await p.getByRole('link', { name: '← К каталогу', exact: true }).click(); await count(p, 8);
  assert.equal(await p.locator('.counter').innerText(), '♥ 1');
});
test('TC-12/13: invalid ID and unknown route have recovery links', async t => {
  const p = await session(t);
  await p.goto(`${base}/#/movie/not-a-number`);
  await p.getByRole('heading', { name: 'Invalid show link', exact: true }).waitFor();
  await p.getByRole('link', { name: '← Back home', exact: true }).click(); await count(p, 8);
  await p.goto(`${base}/#/unknown-route`);
  await p.getByRole('heading', { name: 'Page not found', exact: true }).waitFor();
  await p.getByRole('link', { name: 'Back home', exact: true }).click(); await count(p, 8);
});
test('TC-14: remote detail handles API failure (mocked)', async t => {
  const p = await session(t);
  await p.route('https://api.tvmaze.com/shows/1', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await p.goto(`${base}/#/movie/1`);
  await p.getByRole('heading', { name: 'Show not found or temporarily unavailable', exact: true }).waitFor();
  assert.ok(await p.getByRole('link', { name: '← Back home', exact: true }).isVisible());
});
test('TC-15: remote detail removes HTML tags (mocked)', async t => {
  const p = await session(t);
  await p.route('https://api.tvmaze.com/shows/1', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, name: 'Fixture Show', premiered: null, genres: [], rating: { average: null }, image: null, summary: '<p>Safe <b>description</b></p>' }) }));
  await p.goto(`${base}/#/movie/1`);
  await p.getByRole('heading', { name: 'Fixture Show', exact: true }).waitFor();
  assert.ok((await p.locator('.detail').innerText()).includes('Safe description'));
  assert.equal(await p.locator('.detail b').count(), 0);
});
test('TC-16: catalogue has no horizontal overflow at 390px', async t => {
  const p = await session(t, { width: 390, height: 844 }); await home(p);
  assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.ok(await p.getByRole('textbox', { name: 'Search shows' }).isVisible());
});
