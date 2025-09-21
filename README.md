# Weather Forecast App

A modern, responsive React-based weather application that provides comprehensive weather information including current conditions, hourly forecasts, and 5-day forecasts.

## Features

### 🌤️ Weather Information
- **Current Weather**: Real-time weather conditions with detailed metrics
- **Hourly Forecast**: Next 12 hours of weather data
- **5-Day Forecast**: Extended weather outlook
- **Weather Details**: Temperature, humidity, wind speed, UV index, pressure, visibility, and more

### 📍 Location Services
- **Automatic Location Detection**: Uses browser geolocation API
- **Location Search**: Search for any city worldwide
- **Default Locations**: Fallback to default location if geolocation fails
- **Location Permission Handling**: User-friendly permission requests

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Loading States**: Beautiful loading spinners and skeleton screens
- **Error Handling**: Comprehensive error messages with retry options
- **Accessibility**: ARIA labels and keyboard navigation support

### 🗺️ Interactive Radar
- **Weather Radar**: Embedded interactive weather radar map
- **Real-time Data**: Live precipitation and weather patterns

## Technology Stack

- **React 19**: Latest React with modern hooks and features
- **JavaScript ES6+**: Modern JavaScript features
- **CSS3**: Custom styling with responsive design
- **OpenWeatherMap API**: Weather data provider
- **Windy.com**: Interactive weather radar

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jazzyspoon/React-Weatherpage.git
   cd React-Weatherpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenWeatherMap API key:
   ```
   REACT_APP_WEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env` file

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run deploy` - Deploys to GitHub Pages

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CurrentWeather/  # Current weather display
│   ├── HourlyForecast/  # Hourly weather forecast
│   ├── Daypanel/        # 5-day forecast panel
│   ├── LocationSearch/  # Location search functionality
│   ├── LoadingSpinner/  # Loading animations
│   ├── ErrorMessage/    # Error handling components
│   └── ...
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # App constants and configurations
└── ...
```

## Features in Detail

### Weather Data
- Temperature (current, feels like, min/max)
- Weather conditions with icons
- Precipitation probability
- Wind speed and direction
- Humidity and pressure
- UV index with safety levels
- Sunrise and sunset times
- Visibility and cloud coverage

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

### Error Handling
- Network error recovery
- API error handling
- Location permission errors
- Graceful fallbacks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Windy.com](https://windy.com/) for radar integration
- [React](https://reactjs.org/) for the amazing framework

<img src="https://github.com/Jazzyspoon/React-Weatherpage/blob/master/src/components/images/updated%20look.png" alt="Weather App Screenshot" width="600">
