const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const clientPromise = require('../mongodb');

let client;
let db;

clientPromise.then((resolvedClient) => {
    client = resolvedClient;
    db = client.db();
});

async function getProduct(productId) {
    try{
        return await db.collection('products').findOne({ _id: new ObjectId(productId)}, { projection: { _id: 0 } });
    } catch (err) {
        return null
    }
}

module.exports = {
    getProduct,
};