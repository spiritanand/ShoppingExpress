const Product = require('../models/product');
const CartItem = require('../models/cartItem');
const { STATUS, ERROR_MESSAGES } = require('../constants/constants');
const Order = require('../models/order');
const { handleCustomSequelizeError } = require('../utils/handleErrors');

const getTotalPrice = (products) =>
  products?.reduce((total, product) => {
    const { quantity } = product.cartItem;
    const productTotalPrice = product.price * quantity;

    return total + productTotalPrice;
  }, 0);

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
    const cart = await req.user?.getCart();
    const products = await cart?.getProducts();

    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    const totalPrice = getTotalPrice(products);

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
    const cart = await req.user?.getCart();
    const products = await cart?.getProducts({ where: { id: productId } });

    if (!products) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    let product = products[0];
    let updatedQuantity = 1;

    if (product) {
      updatedQuantity = product.cartItem.quantity + 1;
    } else {
      product = await Product.findByPk(productId);
    }

    cart.addProduct(product, { through: { quantity: updatedQuantity } });

    res.redirect('/cart');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postDecreaseProductFromCart = async (req, res) => {
  const productID = req.body?.productID;

  try {
    const cart = await req.user?.getCart();
    const products = await cart?.getProducts({ where: { id: productId } });
    const product = products[0];

    if (!products) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    const updatedQuantity = product.cartItem.quantity - 1;

    if (updatedQuantity >= 1) {
      await cart.addProduct(product, {
        through: { quantity: updatedQuantity },
      });
    } else {
      await CartItem.destroy({ where: { id: product.cartItem.id } });
    }

    res.redirect('/cart');
  } catch (e) {
    handleCustomSequelizeError(e, res);
  }
};

exports.postRemoveProductFromCart = async (req, res) => {
  const productID = req.body?.productID;
  try {
    const cart = await req.user?.getCart();
    const products = await cart?.getProducts({ where: { id: productId } });
    const product = products[0];

    if (!products) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    if (!cart) throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);

    await product.cartItem.destroy();

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
