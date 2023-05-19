const express = require('express');
const bodyParser = require('body-parser');
const {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	postDeleteProduct,
} = require('../controllers/admin');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended : true }));

router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);
router.get('/edit-product/:productId', getEditProduct);
router.post('/edit-product', postEditProduct);
router.post('/delete-product', postDeleteProduct);
router.get('/products', getProducts);

module.exports = router;