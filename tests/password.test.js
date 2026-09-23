import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { hashModifiedPassword } from '../backend/utils/password.js';

test('unchanged password hashes are not hashed again', async () => {
  const existingHash = await bcrypt.hash('existing-password', 4);
  const user = {
    password: existingHash,
    isModified: () => false,
  };

  await hashModifiedPassword(user);

  assert.equal(user.password, existingHash);
});

test('new passwords are hashed before persistence', async () => {
  const user = {
    password: 'new-password',
    isModified: (field) => field === 'password',
  };

  await hashModifiedPassword(user);

  assert.notEqual(user.password, 'new-password');
  assert.equal(await bcrypt.compare('new-password', user.password), true);
});
