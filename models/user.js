const { ObjectId } = require('mongodb');
const runMongo = require('../utils/database');
const Product = require('./product');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this.id = id;
  }

  async save() {
    const client = await runMongo();
    const { ...user } = this;

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('users');

      return collection.insertOne(user);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async updateCart(updatedCart) {
    const client = await runMongo();

    try {
      const db = client.db('ShoppingExpress');
      const collection = db.collection('users');

      return collection.updateOne(
        { _id: this.id },
        { $set: { cart: updatedCart } }
      );
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async addToCart(productID) {
    let updatedCart;

    const isProductInCart = this.cart.some(
      (product) => product.productID === productID
    );

    if (isProductInCart) {
      updatedCart = this.cart.map((product) => {
        if (product.productID === productID) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });
    } else {
      updatedCart = [
        ...this.cart,
        {
          productID,
          quantity: 1,
        },
      ];
    }

    await this.updateCart(updatedCart);
  }

  async removeFromCart(productID) {
    const updatedCart = this.cart.filter(
      (product) => product.productID !== productID
    );

    await this.updateCart(updatedCart);
  }

  async decreaseFromCart(productID) {
    const updatedCart = this.cart
      .map((product) => {
        if (product.productID === productID) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      })
      .filter((product) => product.quantity > 0);

    await this.updateCart(updatedCart);
  }

  async clearCart() {
    await this.updateCart([]);
  }

  async getEnrichedCart() {
    let totalPrice = 0;

    const products = await Promise.all(
      this.cart.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productID);

        totalPrice += product.price * cartItem.quantity;

        return {
          ...product,
          quantity: cartItem.quantity,
        };
      })
    );

    return {
      products,
      totalPrice,
    };
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
    }
  }
}

module.exports = User;
