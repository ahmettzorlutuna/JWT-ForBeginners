const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {verifyAuth} = require('./middleware/authMiddleware');
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.set("view engine", "ejs");

const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${dbPassword}@${process.env.DB_CLUSTER_NAME}.iki8xmr.mongodb.net/${process.env.DB_NAME}`
  )
  .then((result) =>
    app.listen(3000, () => {
      console.log(`Connected to DB. JWT is listening on port ${3000}`);
    })
  )
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", verifyAuth, (req, res) => res.render("smoothies"));

app.use("/auth", authRoutes);
