const Brand = require('../model/brand-model');
const User = require('../model/user-model');
const validateMongoDbId = require('../utils/validateMongodbid');
//const { validateMongoDbId } = require('../utils/validateMongodbid');

const createBrand = async (req, res) => {
    const { title } = req.body;
    try {
        const newBrand = await Brand.create({
            title,
            
        });

        res.status(201).json({ message: 'Brand created successfully', data: newBrand });
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const updateBrand = async (req, res) => {
     
    const { id } = req.params;
    const existedBrand = await Brand.findById(id);
    if (!existedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    try {
        const BrandToUpdate =  await Brand.findByIdAndUpdate(id, req.body,{new:true})
      

        res.status(200).json(BrandToUpdate);
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const getBrand = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    
    const existedBrand = await Brand.findById(id);
    if (!existedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
    }
    
    res.status(200).json(existedBrand);
}
const getAllBrands = async (req, res) => {
  
    const Brands = await Brand.find({})
    
    res.status(200).json(Brands);

}
const deleteBrand = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    const existedBrand = await Brand.findById(id);
    if (!existedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
    }

    try {
        const BrandToDeleted =  await Brand.findByIdAndDelete(id )
       //const Brand =   await BrandToUpdate.save();

        res.status(200).json({ message: 'Brand deleted successfully' });
        
    } catch (error) {
        throw new Error(error);
        
    }
}

 
module.exports = { createBrand,updateBrand,getBrand,getAllBrands,deleteBrand };