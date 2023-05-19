const Product = require('../models/product');
const Cart = require('../models/cart');
const getExistingItem = require('../utils/getExisitingItem');

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
	Cart.fetchCart(cart => {
		Product.fetchAll(products => {
			let enrichedCart;
			for (product of products) {
				const {
					existingItemIndex,
					existingItem,
				} = getExistingItem(cart.products, product.id);
				// if (existingItemIndex >= 0)
			}

			res.render('shop/cart', {
				title : 'Shopping Cart',
				path : '/cart',
				cart,
			});
		});
	});
};

exports.postCart = (req, res) => {
	const id = req.body?.productId;
	Product.fetchById(id, product => {
		Cart.addProduct(id, product.price);
		res.redirect('/cart');
	});
};

exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		title : 'Checkout',
		path : '/checkout',
	});
};
