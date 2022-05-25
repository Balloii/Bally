const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        flash       = require('connect-flash'),
        methodOverride = require('method-override'),
        Product     = require('./models/product'),
        Comment     = require('./models/comment'),
        User        = require('./models/user'),
        Order       = require('./models/order'),
        seedDB      = require('./seeds.js');

const   indexRoutes = require('./routes/index'),
        productRoutes   = require('./routes/products'),
        commentRoutes   = require('./routes/comments');

mongoose.connect('mongodb://localhost/BallyShop');
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

app.use(require('express-session')({
    secret: 'secret word',
    resave: false,
    saveUninitialized: false
}));//เก็บข้อมูลของ User ไม่ให้หายไป

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next(); //เช็ค User ที่เข้าอยู่ในปัจจุบันแล้วเข้าสู่คำสั่งต่อไป
});

app.use(function(req, res, next){ //จะประกาศ flash ต้องคำนึงถึง 1.สี 2.ข้อความ 3.ตำแหน่งที่จะแสดง
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error'); //ประกาศ flash สำหรับ error
    res.locals.success = req.flash('success'); //ประกาศ flash สำหรับ success
    next();
})

app.use('/', productRoutes);
app.use('/index', indexRoutes);
app.use('/:id/comments', commentRoutes);

app.listen(3000, function(){
    console.log("Activated");
});