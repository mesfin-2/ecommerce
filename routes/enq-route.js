const express = require("express");
const enqController = require("../controller/enq-controller");
const authMiddlewares = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", enqController.createEnquiry);
router.put("/:id", authMiddlewares.userExtractor, authMiddlewares.isAdmin, enqController.updateEnquiry);
router.delete("/:id", authMiddlewares.userExtractor, authMiddlewares.isAdmin, enqController.deleteEnquiry);
router.get("/:id",  enqController.getEnquiry);
router.get("/", enqController.getallEnquiry);

module.exports = router;