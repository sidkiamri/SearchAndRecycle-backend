import mongoose from "mongoose";

// imageModel.js

const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ImageModel = mongoose.model('Image', imageSchema);
export default ImageModel;
