const express = require('express');
// const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
	title   : 'Shopping Express',
	path    : '/home',
	products: []
  });
  // res.sendFile(path.join(__dirname, '..','views', 'index.html'));
  // next(); // allows req to continue to the next middleware
});

module.exports = router;
