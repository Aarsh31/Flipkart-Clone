const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    {
      expiresIn: "7d",
    },
  );

const verifyAuthToken = (token) => jwt.verify(token, env.jwtSecret);

module.exports = { signAuthToken, verifyAuthToken };
