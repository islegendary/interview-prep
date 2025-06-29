const axios = require('axios');
const cheerio = require('cheerio');

// Scrape company website for information
async function scrapeWebsite(url) {
  try {
    console.log(`Scraping website: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract relevant information
    let companyInfo = '';
    
    // Get company name
    const companyName = $('title').text() || $('h1').first().text() || '';
    if (companyName) {
      companyInfo += `Company: ${companyName}\n\n`;
    }
    
    // Get meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    if (metaDescription) {
      companyInfo += `Description: ${metaDescription}\n\n`;
    }
    
    // Extract text from main content areas
    const mainContent = [];
    
    // Common selectors for main content
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.main-content',
      '#content',
      '#main',
      '.about',
      '.company-info'
    ];
    
    contentSelectors.forEach(selector => {
      const element = $(selector);
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > 50) { // Only include substantial content
          mainContent.push(text);
        }
      }
    });
    
    // If no main content found, get text from body
    if (mainContent.length === 0) {
      const bodyText = $('body').text().trim();
      if (bodyText.length > 100) {
        mainContent.push(bodyText.substring(0, 2000)); // Limit to first 2000 chars
      }
    }
    
    // Combine all content
    if (mainContent.length > 0) {
      companyInfo += `Company Information:\n${mainContent.join('\n\n')}`;
    }
    
    // Clean up the text
    companyInfo = companyInfo
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    console.log(`Successfully scraped ${companyInfo.length} characters from ${url}`);
    return companyInfo;
    
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

// Extract job posting information
async function extractJobInfo(url) {
  try {
    console.log(`Extracting job posting from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    let jobInfo = '';
    
    // Get job title
    const jobTitle = $('title').text() || $('h1').first().text() || '';
    if (jobTitle) {
      jobInfo += `Job Title: ${jobTitle}\n\n`;
    }
    
    // Common selectors for job descriptions
    const jobSelectors = [
      '.job-description',
      '.job-details',
      '.description',
      '.content',
      'main',
      'article',
      '.posting-content',
      '#job-description',
      '.job-summary'
    ];
    
    let jobDescription = '';
    jobSelectors.forEach(selector => {
      const element = $(selector);
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > jobDescription.length) {
          jobDescription = text;
        }
      }
    });
    
    // If no specific job description found, get text from body
    if (!jobDescription) {
      jobDescription = $('body').text().trim();
    }
    
    // Clean and limit the description
    jobDescription = jobDescription
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    if (jobDescription.length > 3000) {
      jobDescription = jobDescription.substring(0, 3000) + '...';
    }
    
    jobInfo += `Job Description:\n${jobDescription}`;
    
    console.log(`Successfully extracted job information (${jobInfo.length} characters)`);
    return jobInfo;
    
  } catch (error) {
    console.error(`Failed to extract job info from ${url}:`, error.message);
    throw new Error(`Failed to extract job information: ${error.message}`);
  }
}

// Fallback function for when web scraping fails
function getFallbackCompanyInfo() {
  return `Company information could not be retrieved from the provided website. 
  Please ensure the URL is correct and accessible, or manually provide company information.`;
}

function getFallbackJobInfo() {
  return `Job posting information could not be retrieved from the provided URL. 
  Please ensure the URL is correct and accessible, or manually provide the job description.`;
}

module.exports = {
  scrapeWebsite,
  extractJobInfo,
  getFallbackCompanyInfo,
  getFallbackJobInfo
}; 