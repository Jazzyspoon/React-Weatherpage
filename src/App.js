import React from "react";
import "./App.css";
import Daypanel from "./components/Daypanel/daypanel";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>5 Day Forecast</h1>
        <Daypanel></Daypanel>
      </header>
    </div>
  );
}

export default App;
