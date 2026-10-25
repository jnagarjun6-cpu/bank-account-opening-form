# Mariamman Indian Bank (MIB) — Bank Account Opening Form

A clean, responsive, and beginner-friendly Bank Account Opening Entry Form built with **React JS** and **Vite**.

---

## 1. Project Objective

This project is a frontend learning application designed to practice fundamental and intermediate React JS concepts, including:
- Component-based architecture in React.
- Form management with controlled components and React's `useState` hook.
- Multi-field input validation (regular expressions, date restrictions, numerical rules).
- Responsive UI design using pure Vanilla CSS.
- Preparing a clean, structured repository for GitHub version control.

> **Demonstration Notice:** This application is for demonstration and educational purposes only. No real bank accounts are opened, and no data is transmitted to an external backend or database.

---

## 2. Technologies Used

- **React JS** (v19) — Component-based UI library
- **JavaScript (JSX)** — Syntax extension for component structure and logic
- **HTML5** — Semantic page elements (`header`, `main`, `footer`, `fieldset`, `legend`)
- **CSS3** — Custom design system, CSS Grid, Flexbox, media queries
- **Vite** — Next-generation frontend tooling and development server

---

## 3. Features

- **Bank-Inspired Clean Design**: Styled with a professional navy blue and restrained blue accent palette, rounded inputs, subtle shadows, and crisp typography.
- **Structured 3-Section Layout**:
  - **Section A: Personal Information** (Full Name, Date of Birth, Gender, Mobile Number, Email Address).
  - **Section B: Address Information** (Door Number & Street, City, State/Union Territory dropdown with 36 Indian states & UTs, 6-digit PIN Code).
  - **Section C: Account Information** (Account Type dropdown, Branch Name, Initial Deposit Amount).
- **Controlled Components**: Every input is managed directly by React state for predictable, synchronous data flow.
- **Robust Field Validation**:
  - Validates all fields upon form submission and during interaction.
  - Rejects future dates for Date of Birth (`max` date constraint + programmatic check).
  - Validates 10-digit Indian mobile numbers starting with 6–9.
  - Validates standard email addresses via regex.
  - Validates 6-digit postal PIN codes.
  - Enforces positive numerical values for the initial deposit amount.
  - Provides inline error messages placed directly below the relevant input field.
  - Dynamically clears or updates error messages as the user types or corrects the input.
- **Privacy-Preserving Confirmation Summary**:
  - Prevents default page refresh on submission.
  - Displays a success confirmation banner and an application details summary.
  - Masks the mobile number (e.g., `XXXXXX7890`) to protect customer privacy.
  - Formats initial deposit into formatted Indian currency (₹).
- **Instant Form Reset**:
  - Provides a single-click Reset button to wipe all inputs, validation errors, and confirmation summaries.
- **Fully Responsive**:
  - Two-column grid on desktop and laptops.
  - Automatically collapses into a single-column layout on mobile devices and tablets.

---

## 4. Project Folder Structure

```
bank-account-opening-form/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── BankAccountForm.jsx   # Core form logic, validation, state & summary
│   ├── App.jsx             # Main container: header, form, footer
│   ├── App.css             # Component styling, responsive grids, buttons, cards
│   ├── index.css           # Global CSS variables, font definitions, resets
│   └── main.jsx            # React root entry point
├── .gitignore              # Ignored files (node_modules, dist, etc.)
├── index.html              # HTML shell with meta tags and Google Fonts
├── package.json            # Project dependencies and npm scripts
├── README.md               # Project documentation
└── vite.config.js          # Vite configuration
```

---

## 5. Installation Instructions

Follow these steps to set up the project on your local machine:

1. **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
2. **Open Terminal / Command Prompt** in the project directory:
   ```bash
   cd bank-account-opening-form
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 6. How to Run the Application Locally

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. Open your web browser and navigate to the local URL displayed in the terminal (typically `http://localhost:5173`).
3. To create a production bundle:
   ```bash
   npm run build
   ```

---

## 7. License & Credits

Created as a React JS learning project demonstration.
