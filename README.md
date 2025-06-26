# 🌤️ Demo Weather Vietnam

Ứng dụng dự báo thời tiết Việt Nam được xây dựng bằng React với giao diện hiện đại và tính năng toàn diện.

## 🌟 Demo trực tiếp

🔗 **[https://linh0526.github.io/demo-weather/](https://linh0526.github.io/demo-weather/)**

## ✨ Tính năng chính

- 🌡️ **Dự báo thời tiết thời gian thực** cho các thành phố Việt Nam và toàn cầu
- 🔍 **Tìm kiếm thành phố** với gợi ý tự động
- 🇻🇳 **Giao diện tiếng Việt** hoàn toàn
- 📱 **Responsive Design** - Tương thích mọi thiết bị
- 🎨 **UI hiện đại** với hiệu ứng Glassmorphism
- 🌈 **Gradient động** và animation mượt mà
- 💨 **Thông tin chi tiết:** Tốc độ gió, độ ẩm, áp suất, chỉ số UV
- 🌬️ **Chất lượng không khí** với mô tả bằng tiếng Việt
- 🏙️ **Danh sách thành phố phổ biến** Việt Nam và quốc tế

## 🛠️ Công nghệ sử dụng

- **Frontend:** React 18.3.1
- **Styling:**
  - Bootstrap 5.3.7
  - SASS/SCSS
  - Custom CSS với Glassmorphism
- **Icons:** Font Awesome 6.0.0
- **API:** WeatherAPI.com
- **Deployment:** GitHub Pages
- **Build Tool:** Create React App

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository:**

```bash
git clone https://github.com/linh0526/demo-weather.git
cd demo-weather
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Chạy ứng dụng:**

```bash
npm start
```

4. **Mở trình duyệt:** [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts có sẵn

- `npm start` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm test` - Chạy test suite
- `npm run deploy` - Deploy lên GitHub Pages

## 🌍 API Configuration

Ứng dụng sử dụng [WeatherAPI.com](https://www.weatherapi.com/) để lấy dữ liệu thời tiết.

### Các endpoint được sử dụng:

- **Current Weather:** `/v1/current.json`
- **Search Cities:** `/v1/search.json`
- **Air Quality:** Tích hợp trong current weather

### Tính năng API:

- ✅ Thời tiết hiện tại
- ✅ Chất lượng không khí
- ✅ Tìm kiếm thành phố
- ✅ Dữ liệu UV index
- ✅ Tốc độ và hướng gió

## 📁 Cấu trúc project

```
src/
├── components/
│   ├── Home.js              # Component chính hiển thị thời tiết
│   ├── Home.scss           # Styles cho Home component
│   ├── CitySelector.js     # Modal chọn thành phố
│   ├── CitySelector.scss   # Styles cho CitySelector
│   └── includes/
│       ├── Header.js       # Header với search và navigation
│       └── Header.scss     # Styles cho Header
├── services/
│   └── WeatherService.js   # Service xử lý API calls
├── App.js                  # Root component
└── index.js               # Entry point
```

## 🎨 Tính năng UI/UX

### Design System

- **Color Palette:** Purple gradient (667eea → 764ba2)
- **Typography:** Modern sans-serif fonts
- **Effects:**
  - Glassmorphism với backdrop-filter
  - Floating animation elements
  - Smooth transitions
  - Hover effects

### Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🌟 Tính năng nổi bật

### 1. Tìm kiếm thông minh

- Debounced search (300ms delay)
- Gợi ý thành phố real-time
- Hỗ trợ tìm kiếm tiếng Việt và tiếng Anh

### 2. Dữ liệu thời tiết toàn diện

- Nhiệt độ thực tế và cảm nhận
- Mô tả thời tiết bằng tiếng Việt (80+ điều kiện)
- Chỉ số UV với mức độ nguy hiểm
- Chất lượng không khí theo thang đo Việt Nam

### 3. Trải nghiệm người dùng

- Loading states mượt mà
- Error handling thân thiện
- Animation và transitions
- Icon thời tiết động

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Để đóng góp:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 Todo List

- [ ] Thêm dự báo 7 ngày
- [ ] Dự báo theo giờ (24h)
- [ ] Radar thời tiết
- [ ] Notifications thời tiết
- [ ] Dark/Light mode
- [ ] Lưu thành phố yêu thích
- [ ] PWA support
- [ ] Multi-language support

## 📄 License

Project này được phân phối dưới license MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

- **GitHub:** [@linh0526](https://github.com/linh0526)
- **Demo:** [https://linh0526.github.io/demo-weather/](https://linh0526.github.io/demo-weather/)

## 🙏 Lời cảm ơn

- [WeatherAPI.com](https://www.weatherapi.com/) - Cung cấp dữ liệu thời tiết
- [React](https://reactjs.org/) - Frontend framework
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library

---

⭐ **Nếu project này hữu ích, hãy cho một star nhé!** ⭐
