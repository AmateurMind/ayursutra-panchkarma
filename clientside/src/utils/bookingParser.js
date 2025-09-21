/**
 * Natural Language Booking Parser
 * Converts natural language booking requests into structured appointment data
 */

// Common therapy specialties with aliases
const THERAPIES = {
  'Vamana Therapy': ['vamana', 'therapeutic emesis', 'kapha therapy', 'emesis therapy'],
  'Virechana Therapy': ['virechana', 'purgation', 'liver detox', 'pitta therapy', 'medicated purgation'],
  'Basti Therapy': ['basti', 'enema', 'medicated enema', 'vata therapy', 'colon therapy'],
  'Nasya Therapy': ['nasya', 'nasal', 'nasal therapy', 'head therapy', 'sinus therapy'],
  'Raktamokshana Therapy': ['raktamokshana', 'bloodletting', 'blood purification', 'leech therapy', 'cupping'],
  'Complete PanchKarma': ['complete panchkarma', 'full panchkarma', 'panchkarma', 'panchakarma', 'complete detox', 'full detox']
};

// Common doctor name variations and aliases
const DOCTOR_ALIASES = {
  'Aarav': ['Dr. Aarav Sharma', 'aarav', 'sharma'],
  'Meera': ['Dr. Meera Nair', 'meera', 'nair'],
  'Rajesh': ['Dr. Rajesh Verma', 'rajesh', 'verma'],
  'Kavita': ['Dr. Kavita Deshmukh', 'kavita', 'deshmukh'],
  'Suresh': ['Dr. Suresh Iyer', 'suresh', 'iyer'],
  'Priya': ['Dr. Priya Kulkarni', 'priya', 'kulkarni'],
  'Aditya': ['Dr. Aditya Raghavan', 'aditya', 'raghavan'],
  'Neha': ['Dr. Neha Gupta', 'neha', 'gupta'],
  'Vikram': ['Dr. Vikram Patil', 'vikram', 'patil'],
  'Sneha': ['Dr. Sneha Menon', 'sneha', 'menon'],
  'Manish': ['Dr. Manish Tiwari', 'manish', 'tiwari'],
  'Radhika': ['Dr. Radhika Joshi', 'radhika', 'joshi'],
  'Kiran': ['Dr. Kiran Shetty', 'kiran', 'shetty']
};

// Date parsing helpers
const getDateFromNaturalLanguage = (input) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const lowerInput = input.toLowerCase();
  
  // Handle "tomorrow"
  if (lowerInput.includes('tomorrow')) {
    return formatDate(tomorrow);
  }
  
  // Handle "today"
  if (lowerInput.includes('today')) {
    return formatDate(today);
  }
  
  // Handle days of the week (next Monday, Tuesday, etc.)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayMatch = days.find(day => lowerInput.includes(day));
  if (dayMatch) {
    const targetDay = days.indexOf(dayMatch);
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    
    // If the day has passed this week or is today, get next week
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    return formatDate(targetDate);
  }
  
  // Handle specific dates like "25 Sep", "Sep 25", "25/09", "09/25"
  const datePatterns = [
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/i,
    /(\d{1,2})\/(\d{1,2})/,
    /(\d{1,2})-(\d{1,2})/
  ];
  
  for (const pattern of datePatterns) {
    const match = input.match(pattern);
    if (match) {
      try {
        let day, month;
        
        if (pattern.source.includes('jan|feb')) {
          // Month name patterns
          const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                         'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          if (match[2] && !isNaN(match[1])) {
            // "25 Sep" format
            day = parseInt(match[1]);
            month = months.indexOf(match[2].toLowerCase());
          } else if (match[1] && !isNaN(match[2])) {
            // "Sep 25" format
            day = parseInt(match[2]);
            month = months.indexOf(match[1].toLowerCase());
          }
        } else {
          // Numeric patterns (assume current year, DD/MM or MM/DD based on context)
          day = parseInt(match[1]);
          month = parseInt(match[2]) - 1; // JS months are 0-indexed
        }
        
        const year = today.getFullYear();
        const parsedDate = new Date(year, month, day);
        
        // If the date has passed this year, assume next year
        if (parsedDate < today) {
          parsedDate.setFullYear(year + 1);
        }
        
        return formatDate(parsedDate);
      } catch (error) {
        console.error('Date parsing error:', error);
      }
    }
  }
  
  return null;
};

// Time parsing helpers
const getTimeFromNaturalLanguage = (input) => {
  const lowerInput = input.toLowerCase();
  
  // Handle "anytime"
  if (lowerInput.includes('anytime') || lowerInput.includes('any time')) {
    return 'anytime';
  }
  
  // Handle time periods
  if (lowerInput.includes('morning')) {
    return '9-12';
  }
  if (lowerInput.includes('afternoon')) {
    return '12-17';
  }
  if (lowerInput.includes('evening')) {
    return '17-20';
  }
  
  // Handle specific time ranges like "4-8", "between 4 and 8", "4 to 8"
  const timeRangePatterns = [
    /between\s+(\d{1,2})\s+and\s+(\d{1,2})/i,
    /(\d{1,2})\s*-\s*(\d{1,2})/,
    /(\d{1,2})\s+to\s+(\d{1,2})/i,
    /(\d{1,2})\s*–\s*(\d{1,2})/ // em dash
  ];
  
  for (const pattern of timeRangePatterns) {
    const match = input.match(pattern);
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      if (start >= 0 && start <= 23 && end >= 0 && end <= 23) {
        return `${start}-${end}`;
      }
    }
  }
  
  // Handle single time like "at 4", "4 pm", "4pm"
  const singleTimePatterns = [
    /at\s+(\d{1,2})\s*(am|pm)?/i,
    /(\d{1,2})\s*(am|pm)/i,
    /(\d{1,2})\s*o'?clock/i
  ];
  
  for (const pattern of singleTimePatterns) {
    const match = input.match(pattern);
    if (match) {
      let hour = parseInt(match[1]);
      const period = match[2]?.toLowerCase();
      
      if (period === 'pm' && hour !== 12) {
        hour += 12;
      } else if (period === 'am' && hour === 12) {
        hour = 0;
      }
      
      if (hour >= 0 && hour <= 23) {
        return `${hour}-${hour + 1}`;
      }
    }
  }
  
  return null;
};

