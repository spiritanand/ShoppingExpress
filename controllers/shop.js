const Product = require('../models/product');
const User = require('../models/user');
const { ERROR_MESSAGES, STATUS } = require('../constants/constants');
const Order = require('../models/order');
const { handleCustomDBError } = require('../utils/handleErrors');

/**
 * Shows the homepage
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.render('shop/index', {
      title: 'Shopping Express',
      products,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.getProductDetail = async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findById(productID);

    res.render('shop/product-detail', {
      title: `Product Detail - ${product?.name}`,
      product,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById('649dc1ea922cb55a934f277c')
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
    handleCustomDBError(e, res);
  }
};

exports.postAddToCart = async (req, res) => {
  const productID = req.body?.productID;

  try {
    const cart = await req.user?.cart;

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    await req.user.addToCart(productID);

    res.redirect('/cart');
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.postDecreaseProductFromCart = async (req, res) => {
  const productID = req.body?.productID;

  try {
    const cart = await req.user?.cart;

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    await req.user.decreaseFromCart(productID);

    res.redirect('/cart');
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.postRemoveProductFromCart = async (req, res) => {
  const productID = req.body?.productID;

  try {
    const cart = await req.user?.cart;

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    await req.user.removeFromCart(productID);

    res.redirect('/cart');
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    title: 'Checkout',
    path: '/checkout',
  });
};

exports.getOrders = async (req, res) => {
  try {
    const { _id } = req.user;

    const orders = await Order.find({ userID: _id });

    res.render('shop/orders', {
      title: 'Orders',
      orders,
    });
  } catch (e) {
    handleCustomDBError(e, res);
  }
};

exports.postCheckout = async (req, res) => {
  try {
    const user = await User.findById('649dc1ea922cb55a934f277c')
      .populate('cart.productID')
      .exec();

    const cart = user?.cart;

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

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
    handleCustomDBError(e, res);
  }
};

exports.postCancelOrder = async (req, res) => {
  const orderID = req.body?.orderID;
  try {
    const order = await Order.cancel(orderID);

    if (!order) throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);

    await Product.updateQuantityAfterOrder(order.cart, false);

    res.redirect('/orders');
  } catch (e) {
    handleCustomDBError(e, res);
  }
};
