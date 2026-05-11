import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "../style/analyticsReport.scss";

const AnalyticsReport = () => {
  const { interviewId, sessionId } = useParams();
  const navigate = useNavigate();
  const { getSessionById, endSession, loading, session } = useInterview();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLocalLoading(true);
      // Try to get session first to see if it's already evaluated
      const res = await getSessionById(sessionId);
      if (res.success && !res.data.evaluation) {
        // If not evaluated, trigger endSession
        await endSession(sessionId);
        await getSessionById(sessionId);
      }
      setLocalLoading(false);
    };
    fetchData();
  }, [sessionId]);

  if (loading || localLoading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Analyzing your performance...</p>
      </div>
    );
  }

  const evalData = session?.evaluation;

  if (!evalData) {
    return (
      <div className="analytics-error">
        <p>Could not load evaluation data. Please try again.</p>
        <button onClick={() => navigate(`/interview/${interviewId}`)}>Back to Plan</button>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <button className="back-btn" onClick={() => navigate(`/interview/${interviewId}`)}>
          ← Back to Interview Plan
        </button>
        <h1>Interview Performance Report</h1>
      </header>

      <div className="analytics-layout">
        <section className="score-summary">
          <div className="main-score">
            <div className="score-circle">
              <span className="score-value">{evalData.overallScore}%</span>
              <span className="score-label">Overall Score</span>
            </div>
          </div>
          
          <div className="sub-scores">
            <div className="score-item">
              <label>Communication</label>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${evalData.communicationScore}%` }}></div>
              </div>
              <span>{evalData.communicationScore}%</span>
            </div>
            <div className="score-item">
              <label>Technical Knowledge</label>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${evalData.technicalScore}%` }}></div>
              </div>
              <span>{evalData.technicalScore}%</span>
            </div>
            <div className="score-item">
              <label>STAR Method Alignment</label>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${evalData.starAlignment.score}%` }}></div>
              </div>
              <span>{evalData.starAlignment.score}%</span>
            </div>
          </div>
        </section>

        <section className="detailed-feedback">
          <div className="feedback-card feedback-card--star">
            <h3>STAR Method Feedback</h3>
            <p>{evalData.starAlignment.feedback}</p>
          </div>

          <div className="feedback-grid">
            <div className="feedback-card feedback-card--strengths">
              <h3>Key Strengths</h3>
              <ul>
                {evalData.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="feedback-card feedback-card--improvements">
              <h3>Areas for Improvement</h3>
              <ul>
                {evalData.improvements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="feedback-card feedback-card--summary">
            <h3>Detailed Analysis</h3>
            <p>{evalData.detailedFeedback}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsReport;
