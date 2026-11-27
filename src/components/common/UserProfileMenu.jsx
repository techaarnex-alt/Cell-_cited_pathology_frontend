import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuUser,
  LuTrendingUp,
  LuSettings,
  LuLogOut,
  LuCopy,
  LuCheck,
  LuChevronRight,
  LuFlaskConical,
} from 'react-icons/lu';

export default function UserProfileMenu() {
  const { currentUser, labProfile, data, setView, handleLogout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const userName = currentUser?.name || 'Super Administrator';
  const userRole = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : 'Administrator';
  const labId =
    labProfile?.labCode || currentUser?.laboratory?.code || 'CCPL';

  // Calculate today's total revenue
  const todayTotal = useMemo(() => {
    const today = new Date().toDateString();
    return (data?.reports || []).reduce((acc, r) => {
      const isToday =
        r.createdOn && new Date(r.createdOn).toDateString() === today;
      return isToday
        ? acc + (Number(r.fee || 0) - Number(r.discount || 0))
        : acc;
    }, 0);
  }, [data?.reports]);

  const handleCopyLabId = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(String(labId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigate = (viewKey) => {
    setIsOpen(false);
    setView(viewKey);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Topbar User Icon Button (Pure White & Black) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`topbar-user-avatar-btn ${isOpen ? 'is-open' : ''}`}
        title="Account & Settings"
        aria-label="User Account Menu"
        aria-expanded={isOpen}
      >
        <LuUser className="w-5 h-5 text-black" />
      </button>

      {/* Dropdown Menu (Pure White Background, No Blue) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header with Name, Role & Lab ID */}
          <div className="p-4 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate m-0">
                {userName}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white flex-shrink-0">
                {userRole}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
              <span>Lab ID #: {labId}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={handleCopyLabId}
                onKeyDown={(e) => e.key === 'Enter' && handleCopyLabId(e)}
                className="p-1 text-slate-400 hover:text-black cursor-pointer rounded transition-colors inline-flex items-center"
                title={copied ? 'Copied!' : 'Copy Lab ID'}
              >
                {copied ? (
                  <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <LuCopy className="w-3.5 h-3.5" />
                )}
              </span>
              {copied && (
                <span className="text-[10px] text-emerald-600 font-medium">
                  Copied!
                </span>
              )}
            </div>
          </div>

          {/* Today's Total Highlight Banner (Peach / Orange row like 2nd image) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('business')}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate('business')}
            className="bg-amber-50/90 hover:bg-amber-100/90 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors"
            title="View today's detailed business reports"
          >
            <div className="flex items-center gap-2 text-amber-950 font-semibold text-xs">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                ₹
              </span>
              <span>My today's total : Rs.{todayTotal}</span>
            </div>
            <LuChevronRight className="w-4 h-4 text-amber-700" />
          </div>

          {/* Navigation Links (Pure White background, soft gray hover, black/slate text) */}
          <div className="p-1.5 space-y-0.5 bg-white">
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleNavigate('profile')}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate('profile')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-800 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer select-none"
            >
              <LuUser className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>My account</span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => handleNavigate('profile')}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate('profile')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-800 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer select-none"
            >
              <LuFlaskConical className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>Lab account</span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => handleNavigate('business')}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate('business')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-800 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer select-none"
            >
              <LuTrendingUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>My business report</span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => handleNavigate('setting')}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate('setting')}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-800 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer select-none"
            >
              <LuSettings className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>Setting</span>
            </div>
          </div>

          {/* Logout Section with Divider */}
          <div className="border-t border-slate-100 p-1.5 bg-white">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsOpen(false);
                  handleLogout();
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer select-none"
            >
              <LuLogOut className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
