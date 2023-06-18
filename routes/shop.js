const express = require('express');
const {
  getProducts,
  getCart,
  getCheckout,
  getProductDetail,
  postAddToCart,
  postRemoveProductFromCart,
  postDecreaseProductFromCart,
  getOrders,
  postCheckout,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getProducts);

router.get('/products/:productId', getProductDetail);

router.get('/cart', getCart);
router.post('/cart', postAddToCart);

router.post('/cart/add', postAddToCart);
router.post('/cart/decrease', postDecreaseProductFromCart);
router.post('/cart/remove', postRemoveProductFromCart);

router.get('/checkout', getCheckout);
router.post('/checkout', postCheckout);

router.get('/orders', getOrders);

module.exports = router;
