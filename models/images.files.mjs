import mongoose from "mongoose";

const UploadFileSchema = new mongoose.Schema({
  _id: {
    type: "ObjectId",
  },
  length: {
    type: "Number",
  },
  chunkSize: {
    type: "Number",
  },
  uploadDate: {
    type: "Date",
  },
  filename: {
    type: "String",
  },
  contentType: {
    type: "String",
  },
});

const UploadFile = mongoose.model("images.files", UploadFileSchema);

export default UploadFile;
