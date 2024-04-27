const express = require('express');
const router = express.Router();
const categoryRouter = require('../controller/product-category-controller');
 const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  authMiddlewares.userExtractor,
authMiddlewares.isAdmin, categoryRouter.createCategory);
router.put('/:id',authMiddlewares.userExtractor,authMiddlewares.isAdmin, categoryRouter.updateCategory);
router.delete('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, categoryRouter.deleteCategory);
router.get('/:id',  authMiddlewares.userExtractor, categoryRouter.getCategory);
router.get('/',  authMiddlewares.userExtractor, categoryRouter.getAllCategories);
 // router.put('/dislike',middlewares.userExtractor, blogRouter.dislikeBlog);

// router.put('/:id',  middlewares.userExtractor,
// authMiddlewares.isAdmin, blogRouter.updateBlog);




module.exports = router;