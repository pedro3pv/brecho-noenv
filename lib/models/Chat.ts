import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { getProduct } from './Product';

export type Chat = {
  _id?: ObjectId;
  sellerId: ObjectId;
  buyerId: ObjectId;
  productId: ObjectId;
  messages: JSON[];
}

const client: MongoClient = await clientPromise;
const db: Db = client.db();


export async function getChat(sellerId: string, buyerId: string, productId: string) {
  try {
    const chat = await db.collection('chats').findOne({ sellerId: new ObjectId(sellerId), buyerId: new ObjectId(buyerId), productId: new ObjectId(productId) });

    return chat
  } catch (err) {
    return false;
  }
}

export async function getAllChatsByProductId(productId: string) {
  if (productId.length === 24) {
    return await db.collection('chats').find({ productId: new ObjectId(productId) }).toArray();
  } else {
    return [];
  }
}

export async function getAllChatsByBuyerId(buyerId: string) {
  if (buyerId.length === 24) {
    return await db.collection('chats').find({ buyerId: new ObjectId(buyerId) }).toArray();
  } else {
    return [];
  }
}

export async function countUnreadMessagesSellerId(sellerId: string) {
  let count = 0;
  if (sellerId.length === 24) {
    const chats = await db.collection('chats').find({ sellerId: new ObjectId(sellerId) }).toArray();
    for (const chat of chats) {
      const chatArray = chat;
      const product = await getProduct(chatArray.productId.toString())
      for (const message of chatArray.messages) {
        if (message[2] == false && message[0].toString != sellerId && product?.approved == true) {
          count++;
        }
      }
    }
    return count
  } else {
    return 0;
  }
}

export async function countUnreadMessagesBuyerId(buyerId: string) {
  let count = 0;
  if (buyerId.length === 24) {
    const chats = await db.collection('chats').find({ buyerId: new ObjectId(buyerId) }).toArray();
    for (const chat of chats) {
      const chatArray = chat;
      const product = await getProduct(chatArray.productId.toString())
      for (const message of chatArray.messages) {
        if (message[2] == false && message[0].toString != buyerId && product?.approved == true) {
          count++;
        }
      }
    }
    return count
  } else {
    return 0;
  }
}

export async function countUnreadMessagesProductId(productId: string) {
  let count = 0;
  if (productId.length === 24) {
    const chats = await db.collection('chats').find({ productId: new ObjectId(productId) }).toArray();
    for (const chat of chats) {
      const chatArray = chat;
      const product = await getProduct(chatArray.productId.toString())
      for (const message of chatArray.messages) {
        if (message[2] == false && message[0].toString != chatArray.sellerId && product?.approved == true) {
          count++;
        }
      }
    }
    return count
  } else {
    return 0;
  }
}

export async function countUnreadMessagesProductIdAndBuyerId(productId: string,buyerId: string) {
  let count = 0;
  if (productId.length === 24) {
    const chats = await db.collection('chats').find({ productId: new ObjectId(productId), buyerId: new ObjectId(buyerId) }).toArray();
    for (const chat of chats) {
      const chatArray = chat;
      const product = await getProduct(chatArray.productId.toString())
      for (const message of chatArray.messages) {
        if (message[2] == false && message[0].toString != chatArray.sellerId && product?.approved == true) {
          count++;
        }
      }
    }
    return count
  } else {
    return 0;
  }
}

export async function readMessagesProductIdAndBuyerId(productId: string, sellerId: string, buyerId: string) {
  if (productId.length === 24) {
    let chats = await db.collection('chats').find({ productId: new ObjectId(productId), buyerId: new ObjectId(buyerId), sellerId: new ObjectId(sellerId) }).toArray();
    for (const chat of chats) {
      const chatArray = chat;
      const product = await getProduct(chatArray.productId.toString())
      for (const message of chatArray.messages) {
        if (message[2] == false && message[0].toString != chatArray.sellerId && product?.approved == true) {
          message[2] = true
        }
      }
      // Atualiza o chat no banco de dados
      await db.collection('chats').updateOne({ _id: chatArray._id }, { $set: { messages: chatArray.messages } });
    }
    return true
  } else {
    return false;
  }
}