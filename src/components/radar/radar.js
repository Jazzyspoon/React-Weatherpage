import React from 'react';
import './radar.css';

const Radar = (props) => {
  const latitude = props.data.latitude - 0.05;
  const longitude = props.data.longitude - 0.011;
  if (!props.data) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className='radar container-fluid'>
        <h5 className='radar_text'>Current Radar:</h5>
        <iframe
          title='radar'
          id='radar'
          src={`https://embed.windy.com/embed2.html?lat=${latitude}&lon=${longitude}&detailLat=${latitude}&detailLon=${longitude}&width=650&height=550&zoom=9&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0F&radarRange=-1`}
          frameBorder='0'
        ></iframe>
      </div>
    );
  }
};
export default Radar;
