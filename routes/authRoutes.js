const { Router } = require("express");
const { authController } = require("../controllers/authController");

const router = Router();

router
  .route("signup")
  .get("/signup", () => authController.signup_get)
  .post("/signup", () => authController.signup_post);
router
  .route("login")
  .get("/login", () => authController.login_get)
  .post("/login", () => authController.login_post);

module.exports = router;
