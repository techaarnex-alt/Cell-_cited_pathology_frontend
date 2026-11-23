import React, { useEffect, useRef } from 'react';

export function CellCitedMark({ compact = false }) {
  return (
    <div
      className={`cell-cited-mark ${compact ? 'compact' : ''}`}
      aria-label="Cell Cited Pathology Lab"
    >
      <span className="logo-image">
        <img
          src={`${import.meta.env.BASE_URL}cell-cited-logo.jpg`}
          alt="Cell Cited medical cross logo"
        />
      </span>
      <span>
        <b>Cell Cited</b>
        <strong>
          Pathology Lab <em>(CCPL)</em>
        </strong>
      </span>
    </div>
  );
}

export function NavIcon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const icons = {
    dashboard: (
      <>
        <rect {...common} x="3" y="3" width="7" height="7" rx="1" />
        <rect {...common} x="14" y="3" width="7" height="7" rx="1" />
        <rect {...common} x="3" y="14" width="7" height="7" rx="1" />
        <path {...common} d="M14 21v-7h7v7z" />
        <path {...common} d="M17.5 16v3" />
      </>
    ),
    patients: (
      <>
        <circle {...common} cx="12" cy="8" r="3.5" />
        <path {...common} d="M5 21c.6-4.1 3-6 7-6s6.4 1.9 7 6" />
      </>
    ),
    newreport: (
      <>
        <path {...common} d="M6 3h8l4 4v14H6z" />
        <path {...common} d="M14 3v5h5M12 11v6M9 14h6" />
      </>
    ),
    tests: (
      <>
        <path
          {...common}
          d="M9 3v6l-4 7.1A3.2 3.2 0 0 0 7.8 21h8.4a3.2 3.2 0 0 0 2.8-4.9L15 9V3"
        />
        <path {...common} d="M8 3h8M8.5 16h7" />
      </>
    ),
    results: (
      <>
        <path {...common} d="M5 3h14v18H5z" />
        <path {...common} d="M8 8h8M8 12h5M8 16h3" />
        <path {...common} d="m15 16 1.2 1.2L19 14.5" />
      </>
    ),
    reports: (
      <>
        <path {...common} d="M7 3h8l4 4v14H7z" />
        <path {...common} d="M15 3v5h5M10 12h6M10 16h6" />
      </>
    ),
    billing: (
      <>
        <rect {...common} x="3" y="5" width="18" height="14" rx="2" />
        <path {...common} d="M3 10h18M7 15h3" />
      </>
    ),
    business: (
      <>
        <path {...common} d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        <path {...common} d="m4 7 5-4 5 4 6-3" />
      </>
    ),
    doctors: (
      <>
        <path {...common} d="M9 4h6v4a3 3 0 0 1-6 0zM12 11v10M8 14h8M9 21h6" />
        <path {...common} d="M5 12h2M17 12h2" />
      </>
    ),
    profile: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <circle {...common} cx="12" cy="9" r="2.5" />
        <path {...common} d="M7.8 18c.8-2.1 2.2-3.2 4.2-3.2s3.4 1.1 4.2 3.2" />
      </>
    ),
    setting: (
      <>
        <circle {...common} cx="12" cy="12" r="3" />
        <path
          {...common}
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </>
    ),
    settings: (
      <>
        <circle {...common} cx="12" cy="12" r="3" />
        <path
          {...common}
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </>
    ),
    logout: (
      <>
        <path {...common} d="M10 4H5v16h5" />
        <path {...common} d="M13 8l4 4-4 4M8 12h9" />
      </>
    ),
  };
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export function DoctorSignature() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = new Image();
    image.src = `${import.meta.env.BASE_URL}dr-sanjay-signature.jpg`;
    const render = () => {
      if (!canvasRef.current) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index];
        const green = pixels.data[index + 1];
        const blue = pixels.data[index + 2];
        const ink = Math.max(
          0,
          (blue - red) * 18 + (green - red) * 6 + (blue - 10) * 4
        );
        pixels.data[index] = 5;
        pixels.data[index + 1] = 5;
        pixels.data[index + 2] = 8;
        pixels.data[index + 3] = Math.min(255, ink);
      }
      context.putImageData(pixels, 0, 0);
    };
    if (image.complete && image.naturalWidth > 0) {
      render();
    } else {
      image.onload = render;
    }
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="doctor-signature-canvas"
      aria-label="Signature of Dr. Sanjay Singh"
    />
  );
}

export function LetterheadLogo() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const image = new Image();
    image.src = `${import.meta.env.BASE_URL}cell-cited-logo.jpg`;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index];
        const green = pixels.data[index + 1];
        const blue = pixels.data[index + 2];
        if (red < 12 && green < 12 && blue < 12) pixels.data[index + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="letterhead-logo" aria-hidden="true" />
  );
}

export function EyeIcon({ open }) {
  return open ? (
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
