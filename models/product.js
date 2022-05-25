const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: String,
    Price: Number,
    Detail: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ] // ทำ comment เป็น array เพราะ 1 หน้าของสินค้ามีได้หลาย comment
});

module.exports = mongoose.model('Product', productSchema);