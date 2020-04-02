const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const User = require('../models/UserModel').User;
const bcrypt = require('bcryptjs');
module.exports = {

    index : async (req,res) => {

        const posts = await Post.find();
        const category = await Category.find();

        res.render('default/index',{posts : posts,category : category});
    },

    login : (req,res) => {
        res.render('default/login');
    },

    loginPost : (req,res) => {
        res.send('succsss');
    },

    register : (req,res) => {
        res.render('default/register');
    },

    registerPost : (req,res) => {
        let error = [];

        if (!req.body.firstName){
            error.push({message : "First name is required"});
        }

        if (!req.body.lastName){
            error.push({message : "lastName is required"});
        }

        if (!req.body.email){
            error.push({message : "email is required"});
        }

        if (req.body.password != req.body.password_confirm){
            error.push({message : "Password not match"});
        }

        if (error.length > 0){
            res.render('default/register',{
                error : error,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email,
            });
        }else {
            User.findOne({email: req.body.email})
                .then(user => {
                   if (user){
                       req.flash('error-message','Email already taken');
                       req.redirect('/login');
                   }else {
                       const newUser = new User(req.body);
                        bcrypt.genSalt(10,(err, salt) => {
                            bcrypt.hash(newUser.password,salt,(err,hash) => {
                                newUser.password = hash;
                                newUser.save()
                                    .then(user => {
                                        req.flash('success-message','Account Created');
                                        res.redirect('/login');
                                    });
                            });
                        });
                   }
                });
        }

    },

};