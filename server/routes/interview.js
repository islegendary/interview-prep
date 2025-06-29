const express = require('express');
const router = express.Router();
const { generateQuestions, evaluateAnswers } = require('../services/openaiService');
const { scrapeWebsite, extractJobInfo } = require('../services/webScraperService');
const { cleanJsonResponse } = require('../utils/jsonCleaner');

// Test endpoint to verify API key
router.get('/test', (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  res.json({
    status: 'ok',
    hasOpenAIKey: hasApiKey,
    message: hasApiKey ? 'API key is configured' : 'API key is missing'
  });
});

// Generate personalized interview questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { 
      resume, 
      companyWebsite, 
      jobPostingUrl, 
      jobDescription, 
      openEndedCount = 9 
    } = req.body;

    console.log('Generating questions for interview prep...');

    // Validate required inputs
    if (!resume) {
      return res.status(400).json({ error: 'Resume is required' });
    }

    if (!companyWebsite && !jobDescription) {
      return res.status(400).json({ error: 'Either company website or job description is required' });
    }

    let companyInfo = '';
    let jobInfo = '';

    // Scrape company website if provided
    if (companyWebsite) {
      try {
        console.log('Scraping company website...');
        companyInfo = await scrapeWebsite(companyWebsite);
      } catch (error) {
        console.warn('Failed to scrape company website, proceeding with fallback');
        companyInfo = 'Company information unavailable';
      }
    }

    // Extract job information
    if (jobPostingUrl) {
      try {
        console.log('Extracting job posting information...');
        jobInfo = await extractJobInfo(jobPostingUrl);
      } catch (error) {
        console.warn('Failed to extract job posting, using provided description');
        jobInfo = jobDescription || 'Job information unavailable';
      }
    } else {
      jobInfo = jobDescription;
    }

    // Generate questions using OpenAI
    console.log('Generating personalized questions...');
    const questionsData = await generateQuestions({
      resume,
      companyInfo,
      jobInfo,
      openEndedCount
    });

    // Clean the response
    const cleanedQuestions = cleanJsonResponse(questionsData);

    console.log('Questions generated successfully');
    res.json({
      success: true,
      questions: cleanedQuestions,
      metadata: {
        companyInfo: companyInfo ? 'Available' : 'Unavailable',
        jobInfo: jobInfo ? 'Available' : 'Unavailable',
        questionCount: {
          mcq: 3,
          cultural: 3,
          openEnded: openEndedCount
        }
      }
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message 
    });
  }
});

// Evaluate interview answers
router.post('/evaluate-answers', async (req, res) => {
  try {
    const { 
      resume, 
      questions, 
      answers, 
      companyInfo, 
      jobInfo 
    } = req.body;

    console.log('Evaluating interview answers...');

    // Validate required inputs
    if (!resume || !questions || !answers) {
      return res.status(400).json({ error: 'Resume, questions, and answers are required' });
    }

    // Evaluate answers using OpenAI
    const evaluationData = await evaluateAnswers({
      resume,
      questions,
      answers,
      companyInfo,
      jobInfo
    });

    // Clean the response
    const cleanedEvaluation = cleanJsonResponse(evaluationData);

    console.log('Answers evaluated successfully');
    res.json({
      success: true,
      evaluation: cleanedEvaluation
    });

  } catch (error) {
    console.error('Error evaluating answers:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate answers',
      message: error.message 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'InterviewPrepPro API'
  });
});

module.exports = router; 