import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_USER } from '../../constants';
import './Profile.css';

export default function Profile() {
  const { currentUser, labProfile } = useApp();
  const profileUser = currentUser || DEFAULT_USER;
  const lab = profileUser.laboratory || labProfile;
  const phones =
    lab.phones && lab.phones.length
      ? lab.phones.join(' · ')
      : (labProfile.phones || []).join(' · ');
  const roleDisplay = profileUser.role
    ? profileUser.role.charAt(0).toUpperCase() + profileUser.role.slice(1)
    : 'Administrator';

  return (
    <div className="profile-page-wrapper">
      <header className="profile-hero-header">
        <div className="profile-avatar-circle">
          <img
            src="/cell-cited-logo.jpg"
            alt={profileUser.name || 'User avatar'}
            className="profile-avatar-img"
            onError={(e) => {
              e.currentTarget.src = '/cell-cited-logo.jpg';
            }}
          />
        </div>
        <div className="profile-hero-info">
          <div className="profile-name-badge-row">
            <h1 className="profile-hero-name">
              {profileUser.name || 'Super Administrator'}
            </h1>
            <span className="profile-verified-badge" title="Verified Account">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-label="Verified"
              >
                <circle cx="12" cy="12" r="10" fill="#1d9bf0" />
                <path
                  d="M8.5 12.2l2.3 2.3 4.7-4.7"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="profile-hero-email">
            {profileUser.email || 'admin@cellcited.com'}
          </div>
        </div>
      </header>

      <section className="profile-details-card">
        <h2 className="profile-card-title">Personal details</h2>
        <div className="profile-details-list">
          <div className="profile-detail-row">
            <span className="profile-detail-label">Full name:</span>
            <span className="profile-detail-value">
              {profileUser.name || 'Super Administrator'}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Username:</span>
            <span className="profile-detail-value">
              {profileUser.username || 'admin'}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Role:</span>
            <span className="profile-detail-value">{roleDisplay}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Email:</span>
            <span className="profile-detail-value">
              {profileUser.email || 'admin@cellcited.com'}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Phone Number:</span>
            <span className="profile-detail-value">{phones}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Address:</span>
            <span className="profile-detail-value profile-address-val">
              <span className="profile-flag-icon" role="img" aria-label="India">
                🇮🇳
              </span>
              <span>{lab.address || labProfile.address}</span>
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Laboratory:</span>
            <span className="profile-detail-value">
              {lab.name || labProfile.name}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Lab Code:</span>
            <span className="profile-detail-value">{lab.code || 'CCPL'}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Medical Certificate:</span>
            <span className="profile-detail-value">
              {lab.medicalCertificate ||
                labProfile.certificateNumber ||
                'CMEE26151240'}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Authorised Signatory:</span>
            <span className="profile-detail-value">
              {lab.authorisedSignatory || labProfile.authorisedSignatory}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Registration:</span>
            <span className="profile-detail-value">
              {lab.registrationDetails || labProfile.registrationAuthority}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Timezone:</span>
            <span className="profile-detail-value">
              {lab.timezone || 'Asia/Kolkata'}
            </span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Status:</span>
            <span className="profile-detail-value">
              <span className="profile-status-badge">
                <span className="profile-status-indicator"></span>
                {lab.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
