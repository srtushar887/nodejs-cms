const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;



router.all('/*',(req,res,next) => {

    req.app.locals.layout = 'default';
    next();
});


router.route('/')
    .get(defaultController.index);


//definne passport


passport.use('local', new LocalStrategy({
        // by default, local strategy uses username
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email) email = email.toLowerCase();

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('error-message', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('error-message', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));



// passport.use('login', new LocalStrategy({
//     usernameField : 'email',
//     passwordField : 'password',
//     passReqToCallback: true
// },(req,email,password,done) => {
//     User.findOne({email : email})
//         .then(user => {
//             if (!user){
//                 return done(null, false)
//             }
//
//             bcrypt.compare(password, user.password, (err, passwordMatched) =>{
//                if (err){
//                    return err;
//                }
//
//                if (!passwordMatched){
//                    return done(null, false)
//                }
//
//                 return done(null, user)
//             });
//         });
// }));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


router.route('/login')
    .get(defaultController.login)
    .post(passport.authenticate('local',{
        successRedirect : '/admin',
        failureRedirect : '/login',
        failureFlash : true,
        successFlash : true,
        session : true
    }),defaultController.loginPost);



router.route('/register')
    .get(defaultController.register)
    .post(defaultController.registerPost);

module.exports = router;