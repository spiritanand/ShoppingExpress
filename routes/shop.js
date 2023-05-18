const express = require('express');
const {
	getProducts,
	getCart,
	getCheckout,
	getProductDetail,
	postCart,
} = require('../controllers/shop');
const bodyParser = require('body-parser');
// const path = require('path');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/', getProducts);
// res.sendFile(path.join(__dirname, '..','views', 'index.html')); // sending
// next(); // allows req to continue to the next middleware

router.get('/products/:productId', getProductDetail);

router.get('/cart', getCart);
router.post('/cart', postCart);

router.get('checkout', getCheckout);

module.exports = router;
