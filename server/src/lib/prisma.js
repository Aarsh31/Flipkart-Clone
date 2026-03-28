const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { env } = require("../config/env");

const adapter = new PrismaNeon({ connectionString: env.databaseUrl });

const prisma = global.__flipkartPrisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.__flipkartPrisma = prisma;
}

module.exports = { prisma };
