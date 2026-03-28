const { Router } = require("express");
const { login, me, signup, syncCart } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/me", authenticate, me);
router.post("/auth/sync-cart", authenticate, syncCart);

module.exports = { authRoutes: router };
