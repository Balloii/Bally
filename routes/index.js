const   express = require('express'),
        router  = express.Router(),
        User    = require('../models/user'),
        Product = require('../models/product'),
        multer  = require('multer'),
        path    = require('path'),
        storage = multer.diskStorage({
            destination: function(req, file, callback){
                callback(null, './public/upload/'); //บอกว่าจะเก็บไฟล์ไว้ที่ไหน
            },
            filename: function(req, file, callback){
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); //บอกว่าจะเก็บไฟล์ชื่ออะไร
            }
        }),
        imageFilter = function(req, file, callback){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
                return callback(new Error('Only jpg, jpeg, png and gif.'), false);
            }
            callback(null, true);
        },
        upload  = multer({storage: storage, fileFilter: imageFilter}),
        passport= require('passport'),
        Order   = require('../models/order');

router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', upload.single('profileImage'), function(req, res){
    req.body.profileImage = '/upload/' + req.file.filename;
    let newUser = new User({username: req.body.username,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            phone: req.body.phone,
                            address: req.body.address,
                            profileImage: req.body.profileImage
    });
    if(req.body.adminCode === 'topsecret'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/index/register');
        } else {
            passport.authenticate('local')(req, res, function(){
            req.flash('success', user.username + ' Welcome to BallyShop' );
            res.redirect('/');
            });
        }
    });
});

router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', 
    {
        successFlash: true,
        successRedirect: '/', 
        successFlash: 'Successfully login',
        failureFlash: true,
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password'
    }), function(req, res){
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Log you out successfully');
    res.redirect('/');
}); //ทำการ Logout

router.get('/user/:id', function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash('error', 'There is something wrong!');
            return res.redirect('/');
        } else{
            Order.find().where('user.id').equals(foundUser._id).populate("cart").exec(function(err, foundOrder){
                if(err){
                    req.flash('error', 'There is something wrong!');
                    return res.redirect('/');
                } else{
                    res.render('user/show.ejs', {user: foundUser, order: foundOrder});
                }
            });
        }
    });
});


module.exports = router;