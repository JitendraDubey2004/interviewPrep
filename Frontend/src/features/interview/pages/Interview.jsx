import React, { useState, useEffect, useRef } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useParams, useNavigate } from "react-router";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

const TEMPLATES = [
  { id: 1, name: "Modern Blue", desc: "Two-column header, ruled sections" },
  {
    id: 2,
    name: "Classic Elegant",
    desc: "Centered, black & white, traditional",
  },
  { id: 3, name: "Minimal Clean", desc: "Compact green accents, ATS-safe" },
  { id: 4, name: "Sidebar Dark", desc: "Dark sidebar with accent headings" },
];

const DownloadIcon = () => (
  <svg
    height="0.85rem"
    style={{ marginRight: "0.5rem" }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CodeIcon = () => (
  <svg
    height="0.85rem"
    style={{ marginRight: "0.5rem" }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="q-card__index">Q{index + 1}</span>

        <p className="q-card__question">{item.question}</p>

        <span className="q-card__chevron">
          <ChevronIcon open={open} />
        </span>
      </div>

      {open && (
        <div className="q-card__body">
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--intention">
              Intention
            </span>

            <p>{item.intention}</p>
          </div>

          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--answer">
              Model Answer
            </span>

            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>

      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>

    <ul className="roadmap-day__tasks">
      {day.tasks.map((task, i) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

const TemplatePicker = ({ selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const selected = TEMPLATES.find((t) => t.id === selectedId);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="template-picker" ref={ref}>
      <button
        className="template-picker__trigger"
        onClick={() => setOpen((o) => !o)}
        title="Choose LaTeX template"
      >
        <span className="template-picker__label">{selected.name}</span>

        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="template-picker__dropdown">
          <p className="template-picker__hint">Choose a LaTeX template</p>

          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`template-picker__option ${
                t.id === selectedId ? "template-picker__option--active" : ""
              }`}
              onClick={() => {
                onSelect(t.id);
                setOpen(false);
              }}
            >
              <span className="template-picker__option-num">{t.id}</span>

              <span>
                <strong>{t.name}</strong>
                <small>{t.desc}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [downloadingLatex, setDownloadingLatex] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const [toast, setToast] = useState(null);

  const { report, getReportById, loading, getResumePdf, getResumeLatex } =
    useInterview();

  const { interviewId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80
      ? "score--high"
      : report.matchScore >= 60
        ? "score--mid"
        : "score--low";

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);

      await getResumePdf(interviewId, selectedTemplate);

      showToast("success", "Resume PDF downloaded!");
    } catch (error) {
      showToast("error", error?.message || "Failed to download PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadLatex = async () => {
    try {
      setDownloadingLatex(true);

      await getResumeLatex(interviewId, selectedTemplate);

      showToast(
        "success",
        `LaTeX file downloaded! (Template ${selectedTemplate})`,
      );
    } catch (error) {
      showToast("error", error?.message || "Failed to download LaTeX file.");
    } finally {
      setDownloadingLatex(false);
    }
  };

  return (
    <div className="interview-page">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="interview-layout">
        <nav className="interview-nav">
          <div className="nav-content">
            <p className="interview-nav__label">Sections</p>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${
                  activeNav === item.id ? "interview-nav__item--active" : ""
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="interview-nav__icon">{item.icon}</span>

                {item.label}
              </button>
            ))}
          </div>

          <div className="resume-download">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || downloadingLatex}
              className="button primary-button"
            >
              {downloadingPdf ? (
                <>
                  <span className="btn-spinner" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <DownloadIcon />
                  Download PDF
                </>
              )}
            </button>

            <div className="latex-download">
              <TemplatePicker
                selectedId={selectedTemplate}
                onSelect={setSelectedTemplate}
              />

              <button
                onClick={handleDownloadLatex}
                disabled={downloadingLatex || downloadingPdf}
                className="button secondary-button"
              >
                {downloadingLatex ? (
                  <>
                    <span className="btn-spinner" />
                    Generating .tex...
                  </>
                ) : (
                  <>
                    <CodeIcon />
                    Download LaTeX
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>

        <div className="interview-divider" />

        <main className="interview-content">
          {activeNav === "technical" && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>

                <span>{report.technicalQuestions.length} questions</span>
              </div>

              <div className="q-list">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>

                <span>{report.behavioralQuestions.length} questions</span>
              </div>

              <div className="q-list">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>

                <span>{report.preparationPlan.length}-day plan</span>
              </div>

              <div className="roadmap-list">
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="interview-divider" />

        <aside className="interview-sidebar">
          <div className="match-score">
            <p>Match Score</p>

            <div className={`match-score__ring ${scoreColor}`}>
              <span>{report.matchScore}%</span>
            </div>
          </div>

          <div className="skill-gaps">
            <p>Skill Gaps</p>

            {report.skillGaps.map((gap, i) => (
              <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                {gap.skill}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default Interview;
