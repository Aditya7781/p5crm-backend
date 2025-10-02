import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";

const app = express();

// ✅ Enable CORS
app.use(
    cors({
        origin: "http://localhost:5173", // or process.env.CORS_ORIGIN
        credentials: true, // allow cookies & Authorization headers
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

export default app;
