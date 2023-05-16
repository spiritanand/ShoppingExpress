const Product = require('../models/product');

exports.getProducts = (req, res) => {
	Product.fetchAll(products => {
		res.render('index', {
			title : 'Shopping Express',
			path : '/home',
			products,
		});
	});
};

exports.getAddProducts = (req, res) => {
	res.render('add-product', {
		title : 'Add Products',
		path : '/admin/products',
	});
};

exports.postAddProducts = (req, res) => {
	const {
		name,
		price,
		quantity,
	} = req.body;
	const product = new Product(name, price, quantity);
	product.save();
	res.redirect('/');
};