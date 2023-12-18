import UploadFile from "../models/images.files.mjs";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { GridFSBucket } from "mongodb";
import { GridFsStorage } from "multer-gridfs-storage";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));
const mongoURI = `mongodb://localhost:27017/reducetrash`;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "images",
    };
  },
});

const upload = multer({ storage });

const router = express.Router();

// Init gfs
let gfs;
let gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
});

router.post("/test", upload.single("file"), (req, res) => {
  // do something with the uploaded file
  res.json({ file: req.file });
});

router.get("/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    const readstream = gridfsBucket.openDownloadStreamByName(
      req.params.filename
    );
    readstream.pipe(res);
  });
});
router.get('/image/:filename', async (req, res) => {
  try {
    const image = await UploadFile.findOne({ filename: req.params.filename });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    // Get the MIME type from the image metadata
    const contentType = image.contentType || 'image/png';

    // Set headers
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename=${req.params.filename}`);

    // Create a read stream from GridFS and pipe it to the response
    const readstream = gfs.openDownloadStreamByName(req.params.filename);
    readstream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
