const express = require('express');
const bodyParser = require('body-parser');
const {
	getAddProducts,
	postAddProducts,
} = require('../controllers/products');

const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

router.get('/products', getAddProducts);

router.post('/products', postAddProducts);

module.exports = router;