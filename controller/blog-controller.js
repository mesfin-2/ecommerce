const Blog = require('../model/blog-model');
const User = require('../model/user-model');
const validateMongoDbId = require('../utils/validateMongodbid');
//const { validateMongoDbId } = require('../utils/validateMongodbid');
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

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
             $inc: { numViews: 1 },//increment the number of views by 1
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
          $pull: { dislikes: loginUserId },//if the user has already disliked the blog, remove the dislike
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
          $pull: { likes: loginUserId },//if the user has already liked the blog, remove the like
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },//if the user has not liked the blog, add the like
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
          $pull: { likes: loginUserId },//if the user has already liked the blog, remove the like
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
          $pull: { disLikes: loginUserId },//if the user has already disliked the blog, remove the dislike
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { disLikes: loginUserId },//if the user has not disliked the blog, add the dislike
          isDisLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  };

  const uploadImages = async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const findBlog = await Blog.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          }),
        },
        {
          new: true,
        }
      );
      res.json(findBlog);
    } catch (error) {
      throw new Error(error);
    }
  };
module.exports = { createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,likeBlog,dislikeBlog,uploadImages };