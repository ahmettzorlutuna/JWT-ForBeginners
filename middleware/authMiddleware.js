//auth Middleware for verify to auth Token with coming from client.
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyAuth = (req, res, next) => {
  const token = req.cookies.jwt; //We took the current jwt token from browser

  if (token) {
    jwt.verify(token, `${process.env.JWT_SIGN_SECRET}`, (err, decodedToken) => {
      //verify token from browser and our secret key.
      try {
        console.log(decodedToken);
        console.log(res);
        next(); //if there is no error and verify process is done next executed and page rendered
      } catch (err) {
        console.log(err.message);
        res.redirect("/auth/login");
      }
    });
  } else {
    res.redirect("/auth/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt; //We took the current jwt token from browser

  if (token) {
    jwt.verify(
      token,
      `${process.env.JWT_SIGN_SECRET}`,
      async (err, decodedToken) => {
        //verify token from browser and our secret key.
        try {
          console.log(decodedToken);
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next(); //if there is no error and verify process is done next executed and page rendered
        } catch (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { verifyAuth, checkUser }; //exported
