import mongoose from "mongoose";

// Import required modules

// Define schema
const giftCardSchema = new mongoose.Schema({

  code: {
    type: String,
    required: true,
    unique: true,
  },
    image: {
    type: String,
  },
  point: {
    type: Number,
    required: true,
  },
  redeemed: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Define model
const GiftCard = mongoose.model('GiftCard', giftCardSchema);

// Export model
export default GiftCard;

