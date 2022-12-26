import React from 'react';
import './radar.css';
// Kalispell, MT
//https://embed.windy.com/embed2.html?lat=48.300&lon=-114.267&detailLat=48.300&detailLon=-114.267&width=650&height=250&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" frameborder="0"></iframe>
// Denver, CO
// https://embed.windy.com/embed2.html?lat=39.715&lon=-104.977&detailLat=39.740&detailLon=-104.980&width=650&height=450&zoom=10&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0F&radarRange=-1
const Radar = () => {
  return (
    <div className='radar container-fluid'>
      <h5 className='radar_text'>Current Radar:</h5>
      <iframe
        title='radar'
        id='radar'
        src='https://embed.windy.com/embed2.html?lat=39.715&lon=-104.977&detailLat=39.740&detailLon=-104.980&width=650&height=250&zoom=10&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0F&radarRange=-1'
      ></iframe>
    </div>
  );
};

export default Radar;
