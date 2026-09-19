import dotenv from 'dotenv';
import { app } from './app.js';
import { initDatabaseConnection } from './config/db.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function run() {
  // Initialize DB
  await initDatabaseConnection();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DSA Backend Server] Running on http://0.0.0.0:${PORT}`);
  });
}

run();
