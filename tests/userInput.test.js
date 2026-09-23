import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeEmail,
  validateAccountInput,
} from '../backend/utils/userInput.js';

test('email addresses are normalized consistently', () => {
  assert.equal(normalizeEmail('  User@Example.COM '), 'user@example.com');
});

test('valid account details pass validation', () => {
  assert.equal(validateAccountInput({
    name: 'Valora User',
    email: 'user@example.com',
    password: 'strong-password',
  }), null);
});

test('weak passwords and invalid emails are rejected', () => {
  assert.match(
    validateAccountInput({ name: 'User', email: 'invalid', password: 'password' }),
    /valid email/
  );
  assert.match(
    validateAccountInput({ name: 'User', email: 'user@example.com', password: 'short' }),
    /between 8 and 128/
  );
});

test('profile validation permits an omitted password', () => {
  assert.equal(validateAccountInput(
    { name: 'User', email: 'user@example.com', password: '' },
    { requirePassword: false }
  ), null);
});
