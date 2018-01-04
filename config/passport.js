let passport = require('passport');
let User = require('../models/user');
let localStorage = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id)
});

passport.deserializeUser(function(id, done){
    User.findById(id, (err, user) => {
        done(err, user)
    })
});

passport.use('local.signup', new localStorage({
    usernameField: 'email', passwordField: 'password', passReqToCallback: true
}, function(req, email, password, done){
    //Check valid
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    let errors = req.validationErrors(); //Get all errors for checkBody

    if(errors){
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages));
    } 

    User.findOne({'email': email}, function(err, user){
        if(err) return done(err);
        if(user) return done(null, false, {message: 'Email is already in use'});
        
        var newUser = new User();
        newUser.email= email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save((err, user) => {
            if(err) return done(err);
            return done(null, user);
        })
    })
}));

passport.use('local.signin', new localStorage({
    usernameField: 'email', passwordField: 'password', passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    let errors = req.validationErrors(); 

    if(errors){
        let messages = [];
        errors.forEach(function(error){
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages));
    }  

    User.findOne({'email': email}, function(err, user){
        if(err) return done(err);
        if(!user) return done(null, false, {message: 'No user found'});
        if(!user.validPassword(password)) return done(null, false, {message: 'Wrong password'});
        
        return done(null, user);
    })
}));

