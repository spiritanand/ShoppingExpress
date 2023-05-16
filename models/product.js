const fs = require('fs');
const path = require('path');
const { rootPath } = require('../utils/path');
const products = [];

const dbPath = path.join(rootPath, 'data', 'products.json');

const getProductsFromFile = (cb) => {
	fs.readFile(dbPath, (err, fileContent) => {
		if (err) {
			console.log({ err });
			cb([]);
		} else
			cb(JSON.parse(fileContent));
	});
};

module.exports = class Product {
	constructor(name, price, quantity) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
	}

	save() {
		getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(dbPath, JSON.stringify(products), err => console.log(err));
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}
};