// Comprehensive QA Test Suite for Bank Account Opening Form - Age Restriction & Validation
import { calculateAge, getMaxAllowedDobString, parseLocalDate } from './src/utils/dateUtils.js';

console.log('================================================================');
console.log('  TEST SUITE: Bank Account Opening Form - Age Restriction & Logic');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${details ? '— ' + details : ''}`);
  }
}

// --------------------------------------------------------------------------
// 1. DATE OF BIRTH & AGE RESTRICTION TESTS
// --------------------------------------------------------------------------
console.log('--- 1. Date of Birth & 18+ Age Restriction Boundaries ---');

const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Case 1A: Exact 18th Birthday Today (Eligible)
const exact18Date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const exact18Str = formatDate(exact18Date);
const age18 = calculateAge(exact18Str);
assert(age18 === 18, 'Applicant celebrating exact 18th birthday today is calculated as 18 years old', `Got: ${age18}`);

// Case 1B: 1 Day Shy of 18th Birthday (Ineligible - 17 years 364 days)
const under18Date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
const under18Str = formatDate(under18Date);
const age17 = calculateAge(under18Str);
assert(age17 === 17, 'Applicant 1 day shy of 18th birthday is calculated as 17 years old', `Got: ${age17}`);

// Case 1C: Minor Applicant (10 years old)
const minorDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
const minorStr = formatDate(minorDate);
const age10 = calculateAge(minorStr);
assert(age10 === 10, '10-year-old applicant is correctly calculated as age 10', `Got: ${age10}`);

// Case 1D: Born Today (Ineligible)
const bornTodayStr = formatDate(today);
const ageToday = calculateAge(bornTodayStr);
assert(ageToday === 0, 'Newborn (born today) is calculated as age 0', `Got: ${ageToday}`);

// Case 1E: Future Date (Ineligible)
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
const tomorrowStr = formatDate(tomorrow);
const ageFuture = calculateAge(tomorrowStr);
assert(ageFuture < 0, 'Future date yields negative age', `Got: ${ageFuture}`);

// Case 1F: Adult Applicant (28 years old)
const adultDate = new Date(today.getFullYear() - 28, today.getMonth(), today.getDate());
const adultStr = formatDate(adultDate);
const age28 = calculateAge(adultStr);
assert(age28 === 28, 'Adult applicant correctly calculated as age 28', `Got: ${age28}`);

// Case 1G: Native HTML date picker max attribute boundary
const maxAllowedDob = getMaxAllowedDobString();
assert(maxAllowedDob === exact18Str, 'HTML date picker max attribute exactly matches 18 years ago today', `Expected ${exact18Str}, Got: ${maxAllowedDob}`);

// Case 1H: Leap year boundary test (Feb 29)
const leapBirth = '2004-02-29'; // 2004 was a leap year
const leapAge = calculateAge(leapBirth);
assert(typeof leapAge === 'number' && leapAge >= 20, 'Leap year birthday (Feb 29) calculates accurately', `Got: ${leapAge}`);

// Case 1I: Invalid date string
assert(calculateAge('invalid-date') === null, 'Malformed date string safely returns null');
assert(calculateAge('') === null, 'Empty date string returns null');

// --------------------------------------------------------------------------
// 2. COMPLETE FIELD VALIDATION LOGIC TESTS
// --------------------------------------------------------------------------
console.log('\n--- 2. Comprehensive Field Validation Rules ---');

// Replicate component validation function for unit test verification
const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi (NCT)',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

function validateField(name, rawValue) {
  const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

  switch (name) {
    case 'fullName':
      if (!value) return 'Full name is required.';
      if (value.length < 3) return 'Full name must be at least 3 characters long.';
      if (value.length > 70) return 'Full name cannot exceed 70 characters.';
      if (!/^[a-zA-Z\s.'-]+$/.test(value)) return 'Full name should only contain letters, spaces, dots, hyphens, and apostrophes.';
      return '';

    case 'dob': {
      if (!rawValue) return 'Date of birth is required.';
      const selectedDate = parseLocalDate(rawValue);
      if (!selectedDate || isNaN(selectedDate.getTime())) return 'Please enter a valid date of birth.';
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (selectedDate > todayDate) return 'Date of birth cannot be in the future.';
      if (selectedDate.getTime() === todayDate.getTime()) return 'Date of birth cannot be today.';

      const age = calculateAge(rawValue);
      if (age === null || isNaN(age)) return 'Please enter a valid date of birth.';
      if (age < 18) return `Applicant must be at least 18 years old to open an account (Current age: ${age < 0 ? 0 : age} years).`;
      if (age > 120 || selectedDate.getFullYear() < 1900) return 'Please enter a realistic date of birth (maximum age is 120 years).';
      return '';
    }

    case 'gender':
      if (!rawValue) return 'Please select a gender.';
      if (!['Male', 'Female', 'Other', 'Prefer not to say'].includes(rawValue)) return 'Please select a valid gender option.';
      return '';

    case 'mobileNumber':
      if (!value) return 'Mobile number is required.';
      if (!/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210).';
      return '';

    case 'email': {
      if (!value) return 'Email address is required.';
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(value)) return 'Enter a valid email address (e.g., name@example.com).';
      return '';
    }

    case 'streetAddress':
      if (!value) return 'Door number and street are required.';
      if (value.length < 5) return 'Please provide a complete street address (minimum 5 characters).';
      return '';

    case 'city':
      if (!value) return 'City is required.';
      if (!/^[a-zA-Z\s.-]+$/.test(value)) return 'City name should only contain letters, spaces, dots, and hyphens.';
      return '';

    case 'state':
      if (!rawValue) return 'Please select a state or union territory.';
      if (!INDIAN_STATES_AND_UTS.includes(rawValue)) return 'Please select a valid Indian State or Union Territory from the list.';
      return '';

    case 'pinCode':
      if (!value) return 'PIN code is required.';
      if (!/^[1-9][0-9]{5}$/.test(value)) return 'PIN code must be exactly 6 numeric digits (cannot start with 0).';
      return '';

    case 'accountType':
      if (!rawValue) return 'Please select an account type.';
      if (!['Savings Account', 'Current Account'].includes(rawValue)) return 'Please select a valid account type.';
      return '';

    case 'branchName':
      if (!value) return 'Branch name is required.';
      if (value.length < 3) return 'Branch name must be at least 3 characters long.';
      return '';

    case 'initialDeposit': {
      if (value === '' || value === null || value === undefined) return 'Initial deposit amount is required.';
      if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Please enter a valid numeric deposit amount (e.g., 5000 or 5000.50).';
      const depositNum = parseFloat(value);
      if (isNaN(depositNum) || depositNum <= 0) return 'Initial deposit must be a positive number greater than 0.';
      if (depositNum > 100000000) return 'Deposit amount exceeds the maximum single online transaction limit (₹10,00,00,000).';
      return '';
    }

    default:
      return '';
  }
}

// DOB Validation Logic Tests
assert(validateField('dob', '') === 'Date of birth is required.', 'Empty DOB rejected');
assert(validateField('dob', tomorrowStr) === 'Date of birth cannot be in the future.', 'Future DOB rejected');
assert(validateField('dob', bornTodayStr) === 'Date of birth cannot be today.', "Today's date rejected");
assert(validateField('dob', under18Str).includes('at least 18 years old'), '17-year-old applicant rejected with clear message');
assert(validateField('dob', exact18Str) === '', 'Exact 18-year-old applicant accepted');
assert(validateField('dob', '1995-05-15') === '', 'Adult (1995) applicant accepted');
assert(validateField('dob', '1850-01-01').includes('realistic date of birth'), 'Date before 1900 rejected (>120 years)');

// Deposit Validation Logic Tests
assert(validateField('initialDeposit', '') === 'Initial deposit amount is required.', 'Empty deposit rejected');
assert(validateField('initialDeposit', '0') === 'Please enter a valid numeric deposit amount (e.g., 5000 or 5000.50).' || validateField('initialDeposit', '0').includes('positive number'), 'Zero deposit rejected');
assert(validateField('initialDeposit', '-500') === 'Please enter a valid numeric deposit amount (e.g., 5000 or 5000.50).', 'Negative deposit rejected');
assert(validateField('initialDeposit', '1e5').includes('numeric deposit amount'), 'Scientific notation rejected');
assert(validateField('initialDeposit', '5000.999').includes('numeric deposit amount'), 'More than 2 decimal places rejected');
assert(validateField('initialDeposit', '5000') === '', 'Whole number deposit (5000) accepted');
assert(validateField('initialDeposit', '5000.50') === '', 'Valid decimal deposit (5000.50) accepted');
assert(validateField('initialDeposit', '200000000').includes('exceeds the maximum'), 'Deposit > 10 Crore limit rejected');

// Mobile Validation & Masking Tests
assert(validateField('mobileNumber', '') === 'Mobile number is required.', 'Empty mobile rejected');
assert(validateField('mobileNumber', '12345').includes('10-digit Indian mobile'), 'Short mobile rejected');
assert(validateField('mobileNumber', '4876543210').includes('10-digit Indian mobile'), 'Mobile not starting with 6-9 rejected');
assert(validateField('mobileNumber', '9876543210') === '', 'Valid Indian mobile (9876543210) accepted');

function maskMobile(mobile) {
  if (!mobile) return '••••••••••';
  const clean = mobile.trim();
  if (clean.length < 4) return '••••••••••';
  return `XXXXXX${clean.slice(-4)}`;
}
assert(maskMobile('9876543210') === 'XXXXXX3210', 'Mobile correctly masked to XXXXXX3210');

// PIN Code Tests
assert(validateField('pinCode', '012345').includes('cannot start with 0'), 'PIN code starting with 0 rejected');
assert(validateField('pinCode', '56001').includes('exactly 6 numeric digits'), '5-digit PIN rejected');
assert(validateField('pinCode', '5600001').includes('exactly 6 numeric digits'), '7-digit PIN rejected');
assert(validateField('pinCode', '560001') === '', 'Valid 6-digit PIN accepted');

// Name & Whitespace Sanitization Tests
assert(validateField('fullName', '  ').includes('Full name is required'), 'Whitespace-only name rejected');
assert(validateField('fullName', 'John 123').includes('letters, spaces, dots'), 'Numbers in name rejected');
assert(validateField('fullName', 'Rajesh Kumar Sharma') === '', 'Valid name accepted');

// --------------------------------------------------------------------------
// 3. FULL FORM VALIDATION INTEGRATION TEST
// --------------------------------------------------------------------------
console.log('\n--- 3. Full Form Submission Integration Simulation ---');

const mockValidApplication = {
  fullName: 'Priya Sundaram',
  dob: exact18Str, // Exactly 18 years old today!
  gender: 'Female',
  mobileNumber: '9876543210',
  email: 'priya.sundaram@example.com',
  streetAddress: 'No. 14, 2nd Main Road, Gandhi Nagar',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pinCode: '600020',
  accountType: 'Savings Account',
  branchName: 'Adyar Branch',
  initialDeposit: '10000.00'
};

const errors = {};
Object.keys(mockValidApplication).forEach((field) => {
  const err = validateField(field, mockValidApplication[field]);
  if (err) errors[field] = err;
});

assert(Object.keys(errors).length === 0, 'Full valid application with 18-year-old applicant passes with 0 errors');

// Test Underage Application
const mockUnderageApplication = { ...mockValidApplication, dob: under18Str };
const underageErrors = {};
Object.keys(mockUnderageApplication).forEach((field) => {
  const err = validateField(field, mockUnderageApplication[field]);
  if (err) underageErrors[field] = err;
});

assert(Object.keys(underageErrors).length === 1 && underageErrors.dob !== undefined, 'Underage application correctly caught with exactly 1 error on dob field');

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passedTests} passed, ${failedTests} failed.`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
}
