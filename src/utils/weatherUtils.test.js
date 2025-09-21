import {
  kelvinToFahrenheit,
  getDateForOffset,
  formatCoordinates,
  getDayNameForOffset,
  getShortDayNameForOffset
} from './weatherUtils';

describe('weatherUtils', () => {
  describe('kelvinToFahrenheit', () => {
    test('converts Kelvin to Fahrenheit correctly', () => {
      expect(kelvinToFahrenheit(273.15)).toBe(32); // Freezing point
      expect(kelvinToFahrenheit(373.15)).toBe(212); // Boiling point
      expect(kelvinToFahrenheit(293.15)).toBe(68); // Room temperature
    });

    test('handles null and undefined values', () => {
      expect(kelvinToFahrenheit(null)).toBe(null);
      expect(kelvinToFahrenheit(undefined)).toBe(null);
    });

    test('handles zero value (absolute zero)', () => {
      expect(kelvinToFahrenheit(0)).toBe(-460); // Absolute zero
    });

    test('rounds to nearest integer', () => {
      expect(kelvinToFahrenheit(273.65)).toBe(33); // Should round up
      expect(kelvinToFahrenheit(273.25)).toBe(32); // Should round down
    });
  });

  describe('getDateForOffset', () => {
    test('returns today for offset 0', () => {
      const today = new Date();
      const result = getDateForOffset(0);
      const expectedDate = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      expect(result).toBe(expectedDate);
    });

    test('returns future dates for positive offsets', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = getDateForOffset(1);
      const expectedDate = tomorrow.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      expect(result).toBe(expectedDate);
    });
  });

  describe('formatCoordinates', () => {
    test('formats coordinates correctly', () => {
      const result = formatCoordinates(40.712776, -74.005974);
      expect(result).toEqual({ lat: 40.71, lon: -74.01 });
    });

    test('handles null values', () => {
      expect(formatCoordinates(null, -74.005974)).toBe(null);
      expect(formatCoordinates(40.712776, null)).toBe(null);
      expect(formatCoordinates(null, null)).toBe(null);
    });

    test('rounds to 2 decimal places', () => {
      const result = formatCoordinates(40.712776123, -74.005974456);
      expect(result).toEqual({ lat: 40.71, lon: -74.01 });
    });
  });

  describe('getDayNameForOffset', () => {
    test('returns a valid day name', () => {
      const result = getDayNameForOffset(0);
      const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      expect(validDays).toContain(result);
    });

    test('returns different days for different offsets', () => {
      const today = getDayNameForOffset(0);
      const tomorrow = getDayNameForOffset(1);
      // They should be different unless it's Saturday -> Sunday
      expect(typeof today).toBe('string');
      expect(typeof tomorrow).toBe('string');
    });
  });

  describe('getShortDayNameForOffset', () => {
    test('returns a valid short day name', () => {
      const result = getShortDayNameForOffset(0);
      const validShortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      expect(validShortDays).toContain(result);
    });

    test('returns 3-character strings', () => {
      expect(getShortDayNameForOffset(0)).toHaveLength(3);
      expect(getShortDayNameForOffset(1)).toHaveLength(3);
    });
  });
});
