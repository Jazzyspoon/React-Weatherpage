import React, { useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { kelvinToFahrenheit } from '../../utils/weatherUtils';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './HourlyForecast.css';

const HourlyForecast = () => {
  const { weatherData } = useWeather();

  // Format hourly data for display
  const hourlyData = useMemo(() => {
    if (!weatherData.hourly || weatherData.hourly.length === 0) {
      return [];
    }

    return weatherData.hourly.slice(0, 12).map((hour, index) => {
      const date = new Date(hour.dt * 1000);
      const isNow = index === 0;
      
      return {
        time: isNow ? 'Now' : date.toLocaleTimeString('en-US', { 
          hour: 'numeric',
          hour12: true 
        }),
        temp: kelvinToFahrenheit(hour.temp),
        icon: hour.weather[0].icon,
        description: hour.weather[0].description,
        precipitation: Math.round((hour.pop || 0) * 100),
        humidity: hour.humidity,
        windSpeed: Math.round(hour.wind_speed * 2.237), // Convert m/s to mph
        feelsLike: kelvinToFahrenheit(hour.feels_like)
      };
    });
  }, [weatherData.hourly]);

  if (weatherData.isLoading && !weatherData.hourly.length) {
    return (
      <div className="hourly-forecast">
        <h3>Hourly Forecast</h3>
        <LoadingSpinner size="medium" message="Loading hourly forecast..." />
      </div>
    );
  }

  if (weatherData.error && !weatherData.hourly.length) {
    return (
      <div className="hourly-forecast">
        <h3>Hourly Forecast</h3>
        <ErrorMessage
          title="Hourly Forecast Unavailable"
          message="Unable to load hourly weather data"
          type="error"
        />
      </div>
    );
  }

  if (hourlyData.length === 0) {
    return null;
  }

  return (
    <div className="hourly-forecast">
      <h3>Next 12 Hours</h3>
      <div className="hourly-scroll-container">
        <div className="hourly-items">
          {hourlyData.map((hour, index) => (
            <div key={index} className="hourly-item">
              <div className="hourly-time">{hour.time}</div>
              <div className="hourly-icon">
                <img
                  src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                  alt={hour.description}
                  title={hour.description}
                />
              </div>
              <div className="hourly-temp">{hour.temp}°</div>
              <div className="hourly-precipitation">
                <span className="precip-icon">💧</span>
                <span className="precip-value">{hour.precipitation}%</span>
              </div>
              <div className="hourly-details">
                <div className="detail-item">
                  <span className="detail-icon">💨</span>
                  <span className="detail-value">{hour.windSpeed} mph</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💧</span>
                  <span className="detail-value">{hour.humidity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
