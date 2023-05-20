const fs = require('fs');
const path = require('path');
const { rootPath } = require('../utils/path');
const Product = require('./product');
const getExisitingItem = require('../utils/getExisitingItem');

const cartPath = path.join(rootPath, 'data', 'cart.json');

const getCartFromFile = (cb) => {
	fs.readFile(cartPath, (err, data) => {
		if (err)
			return cb({});

		return cb(JSON.parse(data));
	});
};

function writeCart(cart) {
	fs.writeFile(cartPath, JSON.stringify(cart), err => console.log(err));
}

module.exports = class Cart {
	static addProduct(id, productPrice) {
		// fetch previous cart or create empty cart
		fs.readFile(cartPath, (err, data) => {
			let cart = {
				products : [],
				total : 0,
			};
			if (!err) cart = JSON.parse(data);

			// 	analyze cart
			const {
				existingItemIndex : existingProductIndex,
				existingItem : existingProduct,
			} = getExisitingItem(cart?.products, id);
			let updatedProduct;

			if (existingProduct) {
				// increase by 1 if product exists
				updatedProduct = {
					...existingProduct,
					quantity : existingProduct.quantity + 1,
					price : +productPrice,
				};
				// replacing old product obj with the updated product
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				// create new product object if product did not exist
				updatedProduct = {
					id,
					quantity : 1,
					price : +productPrice,
				};
				// add new product object in products array
				cart.products = [...cart.products, updatedProduct];
			}
			cart.total += +productPrice;

			// 	updating the cart in the db
			writeCart(cart);
		});
	}

	static removeProduct(id, productPrice) {
		getCartFromFile(cart => {
			const {
				existingItemIndex : existingProductIndex,
				existingItem : existingProduct,
			} = getExisitingItem(cart?.products, id);

			if (existingProductIndex < 0) return;

			cart?.products?.splice(existingProductIndex, 1);
			cart.total -= +productPrice * +existingProduct?.quantity;

			writeCart(cart);
		});
	}

	static decreaseProduct(id, productPrice) {
		getCartFromFile(cart => {
			const {
				existingItemIndex : existingProductIndex,
				existingItem : existingProduct,
			} = getExisitingItem(cart?.products, id);

			if (existingProductIndex < 0) return;

			if (existingProduct.quantity === 1)
				return this.removeProduct(id, productPrice);

			existingProduct.quantity -= 1;
			cart.products[existingProductIndex] = existingProduct;
			cart.total -= +productPrice;

			writeCart(cart);
		});
	}

	static updateTotal(id, updatedPrice) {
		getCartFromFile(cart => {
			const {
				existingItem,
				existingItemIndex,
			} = getExisitingItem(cart.products, id);

			if (existingItemIndex < 0) return;

			cart.total -= +existingItem.price * existingItem.quantity;
			cart.total += +updatedPrice * existingItem.quantity;
			cart.products[existingItemIndex] = {
				...cart.products[existingItemIndex],
				price : updatedPrice,
			};

			writeCart(cart);
		});
	}

	static fetchCart(cb) {
		getCartFromFile(cb);
	}
};