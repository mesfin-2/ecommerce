
const express = require("express");
const uploadController = require("../controller/upload-controller");
const authMiddlewares = require('../middleware/authMiddleware');
const uploadMiddlewares = require("../middleware/uploadImages");
const router = express.Router();

router.post(
  "/",authMiddlewares.userExtractor,authMiddlewares.isAdmin,uploadMiddlewares.uploadPhoto.array("images", 10),uploadMiddlewares.productImgResize,uploadController.uploadImages
);

router.delete("/delete-img/:id", authMiddlewares.userExtractor, authMiddlewares.isAdmin, uploadController.deleteImages);

module.exports = router;