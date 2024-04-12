const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");

const userExtractor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decodedToken.id);
      if (!user) {
        req.user = null; // User not found
      } else {
        req.user = user; // Attach user to request
      }

      console.error("Error verifying token:", error);
      req.user = null; // Invalid token
    }
  } else {
    req.user = null; // No token or invalid format
  }

  next();
};

const isAdmin = async (req, res, next) => {
  console.log(req.user);
  next();
};
module.exports = { userExtractor, isAdmin };
