import React, { useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { kelvinToFahrenheit } from '../../utils/weatherUtils';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './CurrentWeather.css';

const CurrentWeather = () => {
  const { weatherData } = useWeather();

  // Format current weather data
  const currentData = useMemo(() => {
    if (!weatherData.current) {
      return null;
    }

    const current = weatherData.current;
    const sunrise = new Date(current.sunrise * 1000);
    const sunset = new Date(current.sunset * 1000);

    return {
      temp: kelvinToFahrenheit(current.temp),
      feelsLike: kelvinToFahrenheit(current.feels_like),
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.humidity,
      pressure: Math.round(current.pressure * 0.02953), // Convert hPa to inHg
      windSpeed: Math.round(current.wind_speed * 2.237), // Convert m/s to mph
      windDirection: current.wind_deg,
      visibility: Math.round(current.visibility * 0.000621371), // Convert m to miles
      uvIndex: current.uvi,
      sunrise: sunrise.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      sunset: sunset.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      dewPoint: kelvinToFahrenheit(current.dew_point),
      clouds: current.clouds
    };
  }, [weatherData.current]);

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVIndexLevel = (uvi) => {
    if (uvi <= 2) return { level: 'Low', color: '#00E400' };
    if (uvi <= 5) return { level: 'Moderate', color: '#FFFF00' };
    if (uvi <= 7) return { level: 'High', color: '#FF8C00' };
    if (uvi <= 10) return { level: 'Very High', color: '#FF0000' };
    return { level: 'Extreme', color: '#8B00FF' };
  };

  if (weatherData.isLoading && !weatherData.current) {
    return (
      <div className="current-weather">
        <LoadingSpinner size="medium" message="Loading current weather..." />
      </div>
    );
  }

  if (weatherData.error && !weatherData.current) {
    return (
      <div className="current-weather">
        <ErrorMessage
          title="Current Weather Unavailable"
          message="Unable to load current weather data"
          type="error"
        />
      </div>
    );
  }

  if (!currentData) {
    return null;
  }

  const uvInfo = getUVIndexLevel(currentData.uvIndex);

  return (
    <div className="current-weather">
      <div className="current-main">
        <div className="current-temp-section">
          <div className="current-icon">
            <img
              src={`https://openweathermap.org/img/wn/${currentData.icon}@2x.png`}
              alt={currentData.description}
            />
          </div>
          <div className="current-temp-info">
            <div className="current-temp">{currentData.temp}°F</div>
            <div className="current-description">{currentData.description}</div>
            <div className="feels-like">Feels like {currentData.feelsLike}°F</div>
          </div>
        </div>
      </div>

      <div className="current-details">
        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-icon">💨</div>
            <div className="detail-content">
              <div className="detail-label">Wind</div>
              <div className="detail-value">{currentData.windSpeed} mph {getWindDirection(currentData.windDirection)}</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">💧</div>
            <div className="detail-content">
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{currentData.humidity}%</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">🌡️</div>
            <div className="detail-content">
              <div className="detail-label">Pressure</div>
              <div className="detail-value">{currentData.pressure} inHg</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">👁️</div>
            <div className="detail-content">
              <div className="detail-label">Visibility</div>
              <div className="detail-value">{currentData.visibility} mi</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">☀️</div>
            <div className="detail-content">
              <div className="detail-label">UV Index</div>
              <div className="detail-value" style={{ color: uvInfo.color }}>
                {currentData.uvIndex} ({uvInfo.level})
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">☁️</div>
            <div className="detail-content">
              <div className="detail-label">Cloudiness</div>
              <div className="detail-value">{currentData.clouds}%</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">🌅</div>
            <div className="detail-content">
              <div className="detail-label">Sunrise</div>
              <div className="detail-value">{currentData.sunrise}</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">🌇</div>
            <div className="detail-content">
              <div className="detail-label">Sunset</div>
              <div className="detail-value">{currentData.sunset}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
