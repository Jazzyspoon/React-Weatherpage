import React from "react";
import "./daypanel.css";
import WeatherDay1 from "../Dayweather/weatherday1";
import WeatherDay2 from "../Dayweather/weatherday2";
import WeatherDay3 from "../Dayweather/weatherday3";
import WeatherDay4 from "../Dayweather/weatherday4";
import WeatherDay5 from "../Dayweather/weatherday5";
const Daypanel = () => {
  let curr = new Date();
  let today = curr.getDay();
  let week = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  // going through the weekdays
  for (let i = 0; week.length < 7; i++) {
    let day = today + i;
    week.push(day);
  }
  return (
    <div className="panel_wide container">
      <div className="day grey">
        <h5 className="grey_text">{week[curr.getDay()]}</h5>
        <WeatherDay1 />
      </div>

      <div className="day">
        <h5>{week[curr.getDay() + 1]}</h5>
        <WeatherDay2 />
      </div>

      <div className="day">
        <h5>{week[curr.getDay() + 2]}</h5>
        <WeatherDay3 />
      </div>

      <div className="day">
        <h5>{week[curr.getDay() + 3]}</h5>
        <WeatherDay4 />
      </div>

      <div className="day">
        <h5>{week[curr.getDay() + 4]}</h5>
        <WeatherDay5 />
      </div>
    </div>
  );
};

export default Daypanel;
