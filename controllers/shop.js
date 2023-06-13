const Product = require('../models/product');

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
  const id = req.params.productId;
  const product = await Product.findByPk(id);

  res.render('shop/product-detail', {
    title: `Product Detail - ${product?.name}`,
    path: '/product-item',
    product,
  });
};

exports.getCart = async (req, res) => {
  const cart = await req.user.getCart();
  const products = cart.getProducts();

  res.render('shop/cart', {
    title: 'Shopping Cart',
    path: '/cart',
    cart: products,
  });

  //     const enrichedCart = { ...cart };
  //     for (const product of products) {
  //       const { existingItemIndex } = getExistingItem(
  //         cart?.products,
  //         product?.id
  //       );
  //       if (existingItemIndex >= 0)
  //         enrichedCart.products[existingItemIndex] = {
  //           ...enrichedCart.products[existingItemIndex],
  //           product,
  //         };
  //     }
};

exports.postAddToCart = async (req, res) => {
  const productId = req.body?.productId;

  const cart = await req.user.getCart();
};

exports.postDecreaseProductFromCart = (req, res) => {
  // const id = req.body?.productId;
  // Product.fetchById(id, (product) => {
  //   Cart.decreaseProduct(id, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postRemoveProductFromCart = (req, res) => {
  // const id = req.body?.productId;
  // Product.fetchById(id, (product) => {
  //   Cart.removeProduct(id, product.price);
  //   res.redirect('/cart');
  // });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    title: 'Checkout',
    path: '/checkout',
  });
};
