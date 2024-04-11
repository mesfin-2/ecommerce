const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, mobile, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // const newUser = new User({
    //   firstname,
    //   lastname,
    //   mobile,
    //   email,
    //   password,
    // });

    //Create a new user

    const newUser = await User.create(req.body); //sending entire body
    res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAuser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching a user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteAuser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const deletedUser = await User.findByIdAndDelete(id);

      return res
        .status(200)
        .json({ message: "User  " + deletedUser.id + " deleted Successfully" });
    } else {
      res.status(400).json({ message: "user is not found" });
    }
  } catch (error) {
    console.error("Error deleting a user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateAuser = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error deleting a user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getAuser,
  deleteAuser,
  updateAuser,
};
