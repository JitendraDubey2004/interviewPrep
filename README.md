# interviewPrep AI

An AI-powered interview platform that allows users to conduct interactive interviews with AI assistance, including resume parsing and personalized question generation.

## Features

- **User Authentication**: Secure login and registration system
- **AI-Powered Interviews**: Interactive sessions with AI-generated questions and responses
- **Resume Upload & Parsing**: Upload PDF resumes for analysis and integration into interviews
- **Real-time Feedback**: Get instant AI evaluations during interview sessions
- **Modern UI**: Clean, responsive interface built with React

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **Google Generative AI** for AI-powered features
- **JWT** for authentication
- **Multer** for file uploads
- **PDF-parse** for resume processing
- **Puppeteer** for browser automation

### Frontend
- **React 19** with **Vite** build tool
- **React Router** for navigation
- **Axios** for API calls
- **Sass** for styling
- **ESLint** for code linting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Google AI API key (for AI features)
- Chrome browser (for Puppeteer)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd interview-ai-yt-main-main
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   
   # Create a .env file in the Backend directory with the following variables:
   # PORT=3000
   # MONGODB_URI=mongodb://localhost:27017/interview-ai
   # JWT_SECRET=your-jwt-secret-key
   # GOOGLE_AI_API_KEY=your-google-ai-api-key
   
   npm run dev
   ```

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
interview-ai-yt-main-main/
├── Backend/
│   ├── src/
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

