import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ProjectLead } from "../models/projectLead.model.js";
import { Project } from "../models/project.model.js";

/**
 * @desc   Test route for project lead authentication
 * @route  GET /pl/pltest
 * @access Project Lead (protected)
 */
const projectLeadTest = asyncHandler(async (req, res) => {
    const projectLeadUser = req.user;
    return res
        .status(200)
        .json(
            new ApiResponse(200, projectLeadUser, "Project Lead is logged in")
        );
});

/**
 * @desc   List all projects assigned to the logged-in Project Lead
 * @route  GET /pl/projects
 * @access Project Lead (protected)
 */
const listAllProjects = asyncHandler(async (req, res) => {
    // Step 1: Find all projects where the current user is the project lead
    const assignedProjects = await Project.find({
        projectLead: req.user._id,
    }).select("_id");

    if (!assignedProjects || assignedProjects.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects found for this lead"));
    }

    // Step 2: Extract the project IDs
    const projectIds = assignedProjects.map((p) => p._id);

    // Step 3: Find corresponding ProjectLead documents
    const projectLeadDocs = await ProjectLead.find({
        project: { $in: projectIds },
    }).populate({
        path: "project",
        select: "projectID projectName sow createdAt deadline status awsDetails features",
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectLeadDocs,
                "Projects fetched successfully"
            )
        );
});

/**
 * @desc   Edit repository details (pushToP5Repo) for a specific project
 * @route  PATCH /pl/edit/:projectID
 * @access Project Lead (protected)
 */
const editProject = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { pushToP5Repo } = req.body;

    // Find the project by its projectID
    const project = await Project.findOne({ projectID });
    if (!project) {
        throw new ApiError(404, "Project not found with the provided ID");
    }

    // Find the ProjectLead document using the project reference
    const projectLeadDoc = await ProjectLead.findOne({ project: project._id });

    if (!projectLeadDoc) {
        throw new ApiError(
            404,
            "Project lead details not found for this project"
        );
    }

    // Update fields
    if (pushToP5Repo !== undefined) {
        projectLeadDoc.pushToP5Repo = pushToP5Repo;
    }

    await projectLeadDoc.save();

    // Return updated document with populated project details
    const updatedProject = await ProjectLead.findById(
        projectLeadDoc._id
    ).populate({
        path: "project",
        select: "projectID projectName sow createdAt deadline status awsDetails features",
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedProject,
                "Project details updated successfully"
            )
        );
});

export { projectLeadTest, listAllProjects, editProject };
