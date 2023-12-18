import CanRoutes from "./routes/CanRoutes.mjs";
import GiftCard from "./models/giftcard.mjs";
import Routerecyclewaste from "./routes/Routerecyclewaste.mjs";
import bodyParser from "body-parser";
import db from "./models/index.mjs";
import eventRoutes from "./routes/eventRoutes.mjs";
import express from "express";
import giftcardRoute from "./routes/giftcardRoute.mjs";
import mongoose from "mongoose";
import registerRouter from "./routes/register.mjs";
import resetRoute from "./routes/reset.mjs";
import uploadRouter from "./routes/imageRoutes.mjs";
import wasteTypeRoutes from "./routes/wasteTypeRoutes.mjs";
import { MongoClient } from "mongodb";
import { GridFsStorage } from "multer-gridfs-storage";

 
 
//import imageRoutes from "./routes/imageRoutes.mjs";

// Import modules

// Setup express
const port = process.env.PORT || 9091;
const databaseName = 'reducetrash';
const app = express();

// Connect to MongoDB
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://localhost:27017/reducetrash`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch((err) => {
    console.log(err);
  });


// Setup middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true} ));
app.use(express.json());

// Setup routes
app.use('/register', registerRouter);
app.use('/wasteType', wasteTypeRoutes);
app.use('/can', CanRoutes);
app.use('/event', eventRoutes);
app.use('/recyclewaste', Routerecyclewaste);
app.use('/gift', giftcardRoute);
//app.use('/images', imageRoutes);
app.use('/test', uploadRouter);
app.use('/password',resetRoute)

app.get('/giftcards/:redeemed', async (req, res) => {
  try {
    const redeemed = req.params.redeemed === 'true'; // Convert string to boolean

    // Fetch gift cards based on the redeemed status
    const giftCards = await GiftCard.find({ redeemed });

    res.json(giftCards);
  } catch (error) {
    console.error('Failed to fetch gift cards', error);
    res.status(500).json({ error: 'Failed to fetch gift cards' });
  }
});


//Bucket
let bucket;
mongoose.connection.on("connected", ()=>{
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "images"
  });
  console.log(bucket);
})


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
