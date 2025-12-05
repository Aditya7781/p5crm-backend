import mongoose from "mongoose";

const apiRepositoryItemSchema = new mongoose.Schema({
    label: { type: String, required: true }, // e.g., "User API", "Auth API"
    link: { type: String, default: "" }, // URL to the API endpoint
});

const projectLeadSchema = new mongoose.Schema(
    {
        projectID: { type: String, required: true, unique: true }, // unique project identifier
        projectName: { type: String, required: true },
        status: { type: String, default: "Ongoing" },
        deadline: { type: Date, default: null },
        createdOn: { type: Date, default: Date.now },

        figmaLink: { type: String, default: "" },
        sowFileLink: { type: String, default: "" }, // Drive link
        pushToP5Repo: { type: Boolean, default: false },

        awsDetails: {
            id: { type: String, default: "" },
            pass: { type: String, default: "" },
        },

        apiRepository: [apiRepositoryItemSchema],
    },
    { timestamps: true }
);

export const ProjectLead = mongoose.model("ProjectLead", projectLeadSchema);
