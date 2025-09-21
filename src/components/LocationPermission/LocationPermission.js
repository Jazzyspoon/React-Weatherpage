import React, { useState } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './LocationPermission.css';

const LocationPermission = ({ onLocationGranted, onLocationDenied, onUseDefault }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setPermissionState('denied');
      onLocationDenied('Geolocation is not supported by this browser.');
      return;
    }

    setIsRequesting(true);
    
    try {
      // Check current permission state
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(permission.state);
        
        if (permission.state === 'denied') {
          setIsRequesting(false);
          onLocationDenied('Location access has been blocked. Please enable it in your browser settings.');
          return;
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsRequesting(false);
          setPermissionState('granted');
          onLocationGranted({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          setIsRequesting(false);
          setPermissionState('denied');
          
          let errorMessage = 'Unable to get your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. You can still use the app with a default location.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Using default location.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Using default location.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
              break;
          }
          
          onLocationDenied(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } catch (error) {
      setIsRequesting(false);
      setPermissionState('denied');
      onLocationDenied('Failed to request location permission.');
    }
  };

  if (isRequesting) {
    return (
      <LoadingSpinner 
        size="large" 
        message="Getting your location..." 
        className="location-loading"
      />
    );
  }

  return (
    <div className="location-permission">
      <div className="location-icon">📍</div>
      <h2>Location Access</h2>
      <p>
        We'd like to show you weather information for your current location. 
        This helps provide more accurate and relevant weather data.
      </p>
      
      <div className="location-buttons">
        <button 
          className="location-button primary" 
          onClick={requestLocation}
          disabled={isRequesting}
        >
          Allow Location Access
        </button>
        
        <button 
          className="location-button secondary" 
          onClick={() => onUseDefault()}
        >
          Use Default Location
        </button>
      </div>
      
      <div className="location-privacy">
        <small>
          🔒 Your location data is only used to fetch weather information and is not stored or shared.
        </small>
      </div>
    </div>
  );
};

export default LocationPermission;
