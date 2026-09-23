export const getOrderProductIds = (orderItems) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error('No order items');
  }

  const productIds = orderItems.map((item) => item?._id);

  if (productIds.some((productId) => typeof productId !== 'string' || !productId)) {
    throw new Error('Invalid product reference');
  }

  if (new Set(productIds).size !== productIds.length) {
    throw new Error('Duplicate products are not allowed');
  }

  return productIds;
};

export const buildOrderItems = (orderItems, products) => {
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  if (productsById.size !== orderItems.length) {
    throw new Error('One or more products are unavailable');
  }

  return orderItems.map((item) => {
    const product = productsById.get(item._id);

    if (!product) {
      throw new Error('One or more products are unavailable');
    }

    if (!Number.isSafeInteger(item.qty) || item.qty < 1) {
      throw new Error('Product quantity must be a positive whole number');
    }

    if (item.qty > product.countInStock) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    return {
      name: product.name,
      qty: item.qty,
      image: product.image,
      price: product.price,
      product: product._id,
    };
  });
};
