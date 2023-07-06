const mongoose = require('mongoose');
const { STATUS } = require('../constants/constants');
const { productSchema } = require('./product');

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cart: [
      {
        productID: productSchema,
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      required: true,
    },
  },
  {
    statics: {
      async cancel(id) {
        return this.findByIdAndUpdate(id, { status: STATUS.CANCELLED });
      },
      async getAllByUserID(userID) {
        return this.find({ userID });
      },
    },
  }
);

module.exports = mongoose.model('Order', orderSchema);
