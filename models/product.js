const { ObjectId } = require('mongodb');
const runMongo = require('../utils/database');

class Product {
  constructor(name, price, description, quantity, imageURL) {
    this.name = name;
    this.price = +price;
    this.description = description;
    this.quantity = +quantity;
    this.imageURL = imageURL;
    this.id = null;
  }

  async save() {
    const client = await runMongo();
    const { id, ...product } = this;

    try {
      const db = client.db('ShoppingExpress');

      const collection = db.collection('products');

      if (this.id) {
        // Product already has an id, update the existing document

        await collection.updateOne(
          { _id: new ObjectId(this.id) },
          { $set: product }
        );
        console.log(`Updated product with _id: ${this.id}`);
      } else {
        // Product doesn't have an id, insert a new document
        const result = await collection.insertOne(product);
        console.log(`Inserted product with _id: ${result.insertedId}`);
      }
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
      console.log('MongoDB client connection closed');
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

  static async deleteById(id) {
    const client = await runMongo();
    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('products');

      return await collection.deleteOne({ _id: new ObjectId(id) });
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
