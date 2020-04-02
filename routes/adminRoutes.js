const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require('../config/costomFunctions');

router.all('/*',isUserAuthenticated, (req,res,next) => {

   req.app.locals.layout = 'admin';
   next();
});


router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts);

router.route('/posts/create')
    .get(adminController.postcreate)
    .post(adminController.submitpost);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .put(adminController.editPostSubmit);

router.route('/post/delete/:id')
    .delete(adminController.deletePost);



router.route('/category')
    .get(adminController.getcategory)
    .post(adminController.createCategory);

router.route('/category/edit/:id')
    .get(adminController.editcategorygetRoute)
    .post(adminController.editCategoryPostRoute);



module.exports = router;