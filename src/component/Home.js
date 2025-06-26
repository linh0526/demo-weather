import React, { useState, useEffect } from 'react';
import WeatherService from '../services/WeatherService';
import './Home.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = ({ currentCity, onCitySearch }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('HÔM NAY');

  const tabs = [
    'HÔM NAY', 'THEO GIỜ', 'HÀNG NGÀY', 'RA-ĐA',
    'MINUTECAST', 'HÀNG THÁNG', 'CHẤT LƯỢNG KHÔNG KHÍ', 'SỨC KHỎE VÀ HO...'
  ];

  useEffect(() => {
    loadWeatherData();
  }, [currentCity]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WeatherService.getCurrentWeather(currentCity || 'Ho Chi Minh City');
      setWeather(data);
      
      // Get forecast data
      const forecastData = await WeatherService.getForecast(currentCity || 'Ho Chi Minh City', 5);
      setForecast(forecastData);
    } catch (err) {
      setError('Không thể tải dữ liệu thời tiết. Vui lòng thử lại.');
      console.error('Weather data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition, isDay) => {
    const weatherIcons = {
      'Sunny': 'fas fa-sun',
      'Clear': 'fas fa-moon',
      'Partly cloudy': isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon',
      'Cloudy': 'fas fa-cloud',
      'Overcast': 'fas fa-cloud',
      'Mist': 'fas fa-smog',
      'Light rain': 'fas fa-cloud-rain',
      'Heavy rain': 'fas fa-cloud-showers-heavy',
      'Thundery outbreaks possible': 'fas fa-bolt',
      'Light snow': 'fas fa-snowflake',
      'Heavy snow': 'fas fa-snowflake',
      'Fog': 'fas fa-smog',
      'Patchy rain possible': 'fas fa-cloud-rain',
      'Moderate rain': 'fas fa-cloud-rain',
      'Blizzard': 'fas fa-snowflake'
    };
    
    return weatherIcons[condition] || 'fas fa-cloud';
  };

  const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Tốt', className: 'good' };
    if (aqi <= 100) return { level: 'Trung bình', className: 'warning' };
    if (aqi <= 150) return { level: 'Không tốt cho nhóm nhạy cảm', className: 'warning' };
    if (aqi <= 200) return { level: 'Không tốt', className: 'bad' };
    if (aqi <= 300) return { level: 'Rất không tốt', className: 'bad' };
    return { level: 'Nguy hại', className: 'bad' };
  };

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: 'Thấp', className: 'good' };
    if (uv <= 5) return { level: 'Trung bình', className: 'warning' };
    if (uv <= 7) return { level: 'Cao', className: 'warning' };
    if (uv <= 10) return { level: 'Rất cao', className: 'bad' };
    return { level: 'Cực độ', className: 'bad' };
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    }
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  const generateHourlyForecast = () => {
    if (!weather) return [];
    
    const hours = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i += 3) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      const temp = weather.current.temp_c + Math.random() * 6 - 3; // Simulate variation
      const condition = weather.current.condition.text;
      
      hours.push({
        time: hour.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(temp),
        condition: condition,
        icon: getWeatherIcon(condition, hour.getHours() >= 6 && hour.getHours() <= 18),
        precipitation: Math.random() * 30
      });
    }
    
    return hours;
  };

  if (loading) {
    return (
      <div className="weather-app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu thời tiết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-app">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadWeatherData}>
            <i className="fas fa-redo-alt me-2"></i>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const airQuality = weather?.current?.air_quality ? getAirQualityLevel(weather.current.air_quality.pm2_5 || 0) : null;
  const uvLevel = getUVLevel(weather?.current?.uv || 0);
  const hourlyData = generateHourlyForecast();

  return (
    <div className="weather-app">

      {/* Navigation */}
      <nav className="nav weather-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Weather Content */}
      <div className="weather-cards-container">
        {weather && (
          <>
            <div className="main-weather-card">
              {/* Current Weather Display */}
              <div className="current-weather">
                <div className="weather-display">
                  <div className="weather-icon">
                    <i className={getWeatherIcon(weather.current.condition.text, weather.current.is_day)}></i>
                  </div>
                  <div className="temperature-info">
                    <div className="temperature">{Math.round(weather.current.temp_c)}°</div>
                    <div className="weather-description">{weather.current.condition.text_vi || weather.current.condition.text}</div>
                  </div>
                </div>

                {/* RealFeel and Humidity */}
                <div className="realfeel-info">
                  <div className="realfeel-temp">
                    RealFeel® {Math.round(weather.current.feelslike_c)}°
                  </div>
                  <div className="humidity-info">
                    <i className="fas fa-tint"></i>
                    {weather.current.humidity}%
                  </div>
                </div>
              </div>

              {/* Weather Highlights */}
              <div className="weather-highlights">
                <div className="highlight-card">
                  <div className="highlight-icon uv">
                    <i className="fas fa-sun"></i>
                  </div>
                  <div className="highlight-title">Chỉ số UV</div>
                  <div className="highlight-value">{weather.current.uv}</div>
                  <div className={`highlight-description ${uvLevel.className}`}>{uvLevel.level}</div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon wind">
                    <i className="fas fa-wind"></i>
                  </div>
                  <div className="highlight-title">Gió</div>
                  <div className="highlight-value">{Math.round(weather.current.wind_kph)}</div>
                  <div className="highlight-description">km/h {weather.current.wind_dir}</div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon visibility">
                    <i className="fas fa-eye"></i>
                  </div>
                  <div className="highlight-title">Tầm nhìn</div>
                  <div className="highlight-value">{Math.round(weather.current.vis_km)}</div>
                  <div className="highlight-description">km</div>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon pressure">
                    <i className="fas fa-thermometer-half"></i>
                  </div>
                  <div className="highlight-title">Áp suất</div>
                  <div className="highlight-value">{Math.round(weather.current.pressure_mb)}</div>
                  <div className="highlight-description">mb</div>
                </div>
              </div>

              {/* Detailed Weather Information */}
              <div className="weather-details-grid">
                <div className="weather-details">
                  <div className="detail-row">
                    <span className="detail-label">RealFeel®</span>
                    <span className="detail-value">{Math.round(weather.current.feelslike_c)}°</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">RealFeel Shade®</span>
                    <span className="detail-value">{Math.round(weather.current.feelslike_c - 2)}°</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Gió</span>
                    <span className="detail-value">{weather.current.wind_dir} {Math.round(weather.current.wind_kph)} km/h</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Gió giật</span>
                    <span className="detail-value">{Math.round(weather.current.gust_kph || weather.current.wind_kph * 1.3)} km/h</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Áp suất</span>
                    <span className="detail-value">{Math.round(weather.current.pressure_mb)} mb</span>
                  </div>
                </div>

                <div className="additional-info">
                  <div className="detail-row">
                    <span className="detail-label">Chất lượng không khí</span>
                    <span className={`detail-value ${airQuality?.className || 'good'}`}>
                      {airQuality?.level || 'Không có dữ liệu'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Chỉ số UV</span>
                    <span className={`detail-value ${uvLevel.className}`}>
                      {weather.current.uv} ({uvLevel.level})
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mật độ mây</span>
                    <span className="detail-value">{weather.current.cloud}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lượng mưa</span>
                    <span className="detail-value">
                      {weather.current.precip_mm ? `${weather.current.precip_mm} mm` : '0 mm'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tầm nhìn</span>
                    <span className="detail-value">{Math.round(weather.current.vis_km)} km</span>
                  </div>
                </div>
              </div>

              {/* Location and Last Updated Info */}
              <div className="location-info">
                <div className="location-main">
                  <i className="fas fa-map-marker-alt"></i>
                  {weather.location.name}, {weather.location.country}
                </div>
                <div className="location-updated">
                  <i className="fas fa-clock"></i>
                  Cập nhật lần cuối: {formatDateTime(weather.current.last_updated)}
                </div>
              </div>
            </div>

            {/* Hourly Forecast Card */}
            {activeTab === 'THEO GIỜ' && (
              <div className="hourly-forecast-card">
                <h3 className="forecast-title">
                  <i className="fas fa-clock"></i>
                  Dự báo theo giờ
                </h3>
                <div className="hourly-forecast">
                  {hourlyData.map((hour, index) => (
                    <div key={index} className="hourly-item">
                      <div className="hour-time">{hour.time}</div>
                      <div className="hour-icon">
                        <i className={hour.icon}></i>
                      </div>
                      <div className="hour-temp">{hour.temp}°</div>
                      <div className="hour-precipitation">
                        <i className="fas fa-tint"></i>
                        {Math.round(hour.precipitation)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Forecast Card */}
            {activeTab === 'HÀNG NGÀY' && forecast && (
              <div className="daily-forecast-card">
                <h3 className="forecast-title">
                  <i className="fas fa-calendar-alt"></i>
                  Dự báo 5 ngày tới
                </h3>
                <div className="daily-forecast">
                  {forecast.forecast.forecastday.map((day, index) => (
                    <div key={index} className="daily-item">
                      <div className="daily-date">
                        {formatDay(day.date)}
                      </div>
                      <div className="daily-icon">
                        <i className={getWeatherIcon(day.day.condition.text, true)}></i>
                      </div>
                      <div className="daily-condition">
                        {day.day.condition.text_vi || day.day.condition.text}
                      </div>
                      <div className="daily-temps">
                        <span className="temp-high">{Math.round(day.day.maxtemp_c)}°</span>
                        <span className="temp-low">{Math.round(day.day.mintemp_c)}°</span>
                      </div>
                      <div className="daily-precipitation">
                        <i className="fas fa-umbrella"></i>
                        {day.day.daily_chance_of_rain || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Air Quality Card */}
            {activeTab === 'CHẤT LƯỢNG KHÔNG KHÍ' && (
              <div className="air-quality-card">
                <h3 className="forecast-title">
                  <i className="fas fa-lungs"></i>
                  Chất lượng không khí
                </h3>
                <div className="air-quality-content">
                  <div className="aqi-main">
                    <div className="aqi-value">
                      {weather.current.air_quality?.pm2_5 || 'N/A'}
                    </div>
                    <div className="aqi-label">AQI PM2.5</div>
                    <div className={`aqi-status ${airQuality?.className || 'good'}`}>
                      {airQuality?.level || 'Không có dữ liệu'}
                    </div>
                  </div>
                  
                  <div className="air-quality-details">
                    <div className="air-item">
                      <span className="air-label">PM10</span>
                      <span className="air-value">{weather.current.air_quality?.pm10 || 'N/A'} µg/m³</span>
                    </div>
                    <div className="air-item">
                      <span className="air-label">CO</span>
                      <span className="air-value">{weather.current.air_quality?.co || 'N/A'} µg/m³</span>
                    </div>
                    <div className="air-item">
                      <span className="air-label">NO₂</span>
                      <span className="air-value">{weather.current.air_quality?.no2 || 'N/A'} µg/m³</span>
                    </div>
                    <div className="air-item">
                      <span className="air-label">O₃</span>
                      <span className="air-value">{weather.current.air_quality?.o3 || 'N/A'} µg/m³</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
