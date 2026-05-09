import axios from "axios";

const api = axios.create({
  baseURL: "https://interview-ai-yt-main.onrender.com",
  withCredentials: true,
});

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};

/**
 * @description Service to generate resume PDF.
 */
/**
 * Generate Resume PDF
 */
export const generateResumePdf = async ({
  interviewReportId,
  templateId = 1,
}) => {
  const response = await api.get(
    `/api/interview/${interviewReportId}/resume/pdf`,
    {
      params: {
        template: templateId,
      },
      responseType: "blob",
    },
  );

  // Create blob URL
  const url = window.URL.createObjectURL(
    new Blob([response.data], {
      type: "application/pdf",
    }),
  );

  // Create temp anchor
  const link = document.createElement("a");

  link.href = url;

  link.download = `resume_${interviewReportId}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);

  return true;
};

/**
 * @description Service to generate resume as a LaTeX (.tex) file and trigger download.
 * Templates:
 * 1 = Modern Blue
 * 2 = Classic Elegant
 * 3 = Minimal Clean
 * 4 = Sidebar Dark
 */
export const generateResumeLatex = async ({
  interviewReportId,
  templateId = 1,
}) => {
  const response = await api.get(
    `/api/interview/${interviewReportId}/resume/latex`,
    {
      params: { template: templateId },
      responseType: "blob",
    },
  );

  // Extract filename from headers if available
  const disposition = response.headers["content-disposition"] ?? "";
  const match = disposition.match(/filename=([^\s;]+)/);

  const filename = match
    ? match[1]
    : `resume_${interviewReportId}_template${templateId}.tex`;

  // Trigger download
  const url = URL.createObjectURL(
    new Blob([response.data], { type: "application/x-tex" }),
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  a.remove();
  URL.revokeObjectURL(url);
};
