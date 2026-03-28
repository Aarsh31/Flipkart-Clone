const { Router } = require("express");
const { getCategories, getProducts, getProductBySlug } = require("../controllers/productsController");

const router = Router();

router.get("/categories", getCategories);
router.get("/products", getProducts);
router.get("/products/:slug", getProductBySlug);

module.exports = { productsRoutes: router };
