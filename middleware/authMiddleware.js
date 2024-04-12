const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");

const userExtractor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decodedToken.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    req.user = null; // No token or invalid format
    next();
  }
};

const isAdmin = async (req, res, next) => {
  console.log(req.user);
  next();
};
module.exports = { userExtractor, isAdmin };
