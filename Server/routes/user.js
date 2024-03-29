import express from "express";
const User_Router = express.Router();
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import config from "config";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

User_Router.post(
  "/reg",
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with minimum of 6 characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    console.error(errors);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User Exists!" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 }, // Change to 3600 during production
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default User_Router;
