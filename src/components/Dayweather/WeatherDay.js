import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { kelvinToFahrenheit, getDateForOffset } from '../../utils/weatherUtils';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './WeatherDay.css';

// Get API key from environment variable or use fallback for development
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '777e115b0093ba596689cbd5bd7ed1d6';

const WeatherDay = ({ data, dayIndex }) => {
  "use memo"; // Enable React Compiler optimization

  const [weatherData, setWeatherData] = useState({
    min: null,
    max: null,
    imageIcon: null,
    forecast: null,
    precipChance: null,
    isLoading: true,
    error: null
  });

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lon: null
  });

  // Calculate date for the specified day
  const date = useMemo(() => getDateForOffset(dayIndex), [dayIndex]);

  // Format coordinates once when props change
  useEffect(() => {
    if (data?.latitude && data?.longitude) {
      setCoordinates({
        lat: Math.round(data.latitude * 100) / 100,
        lon: Math.round(data.longitude * 100) / 100
      });
    }
  }, [data]);

  // Fetch weather data when coordinates change
  useEffect(() => {
    const { lat, lon } = coordinates;

    if (lat === null || lon === null) return;

    const fetchWeatherData = async () => {
      try {
        setWeatherData(prev => ({ ...prev, isLoading: true, error: null }));
        
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${API_KEY}`,
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
          min: data.daily[dayIndex].temp.min,
          max: data.daily[dayIndex].temp.max,
          imageIcon: data.daily[dayIndex].weather[0].icon,
          forecast: data.daily[dayIndex].summary,
          precipChance: Math.round(data.daily[dayIndex].pop * 100), // pop = probability of precipitation (0-1)
          isLoading: false,
          error: null
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
  }, [coordinates, dayIndex]);

  // Memoize tooltip content
  const tooltipHtml = useMemo(() => {
    if (weatherData.error) {
      return `<div>Error loading forecast</div>`;
    }
    return `<div>${date}:</div><div>${weatherData.forecast || 'Loading forecast...'}</div>${weatherData.precipChance !== null ? `<div>Rain: ${weatherData.precipChance}%</div>` : ''}`;
  }, [date, weatherData.forecast, weatherData.precipChance, weatherData.error]);

  const { max, min, imageIcon, precipChance, isLoading, error } = weatherData;

  if (isLoading && !imageIcon) {
    return <div className="weather-loading">Loading...</div>;
  }

  if (error && !imageIcon) {
    return <div className="weather-error">Unable to load weather data</div>;
  }

  return (
    <div
      data-tooltip-id="weather-tooltip"
      data-tooltip-html={tooltipHtml}
      data-tooltip-place="middle"
      className="weather-day-container"
    >
      <Tooltip
        id="weather-tooltip"
        border={'1px solid #222'}
        style={{
          backgroundColor: 'rgb(0, 255, 30)',
          color: '#222',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center',
          maxWidth: '150px',
        }}
        noArrow />
      {imageIcon && (
        <img
          className="day-pane"
          src={`https://openweathermap.org/img/wn/${imageIcon}.png`}
          alt={`Weather forecast for ${dayIndex === 0 ? 'today' : date}`}
          aria-label={`Weather forecast for ${dayIndex === 0 ? 'today' : date}`}
        />
      )}
      <div className="temp-row">
        <h5 className="black_text">
          {kelvinToFahrenheit(max)}°
        </h5>
        <h5 className="light-grey_text">
          {kelvinToFahrenheit(min)}°
        </h5>
      </div>
      {precipChance !== null && (
        <div className="precipitation">
          <span className="rain-icon">💧</span>
          <span className="rain-chance">{precipChance}%</span>
        </div>
      )}
    </div>
  );
};

// Wrap with ErrorBoundary for better error handling
const WeatherDayWithErrorBoundary = (props) => (
  <ErrorBoundary fallback={<div className="weather-error">Something went wrong</div>}>
    <WeatherDay {...props} />
  </ErrorBoundary>
);

export default WeatherDayWithErrorBoundary;
