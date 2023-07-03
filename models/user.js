const mongoose = require('mongoose');
const Product = require('./product');

const userSchema = mongoose.Schema(
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
      async getEnrichedCart() {
        let totalPrice = 0;

        const products = await Promise.all(
          this.cart.map(async (cartItem) => {
            const product = await Product.findById(cartItem.productID);

            // If product is not found, remove it from the enriched cart.
            // This way anywhere we are presenting the cart or storing the order, we can be sure that the
            // product exists.
            if (!product) {
              return null;
            }

            totalPrice += product.price * cartItem.quantity;

            return {
              ...product.toObject(),
              quantity: cartItem.quantity,
            };
          })
        );

        const filteredProducts = products.filter((product) => product !== null);

        return {
          products: filteredProducts,
          totalPrice,
        };
      },
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

module.exports = mongoose.model('User', userSchema);
