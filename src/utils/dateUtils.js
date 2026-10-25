/**
 * Date and Age Utility Functions for Bank Account Opening Form
 */

/**
 * Safely parses a YYYY-MM-DD date string into a Date object at local midnight,
 * preventing UTC timezone offset discrepancies.
 *
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date|null} Date object at local midnight or null if invalid
 */
export const parseLocalDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Calculates exact chronological age based on birth date string (YYYY-MM-DD).
 * Accounts for leap years, exact day, and month boundary checks.
 *
 * @param {string} dobString - Birth date in YYYY-MM-DD format
 * @returns {number|null} Exact age in years, or null if invalid
 */
export const calculateAge = (dobString) => {
  if (!dobString) return null;
  const birthDate = parseLocalDate(dobString);
  if (!birthDate || isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If the birthday hasn't occurred yet this year, decrement age
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
};

/**
 * Computes maximum allowable DOB (YYYY-MM-DD) for 18+ applicants.
 * Used for the native HTML date picker `max` attribute.
 *
 * @returns {string} Date string in YYYY-MM-DD format (18 years ago today)
 */
export const getMaxAllowedDobString = () => {
  const today = new Date();
  const min18Date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const pad = (n) => String(n).padStart(2, '0');
  return `${min18Date.getFullYear()}-${pad(min18Date.getMonth() + 1)}-${pad(min18Date.getDate())}`;
};
