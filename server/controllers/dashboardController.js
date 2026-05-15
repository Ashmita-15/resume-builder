import AtsReport from "../models/AtsReport.js";
import JobMatchReport from "../models/JobMatchReport.js";
import Resume from "../models/Resume.js";

// GET: /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;

        // Count resumes
        const resumeCount = await Resume.countDocuments({ userId });

        // Get average ATS score
        const atsReports = await AtsReport.find({ userId }).select('overallScore suggestions');
        const avgAtsScore = atsReports.length > 0
            ? Math.round(atsReports.reduce((sum, r) => sum + r.overallScore, 0) / atsReports.length)
            : 0;

        // Get best job match score
        const jobMatchReports = await JobMatchReport.find({ userId }).select('matchPercentage');
        const bestMatchScore = jobMatchReports.length > 0
            ? Math.max(...jobMatchReports.map(r => r.matchPercentage))
            : 0;

        // Count total suggestions
        const suggestionsCount = atsReports.reduce((sum, r) => sum + (r.suggestions?.length || 0), 0);

        return res.status(200).json({
            resumeCount,
            avgAtsScore,
            bestMatchScore,
            suggestionsCount,
            atsReportCount: atsReports.length,
            jobMatchCount: jobMatchReports.length,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
