import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import LocationPermission from './components/LocationPermission/LocationPermission';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

// Lazy load components for better performance
const Daypanel = lazy(() => import('./components/Daypanel/daypanel'));
const Radar = lazy(() => import('./components/radar/radar'));
const CurrentWeather = lazy(() => import('./components/CurrentWeather/CurrentWeather'));
const HourlyForecast = lazy(() => import('./components/HourlyForecast/HourlyForecast'));
const LocationSearch = lazy(() => import('./components/LocationSearch/LocationSearch'));

function App() {
  "use memo"; // Enable React Compiler optimization
  
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    township: null,
    error: null,
    isLoading: true,
    permissionState: 'prompt' // 'prompt', 'granted', 'denied', 'default'
  });

  // Handle location permission granted
  const handleLocationGranted = async (coords) => {
    console.log('🎯 Location granted, coords received:', coords);

    const newLocationData = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      error: null,
      isLoading: false,
      permissionState: 'granted'
    };

    console.log('🎯 Initial location data created:', newLocationData);

    // Get township name using reverse geocoding
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      console.log('🎯 API Key available:', !!apiKey);

      if (apiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&appid=${apiKey}`
        );

        console.log('🎯 Geocoding response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('🎯 Geocoding data:', data);

          if (data && data.length > 0) {
            newLocationData.township = data[0].name;
            if (data[0].state) {
              newLocationData.township += `, ${data[0].state}`;
            }
          }
        }
      }
    } catch (error) {
      console.error('🎯 Error getting location name:', error);
    }

    console.log('🎯 Final location data before setState:', newLocationData);
    setLocationData(newLocationData);

    // Dispatch event to notify WeatherContext with a small delay to ensure listener is ready
    console.log('🎯 Dispatching location update event');

    // Immediate dispatch
    window.dispatchEvent(new CustomEvent('locationUpdate', {
      detail: newLocationData
    }));

    // Also dispatch with a delay to catch any late listeners
    setTimeout(() => {
      console.log('🎯 Dispatching delayed location update event');
      window.dispatchEvent(new CustomEvent('locationUpdate', {
        detail: newLocationData
      }));
    }, 100);

    console.log('🎯 Location update complete');
  };

  // Handle location permission denied
  const handleLocationDenied = (errorMessage) => {
    setLocationData(prev => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
      permissionState: 'denied'
    }));
  };

  // Handle using default location
  const handleUseDefault = () => {
    // Use a default location (e.g., New York City)
    const defaultLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
      township: 'New York, NY',
      error: null,
      isLoading: false,
      permissionState: 'default'
    };

    setLocationData(defaultLocation);

    // Dispatch event to notify WeatherContext
    window.dispatchEvent(new CustomEvent('locationUpdate', {
      detail: defaultLocation
    }));
  };

  // Handle location search selection
  const handleLocationSearch = (location) => {
    const searchLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      township: location.township,
      error: null,
      isLoading: false,
      permissionState: 'search'
    };

    setLocationData(searchLocation);

    // Dispatch event to notify WeatherContext
    window.dispatchEvent(new CustomEvent('locationUpdate', {
      detail: searchLocation
    }));
  };

  // Retry location request
  const handleRetryLocation = () => {
    setLocationData(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      permissionState: 'prompt'
    }));
  };

  // Initialize location request on mount
  useEffect(() => {
    // Start with prompt state to show location permission component
    setLocationData(prev => ({
      ...prev,
      isLoading: true,
      permissionState: 'prompt'
    }));
  }, []);

  // Show location permission request if needed
  if (locationData.permissionState === 'prompt' && locationData.isLoading) {
    return (
      <ErrorBoundary fallback={<div className="app-error">The application encountered a critical error</div>}>
        <div className="App">
          <LocationPermission
            onLocationGranted={handleLocationGranted}
            onLocationDenied={handleLocationDenied}
            onUseDefault={handleUseDefault}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Show loading spinner while getting location (but not for permission prompt)
  if (locationData.isLoading && locationData.permissionState !== 'prompt') {
    return (
      <ErrorBoundary fallback={<div className="app-error">The application encountered a critical error</div>}>
        <div className="App">
          <LoadingSpinner
            size="large"
            message="Getting your location..."
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="app-error">The application encountered a critical error</div>}>
      <div className="App">
        <header className="App-header">
          <h1>Weather Forecast for {locationData.township || (locationData.latitude ? `${locationData.latitude.toFixed(2)}°, ${locationData.longitude.toFixed(2)}°` : 'your location')}</h1>

          {locationData.error && locationData.permissionState === 'denied' && (
            <ErrorMessage
              title="Location Access Needed"
              message={locationData.error}
              onRetry={handleRetryLocation}
              retryText="Try Again"
              type="warning"
            />
          )}

          {locationData.permissionState === 'default' && (
            <div className="location-info">
              <span className="location-badge">📍 Using default location</span>
            </div>
          )}

          {locationData.permissionState === 'search' && (
            <div className="location-info">
              <span className="location-badge">🔍 Custom location</span>
            </div>
          )}

          <div className="location-search-container">
            <Suspense fallback={<LoadingSpinner size="small" message="Loading search..." />}>
              <LocationSearch onLocationSelect={handleLocationSearch} />
            </Suspense>
          </div>
        </header>
        <main>
          <Suspense fallback={<LoadingSpinner message="Loading weather data..." />}>
            <CurrentWeather />
            <HourlyForecast />
            <Daypanel />
          </Suspense>
          <Suspense fallback={<LoadingSpinner message="Loading radar..." />}>
            <Radar />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;