import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Get API key from environment variable
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

if (!API_KEY) {
  console.error('REACT_APP_WEATHER_API_KEY is not set. Please add it to your .env file.');
}

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

  // Debug coordinates changes
  useEffect(() => {
    console.log('🌤️ Coordinates state changed:', coordinates);
  }, [coordinates]);
  
  const [weatherData, setWeatherData] = useState({
    daily: [],
    hourly: [],
    current: null,
    isLoading: false,
    error: null,
    lastFetched: null
  });

  // Format coordinates when they change
  const formattedCoordinates = useMemo(() => {
    console.log('🌤️ Formatting coordinates:', coordinates);

    if (coordinates.latitude && coordinates.longitude) {
      const formatted = {
        lat: Math.round(coordinates.latitude * 100) / 100,
        lon: Math.round(coordinates.longitude * 100) / 100
      };
      console.log('🌤️ Formatted coordinates:', formatted);
      return formatted;
    }

    console.log('🌤️ No valid coordinates to format');
    return null;
  }, [coordinates.latitude, coordinates.longitude]);

  // Fetch weather data when formatted coordinates change
  useEffect(() => {
    console.log('🌤️ Weather fetch effect triggered, formattedCoordinates:', formattedCoordinates);

    if (!formattedCoordinates) {
      console.log('🌤️ No formatted coordinates available, skipping fetch');
      return;
    }

    // Check if we've fetched recently (within 10 minutes)
    const now = new Date();
    if (weatherData.lastFetched && (now - weatherData.lastFetched) < 10 * 60 * 1000) {
      console.log('🌤️ Using cached weather data (fresh within 10 minutes)');
      return; // Skip fetch if data is fresh
    }

    const fetchWeatherData = async () => {
      console.log('🌤️ Starting weather data fetch...');

      try {
        setWeatherData(prev => ({ ...prev, isLoading: true, error: null }));

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${formattedCoordinates.lat}&lon=${formattedCoordinates.lon}&appid=${API_KEY}`;
        console.log('🌤️ Fetching from URL:', url);
        console.log('🌤️ API_KEY available:', !!API_KEY);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        });

        console.log('🌤️ Weather API response status:', response.status);

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('🌤️ Weather data received:', data);

        setWeatherData({
          daily: data.daily,
          hourly: data.hourly ? data.hourly.slice(0, 24) : [], // Next 24 hours
          current: data.current,
          isLoading: false,
          error: null,
          lastFetched: new Date()
        });

        console.log('🌤️ Weather data updated successfully');
      } catch (error) {
        console.error('🌤️ Failed to fetch weather data:', error);
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
      console.log('🌤️ WeatherContext received location update:', event.detail);
      console.log('🌤️ Current coordinates before update:', coordinates);

      if (event.detail && event.detail.latitude && event.detail.longitude) {
        console.log('🌤️ Setting coordinates in WeatherContext:', {
          latitude: event.detail.latitude,
          longitude: event.detail.longitude
        });

        const newCoords = {
          latitude: event.detail.latitude,
          longitude: event.detail.longitude
        };

        console.log('🌤️ About to set coordinates:', newCoords);
        setCoordinates(newCoords);

        // Force a re-render to check if coordinates are actually set
        setTimeout(() => {
          console.log('🌤️ Coordinates after setState (delayed check):', coordinates);
        }, 100);

      } else {
        console.log('🌤️ Invalid location data received:', event.detail);
        console.log('🌤️ Event detail keys:', event.detail ? Object.keys(event.detail) : 'no detail');
      }
    };

    console.log('🌤️ WeatherContext: Setting up location update listener');

    // Listen for location updates from App component
    window.addEventListener('locationUpdate', handleLocationUpdate);

    return () => {
      console.log('🌤️ WeatherContext: Removing location update listener');
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