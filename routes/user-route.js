const express = require("express");
const router = express.Router();
const userController = require("../controller/user-controller");
const middlewares = require("../middleware/middleware");
const authMiddlewares = require("../middleware/authMiddleware");

router.post("/register", userController.createUser);
router.get(
  "/:id",
  middlewares.userExtractor,
  authMiddlewares.isAdmin,
  userController.getAuser
);
router.delete("/:id", userController.deleteAuser);
router.put("/:id", userController.updateAuser);
router.get("/", userController.getAllUsers);

module.exports = router;
