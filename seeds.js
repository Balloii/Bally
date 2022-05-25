const   mongoose    = require('mongoose'),
        Product     = require('./models/product'),
        Comment     = require('./models/comment'),
        Cart        = require('./models/cart'),
        Order       = require('./models/order'),
        User        = require('./models/user');
const user = require('./models/user');

// const   data = [
//         {
//             Name:"VGA (การ์ดแสดงผล) GIGABYTE AORUS GEFORCE RTX 3050 ELITE 8G - 8GB GDDR6", 
//             Price:"17,900",
//             Detail: "GeForce RTX 3050 , 8GB GDDR6, 2 x DP, 2 x HDMI",
//             url:"https://www.jib.co.th/img_master/product/original/2022042816254552827_1.jpg"
//         },
//         {   
//             Name:"VGA (การ์ดแสดงผล) GIGABYTE RADEON RX 6400 D6 LOW PROFILE 4G - 4GB GDDR6",
//             Price:"6,990", 
//             Detail: "Radeon RX 6400, 4GB GDDR6, 1 x DP, 1 x HDMI, Low Profile Bracket Included",
//             url:"https://www.jib.co.th/img_master/product/original/2022042810070152808_1.jpg"
//         },
//         {   
//             Name:"VGA (การ์ดแสดงผล) MSI RADEON RX 6400 AERO ITX 4G - 4GB GDDR6", 
//             Price:"7,190",
//             Detail: "Radeon RX 6400, 4GB GDDR6, 1 x DP, 1 x HDMI", 
//             url:"https://www.jib.co.th/img_master/product/original/2022042513121352731_1.jpg"
//         }
//     ];

function seedDB(){
    User.remove({}, function(err){
        if(err){
            console.log(err)
        } else {
            console.log('Data removal complete'); // ทำการลบข้อมูลที่ซ้ำๆกันออกไปแล้วเอาข้อมูลพื้นฐานที่เราใส่มาเพิ่ม
        //     data.forEach(function(seed){
        //         Product.create(seed, function(err, product){
        //             if(err){
        //                 console.log(err);
        //             } else{
        //                 console.log('New data added');
        //                 // Comment.create({
        //                 //     author: 'Balloi',
        //                 //     text: 'Good price!'
        //                 // }, function(err, comment){
        //                 //     if(err){
        //                 //         console.log(err)
        //                 //     } else {
        //                 //         product.comments.push(comment);
        //                 //         product.save();
        //                 //     }
        //                 // });
        //             }
        //         });
        //     });
        }
    });
}

module.exports = seedDB;