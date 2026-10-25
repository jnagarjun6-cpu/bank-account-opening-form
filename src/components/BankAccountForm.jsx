import React, { useState } from 'react';

// List of Indian States and Union Territories for the State dropdown
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
 * BankAccountForm Component
 * Manages the state, validation, submission, and reset for the account opening entry form.
 */
function BankAccountForm() {
  // State for form input values (controlled inputs)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // State for storing validation error messages for each field
  const [errors, setErrors] = useState({});

  // State for storing the successfully submitted data snapshot
  const [submittedData, setSubmittedData] = useState(null);

  // State to track if the form was successfully submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate today's date in YYYY-MM-DD format to prevent future DOB selection
  const todayDateString = new Date().toISOString().split('T')[0];

  /**
   * Validates a single field by name and value.
   * Returns an error message string if invalid, or empty string "" if valid.
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          return 'Full name is required.';
        }
        if (value.trim().length < 3) {
          return 'Full name must be at least 3 characters long.';
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
          return 'Full name should only contain letters, spaces, and dots.';
        }
        return '';

      case 'dob': {
        if (!value) {
          return 'Date of birth is required.';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
          return 'Date of birth cannot be in the future.';
        }
        if (selectedDate.getFullYear() < 1900) {
          return 'Please enter a realistic date of birth.';
        }
        return '';
      }

      case 'gender':
        if (!value) {
          return 'Please select a gender.';
        }
        return '';

      case 'mobileNumber':
        if (!value.trim()) {
          return 'Mobile number is required.';
        }
        // Validates standard 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9)
        if (!/^[6-9]\d{9}$/.test(value.trim())) {
          return 'Enter a valid 10-digit Indian mobile number (e.g., 9876543210).';
        }
        return '';

      case 'email': {
        if (!value.trim()) {
          return 'Email address is required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return 'Enter a valid email address (e.g., name@example.com).';
        }
        return '';
      }

      case 'streetAddress':
        if (!value.trim()) {
          return 'Door number and street are required.';
        }
        if (value.trim().length < 4) {
          return 'Please provide a complete street address.';
        }
        return '';

      case 'city':
        if (!value.trim()) {
          return 'City is required.';
        }
        return '';

      case 'state':
        if (!value) {
          return 'Please select a state or union territory.';
        }
        return '';

      case 'pinCode':
        if (!value.trim()) {
          return 'PIN code is required.';
        }
        // Validates Indian 6-digit postal PIN code
        if (!/^\d{6}$/.test(value.trim())) {
          return 'PIN code must be exactly 6 numeric digits.';
        }
        return '';

      case 'accountType':
        if (!value) {
          return 'Please select an account type.';
        }
        return '';

      case 'branchName':
        if (!value.trim()) {
          return 'Branch name is required.';
        }
        return '';

      case 'initialDeposit': {
        if (value === '' || value === null || value === undefined) {
          return 'Initial deposit amount is required.';
        }
        const depositNum = Number(value);
        if (isNaN(depositNum) || depositNum <= 0) {
          return 'Initial deposit must be a positive number greater than 0.';
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

    // Update form data state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // If an error previously existed for this field, revalidate it to give immediate feedback
    if (errors[name]) {
      const errorMessage = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage
      }));
    }
  };

  /**
   * Handles input blur event (when user clicks or tabs out of an input).
   * Validates the field immediately after interaction so the user knows if it's correct.
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
   * Validates all fields, prevents page reload, and displays confirmation summary if valid.
   */
  const handleSubmit = (e) => {
    // 1. Prevent default browser page refresh
    e.preventDefault();

    // 2. Run comprehensive validation across all fields
    const validationErrors = validateAllFields();

    // 3. If errors exist, update error state and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitted(false);
      setSubmittedData(null);

      // Focus on the first invalid field for better user accessibility
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
      return;
    }

    // 4. If all validations pass, save a snapshot of submitted data and mark as submitted
    setErrors({});
    setSubmittedData({ ...formData });
    setIsSubmitted(true);

    // Smooth scroll to the success message
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
   * Helper function to mask mobile number for customer privacy (e.g. XXXXXX7890).
   * Displays only the last 4 digits.
   */
  const maskMobileNumber = (mobile) => {
    if (!mobile || mobile.length < 4) return '••••••••••';
    const lastFour = mobile.slice(-4);
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
                <span className="summary-label">Date of Birth</span>
                <span className="summary-value">{submittedData.dob}</span>
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
              Please enter your personal details exactly as they appear on your government-issued ID.
            </p>

            <div className="form-grid">
              {/* 1. Full Name */}
              <div className="form-group col-span-2">
                <label htmlFor="fullName" className="field-label">
                  Full Name <span className="required-star">*</span>
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
                  aria-invalid={!!errors.fullName}
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
                <label htmlFor="dob" className="field-label">
                  Date of Birth <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  max={todayDateString}
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.dob ? 'input-error' : ''}`}
                  aria-invalid={!!errors.dob}
                  aria-describedby={errors.dob ? 'dob-error' : undefined}
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
                  Gender <span className="required-star">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.gender ? 'input-error' : ''}`}
                  aria-invalid={!!errors.gender}
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
                  Mobile Number <span className="required-star">*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">+91</span>
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
                    aria-invalid={!!errors.mobileNumber}
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
                  Email Address <span className="required-star">*</span>
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
                  aria-invalid={!!errors.email}
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
                  Door Number and Street <span className="required-star">*</span>
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
                  aria-invalid={!!errors.streetAddress}
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
                  City <span className="required-star">*</span>
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
                  aria-invalid={!!errors.city}
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
                  State / Union Territory <span className="required-star">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.state ? 'input-error' : ''}`}
                  aria-invalid={!!errors.state}
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
                  PIN Code <span className="required-star">*</span>
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
                  aria-invalid={!!errors.pinCode}
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
                  Account Type <span className="required-star">*</span>
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`field-input ${errors.accountType ? 'input-error' : ''}`}
                  aria-invalid={!!errors.accountType}
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
                  Branch Name <span className="required-star">*</span>
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
                  aria-invalid={!!errors.branchName}
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
                  Initial Deposit Amount (₹) <span className="required-star">*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">₹</span>
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
                    aria-invalid={!!errors.initialDeposit}
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
