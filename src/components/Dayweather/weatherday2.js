import React from 'react';

export default class WeatherDay2 extends React.Component {
  state = {
    weather: [],
  };

  componentDidMount() {
    fetch(
      'https://api.openweathermap.org/data/2.5/onecall?lat=39.61&lon=-105.13&exclude=hourly&appid=777e115b0093ba596689cbd5bd7ed1d6',
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
        this.setState({ weather: responseData });
        this.setState({ dayOneMin: responseData.daily[1].temp.min });
        this.setState({ dayOneMax: responseData.daily[1].temp.max });
        this.setState({ imageicon: responseData.daily[1].weather[0].icon });
      })
      .catch((error) => this.setState({ error }));
  }

  render() {
    const { dayOneMin, dayOneMax, imageicon } = this.state;
    return (
      <div>
        <img
          className='daypane'
          src={`https://openweathermap.org/img/wn/${imageicon}.png`}
          alt='weather tomorrow'
          aria-label='weather tomorrow'
        ></img>
        <div className='row'>
          <h5>{Math.round((dayOneMax - 273.15) * 1.8 + 32)}°</h5>
          <h5 className='light-grey_text'>
            {Math.round((dayOneMin - 273.15) * 1.8 + 32)}°
          </h5>
        </div>
      </div>
    );
  }
}
