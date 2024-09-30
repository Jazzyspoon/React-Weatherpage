import React from 'react';
import { Tooltip } from 'react-tooltip';

const WeatherDay3 = (props) => {
  const [dayOneMin, setDayOneMin] = React.useState(null);
  const [dayOneMax, setDayOneMax] = React.useState(null);
  const [imageicon, setImageicon] = React.useState(null);
  const [lat, setLat] = React.useState(null);
  const [lon, setLon] = React.useState(null);
  const [forecast, setForecast] = React.useState(null);

  React.useEffect(() => {
    setLat(Math.round(props.data.latitude * 100) / 100);
    setLon(Math.round(props.data.longitude * 100) / 100);
    if (lat === null || lon === null) return;

    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=777e115b0093ba596689cbd5bd7ed1d6`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setDayOneMin(responseData.daily[2].temp.min);
        setDayOneMax(responseData.daily[2].temp.max);
        setImageicon(responseData.daily[2].weather[0].icon);
        setForecast(responseData.daily[2].summary);
      })
      .catch((error) => console.log(error));
  }, [props.data, lat, lon]);

  const dayAfterTomorrowsDate = new Date(
    new Date().getTime() + 48 * 60 * 60 * 1000
  ).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const tooltipHtml =
    '<div>' + dayAfterTomorrowsDate + ':</div><div>' + forecast + '</div>';

  return (
    <div
      data-tooltip-id='my-tooltip'
      data-tooltip-html={tooltipHtml}
      data-tooltip-place='middle'
    >
      <Tooltip
        id='my-tooltip'
        style={{
          backgroundColor: 'rgb(0, 255, 30)',
          color: '#222',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #222',
          textAlign: 'center',
          maxWidth: '150px',
        }}
      />
      <img
        className='daypane'
        src={`https://openweathermap.org/img/wn/${imageicon}.png`}
        alt='weather today'
        aria-label='weather today'
      ></img>
      <div className='row'>
        <h5 className='black_text'>
          {Math.round((dayOneMax - 273.15) * 1.8 + 32)}°
        </h5>
        <h5 className='light-grey_text'>
          {Math.round((dayOneMin - 273.15) * 1.8 + 32)}°
        </h5>
      </div>
    </div>
  );
};

export default WeatherDay3;
