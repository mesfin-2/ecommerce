const ProductCategory = require('../model/product-category-model');
const validateMongoID = require('../utils/validateMongodbid');
// Create and Save a new Category
const createCategory = async  (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Category
    const category = new ProductCategory({
        title: req.body.title,
    });

    // Save Category in the database
   const newCategoty =  await category.save(category)
   res.status(201).json( newCategoty );
      
      
};

//Update a product Category
const updateCategory = async  (req, res) => {
    const{ id } = req.params;
    const{ title } = req.body;
    validateMongoID(id);
    // Validate request
    if (!title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    //  update Category
    const category = await ProductCategory.findByIdAndUpdate ( id,{title}, {new:true});

   res.status(201).json(category);
      
      
};
//Delete a product Category
const deleteCategory = async  (req, res) => {
    const{ id } = req.params;
    const{ title } = req.body;
    validateMongoID(id);
     
    // Validate request
    if (!title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    //  update Category
    const category = await ProductCategory.findByIdAndDelete(id);

   res.status(201).json( {message: "Category deleted successfully"});
      
      
};

//fetch a product Category
const getCategory = async  (req, res) => {
    const{ id } = req.params;
    validateMongoID(id);
    const category = await ProductCategory.findById(id);
    res.status(200).json(category);

}
//get all product categories
const getAllCategories = async  (req, res) => {
    const categories = await ProductCategory.find();
    res.status(200).json(categories);

}

module.exports = {createCategory,updateCategory,deleteCategory,getCategory,getAllCategories}