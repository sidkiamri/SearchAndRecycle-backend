import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
  img:{ type: String },
  title: { type: String },
  description: { type: String },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

eventSchema.index({ location: '2dsphere' });


export default mongoose.model('Event', eventSchema);
