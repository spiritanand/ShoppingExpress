const Product = require('../models/product');
const Cart = require('../models/cart');
const getExistingItem = require('../utils/getExisitingItem');

// Shows the homepage
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
			let enrichedCart = { ...cart };
			for (product of products) {
				const {
					existingItemIndex,
				} = getExistingItem(cart?.products, product?.id);
				if (existingItemIndex >= 0)
					enrichedCart.products[existingItemIndex] = {
						...enrichedCart.products[existingItemIndex],
						product,
					};
			}

			res.render('shop/cart', {
				title : 'Shopping Cart',
				path : '/cart',
				cart : enrichedCart,
			});
		});
	});
};

exports.postAddToCart = (req, res) => {
	const id = req.body?.productId;
	Product.fetchById(id, product => {
		Cart.addProduct(id, product.price);
		res.redirect('/cart');
	});
};

exports.postDecreaseProductFromCart = (req, res) => {
	const id = req.body?.productId;
	Product.fetchById(id, product => {
		Cart.decreaseProduct(id, product.price);
		res.redirect('/cart');
	});
};

exports.postRemoveProductFromCart = (req, res) => {
	const id = req.body?.productId;
	Product.fetchById(id, product => {
		Cart.removeProduct(id, product.price);
		res.redirect('/cart');
	});
};

exports.getCheckout = (req, res) => {
	res.render('shop/checkout', {
		title : 'Checkout',
		path : '/checkout',
	});
};
