import mongoose from "mongoose";

const designerWorkingSchema = new mongoose.Schema(
    {
        projectID: {
            type: String,
            required: true,
        },
        projectName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        projectLead: {
            type: String,
            required: true,
        },
        createdOn: {
            type: Date,
            default: Date.now,
        },
        deadline: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["in progress", "not started", "completed", "on hold"],
            default: "not started",
        },
        figmaLink: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export const DesignerWorking = mongoose.model(
    "DesignerWorking",
    designerWorkingSchema
);
