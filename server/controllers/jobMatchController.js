import JobMatchReport from "../models/JobMatchReport.js";
import ai from "../configs/ai.js";

// POST: /api/job-match/analyze
export const analyzeJobMatch = async (req, res) => {
    try {
        const { resumeText, jobDescription, jobTitle, company, resumeId } = req.body;
        const userId = req.userId;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: 'Resume text and job description are required' });
        }

        const systemPrompt = `You are an expert career advisor and job matching analyst. Analyze how well the candidate's resume matches the given job description. Evaluate skills overlap, experience alignment, education fit, and overall compatibility. Provide detailed actionable insights. Return ONLY valid JSON.`;

        const userPrompt = `Resume:
${resumeText}

Job Description:
${jobDescription}
${jobTitle ? `\nJob Title: ${jobTitle}` : ''}
${company ? `\nCompany: ${company}` : ''}

Analyze the match and return JSON in this exact format:
{
  "matchPercentage": <number 0-100>,
  "matchingSkills": [
    {"skill": "React", "strength": "strong"},
    {"skill": "Node.js", "strength": "moderate"}
  ],
  "missingSkills": [
    {"skill": "Docker", "importance": "critical", "suggestion": "Take a Docker fundamentals course on Udemy"},
    {"skill": "AWS", "importance": "important", "suggestion": "Get AWS Cloud Practitioner certification"}
  ],
  "roleCompatibility": {
    "score": <number 0-100>,
    "analysis": "Brief analysis of role fit..."
  },
  "experienceMatch": {
    "score": <number 0-100>,
    "analysis": "Brief analysis of experience alignment..."
  },
  "educationMatch": {
    "score": <number 0-100>,
    "analysis": "Brief analysis of education fit..."
  },
  "recommendations": [
    {"area": "Skills", "action": "Learn Docker and containerization", "impact": "high"},
    {"area": "Experience", "action": "Highlight leadership experience more", "impact": "medium"}
  ],
  "keywordOverlap": {
    "matched": ["React", "Node.js", "MongoDB"],
    "missing": ["Docker", "AWS", "CI/CD"],
    "percentage": <number 0-100>
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

        const matchData = JSON.parse(response.choices[0].message.content);

        const report = await JobMatchReport.create({
            userId,
            resumeId: resumeId || undefined,
            resumeText,
            jobDescription,
            jobTitle: jobTitle || '',
            company: company || '',
            ...matchData,
        });

        return res.status(200).json({ report });
    } catch (error) {
        console.error("Job Match Analysis Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// GET: /api/job-match/reports
export const getJobMatchReports = async (req, res) => {
    try {
        const userId = req.userId;
        const reports = await JobMatchReport.find({ userId })
            .select('-resumeText -jobDescription')
            .sort({ createdAt: -1 })
            .limit(20);

        return res.status(200).json({ reports });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET: /api/job-match/reports/:reportId
export const getJobMatchReportById = async (req, res) => {
    try {
        const userId = req.userId;
        const { reportId } = req.params;

        const report = await JobMatchReport.findOne({ userId, _id: reportId });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        return res.status(200).json({ report });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
