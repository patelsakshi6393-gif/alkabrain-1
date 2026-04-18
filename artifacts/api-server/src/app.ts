import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { globalLimiter } from "./middlewares/rate-limit.js";

const ALLOWED_ORIGINS = [
  "https://patelsakshi6393-gif.github.io",
  ...(process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) ?? []),
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:5173", "http://localhost:3000"] : []),
];

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  }),
);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(globalLimiter);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use("/api", router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err, "Unhandled error");
  const status = (err as { status?: number }).status ?? 500;
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
  res.status(status).json({ error: message });
});

export default app;
