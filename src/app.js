import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

// ─── Allowed Origins ───────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,           // e.g. https://yourapp.com
  "http://localhost:3000",          // CRA dev
].filter(Boolean);                  // remove undefined if CLIENT_URL not set

// ─── Security Headers ──────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,              // allow cookies / auth headers
    optionsSuccessStatus: 200,      // some legacy browsers choke on 204
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,        // 15 minutes
  max: 100,                         // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ─── Body Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));       // prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Routes ────────────────────────────────────────────────────────
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/routes", routeRoutes);

// ─── Health Check ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  // Handle CORS errors specifically
  if (err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: isDev ? err.message : "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
});

export default app;