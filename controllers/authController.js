const User = require("../models/User");

const handleError = (error) => {
  console.log(error._message, error.code);
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
    res.status(201).json(user);
  } catch (err) {
    const  errors  = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  console.log(req.body);
  res.send(req.body);
};
