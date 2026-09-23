# Đối chiếu chức năng: ERP ↔ mockup HubSpot-style

Nguyên tắc: **chức năng = 100% ERP**, **giao diện/UX = HubSpot**.
Nguồn ERP: erp.tuoitresoft.com, collection `Deals_Pipeline`, khảo sát trực tiếp ngày 23/09/2026 (UI + API `/collections/:id`, `/views`, `/records`).

## 1. Dữ liệu (schema)

| Hạng mục | ERP | Mockup |
| --- | --- | --- |
| Số trường | 17 | 17, đúng tên, thứ tự, kiểu |
| Kiểu trường | TEXT, LONG_TEXT, NUMBER, SELECT, DATE, DATETIME, RELATION | Như ERP |
| Gói Dịch Vụ Mục Tiêu | STARTER / PROFESSIONAL / ENTERPRISE BYOC | Như ERP |
| Thời Hạn Thanh Toán | 6 Months (6T) / 12 Months (12T) / Monthly | Như ERP |
| Giai Đoạn Pipeline | 1. MQL Qualified … 6. Closed Lost (6 giá trị) | Như ERP |
| Lý do thất bại | 5 lựa chọn | Như ERP |
| Sale phụ trách | TEXT (không phải user) | TEXT |
| Test | RELATION, chỉ sửa ở trang chi tiết | Như ERP |
| Định dạng | Số `1.240`, ngày `d/m/yyyy`, Ngày tạo `DD/MM/YYYY HH:mm` | Như ERP |

## 2. Màn danh sách (`/data/:id/records`)

| Chức năng ERP | Vị trí trong mockup (kiểu HubSpot) |
| --- | --- |
| Tiêu đề collection + số bản ghi | Header trang |
| Tabs view: Bảng · Kanban · view đã lưu (Sửa view / Xóa view) · Tạo View (Tên + Loại: Danh sách/Kanban) | Hàng tab view dưới tiêu đề; sửa/xoá hiện khi rê chuột |
| Làm mới | Chân trang (icon) |
| Cột → trang quản lý trường | Nút “Cột” ở header |
| Tạo mới (form đủ 17 trường, Ctrl+Enter) | Nút chính “Tạo mới” → panel bên phải |
| “…” → Ghim vào sidebar / Ghim vào nhóm… | Menu “…” ở header |
| Tìm kiếm bản ghi | Ô tìm kiếm trên thanh công cụ |
| Mật độ Thoáng / Gọn | Nút chuyển trên thanh công cụ |
| Import (.xlsx/.csv, kéo thả) | Nút “Import” ở header |
| Export + chọn .xlsx/.csv | Chân trang |
| Kết nối Google Sheet (tài khoản → Chọn từ Google Drive) | Menu “…” |
| Bộ lọc: chọn trường → điều kiện theo kiểu → giá trị → Áp dụng; chip có ×; Xoá tất cả | Hàng bộ lọc dạng chip + popover |
| Điều kiện lọc: Text (Bằng/Khác/Chứa/Trống/Không trống), Số (Bằng/Khác/Lớn hơn/Nhỏ hơn/Trống/Không trống), Lựa chọn (Bằng/Khác), Ngày (Bằng/Khác/Lớn hơn/Nhỏ hơn) | Như ERP |
| Bảng: bấm ô để sửa tại chỗ (Enter/blur lưu, Esc huỷ) | Như ERP |
| Sắp xếp theo cột: tăng → giảm → bỏ; mặc định Ngày tạo giảm dần | Như ERP |
| Kéo đổi bề rộng cột, bấm đúp về mặc định | Như ERP |
| Ẩn/hiện cột | Nút cuối hàng tiêu đề |
| Chọn nhiều → “Đã chọn N bản ghi · Xoá · Huỷ” | Thanh thao tác hàng loạt |
| Mở panel chi tiết (mũi tên cuối dòng) | Nút “Xem trước” khi rê vào cột chính + mũi tên cuối dòng |
| Phân trang Trước / Sau, “N bản ghi · Trang x/y”, “Hiển thị a / b bản ghi” khi lọc | Chân trang |
| Kanban: chọn trường lựa chọn làm cột; kéo thả đổi giá trị; bản ghi trống giá trị không hiện | Như ERP |

## 3. Panel xem nhanh (drawer)

| Chức năng ERP | Mockup |
| --- | --- |
| Tiêu đề, “Columns” (→ quản lý trường), “Mở full page →”, đóng | Như ERP |
| Tab Thông tin: đủ trường, bấm để sửa | Như ERP |
| Tab Lịch sử, Liên kết: “sắp ra mắt” | Như ERP |

## 4. Trang chi tiết (`/data/:id/records/:recordId`)

| Chức năng ERP | Vị trí trong mockup (record page 3 cột HubSpot) |
| --- | --- |
| Breadcrumb Dữ liệu / Deals_Pipeline / bản ghi | Đầu thẻ bên trái |
| Kích hoạt Workflow (chọn trong 10 workflow đang có → Kích hoạt) | Nút ở thẻ trái + menu “Thao tác” |
| Sửa từng trường tại chỗ, kể cả RELATION | Thẻ “Thông tin bản ghi” (trái), nhóm trường ở tab “Tổng quan” (giữa), thẻ “Test” (phải) |
| Lịch sử / Liên kết (sắp ra mắt) | Tab “Lịch sử” ở giữa, thẻ “Liên kết” bên phải |

## 5. Khung ứng dụng

| ERP | Mockup |
| --- | --- |
| Menu: Cowork · Trang chủ · Việc của tôi · Dữ liệu · Workflow · Biểu mẫu · Media · Báo cáo · Cài đặt | Như ERP, kiểu sidebar tối của HubSpot |
| Tìm kiếm hoặc gõ lệnh (Ctrl+K); nút “+ Tạo” mở bảng lệnh: Hành động nhanh + danh sách workflow | Như ERP |
| Chuông thông báo (số chưa đọc), avatar | Như ERP |

## 6. Đã gỡ khỏi bản mockup trước (không có trên ERP)

Đã gỡ: timeline hoạt động; ghi chú/email/gọi/việc/lịch hẹn; tóm tắt AI trên bản ghi; báo giá, thanh toán, “workflow đang chạy”; tổng tiền & giá trị có trọng số theo cột Kanban; bộ lọc nhanh (Người phụ trách, Ngày tạo…); chọn pipeline; menu Liên hệ / Công ty / Phân khúc / Email marketing; nút gọi điện, trợ giúp, cài đặt trên thanh trên cùng.

## 7. Điểm ERP có mà mockup chỉ mô phỏng

Import, Export, Kết nối Google Sheet, Ghim sidebar, trang Quản lý cột: có đủ nút và hộp thoại, nhưng mockup không đọc/ghi tệp thật và không gọi Google.
