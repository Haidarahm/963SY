// components/LoadingLine.js
import React from 'react';
import './loadingLine.css';

const LoadingLine = ({ isLoading }) => {
  return (
    <div className={`loading-line ${isLoading ? 'active' : ''}`}>
      <div className="loading-line-progress"></div>
    </div>
  );
};

export default LoadingLine;