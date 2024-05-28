const clientPromise = require('../mongodb');
const { ObjectId } = require('mongodb')

let client;
let db;

clientPromise.then(clientFromPromise => {
  client = clientFromPromise;
  db = client.db();
});

async function getUserByIDComplety(_id) {
  try{
    return await db.collection('users').findOne({_id: new ObjectId(_id)});
  } catch (e) {
    return null;
  }
}

module.exports = { getUserByIDComplety };