const express = require("express");
const router = express.Router();
const productControll = require("../controller/product-controller.js");
//const middlewares = require("../middleware/middleware");
const authMiddlewares = require("../middleware/authMiddleware");

router.post("/",authMiddlewares.userExtractor,authMiddlewares.isAdmin, productControll.createProduct );
router.get("/",productControll.getAllProducts);
 router.get("/:id",productControll.getAproduct );
 router.delete("/:id",authMiddlewares.userExtractor,authMiddlewares.isAdmin,productControll.deleteProduct );
 router.put("/:id",authMiddlewares.userExtractor,authMiddlewares.isAdmin,productControll.updateProduct );

module.exports = router;