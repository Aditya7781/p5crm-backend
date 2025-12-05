import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { Staff } from "../models/staff.model.js";
import { DesignerWorking } from "../models/designerWorking.model.js";

// ✅ 0. Designer Test Endpoint
const designerTest = asyncHandler(async (req, res) => {
    const designerUser = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, designerUser, "Designer user is logged in"));
});

// ✅ 1.
const listDesignerProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({})
        .populate({
            path: "projectLead",
            select: "_id",
        })
        .select(
            "projectID projectName sow createdAt deadline designStatus requirement"
        );

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
    });
});

// ✅ 2. Update the design status of a project
const updateDesignStatus = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { designStatus } = req.body;

    if (!designStatus) {
        throw new ApiError(400, "Design status is required");
    }

    const allowedStatus = [
        "in progress",
        "not started",
        "on hold",
        "completed",
    ];
    if (!allowedStatus.includes(designStatus)) {
        throw new ApiError(400, "Invalid design status value");
    }

    const project = await Project.findOne({ projectID });
    if (!project) throw new ApiError(404, "Project not found");

    if (project.designer.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this project"
        );
    }

    project.designStatus = designStatus;
    await project.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, project, "Design status updated successfully")
        );
});

// ✅ 3. Update the Figma link for a project
const updateFigmaLink = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { figmaLink } = req.body;

    if (!figmaLink) throw new ApiError(400, "Figma link is required");

    const project = await Project.findOne({ projectID });
    if (!project) throw new ApiError(404, "Project not found");

    if (project.designer.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this project"
        );
    }

    project.requirement = figmaLink;
    await project.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Figma link updated successfully"));
});

const addDesignerWorking = asyncHandler(async (req, res) => {
    const {
        projectID,
        projectName,
        description,
        projectLead,
        deadline,
        status,
        figmaLink,
    } = req.body;

    if (!projectID || !projectName || !projectLead || !deadline) {
        throw new ApiError(
            400,
            "projectID, projectName, projectLead, and deadline are required"
        );
    }

    const entry = await DesignerWorking.create({
        projectID,
        projectName,
        description: description || "",
        projectLead,
        deadline,
        status: status || "not started",
        figmaLink: figmaLink || "",
    });

    return res
        .status(201)
        .json(new ApiResponse(201, entry, "Designer working entry created"));
});

const listDesignerWorking = asyncHandler(async (req, res) => {
    const entries = await DesignerWorking.find().sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, entries, "Designer working list fetched"));
});

const updateDesignerWorking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, figmaLink, description } = req.body;

    const entry = await DesignerWorking.findById(id);
    if (!entry) throw new ApiError(404, "Working entry not found");

    if (entry.designer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this entry");
    }

    if (status) entry.status = status;
    if (figmaLink) entry.figmaLink = figmaLink;
    if (description) entry.description = description;

    await entry.save();

    return res
        .status(200)
        .json(new ApiResponse(200, entry, "Working entry updated"));
});

export {
    designerTest,
    listDesignerProjects,
    updateDesignStatus,
    updateFigmaLink,
    addDesignerWorking,
    listDesignerWorking,
    updateDesignerWorking,
};
