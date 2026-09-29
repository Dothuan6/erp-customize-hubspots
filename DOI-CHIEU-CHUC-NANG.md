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

## 10. Giai đoạn 2 — Contacts · Companies · liên kết · Activities · Line items · Reports (28/09/2026)

Nguyên tắc giai đoạn 2: **UX clone HubSpot**, dữ liệu liên kết giữa các bảng. Phần ERP chưa có được ghi rõ ở cột cuối. Kế hoạch chi tiết: Claude Doc “Kế hoạch triển khai giai đoạn 2 — CRM theo UX HubSpot”.

| Màn / chức năng | Tệp | Mockup làm gì | ERP hiện tại |
| --- | --- | --- | --- |
| Danh sách Contacts, Companies | `crm-contacts-hubspot.html`, `crm-companies-hubspot.html`, `crm-list.js` | View Tất cả / của tôi / chưa có owner, lọc nhanh (owner, lifecycle, lead status, nguồn, ngành), sắp xếp, Xem trước (panel dock), xoá hàng loạt, “Thêm contacts ▾” (Tạo mới / Import) | Collection + bảng có sẵn; cần tạo collection Contacts, Companies |
| Panel Tạo Contact / Company | `crm-objects.js` `createPanel` | Trường theo form HubSpot + mục “Liên kết với” Company, Deal; Tạo · Tạo và thêm tiếp · Huỷ | Form tạo bản ghi có sẵn; mục liên kết cần FE |
| Record page 3 cột | `crm-record-hubspot.html?type=contact\|company\|deal&id=` | Trái: định danh, 6 nút nhanh, Lifecycle stage dạng thanh bước, thuộc tính sửa tại chỗ · giữa: Tổng quan (Contact) + Hoạt động · phải: card liên kết | Trang đầy đủ có sẵn; card liên kết + timeline cần FE/BE |
| Card liên kết | `assocCard`, `addAssocPanel` | + Thêm → Tạo mới / Thêm có sẵn; Deal tạo từ Contact/Company điền sẵn “<công ty> - New Deal” và tự gắn liên kết; nhãn liên kết Deal–Contact; Gỡ liên kết có xác nhận | Cần API liên kết ngược + bảng nối Deal_Contacts |
| Activities | `timeline`, `composer` | Ghi chú, Task (hạn, ưu tiên, người làm, tick hoàn thành), Cuộc họp (người tham dự, kết quả), Cuộc gọi (kết quả, hướng); tab lọc, tìm, khoảng thời gian, thu gọn; nhóm “Sắp tới” + theo tháng; tự liên kết Contact ↔ Company ↔ Deal | Tab Lịch sử “sắp ra mắt”; cần collection Activities + log sự kiện |
| Sự kiện hệ thống | `logEvent` | Ghi tạo bản ghi, đổi Lifecycle, đổi owner, đổi giai đoạn Deal (từ board, bảng, panel, record), thêm liên kết, cập nhật line items | Cần audit log phía server |
| Line items | `lineItemsCard`, `lineItemEditor` | Chọn từ thư viện 7 sản phẩm, dòng tùy chỉnh, SL, đơn giá, chiết khấu % / ₫, thuộc tính tùy chỉnh (tạo trong “Chỉnh sửa cột”), tạm tính / chiết khấu / tổng; Lưu → Amount (Tổng Cash-In Dự Kiến) = Tổng | Rollup chưa bật — mockup ghi lại Amount khi lưu |
| Tạo Deal ở màn Deals | `crm-shared.js` `openCreate` | Thêm mục “Liên kết Deal với” Company, Contact | Cần FE |
| Báo cáo | `crm-bao-cao-hubspot.html` | CRM Data Overview (7 thẻ) và Pipeline Overview (6 thẻ), lọc thời gian + owner, bấm số liệu mở danh sách bản ghi | Chưa có module Báo cáo |

Trang chi tiết Deal cũ (`crm-deal-chi-tiet-hubspot.html`) chuyển hướng sang record page mới. Dữ liệu mẫu giai đoạn 2 lưu ở `localStorage` khoá `hx-crm-p2-v1`; nút “⚙ Giao diện → Dữ liệu mẫu” xoá cả dữ liệu giai đoạn 1 và 2.

Ngoài phạm vi (theo kế hoạch): gửi email, gọi điện thật, Quotes, Tickets, Payments, trình tạo báo cáo tự do.

## 11. Phần 1 — Contacts: chỉnh sát HubSpot (29/09/2026)

Khảo sát lại trang Contacts của HubSpot (portal 247428660) rồi chỉnh prototype cho khớp.

