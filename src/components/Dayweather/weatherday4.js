import React, { Component } from 'react';

class WeatherDay4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      dayOneMin: null,
      dayOneMax: null,
      imageicon: null,
      error: null,
    };
    this.props.data.latitude = Math.round(this.props.data.latitude * 100) / 100;
    this.props.data.longitude =
      Math.round(this.props.data.longitude * 100) / 100;
    this.lat = this.props.data.latitude;
    this.lon = this.props.data.longitude;
  }

  //kelvin to far convertor
  ktoFConverter(k) {
    let f = (k - 273.15) * 1.8 + 32;
    return Math.round(f);
  }
  componentDidMount() {
    if (this.props.data) {
      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${this.lat}&lon=${this.lon}&exclude=hourly&appid=777e115b0093ba596689cbd5bd7ed1d6`,
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
          this.setState({ dayOneMin: responseData.daily[3].temp.min });
          this.setState({ dayOneMax: responseData.daily[3].temp.max });
          this.setState({ imageicon: responseData.daily[3].weather[0].icon });
        })
        .catch((error) => this.setState({ error }));
    }
  }

  render() {
    const { dayOneMin, dayOneMax, imageicon } = this.state;
    return (
      <div>
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
  }
}

export default WeatherDay4;
