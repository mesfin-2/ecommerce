const express = require('express');
const router = express.Router();
const blogRouter = require('../controller/blog-controller');
const uploadImages = require('../middleware/uploadImages');
 const authMiddlewares = require('../middleware/authMiddleware');

router.post('/',  authMiddlewares.userExtractor,
authMiddlewares.isAdmin, blogRouter.createBlog);
router.put('/like' ,authMiddlewares.userExtractor, blogRouter.likeBlog);
router.put('/dislike',authMiddlewares.userExtractor, blogRouter.dislikeBlog);

router.put('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, blogRouter.updateBlog);
router.put('/upload-images/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, uploadImages.uploadPhoto.array('images', 10), uploadImages.blogImgResize, blogRouter.uploadImages);

router.get('/:id',  authMiddlewares.userExtractor, blogRouter.getBlog);
router.get('/',  authMiddlewares.userExtractor, blogRouter.getAllBlogs);
router.delete('/:id',  authMiddlewares.userExtractor,authMiddlewares.isAdmin, blogRouter.deleteBlog);



module.exports = router;