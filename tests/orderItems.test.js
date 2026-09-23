import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOrderItems,
  getOrderProductIds,
} from '../backend/utils/orderItems.js';

const product = {
  _id: { toString: () => 'product-1' },
  name: 'Canonical product',
  image: '/images/canonical.jpg',
  price: 29.99,
  countInStock: 3,
};

test('order items use canonical product fields and client quantity', () => {
  const items = buildOrderItems(
    [{ _id: 'product-1', name: 'Forged name', image: '/forged.jpg', price: 0, qty: 2 }],
    [product]
  );

  assert.deepEqual(items, [{
    name: 'Canonical product',
    qty: 2,
    image: '/images/canonical.jpg',
    price: 29.99,
    product: product._id,
  }]);
});

test('duplicate product references are rejected', () => {
  assert.throws(
    () => getOrderProductIds([{ _id: 'product-1' }, { _id: 'product-1' }]),
    /Duplicate products/
  );
});

test('invalid quantities are rejected', () => {
  for (const qty of [0, -1, 1.5, '2']) {
    assert.throws(
      () => buildOrderItems([{ _id: 'product-1', qty }], [product]),
      /positive whole number/
    );
  }
});

test('quantities above available stock are rejected', () => {
  assert.throws(
    () => buildOrderItems([{ _id: 'product-1', qty: 4 }], [product]),
    /does not have enough stock/
  );
});

test('missing products are rejected', () => {
  assert.throws(
    () => buildOrderItems([{ _id: 'missing', qty: 1 }], []),
    /unavailable/
  );
});
