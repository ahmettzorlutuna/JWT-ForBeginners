const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const handleError = (error) => {
  console.log(error.message, error.code);
  let errors = { email: "", password: "" };
  if (error.code === 11000) {
    errors.email = "The email is already registered. Try another one.";
    return errors;
  }
  
  if (error._message === "user validation failed") {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => { //
  return jwt.sign({ id }, `${process.env.JWT_SIGN_SECRET}`, {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id); //Token was created. Then we will place it inside a cookie. Set as a response the cookie. (res.cookie())
    res.cookie("jwt", token, {maxAge: maxAge * 1000}); //jwt is the name of the cookie. You can set it whatever you want.
    res.status(201).json({user: user._id}); //Here is the important think. Be sure that you dont return full of the user object. Just return user._id.
  } catch (err) {
    console.log("hata var");
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email,password);
    if(user){
      res.status(201).json({user: user._id})
    }
  } catch (err) {
    const errors = handleError(err); 
    res.status(400).json({})
  }
};
