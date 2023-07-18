const express = require('express');
const {
  getCart,
  getCheckout,
  postAddToCart,
  postRemoveProductFromCart,
  postDecreaseProductFromCart,
  getOrders,
  postCheckout,
  postCancelOrder,
} = require('../controllers/shop');

const router = express.Router();

router.get('/cart', getCart);
router.post('/cart', postAddToCart);

router.post('/cart/add', postAddToCart);
router.post('/cart/decrease', postDecreaseProductFromCart);
router.post('/cart/remove', postRemoveProductFromCart);

router.post('/checkout', postCheckout);

router.get('/orders', getOrders);
router.post('/cancel-order', postCancelOrder);

module.exports = router;
