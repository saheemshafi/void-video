import mongoose from 'mongoose';
import { DB_NAME } from '../constants';

async function connectDB() {
  try {
    const dbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`DB: Mongodb connected at ${dbInstance.connection.host}.`);
  } catch (error) {
    console.log('DB: Mongodb connection failed. ', error);
    process.exit(1);
  }
}

export default connectDB;
