const Blog = require('../model/blog-model');
const User = require('../model/user-model');
const validateMongoDbId = require('../utils/validateMongodbid');
//const { validateMongoDbId } = require('../utils/validateMongodbid');

const createBlog = async (req, res) => {
    const { title, description, category, image } = req.body;
    try {
        const newBlog = await Blog.create({
            title,
            description,
            category,
            image,
        });

        res.status(201).json({ message: 'Blog created successfully', data: newBlog });
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const updateBlog = async (req, res) => {
     
    const { id } = req.params;
    const existedBlog = await Blog.findById(id);
    if (!existedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    try {
        const blogToUpdate =  await Blog.findByIdAndUpdate(id, req.body,{new:true})
       const blog =   await blogToUpdate.save();

        res.status(200).json({ message: 'Blog updated successfully', data: blog });
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const getBlog = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    const existedBlog = await Blog.findById(id).populate('likes').populate('disLikes').populate('author');
    if (!existedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    
    try {
        await Blog.findByIdAndUpdate(id, {
             $inc: { numViews: 1 },
             },
             { new: true});
        
        res.status(200).json( existedBlog);
        
    } catch (error) {
        throw new Error(error);
        
    }
}

const getAllBlogs = async (req, res) => {
  
    const blogs = await Blog.find({})
    .sort({ createdAt: 1})
    .populate({ path: 'author', select: 'name email'})
    .exec();
    res.status(200).json(blogs);

}

const deleteBlog = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    const existedBlog = await Blog.findById(id);
    if (!existedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    try {
        const blogToDeleted =  await Blog.findByIdAndDelete(id )
       //const blog =   await blogToUpdate.save();

        res.status(200).json({ message: 'Blog deleted successfully' });
        
    } catch (error) {
        throw new Error(error);
        
    }
}

    const likeBlog = async (req, res) => {
        const { blogId } = req.body;
        console.log("blogId",blogId);
        validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.disLikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  };
  const dislikeBlog = async (req, res) => {
    const { blogId } = req.body;
    //blogId is undefined, could you fix it?

    validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisLiked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { disLikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { disLikes: loginUserId },
          isDisLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  };
module.exports = { createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,likeBlog,dislikeBlog };