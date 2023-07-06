const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    statics: {
      async updateQuantityAfterOrder(cart, decrease = true) {
        const updateQuantity = decrease ? -1 : 1;

        const productUpdates = cart.map((cartItem) => {
          const { productID, quantity } = cartItem;
          const { _id: productObjectID } = productID;

          return {
            updateOne: {
              filter: { _id: productObjectID },
              update: { $inc: { quantity: updateQuantity * quantity } },
            },
          };
        });

        await this.bulkWrite(productUpdates);
      },
    },
  }
);

module.exports = mongoose.model('Product', productSchema);
module.exports.productSchema = productSchema;
