const express = require('express');
const { getProducts } = require('../controllers/products');
// const path = require('path');

const router = express.Router();

router.get('/', getProducts);
// res.sendFile(path.join(__dirname, '..','views', 'index.html')); // sending
// next(); // allows req to continue to the next middleware

module.exports = router;
