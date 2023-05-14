const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');

const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

router.get('/products', (req, res) => {
  res.render('add-product', {
	title: 'Add Products',
	path : '/admin/products'
  });
  // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
});

router.post('/products', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;