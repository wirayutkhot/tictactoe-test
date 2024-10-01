// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://tictactoe:kLY738G4VTF81BbB@test.avwa4.mongodb.net/test?retryWrites=true&w=majority&appName=Test";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // ในการพัฒนาใช้ client ที่ติดตั้งอยู่แล้ว
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // ในการผลิตใช้ client ใหม่
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
