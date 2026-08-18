export const canAccessOrder = (orderUserId, user) => {
  if (!orderUserId || !user) return false;

  const ownerId = typeof orderUserId === 'object' && orderUserId._id
    ? orderUserId._id.toString()
    : orderUserId.toString();

  return Boolean(user.isAdmin) || ownerId === user._id.toString();
};
