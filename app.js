const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const sequelize = require('./utils/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/users');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

const app = express();

// globally setting values across our app
app.set('view engine', 'ejs');
// app.set('views', 'views'); // set automatically. no need to call explicitly

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  req.user = await User.findByPk(1);
  next();
});

// handling routes
// always place more specific routes on the top
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

/**
 * An (admin) user can create multiple products.So a product belongs to a single user. A user can create
 * multiple products
 */
Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);

/**
 * A single cart belongs to a single user
 */
Cart.belongsTo(User);
User.hasOne(Cart);

/**
 * A cart can have multiple products, and a product can be associated with multiple carts
 */
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

(async () => {
  try {
    await sequelize.sync();
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
})();
