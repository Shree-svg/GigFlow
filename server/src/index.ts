import app from './app';
import connectDB from './config/db';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 Smart Leads API`);
      console.log(`   ├─ Port:        http://localhost:${PORT}`);
      console.log(`   ├─ Health:      http://localhost:${PORT}/health`);
      console.log(`   ├─ Auth:        http://localhost:${PORT}/api/auth`);
      console.log(`   ├─ Leads:       http://localhost:${PORT}/api/leads`);
      console.log(`   └─ Environment: ${process.env.NODE_ENV ?? 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();
