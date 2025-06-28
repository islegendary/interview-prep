# InterviewPrepPro

**InterviewPrepPro** is a modern, fully interactive interview preparation app that generates personalized interview questions and assessments using real, up-to-date data about your resume, the job, and the company. The app is designed for job-seekers who want a real-world, targeted interview simulation—complete with dynamic questions, gamified interface, and actionable feedback.

## Features

- **Paste Your Resume**: Copy your full resume or CV into the app for direct parsing and analysis.
- **Link to Company Website and Job Posting**: Paste URLs to the company’s website and the live job posting. If needed, manually paste the job description text as a fallback.
- **Live Web & Resume Research**: The app uses the internet and the job description to extract fresh company news, culture, competitors, and relevant technical use cases for your target role.
- **Question Generation**:
  - 3 Multiple Choice Questions (MCQs) about the company, market, and technical context.
  - 3 Cultural/Values-Based Questions aligned with the company's public values and news.
  - N Open-Ended Questions (default 9, user-configurable) covering use cases, technical depth, and role fit.
  - All questions are derived from your resume, the job description, and current online research, not generic lists.
- **Gamified, Modern UI**: Uses an inviting, card-based design with expandable Accordions for questions, answers, and assessment. The process is game-like, making preparation less stressful.
- **Personalized Assessment**:
  - Real-time answer and resume evaluation versus the actual job requirements.
  - Identifies and numbers areas needing refinement (e.g. “2 of 5 need refinement”), not just a correct/incorrect count.
  - Displays best received answers and top examples per question on the final summary page.
- **Robust API and Error Handling**:
  - One comprehensive backend call for question generation and evaluation—no piecemeal chaining.
  - Robust JSON cleaning removes stray markdown or formatting from backend responses.
  - Fallback logic: if the main API call fails, the system falls back to using the manually pasted job posting and resume.
  - Detailed error logging for troubleshooting and QA.
- **Built for Realism**: Open-ended questions and MCQs reference current company news, competitors, and recent projects.

## Usage

1. Paste your resume.
2. Paste the company website URL.
3. Paste the job posting URL, or paste the full job description if a link is not available.
4. Set the number of open-ended questions (or use default 9).
5. Start the interview simulation. The app will present 3 MCQs, 3 cultural questions, and your chosen number of open-ended questions.
6. Answer each question. You’ll get a final assessment that numbers required improvements and highlights best answers.

## Tech Stack
- **Frontend**: React, CSS-in-JS (or plain CSS)
- **Backend**: Node.js API (Express or similar), OpenAI GPT API for real-time web research & question generation
- **No vendor lock-in**: All core logic and UI can run without third-party React component libraries.

## Local Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Add your OpenAI API key to `.env`
4. Start the server: `npm run dev`
5. Open the app at [http://localhost:3000](http://localhost:3000)

## Contribution
PRs welcome for:
- Improved backend reliability
- Better UI gamification
- Advanced scoring/analytics
- Plugin support for ATS and LinkedIn parsing

## License
MIT

