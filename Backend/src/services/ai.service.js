// ai.service.js

const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const { TEMPLATES } = require("./resumeLatexTemplates");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ======================================================
// SCHEMAS
// ======================================================

const interviewReportSchema = z.object({
  matchScore: z.number(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),

  title: z.string(),
});

const interviewEvaluationSchema = z.object({
  overallScore: z.number(),
  communicationScore: z.number(),
  technicalScore: z.number(),
  starAlignment: z.object({
    score: z.number(),
    feedback: z.string(),
  }),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  detailedFeedback: z.string(),
});

// ======================================================
// ATS Resume Schema
// ======================================================

const resumeLatexDataSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),

  linkedin: z.string(),
  github: z.string(),

  summary: z.string(),

  atsAnalysis: z.object({
    atsScore: z.number(),
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    addedKeywords: z.array(z.string()),
  }),

  experienceItems: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      bullets: z.array(z.string()),
    }),
  ),

  educationItems: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),

  skillGroups: z.array(
    z.object({
      category: z.string(),
      skills: z.array(z.string()),
    }),
  ),

  projects: z.array(
    z.object({
      name: z.string(),
      techStack: z.string(),
      description: z.string(),
    }),
  ),

  certifications: z.array(z.string()),
});

// ======================================================
// HELPERS
// ======================================================

function escapeLatex(str = "") {
  if (!str) return "";

  return String(str)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
}

// ======================================================
// Remove Duplicate Skills
// ======================================================

function dedupeSkills(skillGroups) {
  return skillGroups.map((group) => ({
    ...group,
    skills: [...new Set(group.skills)],
  }));
}

// ======================================================
// Remove Duplicate Bullets
// ======================================================

function dedupeBullets(experienceItems) {
  return experienceItems.map((exp) => ({
    ...exp,
    bullets: [...new Set(exp.bullets)],
  }));
}

// ======================================================
// Fill Latex Template
// ======================================================

function fillTemplate(templateCode, blocks) {
  return templateCode
    .replace(/\{\{NAME\}\}/g, blocks.NAME)
    .replace(/\{\{EMAIL\}\}/g, blocks.EMAIL)
    .replace(/\{\{PHONE\}\}/g, blocks.PHONE)
    .replace(/\{\{LOCATION\}\}/g, blocks.LOCATION)
    .replace(/\{\{LINKEDIN\}\}/g, blocks.LINKEDIN)
    .replace(/\{\{GITHUB\}\}/g, blocks.GITHUB)
    .replace(/\{\{SUMMARY\}\}/g, blocks.SUMMARY)
    .replace(/\{\{EXPERIENCE_ITEMS\}\}/g, blocks.EXPERIENCE_ITEMS)
    .replace(/\{\{EDUCATION_ITEMS\}\}/g, blocks.EDUCATION_ITEMS)
    .replace(/\{\{SKILLS_LIST\}\}/g, blocks.SKILLS_LIST)
    .replace(/\{\{PROJECTS_ITEMS\}\}/g, blocks.PROJECTS_ITEMS)
    .replace(/\{\{CERTIFICATIONS\}\}/g, blocks.CERTIFICATIONS);
}

// ======================================================
// Build Latex Blocks
// ======================================================

function buildLatexBlocks(data) {
  const EXPERIENCE_ITEMS = data.experienceItems
    .map((exp) => {
      const bullets = exp.bullets
        .map((b) => `\\item ${escapeLatex(b)}`)
        .join("\n");

      return `
\\experienceItem
{${escapeLatex(exp.role)}}
{${escapeLatex(exp.company)}}
{${escapeLatex(exp.startDate)}}
{${escapeLatex(exp.endDate)}}

\\begin{itemize}[leftmargin=*,nosep]
${bullets}
\\end{itemize}
`;
    })
    .join("\n");

  const EDUCATION_ITEMS = data.educationItems
    .map(
      (edu) => `
\\educationItem
{${escapeLatex(edu.institution)}}
{${escapeLatex(edu.degree)}}
{${escapeLatex(edu.startDate)}}
{${escapeLatex(edu.endDate)}}
`,
    )
    .join("\n");

  const SKILLS_LIST = data.skillGroups
    .map(
      (g) =>
        `\\textbf{${escapeLatex(g.category)}:} ${g.skills
          .map(escapeLatex)
          .join(", ")}`,
    )
    .join(" \\\\\n");

  const PROJECTS_ITEMS = data.projects
    .map(
      (p) => `
\\projectItem
{${escapeLatex(p.name)}}
{${escapeLatex(p.techStack)}}
{${escapeLatex(p.description)}}
`,
    )
    .join("\n");

  const CERTIFICATIONS =
    data.certifications?.length > 0
      ? `
\\sideSection{Certifications}

\\begin{itemize}[leftmargin=*,nosep]
${data.certifications.map((c) => `\\item ${escapeLatex(c)}`).join("\n")}
\\end{itemize}
`
      : "";

  return {
    NAME: escapeLatex(data.name),
    EMAIL: escapeLatex(data.email),
    PHONE: escapeLatex(data.phone),
    LOCATION: escapeLatex(data.location),
    LINKEDIN: data.linkedin,
    GITHUB: data.github,
    SUMMARY: escapeLatex(data.summary),
    EXPERIENCE_ITEMS,
    EDUCATION_ITEMS,
    SKILLS_LIST,
    PROJECTS_ITEMS,
    CERTIFICATIONS,
  };
}

// ======================================================
// PDF GENERATION
// ======================================================


async function generateResumePdf({ resume, selfDescription, jobDescription }) {
}

