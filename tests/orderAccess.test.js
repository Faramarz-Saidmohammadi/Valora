import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessOrder } from '../backend/utils/orderAccess.js';

test('order owner can access their order', () => {
  assert.equal(canAccessOrder('user-1', { _id: 'user-1', isAdmin: false }), true);
});

test('different user cannot access another users order', () => {
  assert.equal(canAccessOrder('user-1', { _id: 'user-2', isAdmin: false }), false);
});

test('admin can access any order', () => {
  assert.equal(canAccessOrder('user-1', { _id: 'admin-1', isAdmin: true }), true);
});

test('populated order user objects are handled safely', () => {
  assert.equal(
    canAccessOrder({ _id: { toString: () => 'user-1' } }, { _id: 'user-1', isAdmin: false }),
    true
  );
});
