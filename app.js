const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const runMongo = require('./utils/database');
const User = require('./models/user');
const { ERROR_MESSAGES } = require('./constants/constants');
const { handleCustomDBError } = require('./utils/handleErrors');

const app = express();
const PORT = 8080;

// globally setting values across our app
app.set('view engine', 'ejs');
// app.set('views', 'views'); // set automatically. no need to call explicitly

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// connect to database
runMongo()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`Now listening on PORT: ${PORT}.`);
    app.listen(PORT);

    // const user = new User('spirit', 'spirit@email.com');
    // return user.save();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);
  });

// middleware for storing user
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('649dc1ea922cb55a934f277c');

    if (!user) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);

    req.user = user;

    next();
  } catch (e) {
    handleCustomDBError(e, res);
  }
});

// handling routes
// always place more specific routes on the top
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);
