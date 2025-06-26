const API_KEY = '07dd103efeb947f187431653252606';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Map API condition codes to Vietnamese descriptions
const weatherConditions = {
  1000: 'Quang đãng',
  1003: 'Ít mây',
  1006: 'Có mây',
  1009: 'Âm u',
  1030: 'Sương mù',
  1063: 'Có thể có mưa',
  1066: 'Có thể có tuyết',
  1069: 'Có thể có mưa tuyết',
  1072: 'Có thể có mưa đá',
  1087: 'Có thể có dông',
  1114: 'Tuyết rơi',
  1117: 'Bão tuyết',
  1135: 'Sương mù',
  1147: 'Sương mù đóng băng',
  1150: 'Mưa phùn nhẹ',
  1153: 'Mưa phùn',
  1168: 'Mưa phùn đóng băng',
  1171: 'Mưa phùn đóng băng nặng',
  1180: 'Mưa nhẹ không đều',
  1183: 'Mưa nhẹ',
  1186: 'Mưa vừa không đều',
  1189: 'Mưa vừa',
  1192: 'Mưa to không đều',
  1195: 'Mưa to',
  1198: 'Mưa đóng băng nhẹ',
  1201: 'Mưa đóng băng vừa/nặng',
  1204: 'Mưa tuyết nhẹ',
  1207: 'Mưa tuyết vừa/nặng',
  1210: 'Tuyết nhẹ không đều',
  1213: 'Tuyết nhẹ',
  1216: 'Tuyết vừa không đều',
  1219: 'Tuyết vừa',
  1222: 'Tuyết nặng không đều',
  1225: 'Tuyết nặng',
  1237: 'Mưa đá',
  1240: 'Mưa rào nhẹ',
  1243: 'Mưa rào vừa/nặng',
  1246: 'Mưa rào to',
  1249: 'Mưa tuyết nhẹ',
  1252: 'Mưa tuyết vừa/nặng',
  1255: 'Tuyết rào nhẹ',
  1258: 'Tuyết rào vừa/nặng',
  1261: 'Mưa đá nhẹ',
  1264: 'Mưa đá vừa/nặng',
  1273: 'Mưa dông nhẹ không đều',
  1276: 'Mưa dông vừa/nặng',
  1279: 'Tuyết dông nhẹ không đều',
  1282: 'Tuyết dông vừa/nặng'
};

// Get air quality description based on US EPA index
const getAirQualityDescription = (index) => {
  switch (index) {
    case 1: return { text: 'Tốt', level: 'good' };
    case 2: return { text: 'Trung bình', level: 'moderate' };
    case 3: return { text: 'Không tốt cho nhóm nhạy cảm', level: 'moderate' };
    case 4: return { text: 'Không tốt', level: 'bad' };
    case 5: return { text: 'Rất không tốt', level: 'bad' };
    case 6: return { text: 'Nguy hiểm', level: 'bad' };
    default: return { text: 'Không xác định', level: 'moderate' };
  }
};

// Get UV level description
const getUVLevel = (uv) => {
  if (uv <= 2) return 'Thấp';
  if (uv <= 5) return 'Trung bình';
  if (uv <= 7) return 'Cao';
  if (uv <= 10) return 'Rất cao';
  return 'Cực độ';
};

