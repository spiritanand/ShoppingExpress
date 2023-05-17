const Product = require('../models/product');

exports.getAddProducts = (req, res) => {
	res.render('admin/add-product', {
		title : 'Add Product',
		path : '/admin/add-product',
	});
};

exports.postAddProducts = (req, res) => {
	const {
		name,
		imageURL,
		price,
		quantity,
	} = req.body;
	const product = new Product(name, imageURL, price, quantity);
	product.save();
	res.redirect('/');
};

exports.getProducts = (req, res) => {
	Product.fetchAll(products => {
		res.render('admin/products', {
			title : 'Products (Admin)',
			path : '/admin/products',
			products,
		});
	});
};