// ======================================================
// INTERVIEW REPORT
// ======================================================

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
  targetCompany = "General",
}) {
  const prompt = `
Generate a comprehensive interview report for a candidate applying to ${targetCompany}.

Target Company: ${targetCompany}
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Instructions:
1. Analyze the job description specifically through the lens of ${targetCompany}'s likely interview style and values.
2. If ${targetCompany} is a major tech company (e.g., Google, Amazon), tailor the technical and behavioral questions to their known formats.
3. Provide a match score and actionable preparation plan.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

// ======================================================
// QUICK PDF EXPORT
// ======================================================

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string(),
  });

  const prompt = `
You are an expert ATS resume writer.

Generate a professional ATS-friendly HTML resume.

Requirements:
- Single-column layout
- Modern typography
- ATS optimized
- Human-written tone
- Quantified achievements
- Strong action verbs
- Add missing but RELEVANT skills naturally
- Match important job description keywords
- Compact 1-page layout
- Blue section headings
- Inline CSS only
- Output ONLY valid HTML

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

// ======================================================
// LATEX EXPORT
// ======================================================

async function generateResumeLatex({
  resume,
  selfDescription,
  jobDescription,
  templateId,
}) {
  const id = parseInt(templateId, 10);

  if (!TEMPLATES[id]) {
    throw new Error("Invalid template ID");
  }

  const prompt = `
You are an elite ATS resume optimizer and professional resume writer.

Your task is to generate an ATS-optimized resume tailored to the target job description.

Instructions:

1. Analyze the target job description carefully
2. Extract important ATS keywords
3. Add ONLY realistic and relevant skills
4. Rewrite bullets using strong action verbs
5. Emphasize measurable achievements
6. Match the language/tone of the job description
7. Improve ATS keyword density naturally
8. Keep content concise and professional
9. Avoid fake claims or unrealistic experience
10. Ensure resume remains human-written
11. Optimize for software engineering recruiters
12. Prioritize technical impact and business outcomes

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: zodToJsonSchema(resumeLatexDataSchema),
    },
  });

  const data = JSON.parse(response.text);

  // ======================================================
  // DATA CLEANING
  // ======================================================

  data.skillGroups = dedupeSkills(data.skillGroups);

  data.experienceItems = dedupeBullets(data.experienceItems);

  // ======================================================
  // BUILD LATEX
  // ======================================================

  const blocks = buildLatexBlocks(data);

  const latexCode = fillTemplate(TEMPLATES[id].code, blocks);

  return {
    latexCode,
    templateName: TEMPLATES[id].name,
    templateId: id,

    atsAnalysis: data.atsAnalysis,
  };
}

// ======================================================
// LIVE MOCK INTERVIEW CHAT
// ======================================================

async function startInterviewChatSession({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a professional hiring manager conducting a mock interview.
Your goal is to test the candidate's fit for the job based on their resume and the job description.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Instructions:
1. Start by introducing yourself and asking the first interview question.
2. Be professional, encouraging, but rigorous.
3. Keep your responses concise and focused on the interview.
4. You will conduct this interview step-by-step.

Wait for the candidate's response after your first question.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return response.text;
}

async function processInterviewChatMessage({
  history,
  newMessage,
  resume,
  jobDescription,
}) {
  const systemInstruction = `You are a professional hiring manager conducting a mock interview. 
Resume Context: ${resume}
Job Description Context: ${jobDescription}

Coding Support:
- If the candidate provides code or you ask a coding question, evaluate the code for correctness, time complexity (Big O), and space complexity.
- You can provide code snippets or challenges to the candidate.
- Be rigorous but constructive.

Conduct the interview naturally. Provide feedback if asked, but stay in character.`;

  const contents = history.map((msg) => ({
    role: msg.role === "model" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));

  contents.push({ role: "user", parts: [{ text: newMessage }] });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    systemInstruction,
    contents,
  });

  return response.text;
}

async function evaluateInterviewSession({
  history,
  resume,
  jobDescription,
}) {
  const prompt = `
You are a senior recruiter evaluating a mock interview session.
Analyze the following interview history and provide a detailed evaluation.

Resume Context:
${resume}

Job Description Context:
${jobDescription}

Interview History:
${history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

Instructions:
1. Provide an overall score (0-100).
2. Evaluate communication clarity and technical correctness.
3. Check for STAR (Situation, Task, Action, Result) method alignment in the candidate's behavioral answers.
4. List specific strengths and areas for improvement.
5. Provide a constructive detailed feedback summary.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewEvaluationSchema),
    },
  });

  return JSON.parse(response.text);
}

async function getStarCoachingFeedback({
  situation,
  task,
  action,
  result,
}) {
  const prompt = `
You are an interview coach helping a candidate structure their behavioral answer using the STAR method.

Candidate Input:
Situation: ${situation}
Task: ${task}
Action: ${action}
Result: ${result}

Instructions:
1. Evaluate each part of the STAR method.
2. Provide specific, concise feedback on how to improve each section.
3. Give an overall "STAR Readiness" score (0-100).
4. Suggest a refined version of their answer.
`;

  const starFeedbackSchema = z.object({
    score: z.number(),
    feedback: z.object({
      situation: z.string(),
      task: z.string(),
      action: z.string(),
      result: z.string(),
    }),
    refinedAnswer: z.string(),
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(starFeedbackSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generateResumeLatex,
  startInterviewChatSession,
  processInterviewChatMessage,
  evaluateInterviewSession,
  getStarCoachingFeedback,
};
