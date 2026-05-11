const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const linkedinController = require("../controllers/linkedin.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * Scrape LinkedIn Profile
 */
interviewRouter.post(
  "/linkedin",
  authMiddleware.authUser,
  linkedinController.scrapeLinkedInProfile
);

/**
 * Generate Interview Report
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterViewReportController
);

/**
 * Get All Reports
 */
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

/**
 * Get Single Report
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

/**
 * Download Resume PDF
 */
interviewRouter.get(
  "/:interviewReportId/resume/pdf",
  authMiddleware.authUser,
  interviewController.generateResumePdfController
);

/**
 * Download Resume Latex
 */
interviewRouter.get(
  "/:interviewReportId/resume/latex",
  authMiddleware.authUser,
  interviewController.generateResumeLatexController
);

// ─────────────────────────────────────────────────────────────
// Live Mock Interview Session
// ─────────────────────────────────────────────────────────────

interviewRouter.post(
  "/:interviewReportId/session/start",
  authMiddleware.authUser,
  interviewController.startInterviewSessionController,
);

interviewRouter.post(
  "/session/:sessionId/chat",
  authMiddleware.authUser,
  interviewController.processInterviewChatController,
);

interviewRouter.post(
  "/session/:sessionId/end",
  authMiddleware.authUser,
  interviewController.endInterviewSessionController,
);

interviewRouter.get(
  "/session/:sessionId",
  authMiddleware.authUser,
  interviewController.getInterviewSessionByIdController,
);

interviewRouter.post(
  "/star-coach",
  authMiddleware.authUser,
  interviewController.getStarCoachingController,
);

module.exports = interviewRouter;