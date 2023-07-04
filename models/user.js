const mongoose = require('mongoose');
const Product = require('./product');

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
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    methods: {
      async addToCart(productID, quantityChange = 1) {
        const productIndex = this.cart.findIndex(
          (item) => item.productID.toString() === productID.toString()
        );

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
        this.cart = this.cart.filter(
          (item) => item.productID.toString() !== productID.toString()
        );

        // Save the updated user document with the modified cart data
        await this.save();
      },
      async clearCart() {
        this.cart = [];
        await this.save();
      },
    },
  }
);

// Fetch the products in the cart and calculate the total price
userSchema.pre('save', async function (next) {
  try {
    const products = await Promise.all(
      this.cart.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productID);
        return product
          ? {
              ...product.toObject(),
              quantity: cartItem.quantity,
            }
          : null;
      })
    );

    this.cart = products
      .filter((product) => product !== null)
      .map((product) => {
        const { _id, quantity } = product;
        return {
          productID: _id,
          quantity,
        };
      });

    this.totalPrice = products.reduce((acc, product) => {
      if (product) {
        // eslint-disable-next-line no-param-reassign
        acc += product.price * product.quantity;
      }

      return acc;
    }, 0);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
