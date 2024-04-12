const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const validateMongoDbId = require("../utils/validateMongodbid.js");

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
  validateMongoDbId(id);
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
  const { id } = req.user;
  validateMongoDbId(id);

  const { firstname, lastname, mobile, email } = req.body;
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
const blockAuser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );

  return res.status(200).json({ message: "User blocked" });
};
const unBlockAuser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );

  return res.status(200).json({ message: "user unblocked" });
};

module.exports = {
  createUser,
  getAllUsers,
  getAuser,
  deleteAuser,
  updateAuser,
  blockAuser,
  unBlockAuser,
};
