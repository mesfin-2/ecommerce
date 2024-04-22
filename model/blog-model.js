    const mongoose = require('mongoose'); // Erase if already required

    // Declare the Schema of the Mongo model
    const blogSchema = new mongoose.Schema({
        title:{
            type:String,
            required:true,
            unique:true,
            index:true,
        },
        description:{
            type:String,
            required:true,
            
        },
        category:{
            type:String,
            required:true,
            
        },
        numViews:{
            type:Number,
            default:0,
        },
        isLiked:{
            type:Boolean,
            default:false,
        },
        isDisLiked:{
            type:Boolean,
            default:false,
        },
        likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        disLikes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        image:{
            type:String,
            default: "https://res.cloudinary.com/dkkgmzpqd/image/upload/v1633660134/placeholder-image_ukvq6s.png",
        },
        author:{
            type:String,
            default: "Admin",
        },
    },
    {timestamps:true});

    //Export the model
    module.exports = mongoose.model('Blog', blogSchema);