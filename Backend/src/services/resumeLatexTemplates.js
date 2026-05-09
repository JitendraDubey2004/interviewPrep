/**
 * 4 Professional LaTeX Resume Templates
 * Each template uses {{PLACEHOLDER}} tokens that AI will fill in.
 *
 * Tokens used across templates:
 *  {{NAME}}, {{EMAIL}}, {{PHONE}}, {{LOCATION}}, {{LINKEDIN}}, {{GITHUB}},
 *  {{SUMMARY}},
 *  {{EXPERIENCE_ITEMS}}   — repeated \experienceItem{...} blocks
 *  {{EDUCATION_ITEMS}}    — repeated \educationItem{...} blocks
 *  {{SKILLS_LIST}}        — comma-separated or itemized skill groups
 *  {{PROJECTS_ITEMS}}     — repeated \projectItem{...} blocks
 *  {{CERTIFICATIONS}}     — itemized certifications (optional, may be empty)
 */

// ─────────────────────────────────────────────────────────────
// TEMPLATE 1 — Modern Blue (two-column header, ruled sections)
// ─────────────────────────────────────────────────────────────
/**
 * TEMPLATE 1 — Kuldeep Modern Resume Template
 */

const template1 = String.raw`
\documentclass[10pt,a4paper]{article}

\usepackage[top=0.4in, bottom=0.5in, left=0.7in, right=0.7in]{geometry}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{enumitem}
\usepackage{titlesec}

\hypersetup{
  colorlinks=true,
  urlcolor=blue,
}

\setlist[itemize]{noitemsep, topsep=0pt, leftmargin=*}

\setlength{\parindent}{0pt}
\setlength{\parskip}{4pt}

\newcommand{\sectiontitle}[1]{%
  \vspace{1.5pt}
  {\color{blue}\large\bfseries #1}\\[-2pt]
  {\color{blue}\hrule height 0.1pt}
  \vspace{1.5pt}
}

\newcommand{\projectentry}[3]{%
  \textbf{#1} \hfill \textit{#2}
}

\newcommand{\subsectiontitle}[1]{%
  \textbf{#1}\hfill\\
}

% =========================
% Dynamic AI Commands
% =========================

\newcommand{\experienceItem}[4]{%
  \textbf{#1} \hfill \textit{#3 -- #4}\\
  \textit{#2}\\
}

\newcommand{\educationItem}[4]{%
  \textbf{#1} \hfill #3 -- #4\\
  \textit{#2}\\
}

\newcommand{\projectItem}[3]{%
  \textbf{#1} \hfill \textit{#2}\\
  #3\\[4pt]
}

\begin{document}

\vspace*{-1cm}

% =========================
% HEADER
% =========================

\begin{center}

{\LARGE \textbf{{NAME}}}\\

\vspace{3pt}

\normalfont
{{PHONE}} $|$
\href{mailto:{{EMAIL}}}{{EMAIL}} $|$
\href{https://{{GITHUB}}}{\textcolor{blue}{GitHub}} $|$
\href{https://{{LINKEDIN}}}{\textcolor{blue}{LinkedIn}}

\end{center}

\vspace{-10pt}

% =========================
% SUMMARY
% =========================

\sectiontitle{Summary}

{{SUMMARY}}

% =========================
% EDUCATION
% =========================

\sectiontitle{Education}

{{EDUCATION_ITEMS}}

% =========================
% SKILLS
% =========================

\sectiontitle{Technical Skills}

{{SKILLS_LIST}}

% =========================
% EXPERIENCE
% =========================

\sectiontitle{Experience}

{{EXPERIENCE_ITEMS}}

% =========================
% PROJECTS
% =========================

\sectiontitle{Projects}

{{PROJECTS_ITEMS}}

% =========================
% CERTIFICATIONS
% =========================

{{CERTIFICATIONS}}

\end{document}
`;

// ─────────────────────────────────────────────────────────────
// TEMPLATE 2 — Classic Elegant (centered header, no color)
// ─────────────────────────────────────────────────────────────
const template2 = String.raw`
\documentclass[11pt,a4paper]{article}
\usepackage[top=0.6in,bottom=0.6in,left=0.8in,right=0.8in]{geometry}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{titlesec}
\usepackage{parskip}

\hypersetup{colorlinks=false}
\pagestyle{empty}

\titleformat{\section}{\normalsize\bfseries\uppercase}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{6pt}{3pt}

\newcommand{\resumeHeader}[6]{%
  \begin{center}
    {\LARGE\textbf{#1}}\\[3pt]
    \href{mailto:#2}{#2} \textbullet\ #3 \textbullet\ #4 \\
    \href{https://#5}{#5} \textbullet\ \href{https://#6}{#6}
  \end{center}
}

\newcommand{\experienceItem}[4]{%
  \noindent\textbf{#1}, \textit{#2} \hfill #3 -- #4\\
}

\newcommand{\educationItem}[4]{%
  \noindent\textbf{#1} \hfill #3 -- #4\\
  \textit{#2}\\
}

\newcommand{\projectItem}[3]{%
  \noindent\textbf{#1} \textit{(#2)}\\
  #3\\[2pt]
}

\begin{document}

\resumeHeader{{{NAME}}}{{{EMAIL}}}{{{PHONE}}}{{{LOCATION}}}{{{LINKEDIN}}}{{{GITHUB}}}

\section{Professional Summary}
{{SUMMARY}}

\section{Work Experience}
{{EXPERIENCE_ITEMS}}

\section{Education}
{{EDUCATION_ITEMS}}

\section{Technical Skills}
{{SKILLS_LIST}}

\section{Projects}
{{PROJECTS_ITEMS}}

{{CERTIFICATIONS}}

\end{document}
`;

