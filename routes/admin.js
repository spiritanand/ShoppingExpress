const express = require('express');
const bodyParser = require('body-parser');
const {
	getAddProducts,
	postAddProducts,
} = require('../controllers/admin');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended : true }));

router.get('/add-product', getAddProducts);

router.post('/add-product', postAddProducts);

router.get('products');

module.exports = router;