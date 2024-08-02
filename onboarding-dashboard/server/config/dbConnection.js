const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");

dotenv.config();

const uri = process.env.mongodb_uri;
let db;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log(`Successfully connected to database`.bgGreen);
  } catch (error) {
    console.log(`Unable to connect to database due to error ${error}`.bgRed);
  }
};

module.exports = connectDB;
