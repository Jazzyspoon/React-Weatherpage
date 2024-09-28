import React from 'react';
import './App.css';
import Daypanel from './components/Daypanel/daypanel';
import Radar from './components/radar/radar';
import Geo from './components/GeoLocation/geoLocation';
import { useGeolocated } from 'react-geolocated';

function App() {
  const [myLocation, setMyLocation] = React.useState('Unknown Location');
  const [latitude, setLatitude] = React.useState(39.74);
  const [longitude, setLongitude] = React.useState(-104.98);

  Geo.coords = { latitude, longitude };

  const getTownFromLatLon = (lat, lon) => {
    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )
      .then((response) => response.json())
      .then((data) => {
        setMyLocation(data.locality);
      });
  };

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 500,
  });

  React.useEffect(() => {
    if (coords) {
      const newLat = coords.latitude;
      const newLon = coords.longitude;
      setLatitude(newLat);
      setLongitude(newLon);
      getTownFromLatLon(newLat, newLon);
    }
  }, [coords]);

  return (
    <div className='App'>
      <header className='App-header'>
        <h2>5-Day Forecast for {myLocation}</h2>
        <Daypanel data={Geo.coords} />
        <Radar data={Geo.coords} />
      </header>
    </div>
  );
}

export default App;
