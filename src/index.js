import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db/index.js";
import app from "./app.js";
import { seedAdmin } from "./utils/seedAdmin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

connectDB()
    .then(async () => {
        app.on("error", (err) => {
            console.error("Error:", err);
            throw err;
        });

        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running at port : ${PORT}`);
        });

        // Seed admin only once
        await seedAdmin();
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed!!", err);
    });
