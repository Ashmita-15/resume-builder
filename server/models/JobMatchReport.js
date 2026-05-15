import mongoose from "mongoose";

const JobMatchReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
    matchPercentage: { type: Number, default: 0 },
    matchingSkills: [{
        skill: { type: String },
        strength: { type: String, enum: ['strong', 'moderate', 'basic'] },
    }],
    missingSkills: [{
        skill: { type: String },
        importance: { type: String, enum: ['critical', 'important', 'nice-to-have'] },
        suggestion: { type: String },
    }],
    roleCompatibility: {
        score: { type: Number, default: 0 },
        analysis: { type: String, default: '' },
    },
    experienceMatch: {
        score: { type: Number, default: 0 },
        analysis: { type: String, default: '' },
    },
    educationMatch: {
        score: { type: Number, default: 0 },
        analysis: { type: String, default: '' },
    },
    recommendations: [{
        area: { type: String },
        action: { type: String },
        impact: { type: String, enum: ['high', 'medium', 'low'] },
    }],
    keywordOverlap: {
        matched: [{ type: String }],
        missing: [{ type: String }],
        percentage: { type: Number, default: 0 },
    },
}, { timestamps: true });

const JobMatchReport = mongoose.model('JobMatchReport', JobMatchReportSchema);

export default JobMatchReport;
