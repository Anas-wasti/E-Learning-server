"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = require("./app");
const cloudinary_1 = require("cloudinary");
const db_1 = __importDefault(require("./utils/db"));
require("dotenv").config();
// Configure Cloudinary from env
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
// For Vercel serverless functions we must export a handler.
// Also ensure DB connection is established once per warm instance.
let dbConnected = false;
const ensureDB = async () => {
    if (!dbConnected) {
        await (0, db_1.default)();
        dbConnected = true;
    }
};
// Vercel will invoke this function for each request.
// The Express `app` is callable as a handler: app(req, res)
async function handler(req, res) {
    try {
        await ensureDB();
        return (0, app_1.app)(req, res);
    }
    catch (error) {
        console.error("Handler error:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
    }
}
