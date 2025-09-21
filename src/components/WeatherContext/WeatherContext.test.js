import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { WeatherProvider, useWeather } from '../../context/WeatherContext';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variable
process.env.REACT_APP_WEATHER_API_KEY = 'test-api-key';

// Test component that uses the weather context
const TestComponent = () => {
  const { weatherData, coordinates } = useWeather();
  
  return (
    <div>
      <div data-testid="loading">{weatherData.isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{weatherData.error || 'No Error'}</div>
      <div data-testid="daily-count">{weatherData.daily.length}</div>
      <div data-testid="coordinates">{coordinates.latitude || 'No Coordinates'}</div>
    </div>
  );
};

describe('WeatherContext', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('provides initial state', () => {
    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    expect(screen.getByTestId('daily-count')).toHaveTextContent('0');
    expect(screen.getByTestId('coordinates')).toHaveTextContent('No Coordinates');
  });

  test('handles location updates', async () => {
    const mockWeatherData = {
      daily: [
        {
          temp: { min: 280, max: 290 },
          weather: [{ icon: '01d', description: 'clear sky' }],
          summary: 'Clear sky',
          pop: 0.1
        }
      ],
      hourly: [],
      current: {
        temp: 285,
        feels_like: 287,
        weather: [{ icon: '01d', description: 'clear sky' }],
        humidity: 50,
        pressure: 1013,
        wind_speed: 5,
        wind_deg: 180,
        visibility: 10000,
        uvi: 3,
        sunrise: 1640000000,
        sunset: 1640040000,
        dew_point: 275,
        clouds: 10
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData
    });

    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    // Simulate location update event
    const locationData = {
      latitude: 40.7128,
      longitude: -74.0060
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('locationUpdate', {
        detail: locationData
      }));
    });

    await waitFor(() => {
      expect(screen.getByTestId('coordinates')).toHaveTextContent('40.7128');
    });

    await waitFor(() => {
      expect(screen.getByTestId('daily-count')).toHaveTextContent('1');
    });
  });

  test('handles API errors', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(
      <WeatherProvider>
        <TestComponent />
      </WeatherProvider>
    );

    // Simulate location update event
    const locationData = {
      latitude: 40.7128,
      longitude: -74.0060
    };

    act(() => {
      window.dispatchEvent(new CustomEvent('locationUpdate', {
        detail: locationData
      }));
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('API Error');
    });
  });
});
