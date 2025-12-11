"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// import { initSocketServer } from "./socketServer";
require("dotenv").config();
// const server = http.createServer(app);
// cloudinary confilg >>>
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
// initSocketServer(server);
// create server >>>
// server.listen(process.env.PORT, () => {
//   console.log(`Server is connected with port ${process.env.PORT}`);
//   connectDB();
// });
