"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./router/user.route"));
const course_route_1 = __importDefault(require("./router/course.route"));
const order_route_1 = __importDefault(require("./router/order.route"));
const notification_route_1 = __importDefault(require("./router/notification.route"));
const analytics_route_1 = __importDefault(require("./router/analytics.route"));
const layout_route_1 = __importDefault(require("./router/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
// body parser >>>
exports.app.use(express_1.default.json({ limit: "50mb" }));
// cookie parser >>>
exports.app.use((0, cookie_parser_1.default)());
// cors => cross origin resource sharing >>>
exports.app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
// api requests limit >>>
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
});
// routers >>>
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default);
// testing route >>>
exports.app.get("/test", (req, res, next) => {
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
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
