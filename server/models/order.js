const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
        color: String,
        thumb: String,
        title: String,
    }],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Shipping', 'Successed'],
    },
    total: {
        type: Number,
    },
    address: {
        type: String,
    },
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: 'Coupon',
    },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    currentProduct: []
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);