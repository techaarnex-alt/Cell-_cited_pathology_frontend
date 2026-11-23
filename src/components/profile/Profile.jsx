import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_USER } from '../../constants';
import { api } from '../../api';
import './Profile.css';

export default function Profile() {
  const { currentUser, setCurrentUser, labProfile, setLabProfile, setNotice } =
    useApp();
  const profileUser = currentUser || DEFAULT_USER;
  const lab = profileUser.laboratory || labProfile;
  const phones =
    lab.phones && lab.phones.length
      ? lab.phones.join(' · ')
      : (labProfile.phones || []).join(' · ');
  const roleDisplay = profileUser.role
    ? profileUser.role.charAt(0).toUpperCase() + profileUser.role.slice(1)
    : 'Administrator';

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phones: '',
    address: '',
    authorisedSignatory: '',
  });

  const handleStartEdit = () => {
    const rawPhones =
      lab.phones && Array.isArray(lab.phones) && lab.phones.length
        ? lab.phones.join(', ')
        : labProfile.phones && Array.isArray(labProfile.phones)
        ? labProfile.phones.join(', ')
        : '';

    setFormData({
      name: profileUser.name || '',
      username: profileUser.username || '',
      email: profileUser.email || '',
      phones: rawPhones,
      address: lab.address || labProfile.address || '',
      authorisedSignatory:
        lab.authorisedSignatory || labProfile.authorisedSignatory || '',
    });
    setEditError('');
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setEditError('Full name is required');
      return;
    }
    if (!formData.username.trim()) {
      setEditError('Username is required');
      return;
    }

    setSaving(true);
    setEditError('');

    try {
      const payload = {
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phones: formData.phones,
        address: formData.address.trim(),
        authorisedSignatory: formData.authorisedSignatory.trim(),
      };

      const res = await api.updateProfile(payload);

      if (res) {
        const updatedUser = {
          ...(currentUser || DEFAULT_USER),
          ...res,
          laboratory: {
            ...((currentUser || DEFAULT_USER).laboratory || {}),
            ...(res.laboratory || {}),
          },
        };
        if (setCurrentUser) {
          setCurrentUser(updatedUser);
        }
        try {
          sessionStorage.setItem('cell-cited-user', JSON.stringify(updatedUser));
        } catch {}

        if (res.laboratory && setLabProfile) {
          setLabProfile((prev) => ({
            ...prev,
            ...res.laboratory,
          }));
        }
      }

      if (setNotice) {
        setNotice('User profile updated successfully');
      }
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update user profile');
    } finally {
      setSaving(false);
    }
  };

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
        <div className="profile-card-header">
          <h2 className="profile-card-title">
            {isEditing ? 'Edit Profile Details' : 'Personal details'}
          </h2>
          {!isEditing && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleStartEdit}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit profile</span>
            </button>
          )}
        </div>

        {editError && (
          <div className="profile-edit-error" role="alert">
            {editError}
          </div>
        )}

        {isEditing ? (
          <form className="profile-edit-form" onSubmit={handleSave}>
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <label htmlFor="profile-name">
                  Full name <span className="profile-required">*</span>
                </label>
                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="profile-edit-field">
                <label htmlFor="profile-username">
                  Username <span className="profile-required">*</span>
                </label>
                <input
                  id="profile-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="profile-edit-field">
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@cellcited.com"
                />
              </div>

              <div className="profile-edit-field">
                <label htmlFor="profile-phones">
                  Phone Number
                </label>
                <input
                  id="profile-phones"
                  type="text"
                  name="phones"
                  value={formData.phones}
                  onChange={handleInputChange}
                  placeholder="9554448906, 6307342505"
                />
                <span className="profile-edit-hint">
                  Separate multiple phone numbers with comma
                </span>
              </div>

              <div className="profile-edit-field profile-edit-field-wide">
                <label htmlFor="profile-address">Address</label>
                <textarea
                  id="profile-address"
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter laboratory address"
                />
              </div>

              <div className="profile-edit-field profile-edit-field-wide">
                <label htmlFor="profile-signatory">
                  Authorised Signatory
                </label>
                <input
                  id="profile-signatory"
                  type="text"
                  name="authorisedSignatory"
                  value={formData.authorisedSignatory}
                  onChange={handleInputChange}
                  placeholder="Dr. Sanjay Singh, MBBS, MD Pathologist"
                />
              </div>
            </div>

            <div className="profile-edit-actions">
              <button
                type="button"
                className="profile-btn-cancel"
                onClick={() => {
                  setIsEditing(false);
                  setEditError('');
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="profile-btn-save"
                disabled={saving}
              >
                {saving ? 'Saving changes...' : 'Save changes'}
              </button>
            </div>
          </form>
        ) : (
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
        )}
      </section>
    </div>
  );
}
