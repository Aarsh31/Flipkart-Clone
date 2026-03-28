const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { env } = require("./config/env");
const { authRoutes } = require("./routes/authRoutes");
const { productsRoutes } = require("./routes/productsRoutes");
const { cartRoutes } = require("./routes/cartRoutes");
const { ordersRoutes } = require("./routes/ordersRoutes");
const { authenticate } = require("./middleware/authMiddleware");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authRoutes);
app.use("/api", productsRoutes);
app.use("/api", authenticate, cartRoutes);
app.use("/api", authenticate, ordersRoutes);
app.use(errorHandler);

module.exports = { app };
