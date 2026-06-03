import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="loading-spinner" role="status" aria-label="Loading">
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );
}