// Helper to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Extract doctor name from input
const extractDoctorName = (input) => {
  const lowerInput = input.toLowerCase();
  
  // First check for explicit doctor patterns
  const patterns = [
    /(?:doctor|dr\.?)\s+((?:[a-z]+\s*)+)/i,
    /with\s+(?:doctor|dr\.?)?\s*((?:[a-z]+\s*)+)/i,
    /specific\s+doctor\s+((?:[a-z]+\s*)+)/i,
    /(?:book|schedule)\s+(?:for|with)\s+(?:doctor|dr\.?)?\s*((?:[a-z]+\s*)+)/i
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const extractedName = match[1].trim().toLowerCase();
      // Try to match against doctor aliases
      for (const [key, aliases] of Object.entries(DOCTOR_ALIASES)) {
        if (aliases.some(alias => alias.toLowerCase().includes(extractedName) || extractedName.includes(alias.toLowerCase()))) {
          return aliases[0]; // Return the full doctor name
        }
      }
      return match[1].trim(); // Return as-is if no alias match
    }
  }
  
  // Check for any doctor name mentions in the text
  for (const [key, aliases] of Object.entries(DOCTOR_ALIASES)) {
    if (aliases.some(alias => {
      const aliasLower = alias.toLowerCase();
      // Check for exact word matches to avoid partial matches
      const words = lowerInput.split(/\s+/);
      return words.some(word => {
        // Remove punctuation and check
        const cleanWord = word.replace(/[.,!?;:]/, '');
        return cleanWord === aliasLower || 
               (aliasLower.includes(' ') && lowerInput.includes(aliasLower)) ||
               (aliasLower.startsWith('dr.') && lowerInput.includes(aliasLower.substring(4)));
      });
    })) {
      return aliases[0]; // Return the full doctor name
    }
  }
  
  // Look for capitalized names (likely proper nouns) as fallback
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  const matches = [...input.matchAll(namePattern)];
  
  for (const match of matches) {
    const name = match[1];
    // Skip common words that might be capitalized
    const skipWords = ['Book', 'Booking', 'Tomorrow', 'Today', 'Monday', 'Tuesday', 'Wednesday', 
                      'Thursday', 'Friday', 'Saturday', 'Sunday', 'Therapy', 'Complete', 'Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana'];
    if (!skipWords.some(word => name.includes(word))) {
      return name;
    }
  }
  
  return null;
};

// Extract specialty/therapy from input
const extractSpecialty = (input) => {
  const lowerInput = input.toLowerCase();
  
  // Check each therapy and its aliases
  for (const [therapyName, aliases] of Object.entries(THERAPIES)) {
    // Check the main therapy name
    if (lowerInput.includes(therapyName.toLowerCase())) {
      return therapyName;
    }
    
    // Check all aliases
    for (const alias of aliases) {
      if (lowerInput.includes(alias.toLowerCase())) {
        return therapyName;
      }
    }
  }
  
  return null;
};

/**
 * Main parser function
 * @param {string} input - Natural language booking request
 * @returns {object} - Structured booking data with missing fields indicated
 */
export const parseBookingRequest = (input) => {
  const result = {
    doctorName: extractDoctorName(input),
    specialty: extractSpecialty(input),
    slotDate: getDateFromNaturalLanguage(input),
    slotTime: getTimeFromNaturalLanguage(input),
    originalInput: input,
    missingFields: []
  };
  
  // Check for missing required fields
  if (!result.slotDate) {
    result.missingFields.push('slotDate');
  }
  if (!result.slotTime) {
    result.missingFields.push('slotTime');
  }
  
  return result;
};

/**
 * Generate follow-up questions for missing fields
 * @param {array} missingFields - Array of missing field names
 * @returns {string} - Follow-up question
 */
export const generateFollowUpQuestion = (missingFields) => {
  if (missingFields.includes('slotDate') && missingFields.includes('slotTime')) {
    return "I need to know when you'd like to schedule your appointment. Please specify the date and time (e.g., 'tomorrow at 3 PM' or '25 Sep between 4-8').";
  } else if (missingFields.includes('slotDate')) {
    return "Which date would you like to schedule your appointment? (e.g., 'tomorrow', '25 Sep', 'next Monday')";
  } else if (missingFields.includes('slotTime')) {
    return "What time works best for you? (e.g., '4-8 PM', 'morning', 'anytime')";
  }
  return "";
};

export default {
  parseBookingRequest,
  generateFollowUpQuestion,
  THERAPIES: Object.keys(THERAPIES)
};
