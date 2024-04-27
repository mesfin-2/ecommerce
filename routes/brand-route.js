const express = require('express');
const router = express.Router();
const brandRouter = require('../controller/brand-controller');
 const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  authMiddlewares.userExtractor,
authMiddlewares.isAdmin, brandRouter.createBrand);
router.put('/:id',  authMiddlewares.userExtractor,
authMiddlewares.isAdmin, brandRouter.updateBrand);

router.get('/:id',  authMiddlewares.userExtractor, brandRouter.getBrand);
router.get('/',  authMiddlewares.userExtractor, brandRouter.getAllBrands);
router.delete('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, brandRouter.deleteBrand);



module.exports = router;