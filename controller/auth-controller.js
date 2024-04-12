const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");
const generateRefreshToken = require("../config/refreshToken.js");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(email, password);
    //Check if user already exists
    const existingUser = await User.findOne({ email });
    const currentPassword = await existingUser.isPasswordMatched(password); //method come from model password check

    if (existingUser && currentPassword) {
      const token = jwt.sign({ id: existingUser._id }, process.env.SECRET, {
        expiresIn: "1d",
      });
      const refreshToken = await generateRefreshToken(existingUser._id);

      const updateuser = await User.findByIdAndUpdate(
        existingUser.id,
        {
          refreshToken,
        },
        { new: true }
      );
      //set token in cookies, so that we can fetch it later for refresh token
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
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

//Handle refresh token
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) {
    res.status(400).json({ message: "No Refresh token in cookies" });
  }
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.status(400).json({ message: "No refresh token found in db" });
  }
  jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      res.status(400).json({ message: "Something wrong wit refresh token" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1d",
    });
    console.log("accessToken", accessToken);
    res.status(200).json(accessToken);
  });
};

//logout
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) {
    res.status(400).json({ message: "No Refresh token in cookies" });
  }
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
};

module.exports = { login, handleRefreshToken, logout };
