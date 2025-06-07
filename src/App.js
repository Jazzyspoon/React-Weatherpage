import React, { useState, useEffect } from 'react';
import './App.css';
import Daypanel from './components/Daypanel/daypanel';
import Radar from './components/radar/radar';
import { WeatherProvider } from './context/WeatherContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  "use memo"; // Enable React Compiler optimization
  
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            isLoading: false
          };
          
          // Get township name using reverse geocoding
          try {
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${process.env.REACT_APP_WEATHER_API_KEY || '777e115b0093ba596689cbd5bd7ed1d6'}`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                newLocationData.township = data[0].name;
                if (data[0].state) {
                  newLocationData.township += `, ${data[0].state}`;
                }
              }
            }
          } catch (error) {
            console.error('Error getting location name:', error);
          }
          
          setLocationData(newLocationData);
          
          // Dispatch event to notify WeatherContext
          window.dispatchEvent(new CustomEvent('locationUpdate', { 
            detail: newLocationData 
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationData({
            latitude: null,
            longitude: null,
            error: `Location error: ${error.message}`,
            isLoading: false
          });
        }
      );
    } else {
      setLocationData({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.',
        isLoading: false
      });
    }
  }, []);

  return (
    <ErrorBoundary fallback={<div className="app-error">The application encountered a critical error</div>}>
      <WeatherProvider>
        <div className="App">
          <header className="App-header">
            <h1>Weather Forecast for {locationData.township || (locationData.latitude ? `${locationData.latitude.toFixed(2)}°, ${locationData.longitude.toFixed(2)}°` : 'your location')}</h1>
            {locationData.error && (
              <div className="location-error">
                {locationData.error}
                <p>Using default location instead.</p>
              </div>
            )}
          </header>
          <main>
            <Daypanel />
            <Radar />
          </main>
        </div>
      </WeatherProvider>
    </ErrorBoundary>
  );
}

export default App;