import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Get API key from environment variable
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '777e115b0093ba596689cbd5bd7ed1d6';

// Create context
const WeatherContext = createContext();

// Custom hook to use the weather context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  "use memo"; // Enable React Compiler optimization
  
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null
  });
  
  const [weatherData, setWeatherData] = useState({
    daily: [],
    isLoading: false,
    error: null,
    lastFetched: null
  });

  // Format coordinates when they change
  const formattedCoordinates = useMemo(() => {
    if (coordinates.latitude && coordinates.longitude) {
      return {
        lat: Math.round(coordinates.latitude * 100) / 100,
        lon: Math.round(coordinates.longitude * 100) / 100
      };
    }
    return null;
  }, [coordinates.latitude, coordinates.longitude]);

  // Fetch weather data when formatted coordinates change
  useEffect(() => {
    if (!formattedCoordinates) return;

    // Check if we've fetched recently (within 10 minutes)
    const now = new Date();
    if (weatherData.lastFetched && (now - weatherData.lastFetched) < 10 * 60 * 1000) {
      return; // Skip fetch if data is fresh
    }

    const fetchWeatherData = async () => {
      try {
        setWeatherData(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${formattedCoordinates.lat}&lon=${formattedCoordinates.lon}&exclude=hourly&appid=${API_KEY}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        setWeatherData({
          daily: data.daily,
          isLoading: false,
          error: null,
          lastFetched: new Date()
        });
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setWeatherData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error.message 
        }));
      }
    };

    fetchWeatherData();
  }, [formattedCoordinates, weatherData.lastFetched]);

  // Update coordinates from App's location data
  useEffect(() => {
    const handleLocationUpdate = (event) => {
      if (event.detail && event.detail.latitude && event.detail.longitude) {
        setCoordinates({
          latitude: event.detail.latitude,
          longitude: event.detail.longitude
        });
      }
    };

    // Listen for location updates from App component
    window.addEventListener('locationUpdate', handleLocationUpdate);

    return () => {
      window.removeEventListener('locationUpdate', handleLocationUpdate);
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    coordinates,
    setCoordinates,
    weatherData
  }), [coordinates, weatherData]);

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;