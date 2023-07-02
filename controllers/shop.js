const Product = require('../models/product');
const { STATUS, ERROR_MESSAGES } = require('../constants/constants');
const Order = require('../models/order');
const { handleCustomSequelizeError } = require('../utils/handleErrors');

/**
 * Shows the homepage
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();

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
    const cart = await req.user?.cart;
    let totalPrice = 0;

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    const products = await Promise.all(
      cart.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productID);

        totalPrice += product.price * cartItem.quantity;

        return {
          ...product,
          quantity: cartItem.quantity,
        };
      })
    );

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

exports.postCheckout = async (req, res) => {
  try {
    const cart = await req.user?.getCart();
    const products = await cart?.getProducts();

    if (!products) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    const totalPrice = getTotalPrice(products);

    const order = await req.user?.createOrder({
      totalPrice,
      status: STATUS.SUCCESS,
    });

    products.forEach((product) => {
      order.addProduct(product, {
        through: { quantity: product.cartItem.quantity },
      });
    });

    await cart.setProducts(null);

    res.redirect('/orders');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postCancelOrder = async (req, res) => {
  const orderId = req.body?.orderId;
  try {
    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);

    await order.update({ status: STATUS.CANCELLED });

    res.redirect('/orders');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user?.getOrders({ include: ['products'] });

    if (!orders) throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);

    res.render('shop/orders', {
      title: 'Orders',
      path: '/orders',
      orders,
    });
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};
