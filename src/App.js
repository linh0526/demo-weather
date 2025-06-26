import React, { useState } from 'react';
import Home from './component/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './component/includes/Header.scss';
import './component/CitySelector.scss';
import Header from './component/includes/Header';

function App() {
  const [currentCity, setCurrentCity] = useState('Ho Chi Minh City');

  const handleCitySelect = (city) => {
    setCurrentCity(city);
  };

  const handleCitySearch = (searchTerm) => {
    // This can be used for city search functionality
    console.log('City search:', searchTerm);
  };

  return (
    <div className="App">
      <Header 
        onCitySelect={handleCitySelect}
        currentCity={currentCity}
      />
      <Home 
        currentCity={currentCity}
        onCitySearch={handleCitySearch}
      />
    </div>
  );
}

export default App;
