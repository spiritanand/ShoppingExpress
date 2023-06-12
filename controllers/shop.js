const Product = require('../models/product');
const { handleSequelizeError } = require('./error');

/**
 * Shows the homepage
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    res.render('shop/index', {
      title: 'Shopping Express',
      path: '/home',
      products,
    });
  } catch (e) {
    handleSequelizeError(e, res);
  }
};

exports.getProductDetail = async (req, res) => {
  const id = req.params.productId;
  try {
    const product = await Product.findByPk(id);

    res.render('shop/product-detail', {
      title: `Product Detail - ${product?.name}`,
      path: '/product-item',
      product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = (req, res) => {
  // Cart.fetchCart((cart) => {
  //   Product.fetchAll((products) => {
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
  //
  //     res.render('shop/cart', {
  //       title: 'Shopping Cart',
  //       path: '/cart',
  //       cart: enrichedCart,
  //     });
  //   });
  // });
};

exports.postAddToCart = (req, res) => {
  // const id = req.body?.productId;
  // Product.fetchById(id, (product) => {
  //   Cart.addProduct(id, product.price);
  //   res.redirect('/cart');
  // });
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
