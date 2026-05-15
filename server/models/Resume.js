import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: {type: String, default: 'Untitled Resume'},
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },
    professional_summary: { type: String, default: '' },
    skills: [{ type: String }],
    personal_info: {
        image: {type: String, default: '' },
        full_name: {type: String, default: '' },
        profession: {type: String, default: '' },
        email: {type: String, default: '' },
        phone: {type: String, default: '' },
        location: {type: String, default: '' },
        linkedin: {type: String, default: '' },
        website: {type: String, default: '' },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
        }
    ],
    project: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
            github_link: { type: String, default: '' },
            live_link: { type: String, default: '' },
            tech_stack: [{ type: String }],
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
        }
    ],
    certifications: [
        {
            name: { type: String },
            issuer: { type: String },
            date: { type: String },
            url: { type: String, default: '' },
        }
    ],
    achievements: [
        {
            title: { type: String },
            description: { type: String },
            date: { type: String },
        }
    ],
    languages: [
        {
            name: { type: String },
            proficiency: { type: String, default: 'Intermediate' },
        }
    ],
    volunteering: [
        {
            organization: { type: String },
            role: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
        }
    ],
    extracurricular: [
        {
            activity: { type: String },
            role: { type: String },
            description: { type: String },
        }
    ],
    section_order: [{ type: String }],
    hidden_sections: [{ type: String }],
}, {timestamps: true, minimize: false})

const Resume = mongoose.model('Resume', ResumeSchema)

export default Resume