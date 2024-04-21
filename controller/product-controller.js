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
  
  const getAllProducts = async (req, res) => {
    // Make query to filter, sort, paginate

    //FILTERING
    // extracting the query parameters from req.query into queryObj,
    const queryObj = { ...req.query };
    console.log(queryObj );
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
     * 3. Field limiting
     * 4. Pagination
     * 
     * 
     */
    // Filtering
  
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
  //converting queryObj to a string (queryStr) and replacing certain substrings in it
  // with their corresponding MongoDB operators (e.g., gte, gt, lte, lt). 
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // convert queryStr back to an object with the correct MongoDB query syntax.
    let products = await Product.find(JSON.parse(queryStr));

    // SORTING

    // if (req.query.sort) {

    //   const sortBy = req.query.sort.split(",").join(" ");
      
    //   products = products.sort(sortBy); // Fix: Replace 'query.sort(sortBy)' with 'products.sort(sortBy)'
    // } else {
    //   products = products.sort("-createdAt"); // Fix: Replace 'query.sort("-createdAt")' with 'products.sort("-createdAt")'
    // }


    
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