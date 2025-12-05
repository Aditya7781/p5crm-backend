import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    designerTest,
    listDesignerProjects,
    updateDesignStatus,
    updateFigmaLink,
    addDesignerWorking,
    listDesignerWorking,
    updateDesignerWorking,
} from "../controllers/designer.controllers.js";

const router = Router();

//router.use(verifyJWT());

// Designer test
router.get("/test", designerTest);

// Projects page
router.get("/projects", listDesignerProjects);
router.patch("/projects/:projectID/design-status", updateDesignStatus);
router.patch("/projects/:projectID/figma", updateFigmaLink);

// ⭐ Working page
router.post("/working", addDesignerWorking);
router.get("/working", listDesignerWorking);
router.patch("/working/:id", updateDesignerWorking);

export default router;
