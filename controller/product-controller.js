const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("../model/productModel");
const { query } = require("express");


const createProduct = async (req, res) => {
    const { title   } = req.body;

    if(title){
       req.body.slug = slugify(title) ;
    }
    // Check if user already exists
    const product = await Product.findOne({ title });
  
    if (product) {
      return res.status(400).json({ message: "Product already exists" });
    }
  
    const newProduct = await Product.create(req.body); //sending entire body
    res.status(201).json({ message: "Product successfully created" });
  };
  
 
    /**
     * 1. Filtering
     *  This req.query typically contains all the query parameters sent
     *  with the request. However, certain fields like page, sort, limit,
     *  and fields are often used for pagination, sorting, and field selection,
     *  respectively. These fields are not intended to be part of the filter
     *  criteria for querying products in this case. So, we remove them
     *  from queryObj to prevent any unintended behavior when querying the database.
     * By removing these fields from queryObj, you ensure that only valid filtering 
     * criteria are passed to
     *  the database query, which improves the reliability and security of your API.
     * 2. Sorting
     * We split the sort query parameter into an array of sorting fields.
        We iterate over each sorting field and check if it starts with a hyphen (-).
        you can on/off the hyphen (-) and see how it works http://localhost:4000/api/products?sort=-category,brand .
        If it does, it indicates descending order; otherwise, it's ascending.
        We extract the field name and sorting order accordingly and use them to
        compare the products.
        If no sorting parameter is provided, we default to sorting by createdAt
        in descending order.

     * 3. Field limiting
      * We check if the fields query parameter is present in the request.
          If it is, we split the fields into an array of field names.
          We join the array of field names into a string separated by spaces.
          We use the select method to include or exclude fields from the query result.
          If no fields parameter is provided, we exclude the __v field from the result.
         * to check how it works try this http://localhost:4000/api/products?fields=title,price,brand
          *the opposite of select try this http://localhost:4000/api/products?fields=-title,-price,-brand
     * 4. Pagination
     * We extract the page and limit query parameters from the request.
     * We set the default values for page and limit to 1 and 10, respectively.
     * We calculate the number of products to skip based on the page and limit values.
     * We use the skip and limit methods to paginate the products.
     * We count the total number of products in the database.
     * If the skip value is greater than the total number of products,
     * we throw an error indicating that the page does not exist.
     * We return the paginated products as the response.
     * to check how it works try this http://localhost:4000/api/products?page=2&limit=2
     * 
     * 
     */
        const getAllProducts = async (req, res) => {
           
            // Make query to filter, sort,limit, paginate
        
            // Filtering
            const filterQuery = { ...req.query };
            const excludeFields = ['page', 'sort', 'limit', 'fields'];
            excludeFields.forEach(el => delete filterQuery[el]);
        
            let filterStr = JSON.stringify(filterQuery);
            filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
            //productQuery is not an array of product Document, Its a  Mongoose query object, 
            //that is why we can chain other methods like sort, select, etc. to it
            let productQuery = Product.find(JSON.parse(filterStr));//Mongoose query object for products
        
            // Sorting
            if (req.query.sort) {
              const sortBy = req.query.sort.split(",");
              productQuery = productQuery.sort(sortBy.join(" "));
            } else {
              productQuery = productQuery.sort("-createdAt");
            }
        
            // Field limiting
            if (req.query.fields) {
              const fields = req.query.fields.split(",").join(" ");
              productQuery = productQuery.select(fields);
            } else {
              //if fields are not provided, exclude __v field
              productQuery = productQuery.select("-__v");
            }

            //Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;
            const query = productQuery.skip(skip).limit(limit);

            if(req.query.page){
                const numProducts = await Product.countDocuments();
                if(skip >= numProducts){
                    throw new Error('This page does not exist');
                } 
            }
            //console.log(page, limit, skip);
        
            // Execute the query
            const products = await productQuery.exec();
        
            return res.status(200).json(products);
           
        };
        
  
  const getAproduct = async (req, res) => {
    const { id } = req.params;
    //validateMongoDbId(id);
      
    const product = await Product.findById(id);
    console.log(product);
    return res.status(200).json(product);
  };
  const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (id) {
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      return res
        .status(200)
        .json({ message: "Product  " + deletedProduct.id + " deleted Successfully" });
    } else {
      res.status(400).json({ message: "product is not found" });
    }
  };
  const updateProduct = async (req, res) => {
    const { title   } = req.body;

    if(title){
       req.body.slug = slugify(title) ;
    }

    const { id } = req.params;
    if (id) {
      const updatedProduct = await Product.findByIdAndUpdate (id,{ $set: req.body },{new:true});
  
      return res
        .status(200)
        .json({ message: "Product  " + updatedProduct.id + " updated Successfully" });
    } else {
      res.status(400).json({ message: "product is not found" });
    }
  };
   

module.exports={createProduct,getAllProducts,getAproduct,deleteProduct,updateProduct}