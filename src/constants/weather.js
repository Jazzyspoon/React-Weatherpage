// Weather API constants
export const WEATHER_API = {
  BASE_URL: 'https://api.openweathermap.org',
  ENDPOINTS: {
    ONE_CALL: '/data/3.0/onecall',
    GEOCODING: '/geo/1.0/direct',
    REVERSE_GEOCODING: '/geo/1.0/reverse'
  },
  ICON_URL: 'https://openweathermap.org/img/wn'
};

// Default locations
export const DEFAULT_LOCATIONS = {
  NEW_YORK: {
    latitude: 40.7128,
    longitude: -74.0060,
    township: 'New York, NY'
  },
  LONDON: {
    latitude: 51.5074,
    longitude: -0.1278,
    township: 'London, UK'
  },
  TOKYO: {
    latitude: 35.6762,
    longitude: 139.6503,
    township: 'Tokyo, Japan'
  }
};

// Weather condition mappings
export const WEATHER_CONDITIONS = {
  CLEAR: ['01d', '01n'],
  CLOUDS: ['02d', '02n', '03d', '03n', '04d', '04n'],
  RAIN: ['09d', '09n', '10d', '10n'],
  THUNDERSTORM: ['11d', '11n'],
  SNOW: ['13d', '13n'],
  MIST: ['50d', '50n']
};

// UV Index levels
export const UV_INDEX_LEVELS = {
  LOW: { min: 0, max: 2, color: '#00E400', label: 'Low' },
  MODERATE: { min: 3, max: 5, color: '#FFFF00', label: 'Moderate' },
  HIGH: { min: 6, max: 7, color: '#FF8C00', label: 'High' },
  VERY_HIGH: { min: 8, max: 10, color: '#FF0000', label: 'Very High' },
  EXTREME: { min: 11, max: 20, color: '#8B00FF', label: 'Extreme' }
};

// Wind direction mappings
export const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
];

// Unit conversions
export const CONVERSIONS = {
  KELVIN_TO_FAHRENHEIT: (k) => Math.round((k - 273.15) * 1.8 + 32),
  KELVIN_TO_CELSIUS: (k) => Math.round(k - 273.15),
  METERS_PER_SECOND_TO_MPH: (mps) => Math.round(mps * 2.237),
  METERS_PER_SECOND_TO_KMH: (mps) => Math.round(mps * 3.6),
  METERS_TO_MILES: (m) => Math.round(m * 0.000621371),
  METERS_TO_KILOMETERS: (m) => Math.round(m / 1000),
  HPA_TO_INHG: (hpa) => Math.round(hpa * 0.02953 * 100) / 100
};

// App configuration
export const APP_CONFIG = {
  LOCATION_TIMEOUT: 10000,
  API_TIMEOUT: 15000,
  CACHE_DURATION: 300000, // 5 minutes
  MAX_SEARCH_RESULTS: 5,
  HOURLY_FORECAST_HOURS: 12,
  DAILY_FORECAST_DAYS: 5
};

// Error messages
export const ERROR_MESSAGES = {
  GEOLOCATION_NOT_SUPPORTED: 'Geolocation is not supported by this browser.',
  LOCATION_PERMISSION_DENIED: 'Location access was denied.',
  LOCATION_UNAVAILABLE: 'Location information is unavailable.',
  LOCATION_TIMEOUT: 'Location request timed out.',
  API_KEY_MISSING: 'Weather API key is not configured.',
  WEATHER_API_ERROR: 'Unable to fetch weather data.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
};
