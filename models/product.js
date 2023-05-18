const fs = require('fs');
const path = require('path');
const { v4 : uuidv4 } = require('uuid');
const { rootPath } = require('../utils/path');

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
	constructor(name, imageURL, price, quantity) {
		this.name = name;
		this.imageURL = imageURL;
		this.price = price;
		this.quantity = quantity;
	}

	save() {
		this.id = uuidv4();
		getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(dbPath, JSON.stringify(products), err => console.log(err));
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