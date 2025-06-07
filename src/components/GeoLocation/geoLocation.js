import React, { useMemo } from 'react';
import { useGeolocated } from 'react-geolocated';
import './geoLocation.css'; // Assuming you have a CSS file

const Geo = ({ data }) => {
  "use memo"; // Enable React Compiler optimization

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 500,
  });

  // Memoize the coordinates display to prevent unnecessary re-renders
  const CoordinatesDisplay = useMemo(() => {
    const coordsToDisplay = data || coords;

    if (!coordsToDisplay) {
      return <div className="loading">Getting the location data...</div>;
    }

    return (
        <table className="coords-table">
          <tbody>
          <tr>
            <td>Latitude</td>
            <td>{coordsToDisplay.latitude.toFixed(6)}</td>
          </tr>
          <tr>
            <td>Longitude</td>
            <td>{coordsToDisplay.longitude.toFixed(6)}</td>
          </tr>
          </tbody>
        </table>
    );
  }, [data, coords]);

  if (!isGeolocationAvailable) {
    return <div className="error">Your browser does not support Geolocation</div>;
  }

  if (!isGeolocationEnabled) {
    return <div className="error">Geolocation is not enabled</div>;
  }

  return CoordinatesDisplay;
};

export default Geo;