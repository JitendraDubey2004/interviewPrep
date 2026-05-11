# interviewPrep AI

An AI-powered interview platform that allows users to conduct interactive interviews with AI assistance, including resume parsing and personalized question generation.

## Features

- **User Authentication**: Secure login and registration system.
- **AI-Powered Live Interviews**: Interactive mock sessions with AI-generated questions.
- **AI Voice (TTS)**: Realistic AI interviewer speech during sessions for an immersive experience.
- **Webcam Overlay**: Real-time video feed to practice body language and eye contact.
- **Post-Interview Performance Analytics**: Detailed evaluation of STAR alignment, communication, and technical correctness.
- **STAR Method Coaching**: Interactive module to master behavioral responses using the STAR framework.
- **Coding Playground**: Integrated code editor for technical and algorithmic interview rounds.
- **LinkedIn Profile Import**: One-click experience extraction via public LinkedIn URL.
- **Resume Upload & Parsing**: PDF resume analysis and integration into interview context.
- **Tailored Resume Export**: Download ATS-optimized resumes in PDF and LaTeX formats.
- **Company Personas**: Simulated interviews tailored to specific company cultures (e.g., Google, Amazon).

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Google Generative AI (Gemini)** for intelligent logic
- **Puppeteer** for LinkedIn scraping and PDF generation
- **Zod** for schema validation and structured AI responses
- **JWT** for secure authentication

### Frontend
- **React 19** with **Vite**
- **React Router** for navigation
- **Axios** for API communication
- **Sass** for advanced styling
- **Web Speech API** for Text-to-Speech and Speech-to-Text

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Google AI API key (Gemini)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd interviewPrep-AI
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install

   # Copy the example env file and fill in your keys
   cp .env.example .env
   ```

   **Required .env variables:**
   - `PORT`: Server port (default 3000)
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure string for token signing
   - `GOOGLE_GENAI_API_KEY`: Your Google AI Studio API key


   3. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

   ## Usage

   1. **Start the Backend:**
   - The backend server will run on `http://localhost:3000` (or the port specified in your `.env` file)

   2. **Start the Frontend:**
   - The frontend development server will run on `http://localhost:5173`

   3. **Access the Application:**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or login with existing credentials
   - Upload your resume and start an interview session

   ## API Endpoints

   ### Authentication
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `POST /api/auth/logout` - User logout

   ### Interview
   - `POST /api/interview/start` - Start a new interview session
   - `POST /api/interview/respond` - Submit response to interview question
   - `GET /api/interview/report` - Get interview report

   ## Project Structure

   ```
   interviewPrep-AI/
   ├── Backend/│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── features/
    │   │   ├── auth/
    │   │   └── interview/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

