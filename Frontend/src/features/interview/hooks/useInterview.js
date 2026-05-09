import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
  generateResumeLatex,
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

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

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
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
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

  const getResumePdf = async (
    interviewReportId,
    templateId = 1,
  ) => {
    setLoading(true);

    try {
      const response = await generateResumePdf({
        interviewReportId,
        templateId,
      });

      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: "application/pdf",
        }),
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `resume_${interviewReportId}_template${templateId}.pdf`,
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

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

  const getResumeLatex = async (
    interviewReportId,
    templateId = 1,
  ) => {
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
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    getResumeLatex,
  };
};