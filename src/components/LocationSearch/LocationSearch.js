import React, { useState, useRef, useEffect } from 'react';
import './LocationSearch.css';

const LocationSearch = ({ onLocationSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  // Debounced search function
  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim() || !API_KEY) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        const formattedSuggestions = data.map(location => ({
          name: location.name,
          state: location.state,
          country: location.country,
          lat: location.lat,
          lon: location.lon,
          displayName: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`
        }));
        setSuggestions(formattedSuggestions);
        setIsOpen(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setQuery(location.displayName);
    setSuggestions([]);
    setIsOpen(false);
    onLocationSelect({
      latitude: location.lat,
      longitude: location.lon,
      township: location.displayName
    });
  };

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleLocationSelect(suggestions[0]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`location-search ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search for a city..."
            className="search-input"
            autoComplete="off"
          />
          <div className="search-icon">
            {isLoading ? (
              <div className="search-spinner"></div>
            ) : (
              <span>🔍</span>
            )}
          </div>
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleLocationSelect(suggestion)}
            >
              <div className="suggestion-name">{suggestion.name}</div>
              <div className="suggestion-details">
                {suggestion.state && `${suggestion.state}, `}{suggestion.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
