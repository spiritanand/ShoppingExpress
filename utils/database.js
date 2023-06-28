const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@shoppingexpress.jcqolcl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function runMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
}

module.exports = runMongo;
exports.client = client;
