import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ProjectLead } from "../models/projectLead.model.js";

// GET all project lead entries
export const listAllProjects = asyncHandler(async (req, res) => {
    const data = await ProjectLead.find({});
    res.status(200).json({
        success: true,
        count: data.length,
        data,
    });
});

export const debugProjectLeads = asyncHandler(async (req, res) => {
    const docs = await ProjectLead.find();
    return res.json(docs);
});

/**
 * @route POST /api/v1/pl/details/:projectID
 * @desc Add or update complete project lead record
 */
export const addOrUpdateProjectLeadDetails = asyncHandler(async (req, res) => {
    const { projectID } = req.params;

    // Extract everything from request body
    const {
        projectName,
        status,
        deadline,
        figmaLink,
        sowFileLink,
        pushToP5Repo,
        awsId,
        awsPass,
        apiRepository = [],
    } = req.body;

    if (!projectName) throw new ApiError(400, "Project name is required");

    // Find or create new document
    let doc = await ProjectLead.findOne({ projectID });

    if (!doc) {
        doc = new ProjectLead({ projectID, projectName });
    }

    // Update all fields
    doc.projectName = projectName || doc.projectName;
    doc.status = status || doc.status;
    doc.deadline = deadline || doc.deadline;
    doc.figmaLink = figmaLink || doc.figmaLink;
    doc.sowFileLink = sowFileLink || doc.sowFileLink;
    doc.pushToP5Repo =
        pushToP5Repo === "true" ||
        pushToP5Repo === true ||
        pushToP5Repo === "yes";
    doc.awsDetails = {
        id: awsId || doc.awsDetails?.id || "",
        pass: awsPass || doc.awsDetails?.pass || "",
    };
    doc.apiRepository = Array.isArray(apiRepository) ? apiRepository : [];

    await doc.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, doc, "Project Lead entry saved successfully")
        );
});
