import React, { useMemo } from 'react';
import './daypanel.css';
import WeatherDay from '../Dayweather/WeatherDay';
import { useWeather } from '../../context/WeatherContext';
import { getShortDayNameForOffset } from '../../utils/weatherUtils';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const Daypanel = () => {
  "use memo"; // Enable React Compiler optimization

  const { coordinates, weatherData } = useWeather();

  // Calculate weekdays once using useMemo
  const weekdays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => getShortDayNameForOffset(i));
  }, []);

  if (weatherData.isLoading && !weatherData.daily.length) {
    return <div className="loading-container"><h3>Loading weather data...</h3></div>;
  }

  if (weatherData.error && !weatherData.daily.length) {
    return <div className="error-container"><h3>Error loading weather: {weatherData.error}</h3></div>;
  }

  if (coordinates.latitude === null) {
    return <div className="loading-container"><h3>Waiting for location data...</h3></div>;
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='day grey'>
          <h5 className='grey_text'>Today</h5>
          <WeatherDay data={coordinates} dayIndex={0} />
        </div>

        <div className='day'>
          <h5>{weekdays[1]}</h5>
          <WeatherDay data={coordinates} dayIndex={1} />
        </div>

        <div className='day'>
          <h5>{weekdays[2]}</h5>
          <WeatherDay data={coordinates} dayIndex={2} />
        </div>

        <div className='day'>
          <h5>{weekdays[3]}</h5>
          <WeatherDay data={coordinates} dayIndex={3} />
        </div>

        <div className='day'>
          <h5>{weekdays[4]}</h5>
          <WeatherDay data={coordinates} dayIndex={4} />
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