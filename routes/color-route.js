const express = require('express');
const router = express.Router();
const colorRouter = require('../controller/color-controller');
 const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  authMiddlewares.userExtractor,
authMiddlewares.isAdmin, colorRouter.createColor);
router.put('/:id',  authMiddlewares.userExtractor,
authMiddlewares.isAdmin, colorRouter.updateColor);

router.get('/:id',  authMiddlewares.userExtractor, colorRouter.getColor);
router.get('/',  authMiddlewares.userExtractor, colorRouter.getAllColors);
router.delete('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, colorRouter.deleteColor);



module.exports = router;