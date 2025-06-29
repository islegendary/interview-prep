const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate personalized interview questions
async function generateQuestions({ resume, companyInfo, jobInfo, openEndedCount = 9 }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.');
  }

  const prompt = `
You are an expert interview coach creating personalized interview questions for a job candidate. 

CANDIDATE RESUME:
${resume}

COMPANY INFORMATION:
${companyInfo}

JOB DESCRIPTION:
${jobInfo}

Generate a comprehensive set of interview questions in the following JSON format:

{
  "multipleChoice": [
    {
      "question": "Question text here",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why this is the correct answer",
      "category": "company|market|technical"
    }
  ],
  "cultural": [
    {
      "question": "Question about company culture, values, or recent news",
      "context": "Background information about why this question is relevant",
      "expectedPoints": ["Key point 1", "Key point 2", "Key point 3"],
      "category": "values|culture|news"
    }
  ],
  "openEnded": [
    {
      "question": "Open-ended question about technical skills, experience, or role fit",
      "context": "Why this question is relevant to the candidate and role",
      "evaluationCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"],
      "category": "technical|experience|behavioral|case"
    }
  ]
}

REQUIREMENTS:
1. Generate exactly 3 multiple choice questions (1 company, 1 market, 1 technical)
2. Generate exactly 3 cultural questions based on company values, culture, or recent news
3. Generate exactly ${openEndedCount} open-ended questions covering:
   - Technical depth and skills relevant to the role
   - Past experience and achievements
   - Behavioral scenarios
   - Case studies or problem-solving
   - Role-specific challenges

4. All questions must be personalized based on:
   - The candidate's resume and experience
   - The specific job requirements
   - Current company information and context
   - Industry trends and challenges

5. Questions should be realistic and challenging, not generic
6. Include specific references to the company, role, or candidate's background when relevant

Return only valid JSON without any markdown formatting or additional text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach specializing in creating personalized, challenging interview questions. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your account balance.');
    } else {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

// Evaluate interview answers
async function evaluateAnswers({ resume, questions, answers, companyInfo, jobInfo }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.');
  }

  const prompt = `
You are an expert interview evaluator assessing a candidate's interview performance.

CANDIDATE RESUME:
${resume}

COMPANY INFORMATION:
${companyInfo}

JOB DESCRIPTION:
${jobInfo}

INTERVIEW QUESTIONS AND ANSWERS:
${JSON.stringify({ questions, answers }, null, 2)}

Provide a comprehensive evaluation in the following JSON format:

{
  "overallScore": 85,
  "areasForImprovement": [
    {
      "area": "Technical depth",
      "description": "Specific feedback about this area",
      "priority": "high|medium|low",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }
  ],
  "strengths": [
    {
      "area": "Communication",
      "description": "What the candidate did well",
      "examples": ["Specific example from answers"]
    }
  ],
  "questionEvaluations": [
    {
      "questionId": 0,
      "score": 8,
      "feedback": "Detailed feedback for this specific answer",
      "strengths": ["What was good"],
      "improvements": ["What could be better"],
      "category": "mcq|cultural|openEnded"
    }
  ],
  "summary": {
    "totalQuestions": 15,
    "questionsNeedingRefinement": 3,
    "overallAssessment": "Comprehensive assessment of performance",
    "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"]
  }
}

EVALUATION CRITERIA:
1. Technical accuracy and depth
2. Relevance to the role and company
3. Communication clarity and structure
4. Problem-solving approach
5. Cultural fit and values alignment
6. Specificity and use of examples

Provide constructive, actionable feedback that helps the candidate improve.
Return only valid JSON without any markdown formatting or additional text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content: "You are an expert interview evaluator providing constructive, actionable feedback. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 3000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('OpenAI API Error during evaluation:', error);
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your account balance.');
    } else {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

module.exports = {
  generateQuestions,
  evaluateAnswers
}; 