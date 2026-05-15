import mongoose from "mongoose";

const AtsReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    overallScore: { type: Number, default: 0 },
    sectionScores: {
        formatting: { type: Number, default: 0 },
        keywords: { type: Number, default: 0 },
        readability: { type: Number, default: 0 },
        grammar: { type: Number, default: 0 },
        structure: { type: Number, default: 0 },
        quantification: { type: Number, default: 0 },
    },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    skillGaps: [{
        skill: { type: String },
        importance: { type: String, enum: ['high', 'medium', 'low'] },
    }],
    suggestions: [{
        category: { type: String },
        message: { type: String },
        priority: { type: String, enum: ['high', 'medium', 'low'] },
    }],
    readabilityMetrics: {
        avgSentenceLength: { type: Number, default: 0 },
        bulletPointUsage: { type: Boolean, default: false },
        sectionCount: { type: Number, default: 0 },
    },
}, { timestamps: true });

const AtsReport = mongoose.model('AtsReport', AtsReportSchema);

export default AtsReport;
