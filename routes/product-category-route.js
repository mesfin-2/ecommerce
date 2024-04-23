const express = require('express');
const router = express.Router();
const categoryRouter = require('../controller/category-controller');
const middlewares = require('../middleware/middleware');
const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  middlewares.userExtractor,
authMiddlewares.isAdmin, categoryRouter.createCategory);
router.put('/:id',middlewares.userExtractor,authMiddlewares.isAdmin, categoryRouter.updateCategory);
router.delete('/:id',  middlewares.userExtractor,authMiddlewares.isAdmin, categoryRouter.deleteCategory);
router.get('/:id',  middlewares.userExtractor, categoryRouter.getCategory);
router.get('/',  middlewares.userExtractor, categoryRouter.getAllCategories);
 // router.put('/dislike',middlewares.userExtractor, blogRouter.dislikeBlog);

// router.put('/:id',  middlewares.userExtractor,
// authMiddlewares.isAdmin, blogRouter.updateBlog);




module.exports = router;