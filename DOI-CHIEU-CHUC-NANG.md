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
| Cột → trang quản lý trường | Menu ⋮ và ⚙ → “Quản lý trường dữ liệu” (trang riêng, xem mục 9) |
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
| Ẩn/hiện cột (≡ “Hiển thị cột”, danh sách 17 trường có tick) | Nút “+” cuối tiêu đề (thêm cột đang ẩn) và hộp “Chọn cột hiển thị” (Ctrl+Shift+L) — xem mục 9 |
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

Đã gỡ: timeline hoạt động; ghi chú/email/gọi/việc/lịch hẹn; tóm tắt AI trên bản ghi; báo giá, thanh toán, “workflow đang chạy”; bộ lọc nhanh (Người phụ trách, Ngày tạo…); chọn pipeline; menu Liên hệ / Công ty / Phân khúc / Email marketing; nút gọi điện, trợ giúp, cài đặt trên thanh trên cùng.

## 7. Điểm ERP có mà mockup chỉ mô phỏng

Import, Export, Kết nối Google Sheet, Ghim sidebar: có đủ nút và hộp thoại, nhưng mockup không đọc/ghi tệp thật và không gọi Google. Quản lý trường chạy thật trong mockup nhưng chỉ lưu trong trình duyệt (localStorage), không ghi lên ERP.

## 8. UX HubSpot đã áp dụng (khảo sát trang Deals của HubSpot, 24/09/2026)

| UX HubSpot | Áp dụng trong mockup | Chức năng ERP tương ứng |
| --- | --- | --- |
| Sidebar có mục "Deals" | Mục **Deals** trên sidebar | Collection Deals_Pipeline được "Ghim vào sidebar" (có sẵn trên ERP) |
| Tiêu đề "Deals ⌄" chuyển đối tượng | Menu chọn collection khác (Leads, Sales_Activities…) | Trang Dữ liệu của ERP |
| Mặc định mở dạng Board | Mở ở Board theo Giai Đoạn Pipeline | Kanban của ERP (ERP bắt chọn trường, mockup chọn sẵn Giai Đoạn Pipeline, vẫn đổi được) |
| Bấm tên bản ghi → trang chi tiết | Tên trên bảng và trên thẻ Board mở trang chi tiết | "Mở full page" |
| Nút Preview cạnh tên → panel dock bên phải | Nút Xem trước (bảng + thẻ) mở panel dock, bảng co lại | Drawer chi tiết |
| Bấm ô → sửa tại chỗ; lựa chọn là danh sách pill có ô tìm kiếm | Như HubSpot | Sửa ô tại chỗ |
| Nút Board / Table | Nút chuyển kiểu hiển thị | Tab Bảng / Kanban |
| ⚙ View settings (kiểu view, xoá view…) | ⚙ Cài đặt view: kiểu hiển thị, mật độ, Sửa view, Xóa view, Quản lý cột | Sửa/Xoá view, Thoáng/Gọn, Cột |
| Nút ⌃ thu gọn thanh lọc | Như HubSpot | — (chỉ giao diện) |
| Nút "Sort by" | Nút Sắp xếp (trường + thứ tự) | Sắp xếp theo cột |
| Menu ⋮ ở tiêu đề cột: sắp xếp, lọc theo cột, thêm cột | Sắp xếp tăng/giảm, Lọc theo cột này, Ẩn cột; "+" cuối tiêu đề để thêm/ẩn cột | Sort, bộ lọc, Ẩn/hiện cột |
| Nhãn stage nhiều màu | Pill màu theo thứ tự lựa chọn; Won xanh lá, Lost đỏ | — (chỉ giao diện) |
| Chân cột Board: Total amount + Weighted amount | **Tổng giá trị** = Σ Tổng Cash-In Dự Kiến; **Giá trị có trọng số** = Σ (Cash-In × Tỷ Lệ Thành Công %); cột Won/Lost ghi Thắng (100%) / Thua (0%) | Bổ sung theo yêu cầu, chỉ tính từ 2 trường sẵn có, không thêm dữ liệu mới |

Không áp dụng vì ERP không có chức năng tương ứng: mở rộng liên kết trong dòng (›), Next Activity/Schedule, Freeze column, Save/Reset/Clone view, chọn pipeline, Automate.

## 9. Quản lý cột / trường dữ liệu (bổ sung 24/09/2026)

Khảo sát ERP: trang `/data/:id/fields` (nút “Cột”) và popover “Hiển thị cột” (≡ cuối tiêu đề bảng). Khảo sát HubSpot: Settings › Properties (Deal properties) và hộp “Choose which columns you see” / nút “Add column” trên list Deals.

### 9.1 Trang Quản lý trường — `crm-quan-ly-truong-hubspot.html`

