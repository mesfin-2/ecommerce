const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");

const createUser = async (req, res) => {
  const { firstname, lastname, mobile, email, password } = req.body;
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await User.create(req.body); //sending entire body
  res.status(201).json({ message: "User successfully registered" });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
};
const getAuser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  console.log(user);
  return res.status(200).json(user);
};
const deleteAuser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const deletedUser = await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "User  " + deletedUser.id + " deleted Successfully" });
  } else {
    res.status(400).json({ message: "user is not found" });
  }
};
const updateAuser = async (req, res) => {
  const { firstname, lastname, mobile, email } = req.body;
  const { id } = req.params;
  if (id) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        mobile,
        email,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } else {
    res.status(400).json({ message: "user is not found" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getAuser,
  deleteAuser,
  updateAuser,
};
