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

exports.getProductDetail = (req, res) => {
	const id = req.params.productId;
	Product.fetchById(id, product => {
		console.log({ product });
		res.render('shop/product-detail', {
			title : `Product Detail - ${product.name}`,
			path : '/product-item',
			product,
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

exports.postCart = (req, res) => {
	const id = req.body?.productId;
	console.log({ id });
	res.redirect('/cart');
};

exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		title : 'Checkout',
		path : '/checkout',
	});
};