// ─────────────────────────────────────────────────────────────
// TEMPLATE 3 — Minimal Clean (left-aligned, compact, ATS-safe)
// ─────────────────────────────────────────────────────────────
const template3 = String.raw`
\documentclass[10pt,a4paper]{article}
\usepackage[margin=0.65in]{geometry}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{titlesec}
\usepackage{xcolor}

\definecolor{accent}{HTML}{2d6a4f}
\pagestyle{empty}
\setlength{\parindent}{0pt}

\titleformat{\section}{\bfseries\color{accent}}{}{0em}{}[\color{accent}\hrule]
\titlespacing{\section}{0pt}{7pt}{3pt}

\newcommand{\resumeHeader}[6]{%
  {\huge\bfseries #1}\\[2pt]
  \small\href{mailto:#2}{#2} $\cdot$ #3 $\cdot$ #4 $\cdot$
  \href{https://#5}{LinkedIn} $\cdot$ \href{https://#6}{GitHub}\\
}

\newcommand{\experienceItem}[4]{%
  {\bfseries #1} $\cdot$ \textit{#2} \hfill \small#3 -- #4\\
}

\newcommand{\educationItem}[4]{%
  {\bfseries #1} \hfill \small#3 -- #4\\
  \textit{#2}\\
}

\newcommand{\projectItem}[3]{%
  {\bfseries #1} \textit{[#2]}\\
  \small #3\\[2pt]
}

\begin{document}

\resumeHeader{{{NAME}}}{{{EMAIL}}}{{{PHONE}}}{{{LOCATION}}}{{{LINKEDIN}}}{{{GITHUB}}}

\vspace{4pt}
\section{Summary}
\small{{SUMMARY}}

\section{Experience}
{{EXPERIENCE_ITEMS}}

\section{Education}
{{EDUCATION_ITEMS}}

\section{Skills}
\small{{SKILLS_LIST}}

\section{Projects}
{{PROJECTS_ITEMS}}

{{CERTIFICATIONS}}

\end{document}
`;

// ─────────────────────────────────────────────────────────────
// TEMPLATE 4 — Sidebar Dark Accent (left sidebar via minipage)
// ─────────────────────────────────────────────────────────────
const template4 = String.raw`
\documentclass[10pt,a4paper]{article}
\usepackage[margin=0in]{geometry}
\usepackage{xcolor}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{titlesec}
\usepackage{graphicx}
\usepackage{minipage-marginpar}

\definecolor{sidebarBg}{HTML}{2c3e50}
\definecolor{sidebarText}{HTML}{ecf0f1}
\definecolor{accentColor}{HTML}{e74c3c}
\definecolor{bodyText}{HTML}{2c2c2c}

\pagestyle{empty}
\setlength{\parindent}{0pt}

\newcommand{\sideSection}[1]{%
  \vspace{8pt}{\bfseries\color{accentColor}\uppercase{#1}}\\\vspace{2pt}\color{sidebarText}%
}

\newcommand{\experienceItem}[4]{%
  \textbf{\color{accentColor}#1}\\
  \textit{#2} \hfill \textit{\small#3 -- #4}\\
}

\newcommand{\educationItem}[4]{%
  \textbf{#1} \hfill \small#3 -- #4\\
  \textit{#2}\\
}

\newcommand{\projectItem}[3]{%
  \textbf{#1} \textit{(#2)}\\
  \small #3\\[3pt]
}

\begin{document}
\noindent
%% ── Sidebar ──────────────────────────────────────────────
\begin{minipage}[t]{0.30\textwidth}
\color{sidebarText}
\colorbox{sidebarBg}{\begin{minipage}[t][\textheight][t]{0.30\textwidth}
\vspace{10pt}\hspace{6pt}
{\large\bfseries\color{white} {{NAME}}}\\[4pt]
\hspace{6pt}\small\color{sidebarText}
\href{mailto:{{EMAIL}}}{{{EMAIL}}}\\
\hspace{6pt}{{PHONE}}\\
\hspace{6pt}{{LOCATION}}\\
\hspace{6pt}\href{https://{{LINKEDIN}}}{LinkedIn}\\
\hspace{6pt}\href{https://{{GITHUB}}}{GitHub}\\

\sideSection{Skills}
{{SKILLS_LIST}}

{{CERTIFICATIONS}}
\end{minipage}}
\end{minipage}%
%% ── Main Content ─────────────────────────────────────────
\begin{minipage}[t]{0.70\textwidth}
\vspace{10pt}
\hspace{8pt}{\Large\bfseries\color{bodyText} Professional Profile}\\[3pt]
\hspace{8pt}\small\color{bodyText}{{SUMMARY}}

\vspace{6pt}
\hspace{8pt}{\bfseries\large\color{accentColor} Experience}\\
\hspace{8pt}\rule{0.65\textwidth}{0.4pt}\\
{{EXPERIENCE_ITEMS}}

\vspace{4pt}
\hspace{8pt}{\bfseries\large\color{accentColor} Education}\\
\hspace{8pt}\rule{0.65\textwidth}{0.4pt}\\
{{EDUCATION_ITEMS}}

\vspace{4pt}
\hspace{8pt}{\bfseries\large\color{accentColor} Projects}\\
\hspace{8pt}\rule{0.65\textwidth}{0.4pt}\\
{{PROJECTS_ITEMS}}

\end{minipage}
\end{document}
`;

const TEMPLATES = {
  1: { name: "Modern Blue",    code: template1 },
  2: { name: "Classic Elegant", code: template2 },
  3: { name: "Minimal Clean",  code: template3 },
  4: { name: "Sidebar Dark",   code: template4 },
};

module.exports = { TEMPLATES };