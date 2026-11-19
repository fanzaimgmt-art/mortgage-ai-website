import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
const mqStart = css.indexOf('@media(max-width:981px){');
const mqEnd = css.indexOf('@media(max-width:560px){');
const mq = css.slice(mqStart, mqEnd);

test('real-people section is a single column at 981px and below', () => {
  assert.match(mq, /\.track \.split\{[^}]*grid-template-columns:\s*1fr/);
});

test('off-screen honeypot does not use a physical left offset', () => {
  assert.doesNotMatch(html, /left:\s*-9999px/);
  assert.match(css, /\.hp\{[^}]*clip-path:\s*inset\(50%\)/);
});

test('content photos and the footer logo have alt text', () => {
  for (const src of ['handshake.jpg', 'market.jpg', 'solution.jpg', 'receptionist.jpg']) {
    const tag = html.match(new RegExp(`<img[^>]*src="images/${src}"[^>]*>`));
    assert.ok(tag, src);
    const alt = tag[0].match(/alt="([^"]*)"/);
    assert.ok(alt && alt[1].trim().length > 0, src + ' alt');
  }
  assert.match(html, /class="foot-brand"[\s\S]{0,200}alt="Mortgage AI logo"/);
});

test('page declares language and direction, including a focus style', () => {
  assert.match(html, /<html lang="en" dir="ltr">/);
  assert.match(css, /:focus-visible\{[^}]*outline:\s*3px solid #0a4f9c/);
});

test('header controls expose expanded state', () => {
  assert.match(html, /id="hamb"[^>]*aria-expanded="false"/);
  assert.match(html, /id="langBtn"[^>]*aria-expanded="false"/);
  assert.match(html, /id="langBtn"[^>]*aria-haspopup="menu"/);
});
