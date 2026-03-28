const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("./asyncHandler");
const { verifyAuthToken } = require("../utils/auth");

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { cart: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Your session has expired. Please log in again." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid. Please log in again." });
  }
});

module.exports = { authenticate };
