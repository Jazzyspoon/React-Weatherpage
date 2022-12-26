import React from 'react';
import './App.css';
import Daypanel from './components/Daypanel/daypanel';
import Radar from './components/radar/radar';

function App() {
  let thisDay = new Date();
  let thisDayString = thisDay.toLocaleDateString();
  let myLocation = 'Littleton, CO';

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='town'>{myLocation}</h1>
        <h2>5-Day Forecast for {thisDayString}</h2>
      </header>
      <div>
        <Daypanel></Daypanel>
        <Radar></Radar>
      </div>
    </div>
  );
}

export default App;