| Khu vực | HubSpot | Prototype sau chỉnh | Cần BE ERP? |
|---|---|---|---|
| Header danh sách | "Contacts ⌄", ⋮, "Add contacts ▾" | Như HubSpot (Tạo mới / Import) | Không |
| Thanh công cụ | Search · Filter · Sort by · Board/Table · ⚙ · ⌃ | Đủ; ⚙ = kiểu hiển thị, mật độ, chỉnh cột, khôi phục view | Không |
| Bộ lọc nhanh | Owner, Create date, Last activity date, Lead status; ⊕ thêm, ✎ sửa, Advanced filters | Popover có ô tìm; ngày dùng preset (Hôm nay…Năm nay); bộ lọc nâng cao dạng panel, các điều kiện nối bằng VÀ | Ngày hoạt động gần nhất cần trường tính (rollup) |
| Cột bảng | Name (avatar, mũi tên mở đối tượng liên kết), Email ↗, Phone, Owner, Primary company, Last activity, Lead status, Create date | Đủ; mở rộng dòng hiện bảng Companies/Deals liên kết; "+" thêm cột | Back-reference (company ↔ contact) |
| Board | Có | Cột theo Lifecycle stage; kéo thả thẻ để đổi stage, thay đổi ghi vào timeline | Không |
| Footer | Đếm · làm mới · Export · reset · clone | Đủ | Không |
| Record — định danh | Avatar, tên + ✎, công ty, email ↗ ⧉, 6 nút nhanh | Đủ; "Thêm" mở menu có ô tìm (cuộc gọi / cuộc họp / email / SMS… / sắp xếp lại nút) | Email, SMS: ngoài giai đoạn 2 |
| Record — Key information | Owner, Phone, City, Lifecycle (pill), Lead status, Last contacted; Actions ▾ · ⚙ | Đủ. **Đã bỏ thanh bước lifecycle** vì HubSpot không có | Last contacted: trường tính |
| Menu Thao tác | Theo dõi, Xem tất cả thuộc tính, Lịch sử thuộc tính, Lịch sử liên kết, Tìm trên Google, Nhân bản, Gộp, Xoá | Đủ; Lịch sử thuộc tính & Gộp gắn nhãn "Sắp có" | Audit log, API gộp |
| Tab giữa | Catch-up (Overview/Health) · Activities · Customize | Tổng quan: tóm tắt AI (demo), Việc sắp tới, Tương tác gần đây + "Tạo hoạt động ▾"; Sức khoẻ: 3 thẻ AI "sắp ra mắt" | Cần module AI |
| Card phải | Companies (Primary, Domain ↗ ⧉, Phone, nhãn liên kết, xem tất cả), Deals, Attachments | Đủ | Nhãn liên kết contact↔company cần bảng liên kết có cột nhãn |

## 12. Phần 2 — Companies: chỉnh sát HubSpot (29/09/2026)

| Khu vực | HubSpot | Prototype sau chỉnh | Cần BE ERP? |
|---|---|---|---|
| Danh sách — views | All companies / My companies / + | Như HubSpot | Không |
| Bộ lọc nhanh | Company owner, Create date, Last activity date, Lead status + Advanced filters | Như HubSpot (có thêm Ngành, Lifecycle, Thành phố, Quốc gia khi bấm ⊕) | Last activity: trường tính |
| Cột bảng | Company name (logo, mở rộng dòng), Owner, Create date, Phone, Last activity, City, Country/Region, Industry | Như HubSpot; thêm trường **Quốc gia/Khu vực** và **Lead status** cho Company | Thêm 2 trường vào collection Company |
| Record — định danh | Logo, tên ✎, domain ↗ ⧉, 6 nút nhanh | Như HubSpot (bỏ dòng ngành/thành phố dưới domain) | Không |
| Key information | Owner, City, Lifecycle (pill), Lead status, Industry, Last contacted | Như HubSpot | Last contacted: trường tính |
| Menu Thao tác của Key information | Customize properties, View all properties, View property history, Enrich record 🔒, Fill smart properties 🔒 | Như HubSpot (2 mục khoá = ngoài phạm vi) | Audit log |
| Menu Thao tác đầu trang | Follow … Merge, Clone, Delete | Dùng chung với Contact | Như Phần 1 |
| Tab Catch-up | 2 mục xếp dọc, thu gọn được: **Overview** (Company insights + Recent interactions) và **Health** (Sentiment, Challenges, Positive feedback) | Đã đổi cả Contact & Company sang 2 mục xếp dọc (trước là nút chuyển) | AI |
| Card Contacts | Tên, công ty, Email ⧉, Phone, nhãn "Contact with Primary Company", View all | Như HubSpot | Không |
| Card khác | Deals, Tickets, Payments, Attachments | Deals, Tệp đính kèm (Tickets/Payments ngoài phạm vi) | — |

## 13. Phần 3 — Deals: chỉnh sát HubSpot (29/09/2026)

