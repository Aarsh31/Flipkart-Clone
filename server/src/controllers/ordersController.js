const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../middleware/asyncHandler");
const { sendOrderConfirmationEmail } = require("../utils/email");
const { decimalToNumber, serializeOrder } = require("../utils/serialize");

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phoneNumber: z.string().min(10),
  addressLine: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  landmark: z.string().optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .optional(),
});

const includeOrder = {
  items: true,
  shippingAddress: true,
};

const getOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: includeOrder,
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders.map(serializeOrder));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    include: includeOrder,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(serializeOrder(order));
});

const createOrder = asyncHandler(async (req, res) => {
  const payload = checkoutSchema.parse(req.body);

  const order = await prisma.$transaction(async (tx) => {
    const sourceItems = payload.items?.length
      ? payload.items
      : await tx.cartItem.findMany({
          where: {
            cart: {
              userId: req.user.id,
            },
          },
          select: {
            productId: true,
            quantity: true,
          },
        });

    if (!sourceItems.length) {
      const error = new Error("Cart is empty");
      error.statusCode = 400;
      throw error;
    }

    const products = await tx.product.findMany({
      where: {
        id: {
          in: sourceItems.map((item) => item.productId),
        },
      },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    let subtotal = 0;

    for (const item of sourceItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        const error = new Error("One or more products are unavailable");
        error.statusCode = 404;
        throw error;
      }

      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product.name}`);
        error.statusCode = 400;
        throw error;
      }

      subtotal += decimalToNumber(product.price) * item.quantity;
    }

    const shippingFee = subtotal > 0 && subtotal < 500 ? 40 : 0;
    const total = subtotal + shippingFee;

    const createdOrder = await tx.order.create({
      data: {
        userId: req.user.id,
        subtotal,
        shippingFee,
        total,
        items: {
          create: sourceItems.map((item) => {
            const product = productMap.get(item.productId);
            return {
              productId: product.id,
              productName: product.name,
              productBrand: product.brand,
              unitPrice: product.price,
              quantity: item.quantity,
              image: product.thumbnail,
            };
          }),
        },
        shippingAddress: {
          create: {
            fullName: payload.fullName,
            phoneNumber: payload.phoneNumber,
            addressLine: payload.addressLine,
            city: payload.city,
            state: payload.state,
            postalCode: payload.postalCode,
            landmark: payload.landmark || null,
          },
        },
      },
      include: includeOrder,
    });

    for (const item of sourceItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    if (!payload.items?.length) {
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: req.user.id,
          },
        },
      });
    }

    return createdOrder;
  });

  await sendOrderConfirmationEmail({
    user: req.user,
    order,
  });

  res.status(201).json(serializeOrder(order));
});

module.exports = { getOrders, getOrderById, createOrder };
