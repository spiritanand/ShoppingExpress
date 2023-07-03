const mongoose = require('mongoose');

const dbName = 'ShoppingExpress';

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@shoppingexpress.jcqolcl.mongodb.net/${dbName}?retryWrites=true&w=majority`;

async function runMongo() {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
}

module.exports = runMongo;
