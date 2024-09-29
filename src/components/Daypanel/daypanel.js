import React from 'react';
import './daypanel.css';
import WeatherDay1 from '../Dayweather/weatherday1';
import WeatherDay2 from '../Dayweather/weatherday2';
import WeatherDay3 from '../Dayweather/weatherday3';
import WeatherDay4 from '../Dayweather/weatherday4';
import WeatherDay5 from '../Dayweather/weatherday5';
import { Tooltip } from 'react-tooltip';

const Daypanel = (props) => {
  const [data, setData] = React.useState({ latitude: null, longitude: null });
  //if props update, update the data
  React.useEffect(
    () => {
      const latitude = props.data.latitude;
      const longitude = props.data.longitude;
      setData({ latitude, longitude });
    },
    [props],
    [data]
  );

  let curr = new Date();
  let today = curr.getDay();
  const todaysDate = new Date().toDateString();
  const tomorrowsDate = new Date(
    new Date().getTime() + 24 * 60 * 60 * 1000
  ).toDateString();
  const dayAfterTomorrowsDate = new Date(
    new Date().getTime() + 48 * 60 * 60 * 1000
  ).toDateString();
  const threeDaysDate = new Date(
    new Date().getTime() + 72 * 60 * 60 * 1000
  ).toDateString();
  const fourDaysDate = new Date(
    new Date().getTime() + 96 * 60 * 60 * 1000
  ).toDateString();

  let week = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];
  // going through the weekdays
  for (let i = 0; week.length < 7; i++) {
    let day = today + i;
    week.push(day);
  }

  return data.latitude === null ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div className='container'>
      <div className='row'>
        <Tooltip id='my-tooltip' />
        <div
          className='day grey'
          data-tooltip-id='my-tooltip'
          data-tooltip-content={todaysDate}
          data-tooltip-place='middle'
        >
          <h5 className='grey_text'>Today</h5>
          <WeatherDay1 data={data} />
        </div>

        <div
          className='day'
          data-tooltip-id='my-tooltip'
          data-tooltip-content={tomorrowsDate}
          data-tooltip-place='middle'
        >
          <h5>{week[curr.getDay() + 1]}</h5>
          <WeatherDay2 data={data} />
        </div>

        <div
          className='day'
          data-tooltip-id='my-tooltip'
          data-tooltip-content={dayAfterTomorrowsDate}
          data-tooltip-place='middle'
        >
          <h5>{week[curr.getDay() + 2]}</h5>
          <WeatherDay3 data={data} />
        </div>

        <div
          className='day'
          data-tooltip-id='my-tooltip'
          data-tooltip-content={threeDaysDate}
          data-tooltip-place='middle'
        >
          <h5>{week[curr.getDay() + 3]}</h5>
          <WeatherDay4 data={data} />
        </div>

        <div
          className='day'
          data-tooltip-id='my-tooltip'
          data-tooltip-content={fourDaysDate}
          data-tooltip-place='middle'
        >
          <h5>{week[curr.getDay() + 4]}</h5>
          <WeatherDay5 data={data} />
        </div>
      </div>
    </div>
  );
};

export default Daypanel;
