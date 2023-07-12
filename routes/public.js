const express = require('express');
const { getProducts, getProductDetail } = require('../controllers/public');

const router = express.Router();

router.get('/', getProducts);

router.get('/products/:productID', getProductDetail);

module.exports = router;
