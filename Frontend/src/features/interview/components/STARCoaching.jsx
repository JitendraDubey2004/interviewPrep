import React, { useState } from "react";
import { useInterview } from "../hooks/useInterview";

const STARCoaching = () => {
  const { getCoaching, loading } = useInterview();
  const [formData, setFormData] = useState({
    situation: "",
    task: "",
    action: "",
    result: "",
  });
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await getCoaching(formData);
    if (result.success) {
      setFeedback(result.data);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="star-coaching">
      <div className="star-coaching__header">
        <h2>STAR Method Coach</h2>
        <p>Structure your behavioral answers. Fill in each part of the STAR framework below.</p>
      </div>

      <div className="star-coaching__layout">
        <form className="star-form" onSubmit={handleSubmit}>
          <div className="star-input">
            <label><span>S</span>ituation</label>
            <textarea 
              placeholder="Set the scene and give the necessary details of your example."
              value={formData.situation}
              onChange={(e) => setFormData({...formData, situation: e.target.value})}
              required
            />
            {feedback && <div className="feedback-hint">{feedback.feedback.situation}</div>}
          </div>

          <div className="star-input">
            <label><span>T</span>ask</label>
            <textarea 
              placeholder="Describe what your responsibility was in that situation."
              value={formData.task}
              onChange={(e) => setFormData({...formData, task: e.target.value})}
              required
            />
            {feedback && <div className="feedback-hint">{feedback.feedback.task}</div>}
          </div>

          <div className="star-input">
            <label><span>A</span>ction</label>
            <textarea 
              placeholder="Explain exactly what steps you took to address it."
              value={formData.action}
              onChange={(e) => setFormData({...formData, action: e.target.value})}
              required
            />
            {feedback && <div className="feedback-hint">{feedback.feedback.action}</div>}
          </div>

          <div className="star-input">
            <label><span>R</span>esult</label>
            <textarea 
              placeholder="Share what outcomes your actions achieved."
              value={formData.result}
              onChange={(e) => setFormData({...formData, result: e.target.value})}
              required
            />
            {feedback && <div className="feedback-hint">{feedback.feedback.result}</div>}
          </div>

          <button type="submit" disabled={loading} className="coach-btn">
            {loading ? "Analyzing..." : "Get AI Feedback"}
          </button>
        </form>

        {feedback && (
          <aside className="star-feedback">
            <div className="readiness-score">
              <label>STAR Readiness</label>
              <div className="score-pill">{feedback.score}%</div>
            </div>

            <div className="refined-answer">
              <h3>Refined AI Answer</h3>
              <p>{feedback.refinedAnswer}</p>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(feedback.refinedAnswer)}>
                Copy Refined Answer
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default STARCoaching;