| Chức năng ERP (`/data/:id/fields`) | Trình bày trong mockup (kiểu HubSpot Properties) |
| --- | --- |
| “← Dữ liệu / Deals_Pipeline · 17 trường” | “‹ Deals”, tiêu đề “Trường dữ liệu”, ô “Collection: Deals (Deals_Pipeline) ▾”, tab “Trường (17)” |
| Danh sách trường: ⠿ + icon loại + tên loại + tên trường | Bảng: ⠿ · Tên trường (link) + loại bên dưới · Cấu hình · Bắt buộc · Duy nhất · Thao tác |
| Kéo ⠿ đổi thứ tự | Kéo ⠿; thêm menu “Khác” → Chuyển lên đầu / lên / xuống (dùng được bằng bàn phím). Tắt kéo khi đang lọc |
| Rê chuột: ✎ sửa, 🗑 xóa | Rê chuột: nút “Chỉnh sửa” + “Khác ▾” (Xóa trường) như HubSpot; bấm tên cũng mở sửa |
| “+ Thêm trường” → hộp “Chọn loại trường” (14 loại) → drawer “Thêm trường” | “Thêm trường” → panel phải “Tạo trường mới”, ô “Loại trường” có tìm kiếm (như Field type của HubSpot), đủ 14 loại |
| 14 loại: Văn bản, Văn bản dài, Số, Tiền tệ, Ngày, Ngày giờ, Lựa chọn đơn, Lựa chọn nhiều, Trạng thái, Hộp kiểm, Người dùng, Tệp đính kèm, Liên kết, Đường dẫn | Như ERP |
| Tên trường *, Bắt buộc, Duy nhất (mọi loại) | Như ERP |
| Văn bản: Độ dài tối đa | Như ERP |
| Số, Tiền tệ: Giá trị nhỏ nhất / lớn nhất | Như ERP |
| Lựa chọn đơn / nhiều: Danh sách lựa chọn + “Thêm lựa chọn”, ✕ xóa | Như ERP; thêm ô màu xem trước (màu nhãn theo thứ tự) |
| Trạng thái: Danh sách trạng thái + “Thêm trạng thái” | Như ERP |
| Liên kết: Collection liên kết (12 collection) + Cột hiển thị (tuỳ chọn, mặc định “Tự động — trường văn bản đầu tiên”) | Như ERP. Trường “Test” → NhanVien |
| Drawer “Chỉnh sửa trường”: không có ô đổi loại | Loại hiện dạng khoá, ghi chú “Không đổi được loại sau khi tạo” |
| Hủy / Lưu | Như ERP; thêm “Xóa trường” trong panel sửa |

Bổ sung nhỏ (UI, không thêm dữ liệu): tìm trường, lọc theo loại / Bắt buộc / Duy nhất; hộp xác nhận khi xóa có số bản ghi đang có dữ liệu; kiểm tra trùng tên trường, lựa chọn trùng, min > max; đổi tên lựa chọn thì cập nhật luôn bản ghi đang dùng lựa chọn đó.

Cần dev xác nhận: hành vi xóa trường trên ERP (có hộp xác nhận không — mockup không bấm thử để tránh xóa dữ liệu thật); mã kiểu API của 7 loại chưa có trong Deals_Pipeline (CURRENCY, MULTI_SELECT, STATUS, CHECKBOX, USER, FILE, URL là tên mockup tự đặt).

### 9.2 Cột hiển thị trên bảng Deals — `crm-giao-dich-hubspot.html`

| Chức năng ERP | Trình bày trong mockup |
| --- | --- |
| ≡ cuối tiêu đề → “Hiển thị cột”: tick / bỏ tick 17 trường | Nút “+” cuối tiêu đề (HubSpot Add column): tìm và bấm để hiện trường đang ẩn; “Chọn cột hiển thị…”; “Tạo trường mới” |
| (như trên) | Hộp “Chọn cột hiển thị” (HubSpot “Choose which columns you see”): trái tìm + tick, phải danh sách cột đang hiện với ✕; Áp dụng / Huỷ / Bỏ chọn tất cả. Mở từ ⚙, menu ⋮, nút “+” hoặc Ctrl+Shift+L |
| Thứ tự cột = thứ tự trường | Giữ nguyên; hộp ghi “Đổi thứ tự trong Quản lý trường” (không thêm kéo thả cột riêng theo view) |
| Menu ⋮ tiêu đề cột → Ẩn cột | Như trước |

Cột ẩn được nhớ theo từng view trong trình duyệt. Không áp dụng từ HubSpot: Frozen columns, cột Associations (ERP không có).

### 9.3 Ảnh hưởng tới các màn khác

- Trường mới hiện ngay: cột trên bảng, thẻ trên panel xem trước, ô trong form “Tạo bản ghi”, nhóm “Trường khác” ở trang chi tiết.
- Trường Lựa chọn đơn / Trạng thái mới dùng được cho “Cột theo” của Board.
- Bắt buộc / Duy nhất / Độ dài / Min–Max được kiểm tra khi tạo bản ghi và khi sửa ô tại chỗ.
- Trường bị xóa biến khỏi mọi màn; Board tự chuyển sang trường lựa chọn khác nếu xóa Giai Đoạn Pipeline.
