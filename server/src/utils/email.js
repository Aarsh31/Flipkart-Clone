const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const createTransport = () => {
  if (env.smtpHost && env.smtpUser && env.smtpPass) {
    return nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

const buildOrderEmailHtml = ({ user, order }) => `
  <div style="font-family: Arial, sans-serif; color: #172337;">
    <h2 style="color:#2874f0;">Order Confirmed</h2>
    <p>Hi ${user.name}, your order <strong>${order.id}</strong> has been placed successfully.</p>
    <p>Total amount: <strong>INR ${order.total}</strong></p>
    <p>Items:</p>
    <ul>
      ${order.items.map((item) => `<li>${item.productName} x ${item.quantity}</li>`).join("")}
    </ul>
    <p>Thank you for shopping with Flipkart Clone.</p>
  </div>
`;

const sendOrderConfirmationEmail = async ({ user, order }) => {
  const transport = createTransport();

  const info = await transport.sendMail({
    from: env.mailFrom,
    to: user.email,
    subject: `Order confirmed: ${order.id}`,
    html: buildOrderEmailHtml({ user, order }),
  });

  if (info.message) {
    console.log("Order email preview:", info.message.toString());
  }

  return info;
};

const queueOrderConfirmationEmail = ({ user, order }) => {
  setImmediate(async () => {
    try {
      await sendOrderConfirmationEmail({ user, order });
    } catch (error) {
      console.error("Order confirmation email failed:", error);
    }
  });
};

module.exports = { sendOrderConfirmationEmail, queueOrderConfirmationEmail };
