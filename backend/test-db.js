require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log("Connecting to:", uri.replace(/:([^:@]{1,})@/, ':***@'));

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS! Connected to MongoDB Atlas.");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR! Failed to connect:");
    console.error(err);
    process.exit(1);
  });
