const mongoose = require('mongoose');

const uri = `${process.env.MONGO_URI}?retryWrites=true&w=majority`;

async function runMongo() {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
}

module.exports = runMongo;
