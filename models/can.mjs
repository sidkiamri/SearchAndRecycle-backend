import mongoose from "mongoose";

const canSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  tid: { type: Number, required: true },
  commodityWasteSeparated: { type: String, required: true },
  owner: { type: String },
  name: { type: String, required: true },
  street: { type: String },
  cp: { type: Number, required: true },
  isPublic: { type: String },

});

export default mongoose.model('Can', canSchema);
