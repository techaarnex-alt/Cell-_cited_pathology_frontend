import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_USER } from '../../constants';
import { api } from '../../api';
import { EyeIcon } from '../common/Icons';
import './Settings.css';

export default function Settings() {
  const { currentUser, setNotice, setView } = useApp();
  const profileUser = currentUser || DEFAULT_USER;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localNotice, setLocalNotice] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalNotice(null);

    if (!oldPassword.trim()) {
      setLocalNotice({
        type: 'error',
        message: 'Please enter your current old password.',
      });
      return;
    }

    if (!newPassword.trim()) {
      setLocalNotice({
        type: 'error',
        message: 'Please enter a new password.',
      });
      return;
    }
    if (newPassword.length < 6) {
      setLocalNotice({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (!confirmPassword.trim()) {
      setLocalNotice({
        type: 'error',
        message: 'Please confirm your new password.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalNotice({
        type: 'error',
        message: 'New password and confirm password do not match.',
      });
      return;
    }

    if (oldPassword === newPassword) {
      setLocalNotice({
        type: 'error',
        message:
          'New password cannot be the same as your old password. Please choose a different password.',
      });
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({
        oldPassword: oldPassword.trim(),
        newPassword,
        confirmPassword,
      });

      setLocalNotice({
        type: 'success',
        message:
          'Password reset successful! Your password has been updated in the database. Use your new password for your future logins.',
      });
      setNotice({
        title: 'Password Updated',
        message:
          'Your administrator password has been updated successfully.',
        type: 'success',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errMsg =
        err.message ||
        err.error?.message ||
        'Failed to update password. Please check your old password.';
      setLocalNotice({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page-wrapper">
      <header className="page-head">
        <div>
          <span className="eyebrow">SETTINGS</span>
        </div>
      </header>

      {/* Account Identity Summary */}
      <div className="settings-account-banner">
        <div className="settings-account-info">
          <div className="settings-account-avatar">
            {profileUser.name ? profileUser.name.charAt(0) : 'A'}
          </div>
          <div className="settings-account-details">
            <b>{profileUser.name || 'Super Administrator'}</b>
            <span>
              @{profileUser.username || 'admin'} ·{' '}
              {profileUser.email || 'admin@cellcited.com'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="settings-role-tag">
            {profileUser.role || 'administrator'}
          </span>
          <button
            type="button"
            className="secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => setView('profile')}
          >
            View Profile →
          </button>
        </div>
      </div>

      {/* Reset Password Card */}
      <section className="settings-card">
        <div className="settings-card-head">
          <div className="settings-icon-badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2>Reset Password</h2>
            <p>
              Update your administrator password by entering your current old
              password and new password.
            </p>
          </div>
        </div>

        {localNotice && (
          <div className={`settings-notice-box ${localNotice.type}`}>
            <span style={{ fontSize: '16px' }}>
              {localNotice.type === 'success' ? '✓' : '⚠'}
            </span>
            <div style={{ flex: 1 }}>{localNotice.message}</div>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="settings-reset-form">
          {/* 1st: Old Password */}
          <div className="settings-form-row">
            <label>1. Old password</label>
            <div className="settings-input-action">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (localNotice) setLocalNotice(null);
                }}
                placeholder="Enter your current old password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="settings-eye-btn"
                onClick={() => setShowOldPassword(!showOldPassword)}
                aria-label="Toggle old password visibility"
              >
                <EyeIcon open={showOldPassword} />
              </button>
            </div>
            <small style={{ color: '#64748b' }}>
              Enter your current account password to authorize the change.
            </small>
          </div>

          {/* 2nd: New Password */}
          <div className="settings-form-row">
            <label>2. New password</label>
            <div className="settings-input-action">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (localNotice) setLocalNotice(null);
                }}
                placeholder="Enter new password (min. 6 characters)"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="settings-eye-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label="Toggle new password visibility"
              >
                <EyeIcon open={showNewPassword} />
              </button>
            </div>
            <small style={{ color: '#64748b' }}>
              Must be at least 6 characters long.
            </small>
          </div>

          {/* 3rd: Confirm Password */}
          <div className="settings-form-row">
            <label>3. Confirm password</label>
            <div className="settings-input-action">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (localNotice) setLocalNotice(null);
                }}
                placeholder="Re-enter your new password to confirm"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="settings-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {newPassword && confirmPassword && (
              <small
                style={{
                  color:
                    newPassword === confirmPassword ? '#059669' : '#dc2626',
                  fontWeight: 500,
                }}
              >
                {newPassword === confirmPassword
                  ? '✓ Passwords match'
                  : '✕ Passwords do not match'}
              </small>
            )}
          </div>

          <div className="settings-actions-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Validating & Resetting…' : 'Reset Password'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setLocalNotice(null);
              }}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
