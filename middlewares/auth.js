const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");

module.exports = (req, res, next) => {
  const reqJwt = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(reqJwt, "some-secret-key");
  } catch (err) {
    next(new AuthError("Необходима авторизация"));
  }

  req.user = payload;

  next();
};
