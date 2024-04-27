const express = require('express');
const router = express.Router();
const couponRouter = require('../controller/coupon-controller');
 const authMiddlewares = require('../middleware/authMiddleware');


router.post('/', authMiddlewares.userExtractor,authMiddlewares.isAdmin, couponRouter.createCoupon);
router.put('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, couponRouter.updateCoupon);
router.get('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, couponRouter.getACoupon);
router.get('/', authMiddlewares.userExtractor,authMiddlewares.isAdmin, couponRouter.getAllCoupons);
router.delete('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, couponRouter.deleteCoupon);


module.exports = router;