import React from 'react';
import { useApp } from '../../context/AppContext';
import { CellCitedMark, EyeIcon } from '../common/Icons';
import './Login.css';

export default function Login() {
  const {
    authMode,
    setAuthMode,
    loginError,
    setLoginError,
    showPassword,
    setShowPassword,
    handleLogin,
    handleSendOtp,
    handleResetPassword,
    handleResendOtp,
    authLoading,
    authNotice,
    setAuthNotice,
    authNoticeType,
    forgotIdentifier,
    setForgotIdentifier,
    maskedEmail,
    resetOtp,
    setResetOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    notice,
  } = useApp();

  const noticeText =
    typeof notice === 'object' && notice !== null
      ? notice.message
      : String(notice || '');

  return (
    <main className="login">
      <section className="login-brand-panel">
        <div className="login-brand-header">
          <CellCitedMark />
          <div
            className="login-doctor-tag"
            title="Consultant Pathologist & Signatory"
          >
            <span className="doc-icon">👨‍⚕️</span>
            <div>
              <strong>Dr. Sanjay Singh</strong>
              <span>MD (Path)</span>
            </div>
          </div>
        </div>

        <span className="login-eyebrow">PATHOLOGY · HEALTH CARE</span>
        <h1 className="login-title">
          Cell Cited Pathology Lab <span className="sub-abbr">(CCPL)</span>
        </h1>

        <div className="login-services-grid">
          <div className="service-chip">
            <span className="chip-bullet">•</span>
            <b>All Types Pathology Tests Available</b>
          </div>
          <div className="service-chip">
            <span className="chip-bullet">•</span>
            <b>24x7 Sample Collection Facility</b>
          </div>
          <div className="service-chip">
            <span className="chip-bullet">•</span>
            <b>Home Sample Collection Available</b>
          </div>
          <div className="service-chip">
            <span className="chip-bullet">•</span>
            <b>Fast &amp; Reliable Report Delivery</b>
          </div>
          <div className="service-chip">
            <span className="chip-bullet">•</span>
            <b>Full Body Health Checkup Package</b>
          </div>
        </div>

        <div className="login-contact-card">
          <div className="contact-item">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div>
              <span className="contact-label">Helpline Numbers</span>
              <span className="contact-value">
                9554448906, 6307342505, 8601463398
              </span>
            </div>
          </div>

          <div className="contact-item">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <div>
              <span className="contact-label">Email Support</span>
              <span className="contact-value">ccpath11@gmail.com</span>
            </div>
          </div>

          <div className="contact-item">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <span className="contact-label">Laboratory Address</span>
              <span className="contact-value">
                Shop No.-17 City Trade Center Lakhpedabagh Chauraha Barabanki (
                225001)
              </span>
            </div>
          </div>
        </div>
      </section>

      {authMode === 'login' && (
        <form onSubmit={handleLogin}>
          <h2>Sign in</h2>
          {loginError && (
            <div className="login-error-alert" role="alert">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{loginError}</span>
            </div>
          )}
          <input
            name="username"
            placeholder="Username or Email"
            required
            defaultValue={forgotIdentifier || ''}
            onChange={() => {
              if (loginError) setLoginError('');
            }}
          />
          <div className="password-input-wrapper">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              onChange={() => {
                if (loginError) setLoginError('');
              }}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <div className="login-forgot-row">
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setAuthMode('forgot');
                setAuthNotice('');
                setLoginError('');
              }}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" disabled={authLoading}>
            {authLoading ? 'Opening workspace...' : 'Login'}
          </button>
          {notice && <p className="notice">{noticeText}</p>}
        </form>
      )}

      {authMode === 'forgot' && (
        <form onSubmit={handleSendOtp} className="auth-card-form">
          <h2>Forgot password</h2>
          <p className="auth-card-desc">
            Enter your registered email address or username to receive a 6-digit
            OTP code to reset your password.
          </p>
          <input
            name="forgotIdentifier"
            type="text"
            value={forgotIdentifier}
            onChange={(e) => setForgotIdentifier(e.target.value)}
            placeholder="Registered email or username"
            required
            autoFocus
          />
          <button type="submit" disabled={authLoading}>
            {authLoading ? 'Sending OTP via EmailJS...' : 'Send OTP'}
          </button>
          {authNotice && (
            <p className={`auth-card-notice ${authNoticeType}`}>{authNotice}</p>
          )}
          <div className="auth-card-footer">
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setAuthMode('login');
                setAuthNotice('');
              }}
            >
              ← Back to Sign in
            </button>
          </div>
        </form>
      )}

      {authMode === 'reset' && (
        <form onSubmit={handleResetPassword} className="auth-card-form">
          <h2>Reset password</h2>
          <p className="auth-card-desc">
            Enter the 6-digit OTP sent to{' '}
            <b>{maskedEmail || forgotIdentifier}</b> and set a new password.
          </p>
          <input
            name="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={resetOtp}
            onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            required
            autoFocus
            className="otp-code-input"
          />
          <div className="password-input-wrapper">
            <input
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              required
              minLength={6}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              title={showNewPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showNewPassword} />
            </button>
          </div>
          <input
            name="confirmPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength={6}
          />
          <button type="submit" disabled={authLoading}>
            {authLoading ? 'Resetting password...' : 'Reset password'}
          </button>
          <div className="resend-row">
            <span>Didn't receive code?</span>
            <button
              type="button"
              className="link-btn"
              disabled={authLoading}
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          </div>
          {authNotice && (
            <p className={`auth-card-notice ${authNoticeType}`}>{authNotice}</p>
          )}
          <div className="auth-card-footer">
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setAuthMode('login');
                setAuthNotice('');
              }}
            >
              ← Back to Sign in
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
