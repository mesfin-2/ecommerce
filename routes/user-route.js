const express = require("express");
const router = express.Router();
const userController = require("../controller/user-controller");
 const authMiddlewares = require("../middleware/authMiddleware");

router.post("/register", userController.createUser);
router.post("/cart", authMiddlewares.userExtractor ,  userController.userCart);
router.post("/cart/applycoupon", authMiddlewares.userExtractor ,  userController.applyCoupon);
router.post("/cart/cash-order", authMiddlewares.userExtractor , userController.createOrder);
router.get("/cart",authMiddlewares.userExtractor , userController.getUserCart);
router.get("/orders",authMiddlewares.userExtractor, userController.getUserOrders);
router.get(
  "/wishList",
  authMiddlewares.userExtractor,
  userController.getUserWishlist
);
router.delete("/empty-cart",authMiddlewares.userExtractor, userController.emptyCart);
router.get(
  "/:id",
  authMiddlewares.userExtractor,
  authMiddlewares.isAdmin,
  userController.getAuser
);
router.delete("/:id", userController.deleteAuser);
router.put("/edit-user",authMiddlewares.userExtractor,  userController.updateAuser);
router.put("/order/edit-order-status/:id",authMiddlewares.userExtractor,  userController.updateOrderStatus);
 
router.put("/save-address",authMiddlewares.userExtractor, userController.saveUserAddress);
router.get("/", userController.getAllUsers);

router.put(
  "/update-password",
  authMiddlewares.userExtractor,
  userController.updatePassword
);

router.put(
  "/block-user/:id",
  authMiddlewares.userExtractor,
  authMiddlewares.isAdmin,
  userController.blockAuser
);
router.put(
  "/unblock-user/:id",
  authMiddlewares.userExtractor,
  authMiddlewares.isAdmin,
  userController.unBlockAuser
);

module.exports = router;
