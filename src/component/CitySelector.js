import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import './CitySelector.scss';
import WeatherService from '../services/WeatherService';

const CitySelector = ({ show, onHide, onCitySelect, currentCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('popular');

  // Danh sách các thành phố phổ biến Việt Nam
  const popularCities = [
    { name: 'Hanoi', displayName: 'Hà Nội', region: 'Thủ đô', country: 'Vietnam', flag: '🏛️' },
    { name: 'Ho Chi Minh City', displayName: 'TP. Hồ Chí Minh', region: 'Thành phố trực thuộc TW', country: 'Vietnam', flag: '🌆' },
    { name: 'Da Nang', displayName: 'Đà Nẵng', region: 'Thành phố trực thuộc TW', country: 'Vietnam', flag: '🌊' },
    { name: 'Hai Phong', displayName: 'Hải Phòng', region: 'Thành phố trực thuộc TW', country: 'Vietnam', flag: '⚓' },
    { name: 'Can Tho', displayName: 'Cần Thơ', region: 'Thành phố trực thuộc TW', country: 'Vietnam', flag: '🌾' },
    { name: 'Nha Trang', displayName: 'Nha Trang', region: 'Khánh Hòa', country: 'Vietnam', flag: '🏖️' },
    { name: 'Hue', displayName: 'Huế', region: 'Thừa Thiên Huế', country: 'Vietnam', flag: '🏰' },
    { name: 'Vung Tau', displayName: 'Vũng Tàu', region: 'Bà Rịa - Vũng Tàu', country: 'Vietnam', flag: '🏖️' },
    { name: 'Da Lat', displayName: 'Đà Lạt', region: 'Lâm Đồng', country: 'Vietnam', flag: '🌲' },
    { name: 'Quy Nhon', displayName: 'Quy Nhơn', region: 'Bình Định', country: 'Vietnam', flag: '🌊' },
    { name: 'Thai Nguyen', displayName: 'Thái Nguyên', region: 'Thái Nguyên', country: 'Vietnam', flag: '🏔️' },
    { name: 'Vinh', displayName: 'Vinh', region: 'Nghệ An', country: 'Vietnam', flag: '🌾' },
  ];

  // Thành phố quốc tế phổ biến
  const internationalCities = [
    { name: 'Bangkok', displayName: 'Bangkok', region: '', country: 'Thailand', flag: '🇹🇭' },
    { name: 'Singapore', displayName: 'Singapore', region: '', country: 'Singapore', flag: '🇸🇬' },
    { name: 'Kuala Lumpur', displayName: 'Kuala Lumpur', region: '', country: 'Malaysia', flag: '🇲🇾' },
    { name: 'Jakarta', displayName: 'Jakarta', region: '', country: 'Indonesia', flag: '🇮🇩' },
    { name: 'Manila', displayName: 'Manila', region: '', country: 'Philippines', flag: '🇵🇭' },
    { name: 'Tokyo', displayName: 'Tokyo', region: '', country: 'Japan', flag: '🇯🇵' },
    { name: 'Seoul', displayName: 'Seoul', region: '', country: 'South Korea', flag: '🇰🇷' },
    { name: 'Hong Kong', displayName: 'Hong Kong', region: '', country: 'Hong Kong', flag: '🇭🇰' },
    { name: 'Taipei', displayName: 'Taipei', region: '', country: 'Taiwan', flag: '🇹🇼' },
    { name: 'Beijing', displayName: 'Beijing', region: '', country: 'China', flag: '🇨🇳' },
    { name: 'Sydney', displayName: 'Sydney', region: 'NSW', country: 'Australia', flag: '🇦🇺' },
    { name: 'New York', displayName: 'New York', region: 'NY', country: 'USA', flag: '🇺🇸' },
  ];

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchCities();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchCities = async () => {
    setLoading(true);
    try {
      const results = await WeatherService.searchCities(searchTerm);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    onCitySelect(city.name);
    onHide();
    setSearchTerm('');
    setSearchResults([]);
  };

  const formatDisplayName = (city) => {
    if (city.region && city.region !== city.name) {
      return `${city.displayName || city.name}, ${city.region}`;
    }
    return city.displayName || city.name;
  };

  const isCurrentCity = (cityName) => {
    return currentCity && currentCity.toLowerCase() === cityName.toLowerCase();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="city-selector-modal">
      <Modal.Header closeButton className="city-selector-header">
        <Modal.Title>
          <i className="fas fa-globe-asia me-2"></i>
          Chọn Thành Phố
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="city-selector-body">
        {/* Search Input */}
        <div className="search-section mb-4">
          <Form.Group>
            <div className="search-input-container position-relative">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm thành phố trên toàn thế giới..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {loading ? (
                <i className="fas fa-spinner fa-spin search-icon"></i>
              ) : (
                <i className="fas fa-search search-icon"></i>
              )}
            </div>
          </Form.Group>
        </div>

        {/* Search Results */}
        {searchTerm.length >= 2 && (
          <div className="search-results mb-4">
            <h6 className="section-title">
              <i className="fas fa-search me-2"></i>
              Kết quả tìm kiếm
            </h6>
            {searchResults.length > 0 ? (
              <ListGroup variant="flush">
                {searchResults.map((city, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleCitySelect(city)}
                    className={`search-result-item ${isCurrentCity(city.name) ? 'current-city' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        <strong>{city.name}</strong>
                        {city.region && <span className="text-muted ms-1">, {city.region}</span>}
                        <span className="text-muted ms-1">, {city.country}</span>
                      </div>
                      {isCurrentCity(city.name) && (
                        <Badge bg="success">Hiện tại</Badge>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="no-results text-center py-3">
                <i className="fas fa-search-location fa-2x text-muted mb-2"></i>
                <p className="text-muted mb-0">Không tìm thấy thành phố nào</p>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="city-tabs mb-3">
          <Button
            variant={selectedTab === 'popular' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTab('popular')}
            className="me-2"
          >
            <i className="fas fa-flag me-1"></i>
            Việt Nam
          </Button>
          <Button
            variant={selectedTab === 'international' ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedTab('international')}
          >
            <i className="fas fa-globe me-1"></i>
            Quốc tế
          </Button>
        </div>

        {/* City Lists */}
        <div className="city-lists">
          {selectedTab === 'popular' && (
            <div className="popular-cities">
              <h6 className="section-title">
                <i className="fas fa-star me-2"></i>
                Thành phố phổ biến - Việt Nam
              </h6>
              <Row>
                {popularCities.map((city, index) => (
                  <Col lg={6} md={6} sm={12} key={index} className="mb-2">
                    <div
                      className={`city-card ${isCurrentCity(city.name) ? 'current-city' : ''}`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="d-flex align-items-center">
                        <span className="city-flag me-2">{city.flag}</span>
                        <div className="flex-grow-1">
                          <div className="city-name">{city.displayName}</div>
                          <div className="city-region">{city.region}</div>
                        </div>
                        {isCurrentCity(city.name) && (
                          <Badge bg="success" className="ms-2">Hiện tại</Badge>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {selectedTab === 'international' && (
            <div className="international-cities">
              <h6 className="section-title">
                <i className="fas fa-globe-americas me-2"></i>
                Thành phố quốc tế
              </h6>
              <Row>
                {internationalCities.map((city, index) => (
                  <Col lg={6} md={6} sm={12} key={index} className="mb-2">
                    <div
                      className={`city-card ${isCurrentCity(city.name) ? 'current-city' : ''}`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <div className="d-flex align-items-center">
                        <span className="city-flag me-2">{city.flag}</span>
                        <div className="flex-grow-1">
                          <div className="city-name">{city.displayName}</div>
                          <div className="city-region">{city.country}</div>
                        </div>
                        {isCurrentCity(city.name) && (
                          <Badge bg="success" className="ms-2">Hiện tại</Badge>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CitySelector; 