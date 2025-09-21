import { render, screen } from '@testing-library/react';
import App from './App';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
};

global.navigator.geolocation = mockGeolocation;

test('renders weather app', () => {
  render(<App />);
  const locationHeading = screen.getByRole('heading', { name: /Location Access/i });
  expect(locationHeading).toBeInTheDocument();
});

test('shows location permission component initially', () => {
  render(<App />);
  const allowButton = screen.getByText(/Allow Location Access/i);
  expect(allowButton).toBeInTheDocument();
});
