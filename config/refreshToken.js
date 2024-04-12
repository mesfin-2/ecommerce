const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateRefreshToken;
