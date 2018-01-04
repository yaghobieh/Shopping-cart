let express = require('express');
let csrf = require('csurf')
let router = express.Router();
let passport = require('passport');

let Order = require('../models/order');
let Cart = require('../models/cart');

let csrfProtection = csrf();
router.use(csrfProtection); //All the route have to be production by csrf

router.get('/profile', isLoggedIn, function(req, res, next){
    Order.find({user: req.user}, function(err, orders){
        if(err) return res.write('Error!');
        let cart;
        //Create new cart
        orders.forEach(function(order){
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', {orders: orders});
    });
});

router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/');
});

//Auth the under routes
router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function(req, res, next) {
    let message_err = req.flash('error');  
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: message_err, hasErrors: message_err.length > 0 })
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup', failureFlash: true
}), function(req, res,next){
    if(req.session.oldUrl){
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function(req, res, next){
    let message_err = req.flash('error');  
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: message_err, hasErrors: message_err.length > 0 })
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin', failureFlash: true
}), function(req, res,next){
    if(req.session.oldUrl){
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;

//Check login 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
} 

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
} 