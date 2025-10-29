import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRouter from "./routes/user.route.js";
import projectLeadRouter from "./routes/projectLead.route.js";
import adminRouter from "./routes/admin.route.js";
import designerRouter from "./routes/designer.route.js";
import frontendRouter from "./routes/frontend.route.js";
import backendRouter from "./routes/backend.route.js";

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Enable CORS using .env origins
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // allow Postman, curl, etc.
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// ✅ Parse JSON
app.use(
    express.json({
        limit: "16kb",
    })
);

// ✅ Parse URL-encoded data
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/project-lead", projectLeadRouter);
app.use("/api/v1/designer", designerRouter);
app.use("/api/v1/frontend", frontendRouter);
app.use("/api/v1/backend", backendRouter);

export default app;
