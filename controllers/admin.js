const Product = require('../models/product');
const {
	render404View,
} = require('./error');
const Cart = require('../models/cart');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		title : 'Add Product',
		path : '/admin/add-product',
		product : {},
		editMode : false,
	});
};

exports.postAddProduct = (req, res) => {
	const {
		name,
		imageURL,
		price,
		quantity,
		description,
	} = req.body;
	const product = new Product(name, imageURL, price, quantity, description);
	product.save();
	res.redirect('/');
};

exports.getEditProduct = (req, res) => {
	const id = req.params?.productId;
	const editMode = Boolean(req.query?.edit);
	Product.fetchById(id, product => {
		if (!product || !editMode)
			return render404View(res);

		res.render('admin/edit-product', {
			title : `Edit - ${product.name}`,
			path : '/admin/edit-product',
			product,
			editMode,
		});
	});
};

exports.postEditProduct = (req, res) => {
	const {
		id,
		name,
		imageURL,
		price,
		quantity,
		description,
	} = req.body;
	const product = new Product(name, imageURL, price, quantity, description, id);
	product.save();
	Cart.updateTotal(id, price);
	res.redirect(`/products/${id}`);
};

exports.postDeleteProduct = (req, res) => {
	const { id } = req.body;
	Product.deleteById(id);
	res.redirect('/admin/products');
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