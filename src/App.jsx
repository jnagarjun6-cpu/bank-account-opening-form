import React from 'react';
import BankAccountForm from './components/BankAccountForm';
import './App.css';

/**
 * App Component
 * The main container rendering the bank header, entry form, and project footer.
 */
function App() {
  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="bank-header">
        <div className="header-brand">
          <div className="brand-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7V9H22V7L12 2ZM4 11V19H7V11H4ZM10 11V19H14V11H10ZM17 11V19H20V11H17ZM2 21V23H22V21H2Z" />
            </svg>
          </div>
          <span className="brand-name">
            Mariamman Indian Bank <span className="brand-badge">MIB</span>
          </span>
        </div>
        <h1 className="header-title">Bank Account Opening Form</h1>
        <p className="header-description">
          Open a new personal or business banking account with ease. Complete the sections below with your accurate personal, address, and account preferences.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <BankAccountForm />
      </main>

      {/* Footer Section */}
      <footer className="bank-footer">
        <p>Bank Account Opening Form — React JS Learning Project</p>
      </footer>
    </div>
  );
}

export default App;
