const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
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
            },
        ],
        paymentIntent: {},
        orderStatus: {
            type: String,
            default: 'Not Processed',
            enum: [
                'Not Processed',
                'Processing',
                'Cash on Delivery',
                "Processing",
                'Dispatched',
                'Cancelled',
                'Delivered'
            ]
        },
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
            }

        },
        { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);