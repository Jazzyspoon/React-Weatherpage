import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  retryText = 'Try Again',
  type = 'error', // 'error', 'warning', 'info'
  className = '',
  showIcon = true 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-message ${type} ${className}`}>
      <div className="error-content">
        {showIcon && <div className="error-icon">{getIcon()}</div>}
        <div className="error-text">
          <h3 className="error-title">{title}</h3>
          {message && <p className="error-description">{message}</p>}
        </div>
      </div>
      {onRetry && (
        <button 
          className="error-retry-button" 
          onClick={onRetry}
          aria-label={retryText}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
