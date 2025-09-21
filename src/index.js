import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { initPerformanceMonitoring } from './utils/performance';
import { WeatherProvider } from './context/WeatherContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Use StrictMode only in production to reduce development console noise
if (process.env.NODE_ENV === 'production') {
  root.render(
    <React.StrictMode>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <WeatherProvider>
      <App />
    </WeatherProvider>
  );
}

// Register enhanced service worker for PWA capabilities
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Enhanced SW registered: ', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, notify user
              console.log('New content available, please refresh');
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log('Enhanced SW registration failed: ', registrationError);
      });
  });
} else {
  // Fallback to default service worker in development
  serviceWorker.register();
}

// Initialize performance monitoring
initPerformanceMonitoring();
