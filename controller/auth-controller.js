const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");
const generateRefreshToken = require("../config/refreshToken.js");
const validateMongoDbId = require("../utils/validateMongodbid.js");
const sendEmail = require("./email-controller.js");

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

//handle admin login
const adminLogin = async (req, res) => {

  try {
    const { email, password } = req.body;
    //console.log(email, password);
    //Check if user already exists
    const existingAdmin = await User.findOne({ email });
    const currentPassword = await existingAdmin.isPasswordMatched(password); //method come from model password check

    if(existingAdmin.role !== "admin"){res.status(400).json({message:"You are not authorized to login as admin"})}

    if (existingAdmin && currentPassword) {
      const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET, {
        expiresIn: "1d",
      });
      const refreshToken = await generateRefreshToken(existingAdmin._id);

      const updateuser = await User.findByIdAndUpdate(
        existingAdmin.id,
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
      console.log(existingAdmin);
      //password check is handled in user model
      return res.status(200).json({
        _id: existingAdmin._id,
        firstname: existingAdmin.firstname,
        lastname: existingAdmin.lastname,
        email: existingAdmin.email,
        mobile: existingAdmin.mobile,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}




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


const forgotPasswordToken= async(req,res)=>{
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "No user found" });
  }
  const token = await user.createPasswordResetToken();//from model
  await user.save();
  //update the user with the reset token  
  const resetUrl = `Hi, Please follow this link to reset your password. This link is valid only for  10 minutes from now. 
  <a href='http://localhost:4000/api/auth/reset-password/${token}'>Click here</a> `;
  //send email
  const data = {
    to: user.email,
    subject: "Forgot Password",
    text: `Hey User`,
    htm: resetUrl,
  };
  //sendEmail(data);
  sendEmail.sendEmail(data);
  res.status(200).json(token);
}

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400).json({ message: "Invalid token" });
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json(user);
};

module.exports = { login, handleRefreshToken, logout,forgotPasswordToken,resetPassword ,adminLogin };
