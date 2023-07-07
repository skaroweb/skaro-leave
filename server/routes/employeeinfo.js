const router = require("express").Router();
const { employeeinfoModel, validate } = require("../models/Employeeinfo");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcryptjs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("uploaded_file"), async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await employeeinfoModel.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //console.log(req.body);
    //Get the site url
    const url = req.protocol + "://" + req.get("host");
    const employeeinfo = req.body;
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.body.uploaded_file, {
      folder: "profile",
    });
    const newEmployeeinfo = new employeeinfoModel({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      gender: req.body.gender,
      designation: req.body.designation,
      phone: req.body.phone,
      joiningdate: req.body.joiningdate,
      dateofbirth: req.body.dateofbirth,
      // uploaded_file: url + "/uploads/" + req.file.filename,
      // uploaded_file: req.body.uploaded_file,
      uploaded_file: result.secure_url,
      cloudinary_id: result.public_id,
    });
    await newEmployeeinfo.save();
    res.json(employeeinfo);
    // await newEmployeeinfo
    //   .save()
    //   .then((data) => {
    //     console.log("added");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const employeeinfo = await employeeinfoModel.find({});
    res.send(employeeinfo);
    //console.log(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employeeinfo = await employeeinfoModel.findById(req.params.id);
    res.send(employeeinfo);
    //console.log(user);
  } catch (err) {
    console.log(err);
  }
});

router.use("/update/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);

    // if (error)
    //   return res.status(400).send({ message: error.details[0].message });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    //const hashPassword = await bcrypt.hash(req.body.password, salt);

    const existingUser = await employeeinfoModel.findById(req.params.id);
    if (req.body.password === "") {
      var hashPassword = await bcrypt.hash(existingUser.password, salt);
    } else {
      var hashPassword = await bcrypt.hash(req.body.password, salt);
    }
    // Upload image to cloudinary

    // const existingUser = await employeeinfoModel.findById(req.params.id);

    // Check if the user already has an image stored in the database
    // if (!existingUser.cloudinary_id) {

    //   existingUser.cloudinary_id = result.public_id;
    //   existingUser.uploaded_file = result.secure_url;
    // } else {
    //   await cloudinary.uploader.destroy(existingUser.cloudinary_id);
    // }
    const result = await cloudinary.uploader.upload(req.body.uploaded_file, {
      folder: "profile",
    });
    const employeeinfo = await employeeinfoModel.findByIdAndUpdate(
      req.params.id,
      {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        gender: req.body.gender,
        designation: req.body.designation,
        phone: req.body.phone,
        joiningdate: req.body.joiningdate,
        dateofbirth: req.body.dateofbirth,
        uploaded_file: result.secure_url,
        cloudinary_id: result.public_id,
      }
    );
    res.send(employeeinfo);
    //console.log(user);
  } catch (err) {
    console.log(err);
  }
});

router.use("/delete/:id", async (req, res) => {
  try {
    const employeeinfo = await employeeinfoModel.findByIdAndDelete(
      req.params.id
    );
    res.send(employeeinfo);
    //console.log(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
