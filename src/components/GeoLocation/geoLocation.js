import React from 'react';
import { useGeolocated } from 'react-geolocated';

const Geo = (props) => {
  const newCoords = props.data;
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 500,
    });
  if (newCoords) {
    return (
      <table>
        <tbody>
          <tr>
            <td>latitude</td>
            <td>{newCoords.latitude}</td>
          </tr>
          <tr>
            <td>longitude</td>
            <td>{newCoords.longitude}</td>
          </tr>
        </tbody>
      </table>
    );
  } else {
    return !isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
      <div>Geolocation is not enabled</div>
    ) : coords ? (
      <table>
        <tbody>
          <tr>
            <td>latitude</td>
            <td>{coords.latitude}</td>
          </tr>
          <tr>
            <td>longitude</td>
            <td>{coords.longitude}</td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div>Getting the location data: </div>
    );
  }
};

export default Geo;
