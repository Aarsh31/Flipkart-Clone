const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../middleware/asyncHandler");
const { signAuthToken } = require("../utils/auth");

const signupSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

const syncCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(10),
    }),
  ),
});

const shapeAuthResponse = (user) => ({
  token: signAuthToken(user),
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});

const signup = asyncHandler(async (req, res) => {
  const payload = signupSchema.parse(req.body);
  const existing = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase() },
  });

  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
      cart: {
        create: {},
      },
    },
  });

  res.status(201).json(shapeAuthResponse(user));
});

const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase() },
  });

  if (!user) {
    return res.status(401).json({ message: "No account found with this email." });
  }

  const matches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!matches) {
    return res.status(401).json({ message: "Incorrect password. Please try again." });
  }

  res.json(shapeAuthResponse(user));
});

const me = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

const syncCart = asyncHandler(async (req, res) => {
  const payload = syncCartSchema.parse(req.body);
  const cartId = req.user.cart.id;

  for (const item of payload.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      continue;
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId: item.productId,
        },
      },
    });

    const desiredQuantity = Math.min((existing?.quantity || 0) + item.quantity, product.stock, 10);

    if (desiredQuantity <= 0) {
      continue;
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId: item.productId,
        },
      },
      update: {
        quantity: desiredQuantity,
      },
      create: {
        cartId,
        productId: item.productId,
        quantity: desiredQuantity,
      },
    });
  }

  res.json({ message: "Guest cart merged successfully." });
});

module.exports = { signup, login, me, syncCart };
