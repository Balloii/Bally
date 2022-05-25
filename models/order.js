const   mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    totalPrice: Number,
    totalAmount: Number,
    totalPayment: Number,
    Date: String,
    Paymethod: String,
    Status: String,
    address: String,
    phone: String,
    email: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    cart: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        },
        totalPrice: Number,
        totalAmount: Number,
        totalPayment: Number,
        ShippingPrice: Number,
        Date: String      
    }] 
});

module.exports = mongoose.model('Order', orderSchema);