# TikTok Seeding Detector - Frontend

Giao diện web cho ứng dụng phát hiện bình luận seeding trên TikTok sử dụng AI VisoBERT.

## 🚀 Tính năng

- **Nhập dữ liệu linh hoạt:** Hỗ trợ nhập 1 URL, nhiều URL hoặc tải lên file (JSON/CSV).
- **Phân tích AI:** Sử dụng mô hình VisoBERT để phát hiện bình luận seeding tiếng Việt.
- **Thống kê trực quan:** Hiển thị biểu đồ, tỷ lệ seeding, từ khóa nổi bật.
- **Xuất báo cáo:** Tải kết quả phân tích dưới dạng file CSV.
- **Trải nghiệm hiện đại:** Giao diện đẹp, responsive, dễ sử dụng.

## 🛠️ Cài đặt & Chạy ứng dụng

### 1. Cài đặt Node.js

Cài đặt [Node.js](https://nodejs.org/) (khuyến nghị bản LTS).

### 2. Cài đặt các package

Chạy lệnh sau trong thư mục `frontend`:

```sh
npm install
```

### 3. Chạy ứng dụng ở chế độ phát triển

```sh
npm run dev
```

Ứng dụng sẽ chạy tại [http://localhost:5173](http://localhost:5173).

### 4. Build cho production

```sh
npm run build
```

## ⚙️ Cấu hình

- **Kết nối API:** Mặc định frontend sẽ gọi backend tại `http://localhost:8000`. Nếu backend chạy ở địa chỉ khác, hãy sửa biến `API_BASE_URL` trong [`src/services/api.ts`](src/services/api.ts).
- **CORS:** Đảm bảo backend cho phép CORS từ domain của frontend.

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── components/      # Các component React
│   ├── services/        # Gọi API, mock data
│   ├── types/           # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx          # Component chính
│   └── main.tsx         # Điểm khởi động ứng dụng
├── public/
├── index.html
├── tailwind.config.js
├── package.json
└── ...
```

## 📝 Định dạng file nhập

- **JSON:** Mảng các object với trường: `comment_id`, `comment_text`, `like_count`, `timestamp`, `user_id`
- **CSV:** Dòng đầu là header, các cột tương ứng như trên

Ví dụ JSON:
```json
[
  {
    "comment_id": "1",
    "comment_text": "Sản phẩm tốt quá!",
    "like_count": 10,
    "timestamp": "2024-01-15T10:30:00Z",
    "user_id": "user123"
  }
]
```

## 💡 Lưu ý

- Nếu backend không chạy, ứng dụng sẽ tự động chuyển sang chế độ demo với dữ liệu giả lập.
- Để phân tích bình luận thực tế, hãy đảm bảo backend hoạt động và có kết nối Internet.

## 📦 Công nghệ sử dụng

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Lucide React Icons](https://lucide.dev/)
