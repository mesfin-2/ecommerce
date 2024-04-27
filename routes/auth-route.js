const express = require("express");
const router = express.Router();
const authRoutes = require("../controller/auth-controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/login", authRoutes.login);
router.post("/login-admin", authRoutes.adminLogin);
router.get("/refresh", authRoutes.handleRefreshToken);
router.get("/logout", authRoutes.logout);
router.post("/forgot-password-token", authRoutes.forgotPasswordToken);
router.put("/reset-password/:token", authRoutes.resetPassword);

module.exports = router;
