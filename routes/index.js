let express = require('express');
let router = express.Router();

let Cart = require('../models/cart');
let Product = require('../models/product');
let Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  let successMsg = req.flash('success')[0];

  let products = Product.find((err, docs) => {

    res.render('shop/index', { title: 'Shopping cart', products: docs, successMsg: successMsg, noMessages: !successMsg });
  }); //Get all products
});

router.get('/add-to-cart/:id', function(req, res, next){
  let productId = req.params.id;
  //Initialize the constructor
  let cart = new Cart( req.session.cart ? req.session.cart : {} );

  Product.findById(productId, function(err, product){
    if(err) return res.redirect('/');
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
});

router.get('/reduce/:id', function(req, res, next){
  let productId = req.params.id;
  let cart = new Cart( req.session.cart ? req.session.cart : {} );

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
  let productId = req.params.id;
  let cart = new Cart( req.session.cart ? req.session.cart : {} );

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart) return res.render('shop/shopping-cart', {products: null})
  let cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart) return res.redirect('shop/shopping-cart')
  let cart = new Cart(req.session.cart);
  let errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg})
});

router.post('/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart) return res.redirect('shop/shopping-cart');

  let cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_LgQue9zAPQ05UkFHjoAnxSE4"
  );
  
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken,
    description: "Test charge"
  }, function(err, charge) {
    if(err){
       req.flash('error', err.message)
      return res.redirect('/checkout')
    }

    //Saving new order in DB
    let order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });

    order.save(function(err, result){
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });

  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
} 

