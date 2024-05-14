const { privateDecrypt } = require('crypto');
const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      amount: {
        type: Number,
        required: true,
      }, 
      name: {type: String, required: true},
      image: {type: String, required: true},
      price: {type: Number, required: true},
      countInStock: {type: Number, required: true}
    }],
    
  },
  {
    timestamps: true,
}
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;