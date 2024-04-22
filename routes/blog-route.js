const express = require('express');
const router = express.Router();
const blogRouter = require('../controller/blog-controller');
const middlewares = require('../middleware/middleware');
const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  middlewares.userExtractor,
authMiddlewares.isAdmin, blogRouter.createBlog);
router.put('/like' ,middlewares.userExtractor, blogRouter.likeBlog);
router.put('/dislike',middlewares.userExtractor, blogRouter.dislikeBlog);

router.put('/:id',  middlewares.userExtractor,
authMiddlewares.isAdmin, blogRouter.updateBlog);

router.get('/:id',  middlewares.userExtractor, blogRouter.getBlog);
router.get('/',  middlewares.userExtractor, blogRouter.getAllBlogs);
router.delete('/:id',  middlewares.userExtractor,authMiddlewares.isAdmin, blogRouter.deleteBlog);



module.exports = router;