const   express = require('express'),
        router  = express.Router({mergeParams: true}),
        Product = require('../models/product'),
        Comment = require('../models/comment'),
        middleware = require('../middleware');

router.get("/new", middleware.isLoggedIn, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new.ejs', {product: foundProduct})
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); //รับข้อมูลจาก comment มาทั้ง id และ username
                    foundProduct.comments.push(comment);
                    foundProduct.save();
                    res.redirect('/' + foundProduct._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect('back');
        } else{
            res.render('comments/edit.ejs', {product_id: req.params.id, comment: foundComment})
        }
    });
});

router.put('/:comment_id', middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect('back');
        } else{
            res.redirect('/' + req.params.id);
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash('error', 'There are something wrong!!!')
            res.redirect('/' + req.params.id);
        } else{
            req.flash('success', 'Your comment was deleted.');
            res.redirect('/' + req.params.id);
        }
    });
});

module.exports = router;