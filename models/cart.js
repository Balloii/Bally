const   mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    totalPrice: Number,
    totalAmount: Number,
    totalPayment: Number,
    ShippingPrice: Number,
    Date: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        address: String,
        phone: String,
        email: String,
    },
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        Name: String,
        Price: Number,
        image: String        
    }] // ทำ Product เป็น array เพราะ 1 หน้าของ cart มีได้หลาย Product
});

module.exports = mongoose.model('Cart', cartSchema);