import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
  generateResumeLatex,
  startInterviewSession,
  sendInterviewChatMessage,
  endInterviewSession,
  getInterviewSessionById,
  scrapeLinkedIn,
  getStarCoaching,
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    session, // ← new
    setSession, // ← new
  } = context;

  // =========================================
  // HANDLE API ERRORS
  // =========================================

  const getErrorMessage = (error) => {
    console.log(error);

    // Gemini API overload / quota
    if (
      error?.response?.status === 503 ||
      error?.response?.data?.error?.status === "UNAVAILABLE"
    ) {
      return "AI servers are currently busy due to high demand. Please try again in a few minutes.";
    }

    // Too many requests
    if (error?.response?.status === 429) {
      return "AI usage limit reached. Please try again later.";
    }

    // Server error
    if (error?.response?.status >= 500) {
      return "Server error occurred. Please try again later.";
    }

    // Default
    return (
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong."
    );
  };

  // =========================
  // Generate Interview Report
  // =========================

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
    targetCompany,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
        targetCompany,
      });

      setReport(response.interviewReport);

      return {
        success: true,
        data: response.interviewReport,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Get Report By ID
  // =========================

  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);

      setReport(response.interviewReport);

      return {
        success: true,
        data: response.interviewReport,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Get All Reports
  // =========================

  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      setReports(response.interviewReports);

      return {
        success: true,
        data: response.interviewReports,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Download Resume PDF
  // =========================

  const getResumePdf = async (interviewReportId, templateId = 1) => {
    setLoading(true);

    try {
      const response = await generateResumePdf({
        interviewReportId,
        templateId,
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Download Resume LaTeX
  // =========================

  const getResumeLatex = async (interviewReportId, templateId = 1) => {
    setLoading(true);

    try {
      await generateResumeLatex({
        interviewReportId,
        templateId,
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Live Interview Session
  // =========================

  const startSession = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await startInterviewSession(interviewReportId);
      setSession(response.session);
      return { success: true, data: response.session };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (sessionId, message) => {
    try {
      const response = await sendInterviewChatMessage(sessionId, message);
      setSession(response.session);
      return { success: true, data: response.aiResponse };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const endSession = async (sessionId) => {
    setLoading(true);
    try {
      const response = await endInterviewSession(sessionId);
      return { success: true, data: response.evaluation };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const getSessionById = async (sessionId) => {
    setLoading(true);
    try {
      const response = await getInterviewSessionById(sessionId);
      setSession(response.session);
      return { success: true, data: response.session };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const importLinkedIn = async (url) => {
    setLoading(true);
    try {
      const response = await scrapeLinkedIn(url);
      return { success: true, data: response.profileText };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  const getCoaching = async (data) => {
    setLoading(true);
    try {
      const response = await getStarCoaching(data);
      return { success: true, data: response.feedback };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Auto Fetch
  // =========================

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    session,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    getResumeLatex,
    startSession,
    sendChatMessage,
    endSession,
    getSessionById,
    importLinkedIn,
    getCoaching,
  };
};