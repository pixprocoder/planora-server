import { toNodeHandler } from "better-auth/node";
import compression from "compression";
import cors from "cors";
import express, { type Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/index";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import routers from "./routes/index";

const app: Application = express();

// Trust proxy - important if behind reverse proxy (nginx, AWS ELB, etc.)
app.set("trust proxy", 1);

// Security middleware - adds various HTTP headers
app.use(helmet());

// Compression middleware - compress response bodies
app.use(compression());

// Request logging - only in development
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Body parser middleware with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    // origin: [`${config.app_url}`, "http://localhost:3000"],
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  }),
);

// Rate limiting - protect against brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use("/api", limiter);

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "Service Unavailable",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

// Better auth route
app.all("/api/auth/*splat", toNodeHandler(auth));

// API routes
app.use("/api/v1", routers);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Medi Store API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/*",
      api: "/api/v1/*",
      health: "/health",
    },
    documentation: "API documentation coming soon",
  });
});

// 404 Not Found handler
app.use(notFound);

// Global error handler - must be last middleware
app.use(globalErrorHandler);

export default app;
