import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//db.user = require("./user.mjs");
//db.giftcard = require("./giftcard.mjs");
export default db;





