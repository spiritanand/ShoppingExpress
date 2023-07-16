const Product = require('../models/product');
const User = require('../models/user');
const { ERROR_MESSAGES, STATUS } = require('../constants/constants');
const Order = require('../models/order');

/**
 * Shows the homepage
 */
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.session?.user?._id)
      .populate('cart.productID')
      .exec();

    const cart = user?.cart;

    await user.save(); // to fetch the totalPrice

    res.render('shop/cart', {
      title: 'Shopping Cart',
      cart,
      totalPrice: user.totalPrice,
    });
  } catch (e) {
    next(e);
  }
};

exports.postAddToCart = async (req, res, next) => {
  const productID = req.body?.productID;

  try {
    await req.user.addToCart(productID);

    res.redirect('/cart');
  } catch (e) {
    next(e);
  }
};

exports.postDecreaseProductFromCart = async (req, res, next) => {
  const productID = req.body?.productID;

  try {
    const cart = await req.user?.cart;

    await req.user.decreaseFromCart(productID);

    res.redirect('/cart');
  } catch (e) {
    next(e);
  }
};

exports.postRemoveProductFromCart = async (req, res, next) => {
  const productID = req.body?.productID;

  try {
    await req.user.removeFromCart(productID);

    res.redirect('/cart');
  } catch (e) {
    next(e);
  }
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    title: 'Checkout',
    path: '/checkout',
  });
};

exports.getOrders = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const orders = await Order.find({ userID: _id });

    res.render('shop/orders', {
      title: 'Orders',
      orders,
    });
  } catch (e) {
    next(e);
  }
};

exports.postCheckout = async (req, res, next) => {
  try {
    const user = await User.findById(req.session?.user?._id)
      .populate('cart.productID')
      .exec();

    const cart = user?.cart;

    const { _id } = user;

    user.save(); // to fetch the totalPrice

    const order = new Order({
      userID: _id,
      cart,
      totalPrice: user.totalPrice,
      status: STATUS.SUCCESS,
    });

    await order.save();

    await Product.updateQuantityAfterOrder(cart);

    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    next(e);
  }
};

exports.postCancelOrder = async (req, res, next) => {
  const orderID = req.body?.orderID;
  try {
    const order = await Order.cancel(orderID);

    if (!order) throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);

    await Product.updateQuantityAfterOrder(order.cart, false);

    res.redirect('/orders');
  } catch (e) {
    next(e);
  }
};
