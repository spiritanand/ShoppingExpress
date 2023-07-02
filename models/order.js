const { ObjectId } = require('mongodb');
const runMongo = require('../utils/database');
const { STATUS } = require('../constants/constants');

class Order {
  constructor(userID, cart) {
    this.userID = userID;
    this.cart = cart;
    this.status = STATUS.PENDING;
  }

  async create(enrichedCart) {
    const client = await runMongo();

    const { products: cart, totalPrice } = enrichedCart;

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('orders');

      return collection.insertOne({
        userID: this.userID,
        cart,
        totalPrice,
        status: STATUS.SUCCESS,
      });
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }

  static async getAllByUserID(userID) {
    const client = await runMongo();

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('orders');

      return collection.find({ userID }).toArray();
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }

  static async findByID(id) {
    const client = await runMongo();

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('orders');

      return collection.find({ _id: id }).toArray();
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }

  static async cancel(id) {
    const client = await runMongo();

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('orders');

      return collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            status: STATUS.CANCELLED,
          },
        }
      );
    } catch (e) {
      console.log(e.stack);
      throw e;
    }
  }
}

module.exports = Order;
