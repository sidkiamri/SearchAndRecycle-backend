import mongoose from "mongoose";

const wasteTypeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  decompositionTime: { type: String, required: true },
  kills: { type: Number, required: true },
  cans: { type: Number, required: true },
});

export default mongoose.model('WasteType', wasteTypeSchema);
