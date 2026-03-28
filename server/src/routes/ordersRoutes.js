const { Router } = require("express");
const { createOrder, getOrderById, getOrders } = require("../controllers/ordersController");

const router = Router();

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.post("/orders", createOrder);

module.exports = { ordersRoutes: router };
