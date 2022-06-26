require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./Models/userModel");

const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.post("/signup", (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      res.status(400).json({ msg: "User already exists" });
    } else {
      try {
        const hash = bcrypt.hashSync(req.body.password, 10);
        let user = new userModel({
          username: req.body.username,
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ msg: "User created" }))
          .catch((err) => res.status(400).json({ msg: err }));
      } catch (err) {
        console.log(err);
        res.status(400).json({ msg: err });
      }
    }
  });
});

app.post("/login", (req, res) => {
  userModel.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let user = { username: req.body.username };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res
          .status(200)
          .json({ msg: "User logged in", accessToken, refreshToken });
      } else {
        res.status(400).json({ msg: "Incorrect password" });
      }
    } else {
      res.status(400).json({ msg: "User does not exist" });
    }
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
