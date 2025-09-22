/**
 * Enhanced Natural Language Booking Parser with OpenAI Integration
 */

const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Fallback to original parsing if OpenAI fails
import { parseBookingRequest as originalParseBookingRequest } from './bookingParser.js';

/**
 * Use OpenAI to parse booking requests
 */
export const parseBookingRequestWithAI = async (input, previousContext = null) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = new Date(today.getTime() + 24*60*60*1000).toISOString().split('T')[0];

    let contextMessage = `Today is ${todayStr}. `;
    if (previousContext) {
      contextMessage += `Previous context: ${JSON.stringify(previousContext)}. `;
    }

    const prompt = `${contextMessage}Parse this booking request and return ONLY valid JSON:
{
  "doctorName": "string or null",
  "specialty": "string or null",
  "slotDate": "YYYY-MM-DD or null",
  "slotTime": "string or null",
  "originalInput": "${input}"
}

Available doctors: Dr. Aarav Sharma (Vamana), Dr. Meera Nair (Virechana), Dr. Rajesh Verma (Basti), Dr. Kavita Deshmukh (Nasya), Dr. Suresh Iyer (Raktamokshana), Dr. Priya Kulkarni (Complete PanchKarma), Dr. Aditya Raghavan (Virechana), Dr. Neha Gupta (Basti), Dr. Vikram Patil (Nasya), Dr. Sneha Menon (Raktamokshana), Dr. Manish Tiwari (Vamana), Dr. Radhika Joshi (Virechana), Dr. Kiran Shetty (Basti)

Rules:
Dates: "23 sep" = 2025-09-23, "tomorrow" = ${tomorrowStr}, "today" = ${todayStr}, "23" = 2025-09-23

Doctors: "Aarav"/"Sharma" = "Dr. Aarav Sharma", "Meera"/"Nair" = "Dr. Meera Nair", "Rajesh"/"Verma" = "Dr. Rajesh Verma", "Kavita"/"Deshmukh" = "Dr. Kavita Deshmukh", "Suresh"/"Iyer" = "Dr. Suresh Iyer", "Priya"/"Kulkarni" = "Dr. Priya Kulkarni", "Aditya"/"Raghavan" = "Dr. Aditya Raghavan", "Neha"/"Gupta" = "Dr. Neha Gupta", "Vikram"/"Patil" = "Dr. Vikram Patil", "Sneha"/"Menon" = "Dr. Sneha Menon", "Manish"/"Tiwari" = "Dr. Manish Tiwari", "Radhika"/"Joshi" = "Dr. Radhika Joshi", "Kiran"/"Shetty" = "Dr. Kiran Shetty"

Therapies: "vamana"/"emesis" = "Vamana Therapy", "virechana"/"purgation" = "Virechana Therapy", "basti"/"enema" = "Basti Therapy", "nasya"/"nasal" = "Nasya Therapy", "raktamokshana"/"bloodletting" = "Raktamokshana Therapy", "complete"/"panchkarma" = "Complete PanchKarma"

User: "${input}"`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    console.log('AI Response:', aiResponse);
    
    let parsedData;
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON in response');
    }

    const result = {
      doctorName: parsedData.doctorName || null,
      specialty: parsedData.specialty || null,
      slotDate: parsedData.slotDate || null,
      slotTime: parsedData.slotTime || null,
      originalInput: input,
      missingFields: []
    };

    if (!result.slotDate) result.missingFields.push('slotDate');
    if (!result.slotTime) result.missingFields.push('slotTime');

    return result;

  } catch (error) {
    console.error('AI parsing failed:', error);
    return originalParseBookingRequest(input);
  }
};

/**
 * Enhanced parser with context memory
 */
export const enhancedParseBookingRequest = async (input, previousData = null) => {
  try {
    if (previousData && isSimpleFollowUp(input)) {
      const aiResult = await parseBookingRequestWithAI(input, previousData);
      
      const merged = {
        doctorName: aiResult.doctorName || previousData.doctorName,
        specialty: aiResult.specialty || previousData.specialty,
        slotDate: aiResult.slotDate || previousData.slotDate,
        slotTime: aiResult.slotTime || previousData.slotTime,
        originalInput: input,
        missingFields: []
      };
      
      if (!merged.slotDate) merged.missingFields.push('slotDate');
      if (!merged.slotTime) merged.missingFields.push('slotTime');
      
      return merged;
    }
    
    return await parseBookingRequestWithAI(input, previousData);
    
  } catch (error) {
    console.error('Enhanced parsing failed:', error);
    return originalParseBookingRequest(input);
  }
};

function isSimpleFollowUp(input) {
  const clean = input.toLowerCase().trim();
  const patterns = [
    /^\d{1,2}$/,           // "23"
    /^tomorrow$/,
    /^today$/,
    /^morning|afternoon|evening|anytime$/,
    /^\d{1,2}-\d{1,2}$/    // "4-8"
  ];
  return patterns.some(p => p.test(clean)) || clean.split(' ').length <= 2;
}

export const generateFollowUpQuestion = (missingFields) => {
  if (missingFields.includes('slotDate') && missingFields.includes('slotTime')) {
    return "When would you like to schedule? (e.g., 'tomorrow at 4 PM')";
  } else if (missingFields.includes('slotDate')) {
    return "Which date? (e.g., 'tomorrow', '23 Sep')";
  } else if (missingFields.includes('slotTime')) {
    return "What time? (e.g., '4-8 PM', 'morning')";
  }
  return "";
};

export default {
  enhancedParseBookingRequest,
  parseBookingRequestWithAI,
  generateFollowUpQuestion
};