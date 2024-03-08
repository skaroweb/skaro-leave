const router = require("express").Router();
const { User } = require("../models/user");
const { employeeinfoModel } = require("../models/Employeeinfo");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

router.post("/", async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await employeeinfoModel.findOne({ email: req.body.email });

    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    const password1 = req.body.password; // User-provided password
    const password2 = user.password; // Stored password in plaintext (not recommended)

    const validPassword = password1 === password2;
    //  console.log(validPassword);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = user.generateAuthToken();
    const email = req.body.email;

    // res.cookie("jwt", token);
    // res.cookie("email", email);
    res.status(200).send({
      data: token,
      email: email,
      message: "logged in successfully",
    });
    next();
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
