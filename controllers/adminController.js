const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const {isEmpty} = require('../config/costomFunctions');

module.exports = {

    index : (req,res) => {
        res.render('admin/index');
    },

    getPosts : (req,res) => {
        Post.find()
            .populate('category')
            .then(posts => {
            res.render('admin/posts/index',{posts: posts});
        });

    },

    submitpost : (req,res) => {
        const commentallow = req.body.allowcomments ? true : false;

        //check for input file
        let filename = '';
        if (!isEmpty(req.files)){
            let file = req.files.uploadfile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir+filename, (err) => {
                if (err){
                    throw err;
                }
            })
        }

        const newPost = new Post({
            title : req.body.title,
            description : req.body.description,
            allowcomments : commentallow,
            status : req.body.status,
            category : req.body.category,
            file : `/public/uploads/${filename}`
        });
        newPost.save().then(post => {
            console.log(post);
            req.flash('success-message','Post created Successfully');
            res.redirect('/admin/posts');
        });

    },

    postcreate : (req,res) => {

        Category.find().then(cats => {
            res.render('admin/posts/create',{categories:cats});
        });
    },

    editPost : (req,res) => {
        const id = req.params.id;
        Post.findById(id)
            .then(post => {
                Category.find().then(cats => {
                    res.render('admin/posts/edit',{post : post,categories : cats})
                });
        });
    },


    editPostSubmit : (req,res) => {
        const commentallow = req.body.allowcomments ? true : false;

        const id = req.params.id;
        Post.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.status = req.body.status;
                post.category = req.body.category;
                post.allowcomments = commentallow;
                post.description = req.body.description;
                post.save().then(updatePost =>{
                   req.flash('success-message',`The post ${updatePost.title} has been updated`);
                    res.redirect('/admin/posts');
                });

            });


    },

    deletePost : (req,res) => {
        Post.findByIdAndDelete(req.params.id)
            .then(deletedPosts => {
                req.flash('success-message',`The post ${deletedPosts.title} has been deleted`);
                res.redirect('/admin/posts')
            })
    },



    getcategory : (req,res) => {
        Category.find().then(categories => {
            res.render('admin/category/index',{categories: categories});
        });
    },

    createCategory : (req,res) => {
        var categoryName = req.body.name;
        if (categoryName){
            const newCategory = new Category({
                title : categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            })
        }
    },


    editcategorygetRoute : async (req,res) => {
        const catid = req.params.id;
      const cats = await Category.find();
      Category.findById(catid).then(cat => {
          res.render('admin/category/edit',{category : cat, categories : cats})
      })
    },


    editCategoryPostRoute : (req, res) => {
      const catId = req.params.id;
      const newTitle = req.body.name;

      if (newTitle){
          Category.findById(catId)
              .then(category => {
                  category.title = newTitle;
                  category.save()
                      .then(update => {
                          res.status(200).json({url : '/admin/category'});
                      });

              })
      }

    },


};