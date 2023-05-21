const express = require('express');
const path = require('path');

require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const {get404} = require('./controllers/error');
const bodyParser = require('body-parser');

const app = express();

// globally setting values across our app
app.set('view engine', 'ejs');
// app.set('views', 'views'); // set automatically. no need to call explicitly

app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// handling routes
// always place more specific routes on the top
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(8080);
