const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");
const { jwtKey } = require("../utils/jwtKey");
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const reqJwt = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(reqJwt, NODE_ENV === 'production' ? JWT_SECRET : jwtKey);
  } catch (err) {
    next(new AuthError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};
