const { Router } = require('express');
const order = require('../models/order');
const user = require('../models/user');

const   express = require('express'),
        router  = express.Router(),
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
        upload      = multer({storage: storage, fileFilter: imageFilter}),
        Product     = require('../models/product'),
        middleware  = require('../middleware'),
        Cart        = require('../models/cart'),
        User        = require('../models/user'),
        Order       = require('../models/order');

router.get("/", function(req, res){
    Product.find({}, function(err, allProducts){
        if(err){
            console.log(err);
        } else {
            res.render("product/landing.ejs", {products: allProducts});
        }
    });
});

router.post('/search', function(req, res){
    let searchBar = req.body.searchBar;
    res.redirect('/search/' + searchBar);
});

router.get('/search/:searchBar', function(req, res){
    let searchBar = req.params.searchBar;
    Product.find({Name: {$regex: searchBar, $options: "i"}}).exec(function(err, foundProduct){
        if(err){
            console.log(err);
        } else{
            res.render('product/landing.ejs', {products: foundProduct});
        }
    });
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    req.body.product.image = '/upload/' + req.file.filename; 
    req.body.product.author = {
        id: req.user._id,
        username: req.user.username
    };
    Product.create(req.body.product, function(err, newlyadded){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/new", middleware.isLoggedIn , function(req, res){
    res.render("product/new.ejs");
});

router.get("/:id/edit", middleware.checkProductOwner, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            console.log(foundProduct);
            res.render("product/edit.ejs", {product: foundProduct})
        }
    });
}); 

router.put('/:id', upload.single('image'), function(req, res){
    if(req.file){
        req.body.product.image = '/upload/' + req.file.filename;
    }
    Product.findByIdAndUpdate(req.params.id, req.body. product, function(err, updateProduct){
        if(err){
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/' + req.params.id);
        }
    });
});

router.get('/:id/add_to_cart', middleware.isLoggedIn, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
            res.redirect('/');
        } else{
            Cart.findOne({user: {id: req.user._id}}, function(err, foundCart){
                if(err){
                    console.log(err);
                } else{
                    if(!foundCart){
                        const newCart = { user: {id: req.user._id}};
                        Cart.create(newCart, function(err, newlycart){
                            if(err){
                                console.log(err);
                            } else{
                                newlycart.products.push(foundProduct);
                                newlycart.totalPrice = 0;
                                newlycart.totalPrice += foundProduct.Price;
                                newlycart.totalAmount = 0;
                                newlycart.totalAmount++;
                                newlycart.Date = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
                                req.flash('success', 'Your item is added to your cart !');
                                newlycart.save();
                                res.redirect('/');
                            }
                        });
                    } else{
                        foundCart.products.push(foundProduct);
                        foundCart.totalPrice += foundProduct.Price;
                        foundCart.totalAmount++;
                        req.flash('success', 'Your item is added to your cart !');
                        foundCart.save();
                        res.redirect('/');
                    }
                }
            });
        }
    });
});

router.get('/cart', middleware.isLoggedIn, function(req, res){
    Cart.findOne({user: {id: req.user._id}}).populate("products").populate("user").exec(function(err, foundCart){
        if(err){
            console.log(err);
        } else{
            res.render('cart/cart.ejs', {showCart: foundCart});
        }
    });
});

router.get('/:id/order', middleware.isLoggedIn, function(req, res){
    Cart.findOne({user: {id: req.user._id}}).populate("user").exec(function(err, foundCart){
        if(err){
            console.log(err);
        } else{
            foundCart.user.address = req.user.address;
            foundCart.user.phone = req.user.phone;
            foundCart.user.email = req.user.email;
            foundCart.Date = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
            foundCart.shippingPrice = 40;
            foundCart.totalPayment = foundCart.totalPrice + foundCart.shippingPrice;
            foundCart.save();
            res.render('order/order.ejs', {foundCart: foundCart});
        }
    });
});

router.post('/order/:id/createOrder',  middleware.isLoggedIn, function(req, res){
    Cart.findById(req.params.id).populate("products").populate("user").exec(function(err, foundCart){
        if(err){
            console.log(err);
        } else{
            Order.create({user: {id: req.user._id}}, function(err, newlyorder){
                if(err){
                    console.log(err);
                } else{
                    newlyorder.cart.push(foundCart);
                    newlyorder.address = req.user.address;
                    newlyorder.phone = req.user.phone;
                    newlyorder.email = req.user.email;
                    newlyorder.Paymethod = req.body.Paymethod;
                    newlyorder.save();
                    req.flash('success', 'order completed !');
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/:id/remove', function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            Cart.findOne({user: {id: req.user._id}}, function(err, foundCart){
                if(err){
                    console.log(err);
                } else{
                    foundCart.products.pull(foundProduct);
                    req.flash('success', ' Remove successfully');
                    foundCart.totalPrice -= foundProduct.Price;
                    foundCart.totalAmount --;
                    foundCart.save();
                    res.redirect('/cart');
                }
            });
        }
    });
});

router.get('/sort-low-to-high', function(req, res){
    Product.find({}).sort([['Price', 1]]).exec(function(err, sortProduct){
        if(err){
            console.log(err);
        } else{
            res.render('product/landing.ejs', {products: sortProduct});
        }
    });
});

router.get('/sort-high-to-low', function(req, res){
    Product.find({}).sort([['Price', -1]]).exec(function(err, sortProduct){
        if(err){
            console.log(err);
        } else{
            res.render('product/landing.ejs', {products: sortProduct});
        }
    });
});

router.get("/:id", function(req, res){
    Product.findById(req.params.id).populate('comments').exec(function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            res.render('product/show.ejs', {product: foundProduct})
        }
    });
});

router.delete('/:id', middleware.checkProductOwner, function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        } else{
            res.redirect('/');
        }
    });
});



module.exports = router;