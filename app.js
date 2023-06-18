const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

const sequelize = require('./utils/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

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

/**
 * An order belongs to a User and the user has many orders
 */
Order.belongsTo(User);
User.hasMany(Order);

/**
 * An Order can have multiple products. It is easy to draw an analogy from Cart and CartItem when looking at
 * Order and OrderItem
 */
Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

(async () => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
})();
