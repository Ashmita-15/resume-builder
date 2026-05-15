import AtsReport from "../models/AtsReport.js";
import ai from "../configs/ai.js";

// POST: /api/ats/analyze
export const analyzeAts = async (req, res) => {
    try {
        const { resumeText, jobDescription, resumeId } = req.body;
        const userId = req.userId;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: 'Resume text and job description are required' });
        }

        const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career consultant. Analyze the given resume against the job description comprehensively. Evaluate:

1. Overall ATS compatibility score (0-100)
2. Section-wise scores: formatting, keywords, readability, grammar, structure, quantification (each 0-100)
3. Matched keywords found in both resume and JD
4. Missing keywords from JD not in resume
5. Skill gaps with importance levels
6. Actionable improvement suggestions with priorities
7. Readability metrics

Return ONLY valid JSON with no additional text.`;

        const userPrompt = `Resume:
${resumeText}

Job Description:
${jobDescription}

Analyze and return JSON in this exact format:
{
  "overallScore": <number 0-100>,
  "sectionScores": {
    "formatting": <number>,
    "keywords": <number>,
    "readability": <number>,
    "grammar": <number>,
    "structure": <number>,
    "quantification": <number>
  },
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "skillGaps": [{"skill": "Docker", "importance": "high"}],
  "suggestions": [
    {"category": "Keywords", "message": "Add cloud technologies like AWS, Azure", "priority": "high"},
    {"category": "Quantification", "message": "Add metrics to achievement statements", "priority": "medium"}
  ],
  "readabilityMetrics": {
    "avgSentenceLength": <number>,
    "bulletPointUsage": <boolean>,
    "sectionCount": <number>
  }
}`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: 'json_object' },
        });

        const analysisData = JSON.parse(response.choices[0].message.content);

        const report = await AtsReport.create({
            userId,
            resumeId: resumeId || undefined,
            resumeText,
            jobDescription,
            ...analysisData,
        });

        return res.status(200).json({ report });
    } catch (error) {
        console.error("ATS Analysis Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// GET: /api/ats/reports
export const getAtsReports = async (req, res) => {
    try {
        const userId = req.userId;
        const reports = await AtsReport.find({ userId })
            .select('-resumeText -jobDescription')
            .sort({ createdAt: -1 })
            .limit(20);

        return res.status(200).json({ reports });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET: /api/ats/reports/:reportId
export const getAtsReportById = async (req, res) => {
    try {
        const userId = req.userId;
        const { reportId } = req.params;

        const report = await AtsReport.findOne({ userId, _id: reportId });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        return res.status(200).json({ report });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
