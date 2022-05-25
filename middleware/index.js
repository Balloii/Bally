const   Product = require('../models/product'),
        Comment = require('../models/comment');

const   middlewareObj = {};

middlewareObj.checkProductOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Product.findById(req.params.id, function(err, foundProduct){
            if(err){
                res.redirect('back');
            } else{
                if(foundProduct.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash('error', "You do not have permission to do this action!");
                    res.redirect('back');
                }
            }
        });
    } else{
        req.flash('error', "Please login!");
        res.redirect('/index/login');
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash('error', "You do not have permission to do this action!");
                    res.redirect('back');
                }
            }
        });
    } else{
        req.flash('error', "Please login!");
        res.redirect('/index/login');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first'); //flash ประเภท error ในการไม่ได้ login
    res.redirect('/index/login');
}

module.exports = middlewareObj;