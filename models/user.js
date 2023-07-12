const mongoose = require('mongoose');
const Product = require('./product');
const { USER_TYPE } = require('../constants/constants');

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
    password: {
      type: String,
      required: true,
      select: false,
    },
    type: {
      type: String,
      enum: Object.values(USER_TYPE),
      default: 'user',
    },
    cart: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        buyQuantity: {
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
          this.cart[productIndex].buyQuantity += quantityChange;
          if (this.cart[productIndex].buyQuantity <= 0) {
            this.cart.splice(productIndex, 1);
          }
        } else if (quantityChange > 0) {
          this.cart.push({
            productID,
            buyQuantity: quantityChange,
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
      async calculateTotalPrice() {
        const enrichedCart = await Promise.all(
          this.cart.map(async (cartItem) => {
            const product = await Product.findById(cartItem.productID);
            return product && product.quantity > 0
              ? {
                  ...product.toObject(),
                  buyQuantity: cartItem.buyQuantity,
                }
              : null;
          })
        );

        this.totalPrice = enrichedCart.reduce((acc, product) => {
          if (product) {
            // eslint-disable-next-line no-param-reassign
            acc += product.price * product.buyQuantity;
          }

          return acc;
        }, 0);

        await this.validateCart(enrichedCart);
      },
      async validateCart(enrichedCart) {
        this.cart = this.cart.filter((cartItem, index) => {
          if (!enrichedCart[index] || cartItem.buyQuantity <= 0) {
            return false;
          }

          if (cartItem.buyQuantity > enrichedCart[index].quantity) {
            // eslint-disable-next-line no-param-reassign
            cartItem.buyQuantity = enrichedCart[index].quantity;
          }

          return true;
        });
      },
    },
  }
);

// Validate products in the cart and calculate the total price
userSchema.pre('save', async function () {
  await this.calculateTotalPrice();
});

module.exports = mongoose.model('User', userSchema);
