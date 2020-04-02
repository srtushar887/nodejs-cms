module.exports = {
  mongoDburl : 'mongodb://localhost:27017/cms_tutorial',
  PORT : process.env.PORT || 3000,
  globalVariables : (req, res, next) => {
    res.locals.success_message = req.flash('success-message');
    res.locals.error_message = req.flash('error-message');

    next();
  }
};