// Map weather condition code to icon class
const getWeatherIcon = (code, isDay) => {
  const iconMap = {
    1000: isDay ? 'fas fa-sun' : 'fas fa-moon',
    1003: 'fas fa-cloud-sun',
    1006: 'fas fa-cloud',
    1009: 'fas fa-cloud',
    1030: 'fas fa-smog',
    1063: 'fas fa-cloud-rain',
    1066: 'fas fa-snowflake',
    1069: 'fas fa-cloud-meatball',
    1072: 'fas fa-cloud-rain',
    1087: 'fas fa-bolt',
    1114: 'fas fa-snowflake',
    1117: 'fas fa-snowflake',
    1135: 'fas fa-smog',
    1147: 'fas fa-smog',
    1150: 'fas fa-cloud-drizzle',
    1153: 'fas fa-cloud-drizzle',
    1168: 'fas fa-cloud-drizzle',
    1171: 'fas fa-cloud-drizzle',
    1180: 'fas fa-cloud-rain',
    1183: 'fas fa-cloud-rain',
    1186: 'fas fa-cloud-rain',
    1189: 'fas fa-cloud-rain',
    1192: 'fas fa-cloud-showers-heavy',
    1195: 'fas fa-cloud-showers-heavy',
    1198: 'fas fa-cloud-rain',
    1201: 'fas fa-cloud-rain',
    1204: 'fas fa-cloud-meatball',
    1207: 'fas fa-cloud-meatball',
    1210: 'fas fa-snowflake',
    1213: 'fas fa-snowflake',
    1216: 'fas fa-snowflake',
    1219: 'fas fa-snowflake',
    1222: 'fas fa-snowflake',
    1225: 'fas fa-snowflake',
    1237: 'fas fa-cloud-hail',
    1240: 'fas fa-cloud-rain',
    1243: 'fas fa-cloud-showers-heavy',
    1246: 'fas fa-cloud-showers-heavy',
    1249: 'fas fa-cloud-meatball',
    1252: 'fas fa-cloud-meatball',
    1255: 'fas fa-snowflake',
    1258: 'fas fa-snowflake',
    1261: 'fas fa-cloud-hail',
    1264: 'fas fa-cloud-hail',
    1273: 'fas fa-bolt',
    1276: 'fas fa-bolt',
    1279: 'fas fa-bolt',
    1282: 'fas fa-bolt'
  };
  return iconMap[code] || 'fas fa-cloud';
};

const WeatherService = {
  async getCurrentWeather(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes&lang=vi`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add Vietnamese text for condition
      const condition = {
        ...data.current.condition,
        text_vi: weatherConditions[data.current.condition.code] || data.current.condition.text
      };

      // Return complete data with Vietnamese translations
      return {
        current: {
          ...data.current,
          condition: condition,
          temp_c: data.current.temp_c,
          feelslike_c: data.current.feelslike_c,
          humidity: data.current.humidity,
          wind_kph: data.current.wind_kph,
          wind_dir: data.current.wind_dir,
          wind_degree: data.current.wind_degree,
          pressure_mb: data.current.pressure_mb,
          vis_km: data.current.vis_km,
          uv: data.current.uv,
          gust_kph: data.current.gust_kph || data.current.wind_kph * 1.3,
          cloud: data.current.cloud,
          precip_mm: data.current.precip_mm,
          is_day: data.current.is_day,
          last_updated: data.current.last_updated,
          air_quality: data.current.air_quality
        },
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon,
          tz_id: data.location.tz_id,
          localtime: data.location.localtime
        }
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error('Không thể tải dữ liệu thời tiết. Vui lòng kiểm tra tên thành phố và thử lại.');
    }
  },

  async getForecast(city, days = 5) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=${days}&aqi=yes&lang=vi`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add Vietnamese translations to forecast
      const forecastWithVietnamese = {
        ...data,
        forecast: {
          forecastday: data.forecast.forecastday.map(day => ({
            ...day,
            day: {
              ...day.day,
              condition: {
                ...day.day.condition,
                text_vi: weatherConditions[day.day.condition.code] || day.day.condition.text
              }
            },
            hour: day.hour.map(hour => ({
              ...hour,
              condition: {
                ...hour.condition,
                text_vi: weatherConditions[hour.condition.code] || hour.condition.text
              }
            }))
          }))
        }
      };

      return forecastWithVietnamese;
    } catch (error) {
      console.error('Forecast API Error:', error);
      throw new Error('Không thể tải dữ liệu dự báo thời tiết.');
    }
  },

  async searchCities(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.map(city => ({
        name: city.name,
        region: city.region,
        country: city.country,
        displayName: `${city.name}, ${city.country}`,
        coordinates: { 
          lat: city.lat, 
          lon: city.lon 
        }
      }));
    } catch (error) {
      console.error('Search Cities Error:', error);
      return [];
    }
  }
};

export default WeatherService;