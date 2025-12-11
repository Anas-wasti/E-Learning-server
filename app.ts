require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./router/user.route";
import courseRouter from "./router/course.route";
import orderRouter from "./router/order.route";
import notificationRoute from "./router/notification.route";
import analyticsRouter from "./router/analytics.route";
import layoutRouter from "./router/layout.route";
import { rateLimit } from "express-rate-limit";

// body parser >>>
app.use(express.json({ limit: "50mb" }));

// cookie parser >>>
app.use(cookieParser());

// cors => cross origin resource sharing >>>
app.use(
  cors({
    origin: ["https://e-learning-client-lime.vercel.app"],
    credentials: true,
  })
); 

// api requests limit >>>
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

// routers >>>
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRoute,
  analyticsRouter,
  layoutRouter
);

// testing route >>>
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "APi is working",
  });
});

// unknown route >>>
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const err = new Error(`Route ${req.originalUrl} not found`) as any;
//   err.statusCode = 404;
//   next(err);
// });

// Apply the rate limiting middleware to all requests. >>>
app.use(limiter);

app.use(ErrorMiddleware);
