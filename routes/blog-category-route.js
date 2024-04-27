const express = require('express');
const router = express.Router();
const blogcategoryRouter = require('../controller/blog-category-controller');
 const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, blogcategoryRouter.createBlogCategory);
router.put('/:id',authMiddlewares.userExtractor,authMiddlewares.isAdmin, blogcategoryRouter.updateBlogCategory);
router.delete('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin,blogcategoryRouter.deleteBlogCategory);
router.get('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, blogcategoryRouter.getBlogCategory);
router.get('/',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, blogcategoryRouter.getAllBlogCategories);
 // router.put('/dislike',middlewares.userExtractor, blogRouter.dislikeBlog);

// router.put('/:id',  middlewares.userExtractor,
// authMiddlewares.isAdmin, blogRouter.updateBlog);




module.exports = router;