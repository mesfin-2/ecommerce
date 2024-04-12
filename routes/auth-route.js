const express = require("express");
const router = express.Router();
const authRoutes = require("../controller/auth-controller.js");

router.post("/login", authRoutes.login);
router.get("/refresh", authRoutes.handleRefreshToken);
router.get("/logout", authRoutes.logout);

module.exports = router;
