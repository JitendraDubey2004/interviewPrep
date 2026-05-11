const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
  generateResumeLatex,
  startInterviewChatSession, // ← new
  processInterviewChatMessage, // ← new
  evaluateInterviewSession,
  getStarCoachingFeedback,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const interviewSessionModel = require("../models/interviewSession.model"); // ← new

// ─────────────────────────────────────────────────────────────
// Live Interview Session Controllers
// ─────────────────────────────────────────────────────────────

/**
 * @description Start a new live interview session based on a report.
 */
async function startInterviewSessionController(req, res) {
  const { interviewReportId } = req.params;

  const report = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!report) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  // Check if active session already exists
  let session = await interviewSessionModel.findOne({
    interviewReport: interviewReportId,
    user: req.user.id,
    status: "active",
  });

  if (session) {
    return res.status(200).json({
      message: "Resuming existing active session.",
      session,
    });
  }

  // Start new chat with AI
  const firstQuestion = await startInterviewChatSession({
    resume: report.resume,
    selfDescription: report.selfDescription,
    jobDescription: report.jobDescription,
  });

  // Create session in DB
  session = await interviewSessionModel.create({
    user: req.user.id,
    interviewReport: interviewReportId,
    history: [{ role: "model", text: firstQuestion }],
    status: "active",
  });

  res.status(201).json({
    message: "Interview session started.",
    session,
  });
}

/**
 * @description Process a user message and get AI response.
 */
async function processInterviewChatController(req, res) {
  const { sessionId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required." });
  }

  const session = await interviewSessionModel.findOne({
    _id: sessionId,
    user: req.user.id,
    status: "active",
  }).populate('interviewReport');

  if (!session) {
    return res.status(404).json({ message: "Active interview session not found." });
  }

  // Process with AI
  const aiResponse = await processInterviewChatMessage({
    history: session.history,
    newMessage: message,
    resume: session.interviewReport.resume,
    jobDescription: session.interviewReport.jobDescription,
  });

  // Update session history
  session.history.push({ role: "user", text: message });
  session.history.push({ role: "model", text: aiResponse });
  await session.save();

  res.status(200).json({
    message: "AI response received.",
    aiResponse,
    session,
  });
}

/**
 * @description End interview session and generate evaluation.
 */
async function endInterviewSessionController(req, res) {
  const { sessionId } = req.params;

  const session = await interviewSessionModel.findOne({
    _id: sessionId,
    user: req.user.id,
  }).populate('interviewReport');

  if (!session) {
    return res.status(404).json({ message: "Interview session not found." });
  }

  if (session.status === 'completed' && session.evaluation) {
    return res.status(200).json({
      message: "Session already completed.",
      evaluation: session.evaluation,
    });
  }

  // Generate evaluation with AI
  const evaluation = await evaluateInterviewSession({
    history: session.history,
    resume: session.interviewReport.resume,
    jobDescription: session.interviewReport.jobDescription,
  });

  // Update session
  session.status = 'completed';
  session.evaluation = evaluation;
  await session.save();

  res.status(200).json({
    message: "Interview session completed and evaluated.",
    evaluation,
  });
}

/**
 * @description Get single interview session by ID.
 */
async function getInterviewSessionByIdController(req, res) {
  const { sessionId } = req.params;

  const session = await interviewSessionModel.findOne({
    _id: sessionId,
    user: req.user.id,
  }).populate('interviewReport');

  if (!session) {
    return res.status(404).json({ message: "Interview session not found." });
  }

  res.status(200).json({
    message: "Interview session fetched successfully.",
    session,
  });
}

/**
 * @description Get coaching feedback for STAR method.
 */
async function getStarCoachingController(req, res) {
  const { situation, task, action, result } = req.body;

  const feedback = await getStarCoachingFeedback({
    situation,
    task,
    action,
    result,
  });

  res.status(200).json({
    message: "STAR coaching feedback generated.",
    feedback,
  });
}

// ─────────────────────────────────────────────────────────────
// Existing controllers (unchanged)
// ─────────────────────────────────────────────────────────────

/**
 * @description Generate interview report based on user self description,
 *              resume and job description.
 */
async function generateInterViewReportController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();

  const { selfDescription, jobDescription, targetCompany } = req.body;

  const interViewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    targetCompany,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    targetCompany: targetCompany || "General",
    ...interViewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport,
  });
}

/**
 * @description Get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Get all interview reports of logged-in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

// ─────────────────────────────────────────────────────────────
// Resume: PDF download
// ─────────────────────────────────────────────────────────────

/**
 * @description Generate and download a tailored resume as PDF.
 *
 * Route:  GET /api/interview/:interviewReportId/resume/pdf
 *
 * The template parameter is accepted but not used for the HTML→PDF path
 * (HTML resumes are free-form). If you want template-based PDF, switch
 * to a LaTeX→PDF pipeline (e.g. via a LaTeX compiler micro-service).
 */
/**
 * @description Generate and download resume PDF
 *
 * Route:
 * GET /api/interview/:interviewReportId/resume/pdf?template=1
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  // Get selected template from query
  const templateId = parseInt(req.query.template ?? "1", 10);

  // Validate template
  if (![1, 2, 3, 4].includes(templateId)) {
    return res.status(400).json({
      message: "Invalid template. Choose 1-4.",
    });
  }

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  // Generate PDF using SAME template
  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
    templateId,
  });

  res.set({
    "Content-Type": "application/pdf",

    "Content-Disposition": `attachment; filename=resume_${interviewReportId}_template${templateId}.pdf`,
  });

  res.send(pdfBuffer);
}

// ─────────────────────────────────────────────────────────────
// Resume: LaTeX download  ← NEW
// ─────────────────────────────────────────────────────────────

/**
 * @description Generate and download a tailored resume as a .tex (LaTeX) file.
 *
 * Route:   GET /api/interview/:interviewReportId/resume/latex
 * Query:   ?template=1   (1 = Modern Blue | 2 = Classic Elegant |
 *                         3 = Minimal Clean | 4 = Sidebar Dark)
 *
 * Returns a raw .tex file so the user can compile it locally with
 * pdflatex / XeLaTeX, or paste it into Overleaf.
 *
 * How the frontend wires up two buttons:
 *   <button onClick={() => window.open(`/api/interview/${id}/resume/pdf`)}>
 *     Download PDF
 *   </button>
 *   <button onClick={() => window.open(`/api/interview/${id}/resume/latex?template=2`)}>
 *     Download LaTeX (.tex)
 *   </button>
 */
async function generateResumeLatexController(req, res) {
  const { interviewReportId } = req.params;

  // templateId defaults to 1 if not provided
  const templateId = parseInt(req.query.template ?? "1", 10);

  if (![1, 2, 3, 4].includes(templateId)) {
    return res.status(400).json({
      message: "Invalid template. Choose a value between 1 and 4.",
      availableTemplates: {
        1: "Modern Blue",
        2: "Classic Elegant",
        3: "Minimal Clean",
        4: "Sidebar Dark",
      },
    });
  }

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const { latexCode, templateName } = await generateResumeLatex({
    resume,
    jobDescription,
    selfDescription,
    templateId,
  });

  res.set({
    "Content-Type": "application/x-tex",
    // Forces browser to download the file instead of displaying it
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}_template${templateId}.tex`,
    // Helpful metadata for the frontend
    "X-Template-Id": String(templateId),
    "X-Template-Name": templateName,
  });

  res.send(latexCode);
}

// ─────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  generateResumeLatexController,
  startInterviewSessionController,
  processInterviewChatController,
  endInterviewSessionController,
  getInterviewSessionByIdController,
  getStarCoachingController,
};