| Khu vực | HubSpot | Prototype sau chỉnh | Cần BE ERP? |
|---|---|---|---|
| Header | "Deals ⌄", ⋮, "Add deals ▾" | "Thêm deals ▾" (Tạo mới / Import) thay 2 nút riêng | Không |
| Thanh công cụ | Search · Filter · Sort by · Pipeline ⌄ · Board/Table · ⚙ · ⌃ | Thêm nút Bộ lọc và nút **Deals_Pipeline ⌄** (ERP hiện chỉ có 1 pipeline) | Nhiều pipeline: cần trường Pipeline |
| Bộ lọc nhanh | Deal owner, Create date, Last activity date, Close date, ⊕, ✎, Advanced filters | Như HubSpot (Sale phụ trách, Ngày tạo, Ngày hoạt động gần nhất, Ngày dự kiến chốt). Bộ lọc điều kiện ERP cũ giữ nguyên, chuyển vào "Bộ lọc nâng cao" | Ngày hoạt động gần nhất: trường tính |
| Cột mặc định | Deal name, Stage, Amount, Close date, Next activity, Owner | Mã Deal, Tên Deal, Giai đoạn, Tổng Cash-In (Amount), Ngày dự kiến chốt, Sale phụ trách, **Hoạt động tiếp theo**, Ngày tạo. Các trường khác thêm lại bằng "+" | Thứ tự cột = thứ tự trường ERP |
| Hoạt động tiếp theo | Task/cuộc họp gần nhất, hoặc "Schedule ▾" (Schedule a meeting / Create a task) | Như HubSpot; mở cửa sổ soạn task/cuộc họp ngay trên danh sách | Trường tính |
| Mở rộng dòng | Chevron → chọn đối tượng liên kết → bảng lồng | Contacts (kèm nhãn liên kết) / Companies | Back-reference |
| Board | Thẻ: tên, ngày tạo, ngày chốt, amount, owner; chân thẻ: Note · Task · "No upcoming"; chân cột: Total / Weighted amount | Như HubSpot (+ tên deal, công ty liên kết). Bỏ nhãn % trên thẻ, % vẫn có ở chân cột | Không |
| Footer | Đếm · làm mới · Export · reset · clone | Đủ | Không |
| Record — định danh | Tên ✎, Amount, Close date 📅 (sửa tại chỗ), Pipeline, Deal stage (bấm để đổi) | Như HubSpot; ✎ đổi **Tên Deal** (Mã Deal là khoá chính ERP, không đổi) | Không |
| About this deal | Owner, Last contacted, Deal type, Priority, Closed lost reason | Sale phụ trách, Liên hệ gần nhất, Gói dịch vụ, Thời hạn thanh toán, Tỷ lệ thành công, Lý do thất bại (ánh xạ sang trường ERP) | Không |
| Timeline | "Deal Activity — X moved Deal từ A sang B", "Created — This deal was created by X" | "Hoạt động Deal — X đã chuyển DEAL-… từ A sang B", "Đã tạo — Deal này được tạo bởi X"; hiện cả trên Contact/Company liên kết | Audit log |
| Card phải | Contacts, Companies, Tickets, Payments, Attachments | Contacts, Companies, **Line items** (yêu cầu dự án), Tệp đính kèm | — |

## 14. Phần 4 — Activities: chỉnh sát HubSpot (29/09/2026)

Khảo sát trên Deal 001 (chỉ mở rồi đóng cửa sổ soạn, không lưu gì vào HubSpot).

