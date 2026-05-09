const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

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

module.exports = interviewRouter;