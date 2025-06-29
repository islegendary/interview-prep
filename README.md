# InterviewPrepPro

**InterviewPrepPro** is a modern, fully interactive interview preparation app that generates personalized interview questions and assessments using real, up-to-date data about your resume, the job, and the company. The app is designed for job-seekers who want a real-world, targeted interview simulation—complete with dynamic questions, gamified interface, and actionable feedback.

## 🚀 Features

- **Paste Your Resume**: Copy your full resume or CV into the app for direct parsing and analysis
- **Link to Company Website and Job Posting**: Paste URLs to the company's website and the live job posting. If needed, manually paste the job description text as a fallback
- **Live Web & Resume Research**: The app uses the internet and the job description to extract fresh company news, culture, competitors, and relevant technical use cases for your target role
- **Question Generation**:
  - 3 Multiple Choice Questions (MCQs) about the company, market, and technical context
  - 3 Cultural/Values-Based Questions aligned with the company's public values and news
  - N Open-Ended Questions (default 9, user-configurable) covering use cases, technical depth, and role fit
  - All questions are derived from your resume, the job description, and current online research, not generic lists
- **Gamified, Modern UI**: Uses an inviting, card-based design with expandable Accordions for questions, answers, and assessment. The process is game-like, making preparation less stressful
- **Personalized Assessment**:
  - Real-time answer and resume evaluation versus the actual job requirements
  - Identifies and numbers areas needing refinement (e.g. "2 of 5 need refinement"), not just a correct/incorrect count
  - Displays best received answers and top examples per question on the final summary page
- **Robust API and Error Handling**:
  - One comprehensive backend call for question generation and evaluation—no piecemeal chaining
  - Robust JSON cleaning removes stray markdown or formatting from backend responses
  - Fallback logic: if the main API call fails, the system falls back to using the manually pasted job posting and resume
  - Detailed error logging for troubleshooting and QA
- **Built for Realism**: Open-ended questions and MCQs reference current company news, competitors, and recent projects

## 🛠️ Tech Stack

- **Frontend**: React 18, Styled Components, React Router DOM
- **Backend**: Node.js, Express.js, OpenAI GPT-4o API
- **Web Scraping**: Axios, Cheerio for company and job information extraction
- **Development**: Nodemon, Concurrently for development workflow

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd interview-prep
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

**To get an OpenAI API key:**
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

1. **Setup Phase**:
   - Paste your resume in the text area
   - Enter the company website URL (optional)
   - Enter the job posting URL or paste the full job description
   - Set the number of open-ended questions (default: 9)
   - Click "Start Interview Simulation"

2. **Interview Phase**:
   - Answer 3 multiple choice questions about the company, market, and technical context
   - Respond to 3 cultural/values-based questions
   - Complete your chosen number of open-ended questions
   - Navigate between questions using Previous/Next buttons

3. **Results Phase**:
   - View your overall score and assessment
   - Review areas for improvement with specific suggestions
   - See your strengths and best answers
   - Get detailed feedback for each question
   - Option to restart or begin a new setup

## 🔧 Development

### Project Structure
```
interview-prep/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # React components
│   │   ├── context/        # React context for state management
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   └── index.js            # Server entry point
├── package.json            # Root package.json
└── README.md
```

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend server only
npm run client       # Start frontend development server
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### API Endpoints
- `POST /api/interview/generate-questions` - Generate personalized questions
- `POST /api/interview/evaluate-answers` - Evaluate interview responses
- `GET /api/interview/health` - Health check endpoint
- `GET /api/interview/test` - Test API key configuration

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_api_key
PORT=5000
NODE_ENV=production
```

## 🤝 Contributing

PRs welcome for:
- Improved backend reliability
- Better UI gamification
- Advanced scoring/analytics
- Plugin support for ATS and LinkedIn parsing
- Bug fixes and performance improvements

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**"Failed to generate questions"**
- Check that your OpenAI API key is correctly set in `.env`
- Verify you have sufficient API credits
- Ensure the API key has access to GPT-4o

**"Server not starting"**
- Check if port 5000 is already in use
- Verify all dependencies are installed
- Check the console for error messages

**"Frontend not loading"**
- Ensure the backend server is running on port 5000
- Check that the proxy setting in `client/package.json` is correct
- Verify React development server is running on port 3000

### Getting Help
- Check the browser console for frontend errors
- Check the server console for backend errors
- Verify your `.env` file configuration
- Ensure all dependencies are properly installed

## 🎯 Roadmap

- [ ] ATS (Applicant Tracking System) integration
- [ ] LinkedIn profile parsing
- [ ] Video interview simulation
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Company-specific question templates
- [ ] Interview scheduling integration

