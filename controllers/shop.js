const Product = require('../models/product');

exports.getProducts = (req, res) => {
	Product.fetchAll(products => {
		res.render('shop/index', {
			title : 'Shopping Express',
			path : '/home',
			products,
		});
	});
};

exports.getCart = (req, res) => {
	res.render('shop/cart', {
		title : 'Shopping Cart',
		path : '/cart',
		cart : [],
	});
};

exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		title : 'Checkout',
		path : '/checkout',
	});
};
