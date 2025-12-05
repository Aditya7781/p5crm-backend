// routes/projectLead.routes.js
import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addOrUpdateProjectLeadDetails } from "../controllers/projectLead.controller.js";
import { listAllProjects } from "../controllers/projectLead.controller.js";

const projectLeadRouter = express.Router();
// ✅ Fetch all projects for the logged-in Project Lead
// GET /api/v1/pl/projects
projectLeadRouter.get("/projects", listAllProjects);

// ✅ Protect all routes
//projectLeadRouter.use(verifyJWT());

// ✅ Test route to verify Project Lead authentication
// GET /api/v1/pl/pltest
//projectLeadRouter.get("/pltest", projectLeadTest);

// ✅ Add or update Project Lead details (Figma, AWS, API repo, SOW link, etc.)
// POST /api/v1/pl/details/:projectID
// Accepts JSON body (not multipart)
projectLeadRouter.post("/details/:projectID", addOrUpdateProjectLeadDetails);

// ✅ Edit / patch existing Project Lead details
// PATCH /api/v1/pl/edit/:projectID
//projectLeadRouter.patch("/edit/:projectID", editProject);

export default projectLeadRouter;
