const express = require("express");
const router = express.Router();
const productControll = require("../controller/product-controller.js");
const authMiddlewares = require("../middleware/authMiddleware");

router.put("/wishlist",authMiddlewares.userExtractor, productControll.addProductToWishList );
router.put("/rating",authMiddlewares.userExtractor, productControll.rating );
router.put("/:id",authMiddlewares.userExtractor,authMiddlewares.isAdmin,productControll.updateProduct );
router.post("/",authMiddlewares.userExtractor,authMiddlewares.isAdmin, productControll.createProduct );
router.get("/",productControll.getAllProducts);
router.get("/:id",productControll.getAproduct );
router.delete("/:id",authMiddlewares.userExtractor,authMiddlewares.isAdmin,productControll.deleteProduct );

module.exports = router;