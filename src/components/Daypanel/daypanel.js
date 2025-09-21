import React, { useMemo } from 'react';
import './daypanel.css';
import WeatherDay from '../Dayweather/WeatherDay';
import { useWeather } from '../../context/WeatherContext';
import { getShortDayNameForOffset } from '../../utils/weatherUtils';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const Daypanel = () => {
  "use memo"; // Enable React Compiler optimization

  const { coordinates, weatherData } = useWeather();

  // Calculate weekdays once using useMemo
  const weekdays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => getShortDayNameForOffset(i));
  }, []);

  if (weatherData.isLoading && !weatherData.daily.length) {
    return (
      <LoadingSpinner
        size="large"
        message="Loading weather data..."
        className="weather-loading"
      />
    );
  }

  if (weatherData.error && !weatherData.daily.length) {
    return (
      <ErrorMessage
        title="Weather Data Unavailable"
        message={`Unable to load weather information: ${weatherData.error}`}
        type="error"
        className="weather-error"
      />
    );
  }

  if (coordinates.latitude === null) {
    return (
      <LoadingSpinner
        size="medium"
        message="Waiting for location data..."
        className="location-loading"
      />
    );
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='day grey'>
          <h5 className='grey_text'>Today</h5>
          <WeatherDay dayIndex={0} />
        </div>

        <div className='day'>
          <h5>{weekdays[1]}</h5>
          <WeatherDay dayIndex={1} />
        </div>

        <div className='day'>
          <h5>{weekdays[2]}</h5>
          <WeatherDay dayIndex={2} />
        </div>

        <div className='day'>
          <h5>{weekdays[3]}</h5>
          <WeatherDay dayIndex={3} />
        </div>

        <div className='day'>
          <h5>{weekdays[4]}</h5>
          <WeatherDay dayIndex={4} />
        </div>
      </div>
    </div>
  );
};

// Wrap with ErrorBoundary for better error handling
const DaypanelWithErrorBoundary = () => (
  <ErrorBoundary fallback={<div className="error-container"><h3>Something went wrong with the weather panel</h3></div>}>
    <Daypanel />
  </ErrorBoundary>
);

export default DaypanelWithErrorBoundary;