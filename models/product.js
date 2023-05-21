const sqlDb = require('../utils/database');
const {v4: uuidv4} = require('uuid');
const Cart = require('./cart');
const getExistingItem = require('../utils/getExisitingItem');

const getProductsFromDb = () => {};

const writeProducts = products => {};

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
    return sqlDb.execute(
      'INSERT INTO products (name, imageURL, price, quantity, description) VALUES (?, ?, ?, ?, ?)',
      [this.name, this.imageURL, this.price, this.quantity, this.description]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return sqlDb.execute('SELECT * FROM products');
  }

  static fetchById(id) {
    return sqlDb.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
