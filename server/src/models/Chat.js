const clientPromise = require('../mongodb');
const { ObjectId } = require("mongodb");

let client;
let db;

clientPromise.then(clientFromPromise => {
  client = clientFromPromise;
  db = client.db();
});

async function createChat(data) {
  const array = [[new ObjectId(data.idClient), data.message, data.read, data.Date]]
  const chat = {
    sellerId: new ObjectId(data.destinationId),
    buyerId: new ObjectId(data.idClient),
    productId: new ObjectId(data.productId),
    messages: array
  }
  return await db.collection('chats').insertOne(chat);
}

async function countUnreadMessages(sellerId) {
  let count = 0;
  if (sellerId.length === 24) {
    const chats = await db.collection('chats').find({ sellerId: new ObjectId(sellerId) }).toArray();
    for (chat of chats) {
      const chatArray = chat;
      for (message of chatArray.messages) {
        if (message[2] == false && message[0].toString() != sellerId) {
          count++;
        }
      }
    }
    return count
  } else {
    return 0;
  }
}

async function chatExists(sellerId, buyerId, productId) {
  try {
    // Buscar o chat
    const chat = await db.collection('chats').findOne({ sellerId: new ObjectId(sellerId), buyerId: new ObjectId(buyerId), productId: new ObjectId(productId) });

    // Verificar se o chat existe
    if (chat) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function updateChat(data) {
  try {
    // Buscar o chat
    let chat = await db.collection('chats').findOne({
      $or: [
        { sellerId: new ObjectId(data.destinationId), buyerId: new ObjectId(data.idClient), productId: new ObjectId(data.productId) },
        { sellerId: new ObjectId(data.idClient), buyerId: new ObjectId(data.destinationId), productId: new ObjectId(data.productId) }
      ]
    });

    // Verificar se o chat existe
    if (!chat) {
      return null;
    }

    const newMessage = [new ObjectId(data.idClient), data.message, data.read, data.Date];

    // Atualizar o chat
    await db.collection('chats').updateOne(
      { _id: chat._id },
      { $push: { messages: newMessage } }
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = { updateChat, chatExists, createChat, countUnreadMessages };