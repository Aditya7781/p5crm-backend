import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

import userRouter from "./routes/user.route.js";
import projectLeadRouter from "./routes/projectLead.route.js";
import adminRouter from "./routes/admin.route.js";
import designerRouter from "./routes/designer.route.js";
import frontendRouter from "./routes/frontend.route.js";
import backendRouter from "./routes/backend.route.js";

const app = express();

// 🔥 Read CORS_ORIGIN properly
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().replace(/\/$/, ""))
    : [];

// CORS CONFIG
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            const clean = origin.trim().replace(/\/$/, "");
            console.log("🔹 Incoming:", clean);

            if (allowedOrigins.includes(clean)) {
                console.log("🟢 Allowed:", clean);
                return callback(null, true);
            }

            console.log("🔴 Blocked:", clean);
            callback(new Error("CORS: Not allowed — " + clean));
        },
        credentials: true,
    })
);

// Parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/pl", projectLeadRouter);
app.use("/api/v1/designer", designerRouter);
app.use("/api/v1/frontend", frontendRouter);
app.use("/api/v1/backend", backendRouter);

export default app;