| Khu vực | HubSpot | Prototype sau chỉnh | Cần BE ERP? |
|---|---|---|---|
| Cửa sổ soạn (chung) | Góc phải dưới; ⌄ thu gọn · ⛶ phóng to · ✕; soạn thảo có B I U, định dạng, liên kết, đính kèm; "Associated with N records ▾"; ☐ "Create a To-do task to follow up In 3 business days"; hỏi trước khi bỏ nội dung | Như HubSpot. Bỏ chọn được từng bản ghi liên kết; task theo dõi được tạo cùng lúc và liên kết cùng bản ghi. Ctrl+Enter để lưu | Đính kèm tệp: dùng trường Tệp ERP |
| Ghi chú | "For [bản ghi]" + nội dung → "Create note" | Như HubSpot (nội dung có định dạng đậm / nghiêng / gạch chân / danh sách) | Lưu HTML đã lọc |
| Task | Tên; Activity date (preset "In 3 business days (Friday)") + giờ; Send reminder; Set to repeat; Task type · Priority · Queue · Assigned to; Notes → "Create" | Như HubSpot (preset ngày làm việc tự bỏ T7/CN, "Chọn ngày…") | Nhắc nhở & lặp lại cần job ở BE |
| Ghi lại cuộc gọi | Contacted · Call outcome · Call direction · Activity date · nội dung → "Log call" | Như HubSpot. Nút "Gọi" gọi trực tiếp = ngoài phạm vi (cần tổng đài) | — |
| Ghi lại / lên lịch cuộc họp | Log: Attendees · Outcome · Start time · Duration · nội dung. Schedule: cần kết nối lịch | "Ghi lại cuộc họp" như HubSpot; "Lên lịch cuộc họp" = cuộc họp tương lai có tiêu đề, kết quả "Đã lên lịch" (chưa đồng bộ lịch) | Đồng bộ Google/Outlook Calendar |
| Tab timeline | All · Notes · Emails · Calls · Tasks · Meetings; mỗi tab có nút riêng (Log a call / Make a phone call, Log a meeting / Schedule a meeting…) | Như HubSpot | — |
| Bộ lọc timeline | "Activity (x/y) ▾" theo nhóm Communication / Team activity / Updates, "All time ▾", "Activity assigned to ▾", "Clear all", "Collapse all ▾" | Như HubSpot (Giao tiếp / Hoạt động nhóm / Cập nhật: Hoạt động Deal, Thay đổi liên kết, Thay đổi thuộc tính, Tạo bản ghi) | — |
| Thẻ hoạt động | Bấm để thu gọn/mở; "Actions ▾": Pin, Edit, History, Delete; "N associations ▾" | Như HubSpot: Ghim lên đầu, Sửa (mở lại cửa sổ soạn), Xem liên kết, Xoá; task tick hoàn thành ngay trên thẻ | Bình luận trên hoạt động: chưa làm |

## 15. Phần 5 — Line items & trường tuỳ chỉnh (29/09/2026)

Portal HubSpot của dự án chưa có sản phẩm nào; mình chỉ mở form "Create product" để xem các trường rồi thoát, không tạo gì. Trình sửa line item bám theo màn "Edit line items" chuẩn của HubSpot.

| Khu vực | HubSpot | Prototype sau chỉnh | Cần BE ERP? |
|---|---|---|---|
| Kiểu màn hình | Trang toàn màn hình, thanh trên tối: Cancel · tiêu đề · Save | Như HubSpot (thay cho hộp thoại cũ) | Không |
| Thêm line item | "Add line item ▾": Select from product library / Create custom line item | Như HubSpot. Thư viện sản phẩm mở ở panel bên phải: tìm theo tên/SKU, tick nhiều sản phẩm, chỉnh số lượng (− / +) rồi "Thêm (n)" | Collection Sản phẩm |
| Cột bảng | Name, Billing frequency, Term, Quantity, Unit price, Unit discount, Net price, Total + các thuộc tính chọn thêm | Tên, Tần suất thanh toán (Một lần / Hằng tháng / Hằng quý / Nửa năm / Hằng năm), Kỳ hạn, Chiết khấu (₫ hoặc %), SL, Đơn giá, Thành tiền (định kỳ = giá/kỳ × số kỳ); bật thêm SKU, Giá vốn, Mô tả | Collection Line item (bảng nối Deal ↔ Sản phẩm) |
| Trường tuỳ chỉnh | "Edit columns" + tạo thuộc tính line item | "Chỉnh sửa cột": chọn / sắp xếp cột + **tạo thuộc tính mới** (Văn bản, Số, Ngày, Lựa chọn đơn, Hộp kiểm) → điền ngay trên từng dòng; cột tuỳ chỉnh có nhãn "TUỲ CHỈNH" | Thêm trường vào collection Line item |
| Tự điền | Mô tả, giá, tần suất lấy từ sản phẩm | Khi thêm từ thư viện: tên, giá, tần suất, kỳ hạn **và giá trị mặc định các trường tuỳ chỉnh** của sản phẩm (vd. Thời hạn 6/12 tháng) tự điền | Trường mặc định trên Sản phẩm |
| Thao tác dòng | Kéo để sắp xếp, ⋯ (Clone, Delete…) | Kéo thả, ⋯: Nhân bản · Lưu vào thư viện sản phẩm (dòng tuỳ chỉnh) · Chuyển lên/xuống · Xoá | Không |
| Tổng kết | Subtotal, + discount / fee / tax cấp báo giá, Total, doanh thu định kỳ | Tạm tính · + Chiết khấu / + Phí / + Thuế (% hoặc ₫; thuế tính sau chiết khấu + phí) · Tổng · ARR / MRR | Lưu điều chỉnh cấp Deal |
| Amount của Deal | Tuỳ chọn dùng tổng line item làm Amount | Ô "Dùng tổng line item làm Amount" (mặc định bật) → cập nhật Tổng Cash-In Dự Kiến, ghi vào timeline | Không |
| Card trên Deal | Danh sách line item + tổng | Như HubSpot + dòng điều chỉnh và ARR khi có hàng định kỳ | Không |
