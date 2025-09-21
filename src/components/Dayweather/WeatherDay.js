import React, { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { kelvinToFahrenheit, getDateForOffset } from '../../utils/weatherUtils';
import { useWeather } from '../../context/WeatherContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './WeatherDay.css';

// This component now gets data from the WeatherContext instead of making its own API calls

const WeatherDay = ({ dayIndex }) => {
  "use memo"; // Enable React Compiler optimization

  const { weatherData: contextWeatherData } = useWeather();

  // Calculate date for the specified day
  const date = useMemo(() => getDateForOffset(dayIndex), [dayIndex]);

  // Get weather data for this specific day from context
  const dayWeatherData = useMemo(() => {
    if (!contextWeatherData.daily || contextWeatherData.daily.length <= dayIndex) {
      return {
        min: null,
        max: null,
        imageIcon: null,
        forecast: null,
        precipChance: null,
        isLoading: contextWeatherData.isLoading,
        error: contextWeatherData.error
      };
    }

    const dayData = contextWeatherData.daily[dayIndex];
    return {
      min: dayData.temp.min,
      max: dayData.temp.max,
      imageIcon: dayData.weather[0].icon,
      forecast: dayData.summary,
      precipChance: Math.round(dayData.pop * 100),
      isLoading: false,
      error: null
    };
  }, [contextWeatherData, dayIndex]);

  // Memoize tooltip content
  const tooltipHtml = useMemo(() => {
    if (dayWeatherData.error) {
      return `<div>Error loading forecast</div>`;
    }
    return `<div>${date}:</div><div>${dayWeatherData.forecast || 'Loading forecast...'}</div>${dayWeatherData.precipChance !== null ? `<div>Rain: ${dayWeatherData.precipChance}%</div>` : ''}`;
  }, [date, dayWeatherData.forecast, dayWeatherData.precipChance, dayWeatherData.error]);

  const { max, min, imageIcon, precipChance, isLoading, error } = dayWeatherData;

  if (isLoading && !imageIcon) {
    return (
      <div className="weather-day-container">
        <LoadingSpinner
          size="small"
          message=""
          className="weather-day-loading"
        />
      </div>
    );
  }

  if (error && !imageIcon) {
    return (
      <div className="weather-day-container">
        <div className="weather-day-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">Error</span>
        </div>
      </div>
    );
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
