import mongoose from 'mongoose';
import type { MongoClient, Db } from 'mongodb';

let isConnected = false;

export async function connectMongo(): Promise<{ client: MongoClient; db: Db }> {
  if (!isConnected) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB || 'deals-db';
    await mongoose.connect(uri, { dbName });
    isConnected = true;
  }
  // These are available once connected
  const client = mongoose.connection.getClient();
  const db = mongoose.connection.db as Db;
  return { client, db };
}

export function getMongoClient(): MongoClient {
  if (!isConnected) {
    throw new Error('Mongo has not been initialized. Call connectMongo() first.');
  }
  return mongoose.connection.getClient();
}

export function getDb(): Db {
  if (!isConnected || !mongoose.connection.db) {
    throw new Error('Mongo has not been initialized. Call connectMongo() first.');
  }
  return mongoose.connection.db as Db;
}

export async function disconnectMongo(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

