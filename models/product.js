const { ObjectId } = require('mongodb');
const runMongo = require('../utils/database');

class Product {
  constructor(name, price, description, quantity, imageURL) {
    this.name = name;
    this.price = +price;
    this.description = description;
    this.quantity = +quantity;
    this.imageURL = imageURL;
  }

  async save() {
    const client = await runMongo();

    try {
      const db = client.db('ShoppingExpress');

      const collection = db.collection('products');

      console.log(this);
      await collection.insertOne(this);
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }
  }

  static async getAllProducts() {
    const client = await runMongo();
    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('products');
      return await collection.find().toArray();
    } catch (error) {
      console.error('Error retrieving items:', error);
      throw error;
    } finally {
      if (client) {
        await client.close();
        console.log('MongoDB client connection closed');
      }
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
    } finally {
      if (client) {
        await client.close();
        console.log('MongoDB client connection closed');
      }
    }
  }
}

module.exports = Product;
