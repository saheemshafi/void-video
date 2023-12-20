import dotenv from 'dotenv';
import connectDB from './db/index';
import { app } from './app';

dotenv.config({
  path: '../env',
});

const port = process.env.PORT || 5000;

async function initializeServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`NodeJS: Server listening on ${port}.`);
    });
  } catch (error) {
    console.log('NodeJS: Failed to initialize app.', error);
  }
}

initializeServer();
