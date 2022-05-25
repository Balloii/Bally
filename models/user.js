const   mongoose = require('mongoose');
        passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    profileImage: String,
    isAdmin: {type: Boolean, default: false} //เพิ่ม admin ใน user เพราะ admin ก็เป็น user เหมือนกัน
});

userSchema.plugin(passportLocalMongoose);//ทำให้ User schema เชื่อมกับ Passport ได้

module.exports = mongoose.model('User', userSchema);