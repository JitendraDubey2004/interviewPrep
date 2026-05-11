import React, { useState, useEffect, useRef } from "react";
import { useInterview } from "../hooks/useInterview";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { useParams, useNavigate } from "react-router";
import "../style/liveSession.scss";

const LiveSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { session, startSession, sendChatMessage, loading } = useInterview();
  const { isListening, transcript, startListening, stopListening, error: speechError } = useSpeechToText();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState("// Write your code here...\n\nfunction solution() {\n  \n}");
  const scrollRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (interviewId && !session) {
      startSession(interviewId);
    }
  }, [interviewId]);

  // Text-to-Speech
  const speak = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Try to find a professional sounding voice
    utterance.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (session?.history.length > 0) {
      const lastMsg = session.history[session.history.length - 1];
      if (lastMsg.role === 'model') {
        speak(lastMsg.text);
      }
    }
  }, [session?.history.length]);

  // Video Integration
  useEffect(() => {
    if (showVideo) {
      const startVideo = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          streamRef.current = stream;
        } catch (err) {
          console.error("Error accessing webcam:", err);
          setShowVideo(false);
        }
      };
      startVideo();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [showVideo]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.history]);

  const handleSend = async () => {
    if (!input.trim() && !showEditor) return;
    if (isSending) return;

    let messageToSend = input;
    if (showEditor && code.trim()) {
        messageToSend += `\n\n[CODE ATTACHED]:\n\`\`\`javascript\n${code}\n\`\`\``;
    }

    setInput("");
    setIsSending(true);

    const result = await sendChatMessage(session._id, messageToSend);
    if (!result.success) {
      alert(result.message);
      setInput(messageToSend); // restore input on failure
    }
    setIsSending(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (loading && !session) {
    return (
      <div className="live-session-loading">
        <div className="spinner"></div>
        <p>Initializing AI Interviewer...</p>
      </div>
    );
  }

  return (
    <div className="live-session">
      <div className="live-session__container">
        <header className="live-session__header">
          <div className="header-title">
            <h2>AI Mock Interview</h2>
            <span className={`status-badge ${session ? 'status-badge--active' : ''}`}>
              {session ? 'Live Session' : 'Initializing...'}
            </span>
          </div>
          
          <div className="header-controls">
            <button 
              className={`control-btn ${showEditor ? 'active' : ''}`} 
              onClick={() => setShowEditor(!showEditor)}
              title={showEditor ? "Close Code Editor" : "Open Code Editor"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </button>
            <button 
              className={`control-btn ${showVideo ? 'active' : ''}`} 
              onClick={() => setShowVideo(!showVideo)}
              title={showVideo ? "Turn off camera" : "Turn on camera"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </button>
            <button 
              className={`control-btn ${isMuted ? 'muted' : ''}`} 
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute AI" : "Mute AI"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              )}
            </button>
            <button 
              className="end-session-btn" 
              onClick={() => { if(window.confirm("End interview and view report?")) navigate(`/interview/${interviewId}/analytics/${session._id}`); }}
            >
              End Session
            </button>
          </div>
        </header>

        <div className="live-session__chat-container">
          <div className="live-session__chat" ref={scrollRef}>
            {session?.history.map((msg, i) => (
              <div key={i} className={`message message--${msg.role}`}>
                <div className="message__bubble">
                  {msg.text}
                </div>
                <span className="message__time">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isSending && (
              <div className="message message--model">
                <div className="message__bubble typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {showVideo && (
            <div className="video-overlay">
              <video ref={videoRef} autoPlay playsInline muted />
              <div className="video-label">You (Live)</div>
            </div>
          )}

          {showEditor && (
            <div className="code-playground">
              <div className="playground-header">
                <h3>Coding Playground</h3>
                <button onClick={() => setShowEditor(false)}>×</button>
              </div>
              <textarea 
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
          )}
        </div>

        {speechError && (
          <div className="live-session__error">
            {speechError}
          </div>
        )}

        <div className="live-session__input-area">
          <button 
            className={`mic-button ${isListening ? 'mic-button--active' : ''}`}
            onClick={toggleListening}
            title={isListening ? "Stop Recording" : "Start Recording"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Type your answer here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSending}
          />

          <button 
            className="send-button"
            onClick={handleSend}
            disabled={!input.trim() || isSending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
