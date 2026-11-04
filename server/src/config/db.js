import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to server/.env');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  console.log(`[DB] Connected to MongoDB (${mongoose.connection.name})`);
}

export default connectDB;
