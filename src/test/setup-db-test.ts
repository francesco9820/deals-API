import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { connectMongo, disconnectMongo } from 'src/data/mongo';

export async function connectUniqueTestDb() {
  const dbName = `deals-db-test-${randomUUID()}`;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017';
  process.env.MONGODB_DB = dbName;
  await connectMongo();
}

export async function closeAndDropDb() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }
  await disconnectMongo();
}


