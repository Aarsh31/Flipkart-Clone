const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../middleware/asyncHandler");
const { serializeCart } = require("../utils/serialize");

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
});

const updateCartSchema = z.object({
  quantity: z.number().int().min(1).max(10),
});

const getCartWithItems = async (userId) =>
  prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartWithItems(req.user.id);
  res.json(serializeCart(cart));
});

const addCartItem = asyncHandler(async (req, res) => {
  const payload = addToCartSchema.parse(req.body);

  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: req.user.cart.id,
        productId: payload.productId,
      },
    },
  });

  const requestedQuantity = (existingItem?.quantity || 0) + payload.quantity;

  if (product.stock < requestedQuantity) {
    return res.status(400).json({ message: "Requested quantity exceeds stock" });
  }

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: req.user.cart.id,
        productId: payload.productId,
      },
    },
    update: {
      quantity: {
        increment: payload.quantity,
      },
    },
    create: {
      cartId: req.user.cart.id,
      productId: payload.productId,
      quantity: payload.quantity,
    },
  });

  const cart = await getCartWithItems(req.user.id);
  res.status(201).json(serializeCart(cart));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const payload = updateCartSchema.parse(req.body);

  const existing = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: req.user.id,
      },
    },
    include: {
      product: true,
    },
  });

  if (!existing) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (existing.product.stock < payload.quantity) {
    return res.status(400).json({ message: "Requested quantity exceeds stock" });
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: payload.quantity },
  });

  const cart = await getCartWithItems(req.user.id);
  res.json(serializeCart(cart));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const existing = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: req.user.id,
      },
    },
  });

  if (!existing) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  const cart = await getCartWithItems(req.user.id);
  res.json(serializeCart(cart));
});

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem };
