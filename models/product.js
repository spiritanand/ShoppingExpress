const fs = require('fs');
const path = require('path');
const { v4 : uuidv4 } = require('uuid');
const { rootPath } = require('../utils/path');
const Cart = require('./cart');
const getExistingItem = require('../utils/getExisitingItem');

const dbPath = path.join(rootPath, 'data', 'products.json');

const getProductsFromFile = (cb) => {
	fs.readFile(dbPath, (err, data) => {
		if (err) {
			console.log({ err });
			cb([]);
		} else
			cb(JSON.parse(data));
	});
};

function writeProducts(products) {
	fs.writeFile(dbPath, JSON.stringify(products), err => console.log(err));
}

module.exports = class Product {
	constructor(name, imageURL, price, quantity, description, id = null) {
		this.name = name;
		this.imageURL = imageURL;
		this.price = price;
		this.quantity = quantity;
		this.description = description;
		this.id = id;
	}

	save() {
		getProductsFromFile(products => {
			if (this.id) {
				const existingProductIndex = products.findIndex(product => product.id === this.id);
				products[existingProductIndex] = this;
			} else {
				this.id = uuidv4();
				products.push(this);
			}

			writeProducts(products);
		});
	}

	static deleteById(id) {
		getProductsFromFile(products => {
			const {
				existingItem,
				existingItemIndex,
			} = getExistingItem(products, id);

			Cart.removeProduct(id, existingItem.price);

			products.splice(existingItemIndex, 1);
			writeProducts(products);
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static fetchById(id, cb) {
		getProductsFromFile(products => {
			const productItem = products.find(product => product.id === id);
			cb(productItem);
		});
	}
};