/**
 * Utility functions for text processing
 */

/**
 * Removes citation references in the format [number] from text
 * @param {string} text - The text to clean
 * @returns {string} Text without citation references
 */
export const removeCitationRefs = (text) => {
  if (!text) return text;
  
// Remove any [number] or [text] pattern from the text
return text.replace(/\[[^\]]+\]/g, '').trim();
};

/**
 * Parse a Latin phrase and extract clean text and pronunciation
 * @param {Object} phrase - The phrase object
 * @returns {Object} Object with cleaned mainText and pronunciationText
 */
export const parseLatinPhrase = (phrase) => {
  const latin = phrase.latin ? removeCitationRefs(phrase.latin) : '';
  const pronunciation = phrase.pronunciation ? removeCitationRefs(phrase.pronunciation) : '';
  
  // If pronunciation is explicitly provided, use that
  if (pronunciation) {
    return {
      mainText: latin.toUpperCase(),
      pronunciationText: pronunciation.toLowerCase()
    };
  }
  
  // Check if the Latin text contains parentheses
  const matches = latin.match(/(.*?)(\(.*?\))?$/);
  if (matches && matches[2]) {
    // Extract main text and parenthetical content
    const mainPart = matches[1].trim();
    const parentheticalPart = matches[2].replace(/[()]/g, '').trim(); // Remove the parentheses
    
    return {
      mainText: mainPart.toUpperCase(),
      pronunciationText: parentheticalPart.toLowerCase()
    };
  }
  
  // Default case when no parentheses or pronunciation
  return {
    mainText: latin.toUpperCase(),
    pronunciationText: latin.toLowerCase()
  };
};
