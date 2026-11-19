import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('empty fields use inline errors, not alert()', () => {
  assert.equal(html.includes('alert('), false);
  assert.match(html, /id="err1"/);
  assert.match(html, /id="err2"/);
  assert.match(html, /id="formErr"/);
});

test('submission sends a client request id and aborts after 20 seconds', () => {
  assert.match(html, /client_request_id/);
  assert.match(html, /SUBMIT_TIMEOUT_MS = 20000/);
  assert.match(html, /AbortController/);
  assert.match(html, /AbortError/);
  assert.match(html, /msg\('timeout'\)/);
});
