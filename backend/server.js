require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./Models/userModel");

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
      res.status(400).json({ error: "User already exists" });
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
          .then(() => res.send({ status: true, message: "Signup successful" }))
          .catch((err) => res.send(err));
      } catch (err) {
        console.log(err);
      }
    }
  });
});

app.post("/login", (req, res) => {
  userModel.findOne({ username: req.body.username }, (err, user) => {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({ status: true, message: "Login successful" });
      } else {
        res.status(400).json({ status: false, message: "Incorrect password" });
      }
    } else {
      res.status(400).json({ status: false, message: "User does not exist" });
    }
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
