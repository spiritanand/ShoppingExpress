const Product = require('../models/product');
const { ERROR_MESSAGES } = require('../constants/constants');
const Order = require('../models/order');
const { handleCustomSequelizeError } = require('../utils/handleErrors');

/**
 * Shows the homepage
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.render('shop/index', {
      title: 'Shopping Express',
      path: '/home',
      products,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.getProductDetail = async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findById(productID);

    res.render('shop/product-detail', {
      title: `Product Detail - ${product?.name}`,
      path: '/product-detail',
      product,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.getCart = async (req, res) => {
  try {
    const { products, totalPrice } = await req.user.getEnrichedCart();

    res.render('shop/cart', {
      title: 'Shopping Cart',
      path: '/cart',
      products,
      totalPrice,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
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
    handleCustomSequelizeError(e, res);
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
    handleCustomSequelizeError(e, res);
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
    handleCustomSequelizeError(e, res);
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
    const orders = await Order.getAllByUserID(req.user.id);

    res.render('shop/orders', {
      title: 'Orders',
      path: '/orders',
      orders,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postCheckout = async (req, res) => {
  try {
    const cart = await req.user?.cart;

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    const order = new Order(req.user.id, cart);

    const enrichedCart = await req.user.getEnrichedCart();
    await order.create(enrichedCart);
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postCancelOrder = async (req, res) => {
  const orderID = req.body?.orderID;
  try {
    const order = await Order.cancel(orderID);

    if (!order) throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);

    res.redirect('/orders');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};
