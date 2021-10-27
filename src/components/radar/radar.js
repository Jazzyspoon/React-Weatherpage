import React from "react";
import "./radar.css";
const Radar = () => {
  return (
    <div className="radar container-fluid">
      <h3>Current Radar</h3>
      <iframe
        title="radar"
        id="radar"
        src="https://embed.windy.com/embed2.html?lat=39.715&lon=-104.977&detailLat=39.740&detailLon=-104.980&width=650&height=450&zoom=10&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0F&radarRange=-1"
      ></iframe>
    </div>
  );
};

export default Radar;
