const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema({
    products:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            
            },
            },
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
            }

        },
        { timestamps: true }
);


//Export the model
module.exports = mongoose.model('Cart', cartSchema);