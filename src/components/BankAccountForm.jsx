import React, { useState, useId } from 'react';

// List of Indian States and Union Territories for the State dropdown (36 total)
const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Initial blank values for the form fields
const INITIAL_FORM_DATA = {
  fullName: '',
  dob: '',
  gender: '',
  mobileNumber: '',
  email: '',
  streetAddress: '',
  city: '',
  state: '',
  pinCode: '',
  accountType: '',
  branchName: '',
  initialDeposit: ''
};

/**
 * Calculates exact age based on birth date string (YYYY-MM-DD).
 * Accounts for leap years, exact day, and month boundary checks.
 */
export const calculateAge = (dobString) => {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;

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
 */
export const getMaxAllowedDobString = () => {
  const today = new Date();
  const min18Date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return min18Date.toISOString().split('T')[0];
};

/**
 * BankAccountForm Component
 * Manages the state, validation, submission, and reset for the account opening entry form.
 * Adheres to strict enterprise standards:
 * - 18+ age boundary validation
 * - Positive numerical deposit validation & parsing
 * - Indian 10-digit mobile number validation and privacy masking
 * - Sanitization of leading/trailing whitespace
 * - Full semantic HTML, ARIA labels, error alerts, and autofocus on error
 */
function BankAccountForm() {
  // Controlled form state
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // Field validation error state
  const [errors, setErrors] = useState({});

  // Snapshot of submitted data for confirmation summary
  const [submittedData, setSubmittedData] = useState(null);

  // Submission status flag
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Computed max date for HTML input (18 years ago)
  const maxAllowedDob = getMaxAllowedDobString();

  // Current calculated age of applicant for live feedback
  const currentAge = calculateAge(formData.dob);

  /**
   * Validates a single field by name and value.
   * Returns an error message string if invalid, or empty string "" if valid.
   */
  const validateField = (name, rawValue) => {
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    switch (name) {
      case 'fullName': {
        if (!value) {
          return 'Full name is required.';
        }
        if (value.length < 3) {
          return 'Full name must be at least 3 characters long.';
        }
        if (value.length > 70) {
          return 'Full name cannot exceed 70 characters.';
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          return 'Full name should only contain letters, spaces, dots, hyphens, and apostrophes.';
        }
        return '';
      }

      case 'dob': {
        if (!rawValue) {
          return 'Date of birth is required.';
        }
        const selectedDate = new Date(rawValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(selectedDate.getTime())) {
          return 'Please enter a valid date of birth.';
        }

        // Boundary Check: Reject future dates
        if (selectedDate > today) {
          return 'Date of birth cannot be in the future.';
        }

        // Boundary Check: Reject today's date
        if (selectedDate.getTime() === today.getTime()) {
          return 'Date of birth cannot be today.';
        }

        // Boundary Check: Strict 18+ age restriction
        const age = calculateAge(rawValue);
        if (age === null || isNaN(age)) {
          return 'Please enter a valid date of birth.';
        }
        if (age < 18) {
          return `Applicant must be at least 18 years old to open an account (Current age: ${age < 0 ? 0 : age} years).`;
        }
        if (age > 120 || selectedDate.getFullYear() < 1900) {
          return 'Please enter a realistic date of birth (maximum age is 120 years).';
        }
        return '';
      }

      case 'gender': {
        if (!rawValue) {
          return 'Please select a gender.';
        }
        const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
        if (!validGenders.includes(rawValue)) {
          return 'Please select a valid gender option.';
        }
        return '';
      }

      case 'mobileNumber': {
        if (!value) {
          return 'Mobile number is required.';
        }
        // Strict Indian 10-digit mobile number format starting with 6, 7, 8, or 9
        if (!/^[6-9]\d{9}$/.test(value)) {
          return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210).';
        }
        return '';
      }

      case 'email': {
        if (!value) {
          return 'Email address is required.';
        }
        // RFC 5322 compliant standard email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailRegex.test(value)) {
          return 'Enter a valid email address (e.g., name@example.com).';
        }
        return '';
      }

      case 'streetAddress': {
        if (!value) {
          return 'Door number and street are required.';
        }
        if (value.length < 5) {
          return 'Please provide a complete street address (minimum 5 characters).';
        }
        return '';
      }

      case 'city': {
        if (!value) {
          return 'City is required.';
        }
        if (!/^[a-zA-Z\s.-]+$/.test(value)) {
          return 'City name should only contain letters, spaces, dots, and hyphens.';
        }
        return '';
      }

      case 'state': {
        if (!rawValue) {
          return 'Please select a state or union territory.';
        }
        if (!INDIAN_STATES_AND_UTS.includes(rawValue)) {
          return 'Please select a valid Indian State or Union Territory from the list.';
        }
        return '';
      }

      case 'pinCode': {
        if (!value) {
          return 'PIN code is required.';
        }
        // Standard Indian postal PIN code: 6 numeric digits, cannot start with 0
        if (!/^[1-9][0-9]{5}$/.test(value)) {
          return 'PIN code must be exactly 6 numeric digits (cannot start with 0).';
        }
        return '';
      }

      case 'accountType': {
        if (!rawValue) {
          return 'Please select an account type.';
        }
        const validAccountTypes = ['Savings Account', 'Current Account'];
        if (!validAccountTypes.includes(rawValue)) {
          return 'Please select a valid account type.';
        }
        return '';
      }

      case 'branchName': {
        if (!value) {
          return 'Branch name is required.';
        }
        if (value.length < 3) {
          return 'Branch name must be at least 3 characters long.';
        }
        return '';
      }

      case 'initialDeposit': {
        if (value === '' || value === null || value === undefined) {
          return 'Initial deposit amount is required.';
        }
        // Enforce valid positive decimal currency format (up to 2 decimal places)
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          return 'Please enter a valid numeric deposit amount (e.g., 5000 or 5000.50).';
        }
        const depositNum = parseFloat(value);
        if (isNaN(depositNum) || depositNum <= 0) {
          return 'Initial deposit must be a positive number greater than 0.';
        }
        if (depositNum > 100000000) {
          return 'Deposit amount exceeds the maximum single online transaction limit (₹10,00,00,000).';
        }
        return '';
      }

      default:
        return '';
    }
  };

  /**
   * Handles user input changes.
   * Updates state and immediately clears or updates the error message for that field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Controlled state update
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Revalidate on change if error already exists (instant correction feedback)
    if (errors[name]) {
      const errorMessage = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage
      }));
    }
  };

  /**
   * Handles input blur event.
   * Validates field on blur to provide immediate feedback once the user leaves the input.
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    if (errorMessage) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage
      }));
    }
  };

  /**
   * Validates all form fields before submission.
   * Returns an object of errors where key is field name and value is error message.
   */
  const validateAllFields = () => {
    const newErrors = {};

    Object.keys(formData).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    return newErrors;
  };

  /**
   * Handles form submission.
   * Validates all fields, sanitizes inputs, prevents page reload, and displays confirmation summary if valid.
   */
  const handleSubmit = (e) => {
    // Prevent default browser page refresh
    e.preventDefault();

    // Comprehensive validation across all fields
    const validationErrors = validateAllFields();

    // If validation fails, focus the first invalid field for accessibility
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitted(false);
      setSubmittedData(null);

      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus({ preventScroll: false });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Sanitize and trim strings before storing the submitted snapshot
    const sanitizedSnapshot = {
      fullName: formData.fullName.trim(),
      dob: formData.dob,
      gender: formData.gender,
      mobileNumber: formData.mobileNumber.trim(),
      email: formData.email.trim(),
      streetAddress: formData.streetAddress.trim(),
      city: formData.city.trim(),
      state: formData.state,
      pinCode: formData.pinCode.trim(),
      accountType: formData.accountType,
      branchName: formData.branchName.trim(),
      initialDeposit: String(parseFloat(formData.initialDeposit.trim()))
    };

    setErrors({});
    setSubmittedData(sanitizedSnapshot);
    setIsSubmitted(true);

    // Smooth scroll to the confirmation banner
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handles form reset.
   * Clears all input values, error messages, and submission summary.
   */
  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  /**
   * Helper function to mask mobile number for customer privacy (e.g. XXXXXX1234).
   * Displays only the last 4 digits.
   */
  const maskMobileNumber = (mobile) => {
    if (!mobile) return '••••••••••';
    const clean = mobile.trim();
    if (clean.length < 4) return '••••••••••';
    const lastFour = clean.slice(-4);
    return `XXXXXX${lastFour}`;
  };

  /**
   * Helper function to format deposit amount in Indian currency format.
   */
  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="form-wrapper">
      {/* Success and Demonstration Notice Alert */}
      {isSubmitted && submittedData && (
        <section
          className="submission-banner"
          aria-live="polite"
          id="confirmation-section"
        >
          <div className="banner-header">
            <span className="banner-icon" aria-hidden="true">✓</span>
            <div>
              <h2 className="banner-title">Application Submitted Successfully!</h2>
              <p className="banner-subtitle">
                Thank you, <strong>{submittedData.fullName}</strong>. Your entry has been recorded.
              </p>
            </div>
          </div>

          <div className="disclaimer-note">
            <strong>Demonstration Notice:</strong> This is a simulation entry form built for a React JS learning project. No real bank account has been opened and no data has been transmitted to a remote server.
          </div>

          {/* Confirmation Summary Card */}
          <div className="summary-card">
            <h3 className="summary-title">Submitted Application Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Full Name</span>
                <span className="summary-value">{submittedData.fullName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Date of Birth & Age</span>
                <span className="summary-value">
                  {submittedData.dob}
                  <span className="age-summary-badge">
                    {calculateAge(submittedData.dob)} Years (18+ Verified)
                  </span>
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Gender</span>
                <span className="summary-value">{submittedData.gender}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Mobile Number</span>
                <span className="summary-value masked-value">
                  {maskMobileNumber(submittedData.mobileNumber)}
                  <span className="privacy-badge">Masked for Privacy</span>
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Email Address</span>
                <span className="summary-value">{submittedData.email}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Door No. & Street</span>
                <span className="summary-value">{submittedData.streetAddress}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">City</span>
                <span className="summary-value">{submittedData.city}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">State / UT</span>
                <span className="summary-value">{submittedData.state}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">PIN Code</span>
                <span className="summary-value">{submittedData.pinCode}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Account Type</span>
                <span className="summary-value badge-account">{submittedData.accountType}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Branch Name</span>
                <span className="summary-value">{submittedData.branchName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Initial Deposit</span>
                <span className="summary-value deposit-value">
                  {formatCurrency(submittedData.initialDeposit)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Entry Form Card */}
      <div className="card-container">
        <form onSubmit={handleSubmit} noValidate className="bank-form">
          {/* SECTION A: Personal Information */}
          <fieldset className="form-section">
            <legend className="section-legend">
              <span className="section-step">A</span>
              Personal Information
            </legend>
            <p className="section-hint">
              Please enter your personal details exactly as they appear on your government-issued ID. Applicants must be at least 18 years of age.
            </p>

            <div className="form-grid">
              {/* 1. Full Name */}
              <div className="form-group col-span-2">
                <label htmlFor="fullName" className="field-label">
                  Full Name <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Rajesh Kumar Sharma"
                  className={`field-input ${errors.fullName ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  required
                />
                {errors.fullName && (
                  <span id="fullName-error" className="error-message" role="alert">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* 2. Date of Birth */}
              <div className="form-group">
                <div className="label-with-badge">
                  <label htmlFor="dob" className="field-label">
                    Date of Birth <span className="required-star" aria-hidden="true">*</span>
                  </label>
                  {/* Dynamic Age Badge */}
                  {formData.dob && currentAge !== null && (
                    <span
                      id="dob-age-hint"
                      className={`age-live-badge ${currentAge >= 18 ? 'age-valid' : 'age-invalid'}`}
                    >
                      Age: {currentAge < 0 ? 0 : currentAge} {currentAge >= 18 ? '(Eligible)' : '(Under 18)'}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  max={maxAllowedDob}
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.dob ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.dob)}
                  aria-describedby={errors.dob ? 'dob-error' : (formData.dob ? 'dob-age-hint' : undefined)}
                  required
                />
                {errors.dob && (
                  <span id="dob-error" className="error-message" role="alert">
                    {errors.dob}
                  </span>
                )}
              </div>

              {/* 3. Gender */}
              <div className="form-group">
                <label htmlFor="gender" className="field-label">
                  Gender <span className="required-star" aria-hidden="true">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.gender ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.gender)}
                  aria-describedby={errors.gender ? 'gender-error' : undefined}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <span id="gender-error" className="error-message" role="alert">
                    {errors.gender}
                  </span>
                )}
              </div>

              {/* 4. Mobile Number */}
              <div className="form-group">
                <label htmlFor="mobileNumber" className="field-label">
                  Mobile Number <span className="required-star" aria-hidden="true">*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix" aria-hidden="true">+91</span>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="9876543210"
                    className={`field-input has-prefix ${errors.mobileNumber ? 'input-error' : ''}`}
                    aria-required="true"
                    aria-invalid={Boolean(errors.mobileNumber)}
                    aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                    required
                  />
                </div>
                {errors.mobileNumber && (
                  <span id="mobileNumber-error" className="error-message" role="alert">
                    {errors.mobileNumber}
                  </span>
                )}
              </div>

              {/* 5. Email Address */}
              <div className="form-group">
                <label htmlFor="email" className="field-label">
                  Email Address <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="rajesh.kumar@example.com"
                  className={`field-input ${errors.email ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email && (
                  <span id="email-error" className="error-message" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* SECTION B: Address Information */}
          <fieldset className="form-section">
            <legend className="section-legend">
              <span className="section-step">B</span>
              Address Information
            </legend>
            <p className="section-hint">
              Provide your permanent residential address for official communication and account correspondence.
            </p>

            <div className="form-grid">
              {/* 6. Door Number and Street */}
              <div className="form-group col-span-2">
                <label htmlFor="streetAddress" className="field-label">
                  Door Number and Street <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Flat No. 402, Green Valley Apartments, MG Road"
                  className={`field-input ${errors.streetAddress ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.streetAddress)}
                  aria-describedby={errors.streetAddress ? 'streetAddress-error' : undefined}
                  required
                />
                {errors.streetAddress && (
                  <span id="streetAddress-error" className="error-message" role="alert">
                    {errors.streetAddress}
                  </span>
                )}
              </div>

              {/* 7. City */}
              <div className="form-group">
                <label htmlFor="city" className="field-label">
                  City <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Bengaluru"
                  className={`field-input ${errors.city ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  required
                />
                {errors.city && (
                  <span id="city-error" className="error-message" role="alert">
                    {errors.city}
                  </span>
                )}
              </div>

              {/* 8. State */}
              <div className="form-group">
                <label htmlFor="state" className="field-label">
                  State / Union Territory <span className="required-star" aria-hidden="true">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.state ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  required
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES_AND_UTS.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <span id="state-error" className="error-message" role="alert">
                    {errors.state}
                  </span>
                )}
              </div>

              {/* 9. PIN Code */}
              <div className="form-group">
                <label htmlFor="pinCode" className="field-label">
                  PIN Code <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="560001"
                  className={`field-input ${errors.pinCode ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.pinCode)}
                  aria-describedby={errors.pinCode ? 'pinCode-error' : undefined}
                  required
                />
                {errors.pinCode && (
                  <span id="pinCode-error" className="error-message" role="alert">
                    {errors.pinCode}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* SECTION C: Account Information */}
          <fieldset className="form-section">
            <legend className="section-legend">
              <span className="section-step">C</span>
              Account Information
            </legend>
            <p className="section-hint">
              Select your preferred banking facility and specify your initial opening deposit amount.
            </p>

            <div className="form-grid">
              {/* 10. Account Type */}
              <div className="form-group">
                <label htmlFor="accountType" className="field-label">
                  Account Type <span className="required-star" aria-hidden="true">*</span>
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.accountType ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.accountType)}
                  aria-describedby={errors.accountType ? 'accountType-error' : undefined}
                  required
                >
                  <option value="">Select Account Type</option>
                  <option value="Savings Account">Savings Account</option>
                  <option value="Current Account">Current Account</option>
                </select>
                {errors.accountType && (
                  <span id="accountType-error" className="error-message" role="alert">
                    {errors.accountType}
                  </span>
                )}
              </div>

              {/* 11. Branch Name */}
              <div className="form-group">
                <label htmlFor="branchName" className="field-label">
                  Branch Name <span className="required-star" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="branchName"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Indiranagar Branch"
                  className={`field-input ${errors.branchName ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={Boolean(errors.branchName)}
                  aria-describedby={errors.branchName ? 'branchName-error' : undefined}
                  required
                />
                {errors.branchName && (
                  <span id="branchName-error" className="error-message" role="alert">
                    {errors.branchName}
                  </span>
                )}
              </div>

              {/* 12. Initial Deposit Amount */}
              <div className="form-group col-span-2">
                <label htmlFor="initialDeposit" className="field-label">
                  Initial Deposit Amount (₹) <span className="required-star" aria-hidden="true">*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix" aria-hidden="true">₹</span>
                  <input
                    type="number"
                    id="initialDeposit"
                    name="initialDeposit"
                    min="1"
                    step="any"
                    value={formData.initialDeposit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 5000"
                    className={`field-input has-prefix ${errors.initialDeposit ? 'input-error' : ''}`}
                    aria-required="true"
                    aria-invalid={Boolean(errors.initialDeposit)}
                    aria-describedby={errors.initialDeposit ? 'initialDeposit-error' : undefined}
                    required
                  />
                </div>
                {errors.initialDeposit && (
                  <span id="initialDeposit-error" className="error-message" role="alert">
                    {errors.initialDeposit}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Form Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              id="reset-button"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="submit-button"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BankAccountForm;
