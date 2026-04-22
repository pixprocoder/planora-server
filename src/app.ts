// import { toNodeHandler } from "better-auth/node"; // Removed for dynamic import
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

// Security layer
app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Body parser middleware with size limits
// Special handling for Stripe webhook which needs raw body
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/payments/webhook") {
    next();
  } else {
    express.json({ limit: "10mb" })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  process.env.APP_URL,
  process.env.BETTER_AUTH_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || config.env === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  }),
);


// 1. Global Rate Limiter - Generous limit for general API usage
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased to 500 for better UX
  message: {
    success: false,
    message: "Platform telemetry limit reached. Please wait a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Auth Rate Limiter - Strict limit for login/auth attempts (Security Layer)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 mins
  message: {
    success: false,
    message: "Too many authentication attempts. Authority access temporarily restricted.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply global rate limiting to all API routes
app.use("/api", globalLimiter);

// Apply strict rate limiting specifically to Auth routes
app.use("/api/auth", authLimiter);

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

// Better auth route - Using dynamic import for ESM compatibility
app.all("/api/auth/*splat", async (req, res) => {
  const { toNodeHandler } = await import("better-auth/node");
  return toNodeHandler(auth)(req, res);
});

// API routes
app.use("/api/v1", routers);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Planora API",
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
