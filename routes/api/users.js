// To handel all users login/registration

const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const User = require("../../models/User");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  "/",
  [
    check("name", 'Field "Name" is required!').not().isEmpty(),
    check("email", "Please include a valid Email address!").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters!"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if the user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User with this Email already exists!" }] });
      }

      // get users gravatar and create a new user
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt the password and save the user in db
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Sign and return json web token

      const jwtPayload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        jwtPayload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
