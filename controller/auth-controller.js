const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(email, password);
    //Check if user already exists
    const existingUser = await User.findOne({ email });
    const currentPassword = await existingUser.isPasswordMatched(password); //method come from model password check

    if (existingUser && currentPassword) {
      const token = jwt.sign({ id: existingUser._id }, process.env.SECRET, {
        expiresIn: "30d",
      });
      console.log(existingUser);
      //password check is handled in user model
      return res.status(200).json({
        _id: existingUser._id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
        mobile: existingUser.mobile,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

module.exports = login;
