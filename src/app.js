import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";

const app = express();

// ✅ Enable CORS
app.use(
    cors({
        origin: ["http://localhost:5173", "https://p5crm.vercel.app/login"],
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

import projectLeadRouter from "./routes/projectLead.route.js";
import adminRouter from "./routes/admin.route.js";
import designerRouter from "./routes/designer.route.js";
import frontendRouter from "./routes/frontend.route.js";
import backendRouter from "./routes/backend.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/project-lead", projectLeadRouter);
app.use("/api/v1/designer", designerRouter);
app.use("/api/v1/frontend", frontendRouter);
app.use("/api/v1/backend", backendRouter);

export default app;
