// Shared utility functions for weather components

// Convert Kelvin to Fahrenheit
export const kelvinToFahrenheit = (kelvin) => {
  return kelvin ? Math.round((kelvin - 273.15) * 1.8 + 32) : null;
};

// Calculate date for a specific day offset (0 = today, 1 = tomorrow, etc.)
export const getDateForOffset = (dayOffset) => {
  return new Date(
    new Date().getTime() + dayOffset * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format coordinates to reduce precision
export const formatCoordinates = (latitude, longitude) => {
  if (latitude === null || longitude === null) return null;
  return {
    lat: Math.round(latitude * 100) / 100,
    lon: Math.round(longitude * 100) / 100
  };
};

// Get day name for a specific day offset (0 = today, 1 = tomorrow, etc.)
export const getDayNameForOffset = (dayOffset) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  return days[(today + dayOffset) % 7];
};

// Get short day name for a specific day offset (0 = today, 1 = tomorrow, etc.)
export const getShortDayNameForOffset = (dayOffset) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  return days[(today + dayOffset) % 7];
};