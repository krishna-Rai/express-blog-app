const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


async function connectToDb() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to database server');
//   const db = client.db(dbName);
//   const collection = db.collection('blog-posts');

  // the following code examples can be pasted here...

  return client;
}

module.exports = connectToDb
