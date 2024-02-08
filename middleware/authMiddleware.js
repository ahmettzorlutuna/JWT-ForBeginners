const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, `${process.env.JWT_SIGN_SECRET}`, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/auth/login");
      } else {
        console.log(decodedToken);
        next;
      }
    });
  } else {
    res.redirect("/auth/login");
  }
};

module.exports = { verifyAuth };
