// Clean JSON responses from OpenAI API
function cleanJsonResponse(response) {
  if (typeof response === 'string') {
    // Remove markdown code blocks
    let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();
    
    // Try to parse the cleaned response
    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.warn('Failed to parse cleaned JSON, attempting additional cleaning...');
      
      // Additional cleaning for common issues
      cleaned = cleaned
        .replace(/^[^{]*/, '') // Remove anything before first {
        .replace(/[^}]*$/, '') // Remove anything after last }
        .trim();
      
      try {
        return JSON.parse(cleaned);
      } catch (secondParseError) {
        console.error('Failed to parse JSON after cleaning:', secondParseError);
        throw new Error('Invalid JSON response from OpenAI API');
      }
    }
  }
  
  // If response is already an object, return it
  if (typeof response === 'object' && response !== null) {
    return response;
  }
  
  throw new Error('Invalid response format from OpenAI API');
}

// Validate question structure
function validateQuestionStructure(questions) {
  const required = ['multipleChoice', 'cultural', 'openEnded'];
  const missing = required.filter(field => !questions[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required question categories: ${missing.join(', ')}`);
  }
  
  // Validate multiple choice questions
  if (!Array.isArray(questions.multipleChoice) || questions.multipleChoice.length !== 3) {
    throw new Error('Expected exactly 3 multiple choice questions');
  }
  
  // Validate cultural questions
  if (!Array.isArray(questions.cultural) || questions.cultural.length !== 3) {
    throw new Error('Expected exactly 3 cultural questions');
  }
  
  // Validate open-ended questions
  if (!Array.isArray(questions.openEnded) || questions.openEnded.length === 0) {
    throw new Error('Expected at least 1 open-ended question');
  }
  
  return true;
}

// Validate evaluation structure
function validateEvaluationStructure(evaluation) {
  const required = ['overallScore', 'areasForImprovement', 'strengths', 'questionEvaluations', 'summary'];
  const missing = required.filter(field => !evaluation[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required evaluation fields: ${missing.join(', ')}`);
  }
  
  return true;
}

// Sanitize text content
function sanitizeText(text) {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

// Deep clean object
function deepCleanObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepCleanObject(item));
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    cleaned[key] = deepCleanObject(value);
  }
  
  return cleaned;
}

module.exports = {
  cleanJsonResponse,
  validateQuestionStructure,
  validateEvaluationStructure,
  sanitizeText,
  deepCleanObject
}; 