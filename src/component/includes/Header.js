import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.scss';
import { Navbar, Container, Form, Row, Col, Button } from 'react-bootstrap';
import WeatherService from '../../services/WeatherService';
import CitySelector from '../CitySelector';

const Header = ({ onCitySelect, currentCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchCities(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchCities = async (query) => {
    setLoading(true);
    try {
      const cities = await WeatherService.searchCities(query);
      setSuggestions(cities);
      setShowSuggestions(cities.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleCitySelect = (city) => {
    setSearchTerm('');
    setShowSuggestions(false);
    if (onCitySelect) {
      onCitySelect(city.name);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleCitySelect(suggestions[0]);
    } else if (searchTerm.trim()) {
      // Try to search for the entered term directly
      setShowSuggestions(false);
      if (onCitySelect) {
        onCitySelect(searchTerm.trim());
      }
      setSearchTerm('');
    }
  };

  const getCurrentCityDisplay = () => {
    if (!currentCity) return 'Chọn thành phố';
    return currentCity;
  };

  const handleOpenCitySelector = () => {
    setShowCitySelector(true);
  };

  const handleCloseCitySelector = () => {
    setShowCitySelector(false);
  };

  const handleCitySelectorSelect = (city) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
    setShowCitySelector(false);
  };

  return (
    <>
      <Navbar expand="lg" className="header" variant="dark">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">
            <i className="fas fa-cloud-sun me-2"></i>
            Weather
          </Navbar.Brand>
          
          <div className="d-flex align-items-center gap-3">
            {/* Current City Display with Click to Open Modal */}
            <div 
              className="current-city-display d-flex align-items-center cursor-pointer"
              onClick={handleOpenCitySelector}
              title="Nhấn để chọn thành phố"
            >
              <i className="fas fa-map-marker-alt me-2"></i>
              <span className="current-city-text">{getCurrentCityDisplay()}</span>
              <i className="fas fa-chevron-down ms-2"></i>
            </div>

            {/* Search Form */}
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <Row>
                <Col xs="auto">
                  <div className="search-container position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm thành phố..."
                      className="search-input"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {loading ? (
                      <i className="fas fa-spinner fa-spin search-icon position-absolute"></i>
                    ) : (
                      <i className="fas fa-search search-icon position-absolute"></i>
                    )}
                    
                    {/* Search Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="search-suggestions">
                        {suggestions.slice(0, 8).map((city, index) => (
                          <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleCitySelect(city)}
                          >
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {city.displayName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </Navbar>

      {/* City Selector Modal */}
      <CitySelector
        show={showCitySelector}
        onHide={handleCloseCitySelector}
        onCitySelect={handleCitySelectorSelect}
        currentCity={currentCity}
      />
    </>
  );
};

export default Header;
