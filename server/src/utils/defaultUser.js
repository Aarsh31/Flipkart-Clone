const { env } = require("../config/env");
const { prisma } = require("../lib/prisma");

const getDefaultUser = async () => {
  let user = await prisma.user.upsert({
    where: { email: env.defaultUserEmail },
    update: {},
    create: {
      email: env.defaultUserEmail,
      name: "Demo Shopper",
      cart: {
        create: {},
      },
    },
    include: {
      cart: true,
    },
  });

  if (!user.cart) {
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    user = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        cart: true,
      },
    });
  }

  return user;
};

module.exports = { getDefaultUser };
