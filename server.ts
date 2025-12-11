import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./utils/db";
require("dotenv").config();

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// For Vercel serverless functions we must export a handler.
// Also ensure DB connection is established once per warm instance.
let dbConnected = false;

const ensureDB = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// Vercel will invoke this function for each request.
// The Express `app` is callable as a handler: app(req, res)
export default async function handler(req: any, res: any) {
  try {
    await ensureDB();
    return app(req, res);
  } catch (error: any) {
    console.error("Handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
  }
}
