const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cart: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    methods: {
      async addToCart(productID, quantityChange = 1) {
        const productIndex = this.cart.findIndex((item) => {
          const { _id } = item.productID;

          return (
            _id.toString() === productID.toString() ||
            item.productID.toString() === productID.toString()
          );
        });

        if (productIndex !== -1) {
          this.cart[productIndex].quantity += quantityChange;
          if (this.cart[productIndex].quantity <= 0) {
            this.cart.splice(productIndex, 1);
          }
        } else if (quantityChange > 0) {
          this.cart.push({
            productID,
            quantity: quantityChange,
          });
        }

        await this.save();
      },
      async decreaseFromCart(productID) {
        await this.addToCart(productID, -1);
      },
      async removeFromCart(productID) {
        // Filter out the product from the cart
        this.cart = this.cart.filter((item) => {
          const { _id } = item.productID;

          if (_id) return _id.toString() !== productID.toString();

          return item.productID.toString() !== productID.toString();
        });

        // Save the updated user document with the modified cart data
        await this.save();
      },
      async clearCart() {
        this.cart = [];
        await this.save();
      },
    },
    statics: {
      getTotalPrice(cart) {
        return cart.reduce(
          (total, item) => total + item.productID.price * item.quantity,
          0
        );
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
