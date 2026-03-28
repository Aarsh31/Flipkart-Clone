const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ||
    [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://flipkart-clone-3-3a18.onrender.com",
    ].join(",")
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  defaultUserEmail: process.env.DEFAULT_USER_EMAIL || "demo@flipkartclone.local",
  jwtSecret: process.env.JWT_SECRET || "flipkart-clone-dev-secret",
  mailFrom: process.env.MAIL_FROM || "Flipkart Clone <no-reply@flipkartclone.local>",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
};

if (!env.databaseUrl || !env.directUrl) {
  throw new Error("DATABASE_URL or DIRECT_URL is not defined");
}

module.exports = { env };
