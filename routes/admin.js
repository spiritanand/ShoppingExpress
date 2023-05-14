const express = require('express');
const path = require('path')

const router = express.Router();

router.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
});

router.post('/products', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;