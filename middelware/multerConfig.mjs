import Grid from "gridfs-stream";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";

//import methodOverride from "method-override";

/*

// multerConfig.js

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  },
});

export default upload;
*/

const app = express();

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Mongo URI
const mongoURI = `mongodb://localhost:27017/reducetrash`;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
  dbName: 'reducetrash',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: 'images',
      };
      resolve(fileInfo);
    });
  },
});

export const upload = multer({ storage });
