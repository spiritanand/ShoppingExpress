const express = require('express');
const {
	getProducts,
	getCart,
	getCheckout,
} = require('../controllers/shop');
// const path = require('path');

const router = express.Router();

router.get('/', getProducts);
// res.sendFile(path.join(__dirname, '..','views', 'index.html')); // sending
// next(); // allows req to continue to the next middleware

router.get('/cart', getCart);

router.get('checkout', getCheckout);

module.exports = router;
