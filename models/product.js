const { ObjectId } = require('mongodb');
const runMongo = require('../utils/database');

class Product {
  constructor(name, price, description, quantity, imageURL, productID, userID) {
    this.name = name;
    this.price = +price;
    this.description = description;
    this.quantity = +quantity;
    this.imageURL = imageURL;
    this.productID = productID ? new ObjectId(productID) : null;
    this.userID = userID;
  }

  async save() {
    const client = await runMongo();
    const { productID, ...product } = this;

    try {
      const db = client.db('ShoppingExpress');

      const collection = db.collection('products');

      if (this.productID) {
        // Product already has an productID, update the existing document

        return await collection.updateOne(
          { _id: this.productID },
          { $set: product }
        );
      }

      // Product doesn't have a productID, insert a new document
      return await collection.insertOne(product);
    } catch (error) {
      console.log(error.stack);
      throw error;
    }
  }

  static async getAll() {
    const client = await runMongo();
    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('products');
      return await collection.find().toArray();
    } catch (error) {
      console.error('Error retrieving items:', error);
      throw error;
    }
  }

  static async findById(id) {
    const client = await runMongo();
    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('products');

      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error finding product:', error);
      throw error;
    }
  }

  static async deleteById(id) {
    const client = await runMongo();
    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('products');

      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error finding product:', error);
      throw error;
    }
  }
}

module.exports = Product;
