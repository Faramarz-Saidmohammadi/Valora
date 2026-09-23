import test from 'node:test';
import assert from 'node:assert/strict';
import { getSafeRedirect } from '../frontend/src/utils/safeRedirect.mjs';

test('local redirect paths are preserved', () => {
  assert.equal(getSafeRedirect('/shipping?step=payment'), '/shipping?step=payment');
});

test('external and protocol-relative redirects fall back to home', () => {
  assert.equal(getSafeRedirect('https://example.com'), '/');
  assert.equal(getSafeRedirect('//example.com'), '/');
  assert.equal(getSafeRedirect('/\\example.com'), '/');
});
