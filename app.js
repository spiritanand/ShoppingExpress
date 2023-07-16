const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf'); // csurf has been deprecated, but still works :)
// Also, I could not get any other csrf package to work :X

require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const { get404 } = require('./controllers/error');
const runMongo = require('./utils/database');
const User = require('./models/user');
const { isAdmin, isLoggedIn } = require('./middlewares/isAuth');
const { handleCustomDBError } = require('./utils/handleErrors');

const app = express();
const PORT = 8080;

const store = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

// globally setting values across our app
app.set('view engine', 'ejs');
// app.set('views', 'views'); // set automatically. no need to call explicitly

// To parse the body of incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csurf());

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

// general middleware for storing user
app.use(async (req, res, next) => {
  res.locals.isAdmin = req?.session?.user?.type === 'admin';
  res.locals.csrfToken = req.csrfToken();

  req.user = await User.findById(req?.session?.user?._id);
  res.locals.isUserLoggedIn = Boolean(req.user);

  res.locals.path = req.path;
  next();
});

// handling routes
app.use(authRoutes);
app.use(publicRoutes);
app.use(isLoggedIn, shopRoutes);
app.use('/admin', isAdmin, adminRoutes);
// catch all routes
app.use(get404);
app.use((e, req, res, next) => {
  handleCustomDBError(e, res);
});
