import { Server } from "http";
import app from "./app";
import config from "./config/index";
import { prisma } from "./lib/prisma";

let server: Server;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Start listening
    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port: ${config.port}`);
      console.log(`📍 Environment: ${config.env || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log("🔌 HTTP server closed");

      try {
        // Disconnect from database
        await prisma.$disconnect();
        console.log("🔌 Database connection closed");
        console.log("✅ Graceful shutdown completed");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("⏰ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Handle graceful shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown) => {
  console.error("❌ Unhandled Rejection:", reason);
  gracefulShutdown("unhandledRejection");
});

await startServer();

