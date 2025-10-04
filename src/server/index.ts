import http from 'http';
import app from 'src/server/app';
import { connectMongo, disconnectMongo } from 'src/data/mongo';

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason.message);
  // Optionally terminate the process
  // process.exit(1);
});

const start = async () => {
  try {
    await connectMongo();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', (error as Error).message);
    process.exit(1);
  }

  server
    .listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
      console.log(`📄 Documentation: http://localhost:${PORT}/api-docs`);
    })
    .on('error', (error: Error) => {
      console.error('Server error:', error.message);
    });
};

start();

// Graceful shutdown to avoid EADDRINUSE on restarts
let isShuttingDown = false;
const shutdown = (signal: NodeJS.Signals) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`Received ${signal}. Closing server...`);
  server.close((err?: Error) => {
    if (err) {
      console.error('Error while closing server:', err.message);
      process.exit(1);
    } else {
      disconnectMongo()
        .catch((e: Error) => console.error('Error while disconnecting MongoDB:', e.message))
        .finally(() => process.exit(0));
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
