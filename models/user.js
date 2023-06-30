const { ObjectId } = require('mongodb');
const runMongo = require('../utils/database');

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this.id = null;
  }

  async save() {
    const client = await runMongo();
    const { id, ...user } = this;

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('users');

      await collection.insertOne(user);
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
      console.log('MongoDB client connection closed');
    }
  }

  static async findById(id) {
    const client = await runMongo();

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('users');

      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.log(error.stack);
      throw error;
    } finally {
      await client.close();
      console.log('MongoDB client connection closed');
    }
  }
}

module.exports = User;
