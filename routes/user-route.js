const express = require("express");
const router = express.Router();
const userController = require("../controller/user-controller");

router.post("/register", userController.createUser);
router.get("/:id", userController.getAuser);
router.delete("/:id", userController.deleteAuser);
router.put("/:id", userController.updateAuser);
router.get("/", userController.getAllUsers);

module.exports = router;
