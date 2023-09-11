const router = require("express").Router();
const User = require("../model/user");
const JWT = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const user = require("../model/user");

router.post("/register", async (req, res) => {
  // joi validation

  // This is a shorter version
  const { error } = registerValidation(req.body);

  // Error in validation response
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if email already exist in data base
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    return res.status(400).send("user already exist");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.json({ user: user._id, name: user.name });
  } catch (error) {
    res.status(400).send(error);
  }
});

// login
router.post("/login", async (req, res) => {
  // This is a shorter version
  const { error } = loginValidation(req.body);

  // Error in validation response
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if email already exist in data base
  const emailExist = await User.findOne({ email: req.body.email });

  if (!emailExist) {
    return res.status(400).send("email does not exist");
  }
  const validPass = await bcrypt.compare(
    req.body.password,
    emailExist.password
  );
  if (!validPass) {
    return res.status(400).send("invalid password");
  }

  const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
