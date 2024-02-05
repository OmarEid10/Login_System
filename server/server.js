// CREATE SERVER
const express = require("express");
const app = express();
const _PORT = process.env.PORT;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const cookieParser = require('cookie-parser')
app.use(cookieParser());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CONNECT TO DB
const username = process.env.USERNAME,
  password = process.env.PASSWORD,
  database = process.env.DB;

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.4c5hbiu.mongodb.net/${database}?retryWrites=true&w=majority`
);

// USER MODEL
const UserModel = require("./models/Users");

// get request
app.get("/users", async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

// create user
app.post("/createUser", async (req, res) => {
  const newUser = new UserModel(req.body);
  await newUser.save();
  res.json(req.body);
});

// Admin MODEL
const AdminrModel = require("./models/Admins");
// register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminrModel.findOne({ username });
  admin && res.json({ message: "admin already exists!" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newAdmin = new AdminrModel({ username, password: hashedPassword });
  await newAdmin.save();

  return res.json({ message: "admin created sucssefly" });
});

// login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminrModel.findOne({ username });
  !admin && res.json({ message: "admin doesn't exists!" });

  const isPaswordValid = await bcrypt.compare(password, admin.password);
  !isPaswordValid &&
    res.json({ message: "username or password is not correct" });

  const token = jwt.sign({ id: admin._id }, process.env.SECRET);
  return res.json({ token, adminID: admin._id });
});

app.listen(_PORT, () => {
  console.log("Server Works");
});
