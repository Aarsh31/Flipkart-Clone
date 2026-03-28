const { Router } = require("express");
const { addCartItem, getCart, removeCartItem, updateCartItem } = require("../controllers/cartController");

const router = Router();

router.get("/cart", getCart);
router.post("/cart/items", addCartItem);
router.patch("/cart/items/:itemId", updateCartItem);
router.delete("/cart/items/:itemId", removeCartItem);

module.exports = { cartRoutes: router };
