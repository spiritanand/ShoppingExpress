const Product = require('../models/product');
const CartItem = require('../models/cartItem');
const { STATUS } = require('../constants/constants');
const Order = require('../models/order');

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
  const products = await Product.findAll();

  res.render('shop/index', {
    title: 'Shopping Express',
    path: '/home',
    products,
  });
};

exports.getProductDetail = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId);

  res.render('shop/product-detail', {
    title: `Product Detail - ${product?.name}`,
    path: '/product-detail',
    product,
  });
};

exports.getCart = async (req, res) => {
  const cart = await req.user?.getCart();
  const products = await cart?.getProducts();

  const totalPrice = getTotalPrice(products);

  res.render('shop/cart', {
    title: 'Shopping Cart',
    path: '/cart',
    products,
    totalPrice,
  });
};

exports.postAddToCart = async (req, res) => {
  const productId = req.body?.productId;

  const cart = await req.user?.getCart();
  const products = await cart?.getProducts({ where: { id: productId } });

  let product = products[0];
  let updatedQuantity = 1;

  if (product) {
    updatedQuantity = product.cartItem.quantity + 1;
  } else {
    product = await Product.findByPk(productId);
  }

  cart.addProduct(product, { through: { quantity: updatedQuantity } });

  res.redirect('/cart');
};

exports.postDecreaseProductFromCart = async (req, res) => {
  const productId = req.body?.productId;

  const cart = await req.user?.getCart();
  const products = await cart?.getProducts({ where: { id: productId } });
  const product = products[0];

  const updatedQuantity = product.cartItem.quantity - 1;

  if (updatedQuantity >= 1) {
    await cart.addProduct(product, { through: { quantity: updatedQuantity } });
  } else {
    await CartItem.destroy({ where: { id: product.cartItem.id } });
  }

  res.redirect('/cart');
};

exports.postRemoveProductFromCart = async (req, res) => {
  const productId = req.body?.productId;

  const cart = await req.user?.getCart();
  const products = await cart?.getProducts({ where: { id: productId } });
  const product = products[0];

  await product.cartItem.destroy();

  res.redirect('/cart');
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    title: 'Checkout',
    path: '/checkout',
  });
};

exports.postCheckout = async (req, res) => {
  const cart = await req.user?.getCart();
  const products = await cart?.getProducts();

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
};

exports.postCancelOrder = async (req, res) => {
  const orderId = req.body?.orderId;

  const order = await Order.findOne({ where: { id: orderId } });

  await order.update({ status: STATUS.CANCELLED });

  res.redirect('/orders');
};

exports.getOrders = async (req, res) => {
  const orders = await req.user?.getOrders();

  res.render('shop/orders', {
    title: 'Orders',
    path: '/orders',
    orders,
  });
};
