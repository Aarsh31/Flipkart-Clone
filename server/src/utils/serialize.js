const decimalToNumber = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "object" && typeof value.toNumber === "function") {
    return value.toNumber();
  }

  return Number(value);
};

const serializeProduct = (product) => ({
  ...product,
  price: decimalToNumber(product.price),
  originalPrice: decimalToNumber(product.originalPrice),
  rating: decimalToNumber(product.rating),
  images: product.images || [],
});

const serializeCart = (cart) => {
  const items = cart.items.map((item) => ({
    ...item,
    product: serializeProduct(item.product),
    lineTotal: decimalToNumber(item.product.price) * item.quantity,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = subtotal > 0 && subtotal < 500 ? 40 : 0;

  return {
    ...cart,
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
};

const serializeOrder = (order) => ({
  ...order,
  subtotal: decimalToNumber(order.subtotal),
  shippingFee: decimalToNumber(order.shippingFee),
  total: decimalToNumber(order.total),
  items: order.items.map((item) => ({
    ...item,
    unitPrice: decimalToNumber(item.unitPrice),
  })),
});

module.exports = { decimalToNumber, serializeProduct, serializeCart, serializeOrder };
