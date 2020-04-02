const {globalVariables}  = require('./config/configaration');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverirde = require('method-override');
const {selectOption} = require('./config/costomFunctions');
const ImageUpload = require('express-fileupload');
const passportLocal = require('passport');

const {mongoDburl,PORT} = require('./config/configaration');

const app = express();


/*config mongoose to connect mongodb*/
mongoose.connect(mongoDburl,{useNewUrlParser: true})
    .then(response => {
        console.log('Mongodb connect successfully')
    })
    .catch(err => {
        console.log('Mongodb connect failed')
    });

/*configure express*/
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'public')));


/*flash and session*/
app.use(session({
    secret : 'anysecret',
    saveUninitialized : true,
    resave : true,
}));

app.use(flash());
app.use(globalVariables);

/* file upload midlleware */
app.use(ImageUpload());



/*set view engine to use handlebars */
app.engine('handlebars',hbs({defaultLayout: 'default',helpers : {select : selectOption}}));
app.set('view engine','handlebars');


/*mehod overirde middleware*/
app.use(methodOverirde('newMethod'));

/*routes*/
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/',defaultRoutes);
app.use('/admin',adminRoutes);




app.listen(PORT, () => {
   console.log(`server is running on port ${PORT}`);
});