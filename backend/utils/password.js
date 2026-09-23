import bcrypt from 'bcryptjs';

export const hashModifiedPassword = async (user) => {
  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
};
