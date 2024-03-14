require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const employeeInfo = require("./routes/employeeinfo");
const { UserModel, validate } = require("./models/employee");
const authMiddleware = require("./middlewares/authMiddleware");

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
// app.use(limiter);
// app.use(signInLimiter);
// database connection
connection();

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use("/createuser", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const date = await UserModel.findOne({
      name: req.body.name,
      applydate: req.body.applydate,
      currentuserid: req.body.currentuserid,
    });

    if (date)
      return res.status(409).send({ message: `Apply date already Exist!` });
    const user = req.body;
    // console.log(user);
    const newUser = new UserModel({
      name: req.body.name,
      absencetype: req.body.absencetype,
      reason: req.body.reason,
      permissionTime: req.body.permissionTime,
      workFromHome: req.body.workFromHome,

      // age: req.body.age,
      // userName: req.body.userName,
      currentuserid: req.body.currentuserid,
      status: req.body.status,
      applydate: req.body.applydate,
    });

    await newUser.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
    //console.log(error.message);
  }
});

app.get("/getusers", async (req, res) => {
  try {
    const user = await UserModel.find({});
    res.send(user);
    //console.log(user);
  } catch (err) {
    console.log(err);
  }
});

app.get("/getusers/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.send(user);
    //console.log(user);
  } catch (err) {
    console.log(err);
  }
});

app.use("/update/:id", async (req, res) => {
  const date = await UserModel.findOne({
    currentuserid: req.body.currentuserid,
    applydate: req.body.applydate,
  });

  if (date)
    return res.status(409).send({ message: `Apply date already Exist!` });

  await UserModel.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

app.use("/delete/:id", async (req, res) => {
  await UserModel.findByIdAndDelete(req.params.id)
    .then((book) => res.json({ msg: "deleted successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to delete the Database" })
    );
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employeeinfo", employeeInfo);
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
