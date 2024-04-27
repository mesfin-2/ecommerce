const BlogCategory = require('../model/blog-category-model');
const User = require('../model/user-model');
const validateMongoDbId = require('../utils/validateMongodbid');
//const { validateMongoDbId } = require('../utils/validateMongodbid');

const createBlogCategory = async (req, res) => {
    const { title } = req.body;
    try {
        const newBlogCategoty = await BlogCategory.create({title });

        res.status(201).json({ message: 'Blog created successfully', data: newBlogCategoty });
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const updateBlogCategory = async (req, res) => {
     
    const { id } = req.params;
    const existedBlog = await BlogCategory.findById(id);
    if (!existedBlog) {
        return res.status(404).json({ message: 'Blog Category not found' });
    }

    try {
        const blogToUpdate =  await BlogCategory.findByIdAndUpdate(id, req.body,{new:true})
       const blogcategory =   await blogToUpdate.save();

        res.status(200).json({ message: 'Blog updated successfully', data: blogcategory });
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const getBlogCategory = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    
    const existedBlogCategory = await BlogCategory.findById(id);
    if (!existedBlog) {
        return res.status(404).json({ message: 'Blog category not found' });
    }
    
    res.status(200).json(existedBlogCategory);
}

const getAllBlogCategories = async (req, res) => {
  
    const blogcategories = await BlogCategory.find({})
    
    res.status(200).json(blogcategories);

}

const deleteBlogCategory = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    const existedBlog = await BlogCategory.findById(id);
    if (!existedBlog) {
        return res.status(404).json({ message: 'Blogctegory not found' });
    }

    try {
        const blogToDeleted =  await BlogCategory.findByIdAndDelete(id )
       //const blog =   await blogToUpdate.save();

        res.status(200).json({ message: 'Blog category deleted successfully' });
        
    } catch (error) {
        throw new Error(error);
        
    }
}

  
module.exports = { createBlogCategory,updateBlogCategory,getBlogCategory,getAllBlogCategories,deleteBlogCategory };