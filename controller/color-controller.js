const Color = require('../model/color-model');
const User = require('../model/user-model');
const validateMongoDbId = require('../utils/validateMongodbid');
//const { validateMongoDbId } = require('../utils/validateMongodbid');

const createColor = async (req, res) => {
    const { title } = req.body;
    try {
        const newColor = await Color.create({
            title,
            
        });

        res.status(201).json( newColor );
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const updateColor = async (req, res) => {
     
    const { id } = req.params;
    const existedColor = await Color.findById(id);
    if (!existedColor) {
        return res.status(404).json({ message: 'Color not found' });
    }

    try {
        const ColorToUpdate =  await Color.findByIdAndUpdate(id, req.body,{new:true})
      

        res.status(200).json(ColorToUpdate);
        
    } catch (error) {
        throw new Error(error);
        
    }
}
const getColor = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    
    const existedColor = await Color.findById(id);
    if (!existedColor) {
        return res.status(404).json({ message: 'Color not found' });
    }
    
    res.status(200).json(existedColor);
}
const getAllColors = async (req, res) => {
  
    const Colors = await Color.find({})
    
    res.status(200).json(Colors);

}
const deleteColor = async (req, res) => {
     
    const { id } = req.params;
    validateMongoDbId(id);
    const existedColor = await Color.findById(id);
    if (!existedColor) {
        return res.status(404).json({ message: 'Color not found' });
    }

    try {
        const ColorToDeleted =  await Color.findByIdAndDelete(id )
       //const Color =   await ColorToUpdate.save();

        res.status(200).json({ message: 'Color deleted successfully' });
        
    } catch (error) {
        throw new Error(error);
        
    }
}

 
module.exports = { createColor,updateColor,getColor,getAllColors,deleteColor };