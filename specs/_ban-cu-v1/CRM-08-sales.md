# CRM-08 — Sales

> **Trạng thái:** 💡 Proposed · v1.1 · 01/10/2026 · chờ review
> **Tính năng sở hữu (19):** S-01 → S-19
> **Phụ thuộc:** `CRM-00` §5.6, §6.2, §8.1 (collection `NhanVien`, chọn owner, đồng bộ trường cũ) · `F14-S1` §5.2 (`sales_scorecard`) · `F03-S5` §5 (chuyển giao, đổi tên) · `F03-S6` (task, hoạt động) · `F03-S4` (trạng thái giao diện theo người dùng) · `CRM-01` (khung bảng, trang chi tiết) · `DESIGN-SYSTEM-HUBSPOT.md` §6.6, §6.9, §6.16
> **Prototype:** `crm-sales-hubspot.html` (danh sách) · `crm-sales-hubspot.html?id=s1` (chi tiết)
> **Nguồn HubSpot:** trang danh sách, Sales leaderboard / Forecast, bố cục trang chi tiết, "deactivate user và reassign records" — `DOI-CHIEU-CHUC-NANG.md` §17

---

## 1. Phạm vi

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Mục |
|---|---|---|---|---|
| S-01 | Menu Sales trên sidebar | P0 | Chỉ FE | §2 |
| S-02 | Collection Sale | P0 | FE + BE | §3 |
| S-03 | Liên kết Sale với owner | P0 | FE + BE | §3.2 |
| S-04 | Header + nút Thêm sale | P0 | Chỉ FE | §4.1 |
| S-05 | Tab view theo team | P1 | Chỉ FE | §4.2 |
| S-06 | Tìm kiếm và chọn kỳ | P0 | Chỉ FE | §4.3 |
| S-07 | Dải KPI tổng | P0 | FE + BE | §4.4 |
| S-08 | Bảng xếp hạng sale | P0 | FE + BE | §4.5 |
| S-09 | Xuất CSV | P2 | Chỉ FE | §4.6 |
| S-10 | Panel Thêm sale | P0 | Chỉ FE | §5 |
| S-11 | Thẻ định danh sale | P0 | Chỉ FE | §7.1 |
| S-12 | Thông tin sale sửa tại chỗ | P0 | FE + BE | §7.2 |
| S-13 | KPI hiệu suất theo kỳ | P0 | FE + BE | §7.3 |
| S-14 | Pipeline theo giai đoạn | P1 | Chỉ FE | §7.4 |
| S-15 | Việc cần làm | P1 | Chỉ FE | §7.5 |
| S-16 | Hoạt động gần đây | P2 | Chỉ FE | §7.6 |
| S-17 | Card bản ghi sở hữu | P1 | Chỉ FE | §7.7 |
| S-18 | Chuyển giao bản ghi | P1 | FE + BE | §8 |
| S-19 | Đánh dấu đã nghỉ / đang làm | P2 | Chỉ FE | §9 |

Lệch so với sheet, cần PO xác nhận:

- **S-02 không tạo collection "Sale" mới.** Theo QĐ-01, sale là bản ghi của collection `NhanVien` đang có, thêm các trường ở CRM-00 §5.6 và thêm trường `is_sales` (§3.1) để tách nhân viên kinh doanh khỏi nhân viên khác.
- **S-12 "đổi tên ⇒ cập nhật owner ở mọi bản ghi"** không cần cập nhật hàng loạt: owner là liên kết tới nhân viên nên mọi nơi tự hiện tên mới. Chỉ trường văn bản cũ `sale_ph_tr_ch` cần đồng bộ trong thời gian chuyển tiếp (F03-S5 §5.3).
- **S-06 "nhớ lựa chọn trong trình duyệt"** đổi thành nhớ theo người dùng (F03-S4), để đổi máy vẫn giữ.
- S-14, S-15, S-16, S-17 ghi "Chỉ FE" nhưng cần API đọc theo nhân viên (F14-S1, F03-S6, API danh sách); không cần BE mới ngoài các spec nền đó.
- S-09, S-10, S-19 ghi "Chỉ FE" nhưng cần BE: S-09 xuất tệp ở máy chủ (F14-S1 §5.2 `sales_scorecard/export.csv`) để có kiểm quyền và ghi nhật ký; S-10 ghi cờ `is_sales` và tạo `NhanVien`; S-19 lấy số bản ghi còn phụ trách từ API xem trước của F03-S5 §5.1. Đề nghị sửa cột Phạm vi thành "FE + BE".
- S-18 chuyển giao thêm **task chưa xong** ngoài contact, company, deal, vì task giao cho người đã nghỉ sẽ không ai làm (§8).

**Ngoài phạm vi:** dự báo doanh số theo phương pháp khác (theo giai đoạn, theo lịch sử); chỉ tiêu theo từng tháng khác nhau; hoa hồng; quản lý team (team là danh mục, CRM-00 Q6).

---

## 2. Vị trí và URL (S-01)

- Mục **"Sales"** trên sidebar CRM, ngay sau "Deals", biểu tượng `badge`.
- Danh sách: `/crm/sales?view=all&period=month`. Chi tiết: `/crm/sales/<id NhanVien>?period=month`.
- Hiện với người đọc được `NhanVien`.

---

## 3. Dữ liệu

### 3.1 Nhân viên kinh doanh

Collection `NhanVien` (CRM-00 §5.6) với các trường Họ và tên, Email, Số điện thoại, Tài khoản đăng nhập (`tai_khoan`), Team (`sales_team`), Vai trò (`sales_role`), Chỉ tiêu tháng (`monthly_quota`), Trạng thái (`work_status`), Ngày vào làm.

Spec này thêm vào `NhanVien` (CRM-00 cập nhật):

| Key | Tên hiển thị | Kiểu | Ghi chú |
|---|---|---|---|
| `is_sales` | Thuộc đội kinh doanh | Hộp kiểm | Mặc định `false`. Danh sách Sales và ô chọn owner chỉ gồm nhân viên có `is_sales = true` |

Lý do: `NhanVien` dùng chung cho cả ERP (CRM-00 §5.6), có cả nhân viên kế toán, kỹ thuật. Không có cờ này thì bảng xếp hạng và ô chọn owner sẽ có cả người không làm sales. Script CRM-00 đặt `is_sales = true` cho nhân viên đã khớp với `sale_ph_tr_ch` của Deals (CRM-00 §8.1) và nhân viên có Team hoặc Vai trò sales; còn lại quản trị đánh dấu tay.

### 3.2 Liên kết với owner (S-03)

- Contact owner, Company owner, Sale phụ trách của Deal là liên kết tới bản ghi `NhanVien` (CRM-00 §6.2).
- Ô chọn owner liệt kê nhân viên có `is_sales = true` và `work_status = Đang làm việc`. Ô chọn **Người thực hiện** của task (CRM-05 §4.2) liệt kê mọi nhân viên đang làm việc, không cần `is_sales`, vì task có thể giao cho bộ phận khác.
- Nhân viên vừa thêm (§5) hiện ngay trong các ô chọn đó.

---

## 4. Danh sách Sales

Bố cục: header · tab view · thanh công cụ · dải KPI · bảng · footer. Bảng theo DS-HUBSPOT §6.6.

### 4.1 Header (S-04)

- Tiêu đề "Sales" và số sale trong tab đang mở ("12 sale").
- Bên phải: nút "Xuất CSV" (§4.6) và nút chính **"Thêm sale"** (§5). Người không có quyền tạo bản ghi `NhanVien` không thấy "Thêm sale".

### 4.2 Tab view (S-05)

- **Tất cả sales** · **Của tôi** · một tab cho mỗi giá trị Team (D-TEAM) đang có ít nhất một sale, theo thứ tự danh mục.
- "Của tôi": chỉ nhân viên gắn với tài khoản đang đăng nhập (`tai_khoan`). Tài khoản chưa gắn nhân viên nào: tab không hiện.
- Tab đang chọn ghi vào URL (`view=all|me|<team>`) và nhớ theo người dùng.
- Sale "Tạm nghỉ", "Đã nghỉ" có trong mọi tab, dòng mờ đi, có nhãn trạng thái cạnh tên (§9).

### 4.3 Tìm kiếm và chọn kỳ (S-06)

- Ô "Tìm tên, email, team": lọc theo Họ và tên, Email, Team; gửi sau khi ngừng gõ 300 ms. Máy chủ so khớp không phân biệt hoa thường và bỏ dấu cả hai phía (gõ "tran" ra "Trần"), qua API danh sách `NhanVien`; FE lấy danh sách id khớp rồi gửi vào `employees` của `sales_scorecard`.
- Nút chọn kỳ dạng segmented: **Tháng này** · **Quý này** · **Năm nay**; cạnh đó ghi khoảng ngày, ví dụ "01/10 – 31/10/2026". Mã kỳ là `month`, `quarter`, `year` của F14-S1 §3.1.
- Kỳ và tab nhớ theo người dùng (F03-S4, khoá `crm.sales.list`, giá trị `{ "period", "view", "sort" }`). Ô tìm không nhớ.

### 4.4 Dải KPI tổng (S-07)

Năm thẻ, tính trên **các sale đang hiện** sau khi lọc tab và ô tìm:

| Thẻ | Giá trị | Dòng phụ |
|---|---|---|
| Doanh số thắng | Σ `wonAmount` | "Deal Closed Won có ngày đóng trong kỳ" |
| Đạt chỉ tiêu | Σ `wonAmount` ÷ Σ `quota`, cả tử số và mẫu số chỉ lấy các sale **có** chỉ tiêu (sale chưa đặt chỉ tiêu không góp doanh số vào phép chia này); "—" khi không ai có chỉ tiêu | "Chỉ tiêu kỳ: {Σ quota}" |
| Pipeline đang mở | Σ `pipeline` | "{Σ openDeals} deal · dự báo {Σ forecast}" |
| Hoạt động 30 ngày | Σ `activities30d` | "Ghi chú · cuộc gọi · cuộc họp" |
| Task quá hạn | Σ `overdueTasks` | "Chưa hoàn thành, đã quá hạn". Thẻ chuyển kiểu cảnh báo khi > 0 |

Số tiền dạng rút gọn ("1,2 tỷ ₫", "610 tr ₫"); rê chuột hiện số đầy đủ.

### 4.5 Bảng xếp hạng (S-08)

Dữ liệu từ `sales_scorecard` (F14-S1 §5.2) cho các nhân viên trong tab, kỳ đang chọn. Công thức ở §6.

| Cột | Ghi chú |
|---|---|
| Sale | Dính trái. Huy hiệu hạng (`rank` từ API, §6) · avatar chữ cái · Họ và tên · nhãn trạng thái nếu không phải Đang làm việc. Bấm cả dòng mở chi tiết |
| Team · Vai trò | |
| Contacts · Companies · Deal đang mở | Số, canh phải |
| Giá trị pipeline · Dự báo (theo tỷ lệ) | Tiền rút gọn |
| Doanh số thắng | In đậm |
| Chỉ tiêu | "—" khi chưa đặt |
| % đạt chỉ tiêu | Thanh tiến độ + phần trăm. ≥ 100%: màu thành công; 50–99%: cảnh báo; < 50%: lỗi; chưa đặt chỉ tiêu: chữ "Chưa đặt chỉ tiêu" |
| Tỷ lệ thắng | Phần trăm; "—" khi kỳ chưa có deal đóng |
| Hoạt động 30 ngày | |
| Task quá hạn | Số khác 0 hiện nhãn màu lỗi |

- Bấm tiêu đề cột để sắp xếp tăng/giảm. Mặc định: Doanh số thắng giảm dần.
- Không có sale nào khớp: "Không có sale phù hợp."
- Footer: "{n} sale" và chữ nhỏ "Chỉ tiêu kỳ = chỉ tiêu tháng × số tháng của kỳ. Bấm tên cột để sắp xếp, bấm dòng để xem chi tiết."
- Đang tải: skeleton 8 dòng. Lỗi: "Không tải được bảng xếp hạng." + "Thử lại".

### 4.6 Xuất CSV (S-09)

- Nút "Xuất CSV" gọi `POST /api/v1/reports/named/sales_scorecard/export.csv` (F14-S1 §5.2) với đúng `employees` và kỳ đang hiện; tải `sales-{month|quarter|year}-{dd-mm-yyyy}.csv`.
- Tệp có các cột của bảng theo thứ tự đang hiện, thêm cột Email; số tiền là số nguyên không có dấu ngăn cách; phần trăm là số. Định dạng, chống chèn công thức, ghi nhật ký theo F14-S1 §6.2.
- Cần quyền `record.export` trên `NhanVien`; không có thì không có nút.

---

## 5. Panel Thêm sale (S-10)

Panel phải theo CRM-01 §6, tiêu đề "Thêm sale", hai tab:

**Tab "Chọn nhân viên có sẵn"** (mặc định khi `NhanVien` có nhân viên chưa thuộc đội kinh doanh):

- Ô tìm nhân viên đang làm việc có `is_sales = false`.
- Chọn một người thì hiện các ô Team, Vai trò, Chỉ tiêu tháng để điền thêm.
- Nút "Thêm" · "Huỷ". Thêm: đặt `is_sales = true` và các trường vừa điền, đóng panel, toast "Đã thêm sale “{tên}”", bảng tải lại.

**Tab "Tạo nhân viên mới"**:

| # | Ô | Ràng buộc |
|---|---|---|
| 1 | Họ và tên * | Không trùng tên nhân viên đang làm việc khác (CRM-00 §5.6) |
| 2 | Email * | Định dạng email; Duy nhất |
| 3 | Số điện thoại | |
| 4 | Team | D-TEAM |
| 5 | Vai trò | D-ROLE |
| 6 | Chỉ tiêu tháng | Tiền, ≥ 0, gợi ý "VD: 100000000" |
| 7 | Trạng thái | D-WORKSTATUS, mặc định Đang làm việc |
| 8 | Ngày vào làm | Mặc định hôm nay |
| 9 | Tài khoản đăng nhập | Chọn tài khoản ERP có tìm; không bắt buộc; mỗi tài khoản gắn tối đa một nhân viên |

- Tạo với `is_sales = true`.
- Dòng chú thích dưới form: "Sale mới hiện ngay trong ô chọn Contact owner, Company owner và Sale phụ trách của Deal."
- Lỗi: thiếu tên hoặc email "Nhập họ tên và email của sale"; trùng tên "Đã có nhân viên đang làm việc tên “{tên}”"; trùng email, tài khoản: lỗi từ API dưới ô tương ứng.
- Nút ở tab này là "Tạo" · "Huỷ". Tạo xong: đóng panel, toast "Đã thêm sale “{tên}”", bảng tải lại.

---

## 6. Công thức chỉ số

Kỳ P là Tháng này, Quý này hoặc Năm nay (giờ Việt Nam). "Deal đang mở", Won, Lost theo CRM-00 §5.4.3. Amount là `t_ng_cash_in_d_ki_n`, trống tính 0. Mọi chỉ số tính theo **owner hiện tại** của bản ghi.

| Chỉ số | Công thức | Theo kỳ? |
|---|---|---|
| `contacts`, `companies` | Số contact, company có `owner_id` là nhân viên | Không |
| `openDeals` | Số deal đang mở của nhân viên | Không |
| `pipeline` | Σ Amount của deal đang mở | Không |
| `forecast` | Σ (Amount × Tỷ lệ thành công ÷ 100) của deal đang mở; tỷ lệ trống tính 0 | Không |
| `wonAmount`, `wonCount` | Σ Amount, số deal Won có `closed_at` trong P | Có |
| `lostCount` | Số deal Lost có `closed_at` trong P | Có |
| `winRate` | `wonCount` ÷ (`wonCount` + `lostCount`) × 100, làm tròn; `null` khi mẫu bằng 0 | Có |
| `quota` | `monthly_quota` × số tháng của P (1 · 3 · 12); `null` khi chưa đặt chỉ tiêu tháng | Có |
| `quotaPct` | `wonAmount` ÷ `quota` × 100, làm tròn; `null` khi `quota` là `null` hoặc 0 | Có |
| `activities30d` | Số Ghi chú, Cuộc gọi, Cuộc họp **đã diễn ra** (F14-S1 §4.4 `$happenedAt`) trong mốc `d30` (F14-S1 §3.1: 29 ngày trước → hết hôm nay), có `$actor` là nhân viên | Không, luôn mốc `d30` |
| `openTasks` | Số task chưa xong có người thực hiện là nhân viên | Không |
| `overdueTasks` | Số task chưa xong có người thực hiện là nhân viên và `due_at < now` (đã qua giờ hạn, không phải qua ngày) | Không |

**Hạng** (`rank` do API trả, huy hiệu ở cột Sale): xếp các sale **đang làm việc** theo `wonAmount` giảm dần, bằng nhau thì `pipeline` giảm dần. Hạng tính trên toàn bộ sale đang làm việc, không đổi khi lọc tab hay tìm kiếm. Sale tạm nghỉ, đã nghỉ không có hạng ("—"). Hạng 1 có huy hiệu nổi bật khi `wonAmount` > 0.

**Chỉ tiêu và ngày vào làm**: giai đoạn này chỉ tiêu kỳ không trừ phần tháng trước ngày vào làm. Sale vào làm giữa quý vẫn có chỉ tiêu đủ 3 tháng (Q3).

**Quyền**: số liệu chỉ tính trên bản ghi người xem đọc được (F14-S1 §4.5). Nếu vai trò Sales chỉ đọc được bản ghi của mình thì số của người khác trên bảng sẽ thấp hơn thực tế. Đề xuất: hoặc cho vai trò Sales đọc mọi Contact, Company, Deal, hoặc chỉ mở trang Sales cho quản lý (Q1).

---

## 7. Trang chi tiết sale

Template T2 (CRM-01 §5.1): cột trái · giữa · phải.

### 7.1 Thẻ định danh (S-11)

- Link "‹ Sales" quay về danh sách (giữ tab, kỳ) · nút "Thao tác ▾".
- Avatar chữ cái · Họ và tên (chữ lớn) · dòng "{Vai trò} · {Team}" · nhãn trạng thái nếu không phải Đang làm việc.
- Dòng phụ: email (link `mailto:`) · số điện thoại.
- Bốn nút nhanh tròn có nhãn:

| Nút | Hành vi |
|---|---|
| Email | Mở `mailto:` (ứng dụng thư của máy). Không có email thì vô hiệu |
| Gọi | Mở `tel:`. Không có số thì vô hiệu |
| Deals | Mở danh sách Deals lọc Sale phụ trách là nhân viên này |
| Báo cáo | Mở dashboard "Tổng quan pipeline" (CRM-07) với Sale phụ trách là nhân viên này |

- Menu "Thao tác ▾": Chuyển giao bản ghi (§8) · Đánh dấu đã nghỉ / Đánh dấu đang làm việc (§9) · vạch ngăn · Xoá (chỉ khi nhân viên không còn bản ghi nào trỏ tới, CRM-00 R1; nếu còn thì mục bị ẩn).

### 7.2 Thông tin sale (S-12)

Card "Thông tin sale", `PropertyList` sửa tại chỗ (DS-HUBSPOT §6.9a): Họ và tên · Email · Số điện thoại · Team · Vai trò · Chỉ tiêu tháng · Trạng thái · Ngày vào làm · Tài khoản đăng nhập · Thuộc đội kinh doanh. Cuối card "Ngày tạo: {dd/mm/yyyy HH:mm}".

- Đổi Họ và tên: trống thì "Tên không được để trống"; trùng tên nhân viên đang làm việc khác thì "Đã có nhân viên đang làm việc tên “{tên}”"; hợp lệ thì toast "Đã đổi tên. Mọi bản ghi do {tên mới} phụ trách hiện tên mới." Khi đồng bộ `sale_ph_tr_ch` còn bật, máy chủ cập nhật trường đó cho các deal của nhân viên (F03-S5 §5.3).
- Đổi Trạng thái tại đây chạy cùng quy tắc ở §9 (hỏi khi chuyển sang Đã nghỉ).
- Bỏ tick "Thuộc đội kinh doanh": hỏi "{Tên} sẽ không còn trong danh sách Sales và ô chọn owner. Bản ghi đang sở hữu giữ nguyên." Lưu thì quay về danh sách.
- Người không có quyền sửa `NhanVien`: card chỉ đọc.

### 7.3 KPI hiệu suất (S-13)

Card "Hiệu suất" ở cột giữa, có nút chọn kỳ như §4.3 (dùng chung lựa chọn với danh sách). Sáu thẻ:

| Thẻ | Giá trị | Dòng phụ |
|---|---|---|
| Doanh số thắng | `wonAmount` | "{wonCount} deal Closed Won" |
| Chỉ tiêu kỳ | `quota` hoặc "—" | Thanh % đạt như §4.5 |
| Pipeline đang mở | `pipeline` | "{openDeals} deal · dự báo {forecast}" |
| Tỷ lệ thắng | `winRate` hoặc "—" | "{wonCount} thắng · {lostCount} thua trong kỳ" |
| Hoạt động 30 ngày | `activities30d` | "Ghi chú · cuộc gọi · cuộc họp" |
| Task quá hạn | `overdueTasks` | "{openTasks} task chưa xong"; kiểu cảnh báo khi > 0 |

Bấm số ở thẻ Doanh số thắng, Pipeline đang mở, Task quá hạn mở drill-down (mã `drill` của F14-S1 §5.2) trong panel như CRM-07 §8.

### 7.4 Pipeline theo giai đoạn (S-14)

- Card "Pipeline theo giai đoạn", nút "Mở Deals ↗" ở header.
- Một dòng cho mỗi giai đoạn của D-STAGE theo thứ tự danh mục: tên giai đoạn (pill) · thanh so sánh · "{số deal} · {tổng Amount}".
- Bốn giai đoạn đang mở tính deal **hiện đang ở** giai đoạn đó. Won và Lost chỉ tính deal có `closed_at` trong kỳ đang chọn.
- Thanh dài theo tổng Amount, so với dòng lớn nhất.
- Bấm một dòng: mở danh sách Deals lọc Sale phụ trách và giai đoạn đó (với Won/Lost thêm bộ lọc ngày đóng trong kỳ).

### 7.5 Việc cần làm (S-15)

- Card "Việc cần làm ({n})": task chưa xong có người thực hiện là nhân viên, và cuộc họp sắp tới (định nghĩa "sắp tới" ở CRM-00 §5.4.2) do nhân viên tạo.
- Thứ tự: task quá hạn (hạn cũ nhất trước), rồi các mục còn lại theo hạn hoặc giờ bắt đầu tăng dần. Tối đa 8 mục; còn nữa thì "Xem thêm {n}" mở rộng ngay trong card.
- Mỗi mục: biểu tượng loại · tiêu đề · link tới bản ghi liên kết đầu tiên · dòng phụ theo hạn của task:
  - `due_at < now`: "Hạn {dd/mm HH:mm} · Quá hạn" (màu lỗi), kể cả khi hạn là đầu giờ hôm nay.
  - Hạn trong hôm nay, chưa tới giờ: "Hôm nay {HH:mm}" (đậm).
  - Hạn từ ngày mai: "Hạn {dd/mm}".
  - Sau đó "· Ưu tiên {mức}". Cuộc họp ghi "{dd/mm HH:mm}".
- Rỗng: "Không có việc cần làm."
- Dữ liệu: API `my-tasks` không dùng được (chỉ cho chính mình); dùng API danh sách `crm_activities` với bộ lọc người thực hiện, loại, trạng thái. Người xem cần đọc được các task đó.

### 7.6 Hoạt động gần đây (S-16)

- Card "Hoạt động gần đây": 6 hoạt động đã diễn ra mới nhất có `$actor` là nhân viên (F14-S1 §4.4).
- Dữ liệu: FE gửi truy vấn F14-S1 §4.1 trên `crm_activities` (`count`, `owner = { field: "$actor", in: [id nhân viên] }`, `time.field = "$happenedAt"`, `preset = all`, không nhóm), lấy mã `drill` của tổng rồi gọi F14-S1 §6.1 với `sort=$happenedAt:desc&limit=6`. Hoạt động chưa diễn ra có `$happenedAt` rỗng nên không lọt vào.
- Mỗi dòng: biểu tượng · "{loại}: {tiêu đề}" · link bản ghi liên kết đầu tiên · thời điểm.
- Rỗng: "Chưa có hoạt động nào."

### 7.7 Card bản ghi sở hữu (S-17)

Cột phải có ba card theo thứ tự **Deals** · **Companies** · **Contacts**:

- Header: biểu tượng · "{Đối tượng} ({tổng})" · "Xem tất cả" (mở danh sách lọc owner là nhân viên).
- Tối đa 6 dòng; còn nữa thì "+{n} bản ghi khác".
- Deals: deal đang mở trước (Ngày dự kiến chốt tăng dần), rồi deal đóng gần nhất. Dòng: "{Mã Deal} — {Tên Deal}" · "{Amount} · {giai đoạn}".
- Companies: tên · Lifecycle stage. Contacts: họ tên · chức danh (không có thì Lifecycle stage).
- Rỗng: "Chưa sở hữu {deal / công ty / contact} nào."

---

## 8. Chuyển giao bản ghi (S-18)

Mở từ "Thao tác ▾ → Chuyển giao bản ghi". Modal (DS-HUBSPOT §6.11) tiêu đề "Chuyển giao bản ghi của {tên}":

1. Danh sách bốn mục có checkbox, số lượng từ API xem trước (F03-S5 §5.1), mặc định tick hết:
   - Contacts ({n}) · Companies ({n}) · Deals đang mở ({n}) · Task chưa xong ({n}).
   - Dòng nhỏ: "Deal đã đóng giữ nguyên Sale phụ trách để không đổi doanh số đã ghi nhận."
2. Ô "Chuyển cho": chọn sale đang làm việc, không gồm chính người này.
3. Có bản ghi người xem không có quyền sửa (`notPermitted`): hộp cảnh báo "{n} bản ghi bạn không có quyền sửa sẽ được giữ nguyên."
4. Nút "Huỷ" · **"Chuyển giao"** (vô hiệu khi chưa chọn người nhận hoặc không tick mục nào).

Bấm "Chuyển giao": gọi F03-S5 §5.2, đóng modal, thanh tiến độ ở góc màn hình (CRM-01 §4.12). Xong: toast và thông báo "Đã chuyển {n} bản ghi của {tên cũ} cho {tên mới}"; trang chi tiết tải lại. Nếu nhân viên vẫn "Đang làm việc", toast có thêm nút "Đánh dấu đã nghỉ" (§9).

Số liệu đếm lúc mở modal có thể khác lúc chạy; kết quả cuối theo job (F03-S5 §3.3).

---

## 9. Đánh dấu đã nghỉ / đang làm việc (S-19)

**Đánh dấu đã nghỉ** (từ menu Thao tác hoặc đổi Trạng thái ở §7.2):

- Nhân viên còn bản ghi đang phụ trách (contact, company, deal đang mở, task chưa xong): hộp thoại "{Tên} còn phụ trách {a} contact, {b} công ty, {c} deal đang mở, {d} task chưa xong. Nên chuyển giao trước khi đánh dấu đã nghỉ." với ba nút "Chuyển giao trước" (mở §8) · "Vẫn đánh dấu đã nghỉ" · "Huỷ".
- Không còn bản ghi: hộp xác nhận "Đánh dấu {tên} đã nghỉ?".
- Kết quả: `work_status = Đã nghỉ`. Nhân viên biến khỏi ô chọn owner (CRM-00 §6.2); dòng trong danh sách mờ đi, có nhãn "Đã nghỉ", không có hạng; bản ghi vẫn thuộc họ hiện tên kèm nhãn trạng thái.
- Tài khoản đăng nhập **không** bị khoá; khoá tài khoản là việc của quản trị ở F01.

**Đánh dấu đang làm việc**: hộp xác nhận ngắn, đặt `work_status = Đang làm việc`; nhân viên trở lại ô chọn owner và có hạng.

"Tạm nghỉ" đặt bằng cách sửa Trạng thái ở §7.2, không hỏi gì; nhân viên tạm nghỉ không có trong ô chọn owner nhưng vẫn giữ bản ghi.

---

## 10. Quyền

| Hành động | Điều kiện |
|---|---|
| Xem danh sách, chi tiết | Đọc được `NhanVien` (và Q1) |
| Thêm sale, sửa thông tin, đổi trạng thái | `record.write` / `record.create` trên `NhanVien` |
| Xuất CSV | `record.export` trên `NhanVien` |
| Chuyển giao | Quyền ghi trên các collection được chuyển (F03-S5 §5.2) |
| Xoá nhân viên | `record.delete` trên `NhanVien` và không còn bản ghi trỏ tới (CRM-00 R1) |

---

## 11. Tiêu chí nghiệm thu

**AC-S01-1 — Menu Sales**
Given người dùng đọc được `NhanVien`
When mở CRM
Then sidebar có "Sales" ngay sau "Deals"; bấm mở danh sách Sales.

**AC-S02-2 — Chỉ nhân viên kinh doanh**
Given `NhanVien` có 15 người, 12 người `is_sales = true`
When mở danh sách Sales tab Tất cả
Then có 12 sale; ô chọn Contact owner chỉ có những người trong 12 người đó đang làm việc; ô Người thực hiện của task có cả 3 người còn lại nếu đang làm việc.

**AC-S03-3 — Sale mới hiện trong ô chọn owner**
Given vừa thêm sale "Võ Thị Hoa" đang làm việc
When mở panel tạo Contact
Then ô Contact owner có "Võ Thị Hoa".

**AC-S04-1 — Header**
Given tab Tất cả có 12 sale
When nhìn header
Then có "Sales", "12 sale", nút "Xuất CSV" và "Thêm sale".

**AC-S05-1 — Tab theo team**
Given có sale ở Team "Sales HCM" và "Key Account", không ai ở "Sales HN"
When nhìn hàng tab
Then có Tất cả sales · Của tôi · Sales HCM · Key Account; không có tab Sales HN.

**AC-S06-1 — Chọn kỳ được nhớ**
Given hôm nay 01/10/2026
When chọn "Quý này" rồi mở danh sách trên máy khác
Then kỳ là "Quý này", cạnh nút ghi "01/10 – 31/12/2026".

**AC-S07-1 — Dải KPI theo danh sách đang lọc**
Given tab "Sales HCM" có Minh (thắng 610 tr, chỉ tiêu 500 tr) và Lan (thắng 240 tr, chưa đặt chỉ tiêu)
When xem dải KPI kỳ Tháng này
Then Doanh số thắng 850 tr ₫; Đạt chỉ tiêu 122% với dòng "Chỉ tiêu kỳ: 500 tr ₫".

**AC-S08-1 — Bảng xếp hạng và hạng**
Given ba sale đang làm việc thắng 610 tr, 240 tr, 0 trong tháng
When mở bảng
Then thứ tự theo Doanh số thắng giảm dần, hạng 1 · 2 · 3, hạng 1 có huy hiệu nổi bật; bấm tiêu đề "Tỷ lệ thắng" thì sắp lại theo cột đó, hạng không đổi.

**AC-S08-2 — Chỉ tiêu theo kỳ**
Given Minh có chỉ tiêu tháng 500.000.000 ₫
When chọn "Quý này"
Then cột Chỉ tiêu của Minh là 1,5 tỷ ₫.

**AC-S09-1 — Xuất CSV**
Given tab Sales HCM, kỳ Tháng này
When bấm "Xuất CSV"
Then tải `sales-month-01-10-2026.csv` chỉ gồm sale của Sales HCM, mở bằng Excel đúng tiếng Việt.

**AC-S10-1 — Thêm từ nhân viên có sẵn**
Given "Trần Thị Mai" là nhân viên đang làm việc chưa thuộc đội kinh doanh
When ở tab "Chọn nhân viên có sẵn" chọn Mai, Team Sales HN, bấm "Thêm"
Then Mai có trong danh sách Sales; không có bản ghi nhân viên mới nào được tạo.

**AC-S10-2 — Chặn trùng tên**
Given đã có nhân viên đang làm việc tên "Minh Trần"
When tạo nhân viên mới tên "Minh Trần"
Then báo "Đã có nhân viên đang làm việc tên “Minh Trần”"; không tạo.

**AC-S11-1 — Nút nhanh**
Given trang chi tiết Minh Trần
When bấm "Deals"
Then mở danh sách Deals lọc Sale phụ trách = Minh Trần.

**AC-S12-1 — Đổi tên**
Given Minh Trần phụ trách 42 contact
When đổi tên thành "Trần Văn Minh"
Then toast "Đã đổi tên. Mọi bản ghi do Trần Văn Minh phụ trách hiện tên mới."; mở một contact của Minh thấy owner "Trần Văn Minh".

**AC-S13-1 — KPI hiệu suất**
Given Minh có 4 deal thắng 610 tr và 2 deal thua có ngày đóng trong tháng, 9 deal đang mở tổng 1,24 tỷ, dự báo 412 tr
When xem card Hiệu suất kỳ Tháng này
Then Doanh số thắng 610 tr ₫ "4 deal Closed Won"; Tỷ lệ thắng 67% "4 thắng · 2 thua trong kỳ"; Pipeline đang mở 1,24 tỷ ₫ "9 deal · dự báo 412 tr ₫".

**AC-S14-1 — Pipeline theo giai đoạn**
Given Minh có 3 deal ở "2. Discovery Call" tổng 300 tr
When bấm dòng "2. Discovery Call"
Then mở danh sách Deals lọc Sale phụ trách Minh và giai đoạn đó, có 3 deal.

**AC-S15-1 — Việc cần làm**
Given Minh có task hạn 25/09 17:00, task hạn 01/10 08:00, task hạn 01/10 17:00, cuộc họp 02/10 10:00
When xem card Việc cần làm lúc 09:00 ngày 01/10/2026
Then thứ tự: task 25/09 ("Quá hạn") · task 01/10 08:00 ("Quá hạn") · task 01/10 17:00 ("Hôm nay 17:00") · cuộc họp 02/10 10:00; thẻ Task quá hạn ở card Hiệu suất là 2.

**AC-S16-1 — Hoạt động gần đây**
Given Minh có 10 hoạt động đã diễn ra và 1 cuộc họp hẹn tuần sau
When xem card Hoạt động gần đây
Then có 6 hoạt động mới nhất đã diễn ra, không có cuộc họp tuần sau.

**AC-S17-1 — Card bản ghi sở hữu**
Given Minh sở hữu 42 contact
When xem card Contacts
Then header "Contacts (42)", 6 dòng và "+36 bản ghi khác"; "Xem tất cả" mở danh sách Contacts lọc owner Minh.

**AC-S18-1 — Chuyển giao**
Given Minh có 42 contact, 17 company, 9 deal đang mở, 6 task chưa xong
When chuyển giao cả bốn mục cho Lan Lê
Then modal hiện đúng bốn số đó; sau khi job xong, card bản ghi sở hữu của Minh còn 0 contact, 0 company và chỉ còn deal đã đóng; toast có nút "Đánh dấu đã nghỉ".

**AC-S19-1 — Đánh dấu đã nghỉ khi còn bản ghi**
Given Minh còn 9 deal đang mở
When chọn "Đánh dấu đã nghỉ"
Then hộp thoại nêu số bản ghi còn phụ trách với ba nút; chọn "Vẫn đánh dấu đã nghỉ" thì dòng Minh trong danh sách mờ đi, nhãn "Đã nghỉ", không có hạng, và Minh không còn trong ô chọn owner.

---

## 12. Test case

| Mã | Loại | Bước | Kỳ vọng |
|---|---|---|---|
| TC-CRM08-01 | Unit | `winRate` khi 0 thắng 0 thua | `null`, hiện "—" |
| TC-CRM08-02 | Unit | `quotaPct` khi chỉ tiêu tháng = 0 | `null`, hiện "Chưa đặt chỉ tiêu" |
| TC-CRM08-03 | Unit | `forecast` với deal có tỷ lệ thành công trống | Deal đó góp 0 |
| TC-CRM08-04 | Unit | Hai sale cùng `wonAmount`, pipeline khác | Sale pipeline lớn hơn đứng trên |
| TC-CRM08-05 | E2E | Tìm "hcm" | Chỉ sale thuộc Team Sales HCM |
| TC-CRM08-06 | E2E | Tài khoản chưa gắn nhân viên | Không có tab "Của tôi" |
| TC-CRM08-07 | E2E | Bỏ tick "Thuộc đội kinh doanh" | Hỏi xác nhận; lưu thì về danh sách, người đó không còn trong danh sách |
| TC-CRM08-08 | E2E | Đổi tên trùng nhân viên đang làm việc khác | Báo lỗi, giá trị cũ giữ nguyên |
| TC-CRM08-09 | E2E | Đổi tên khi đồng bộ `sale_ph_tr_ch` đang bật | Các deal của nhân viên có `sale_ph_tr_ch` mới |
| TC-CRM08-10 | E2E | Chuyển giao, bỏ tick "Task chưa xong" | Task giữ người thực hiện cũ |
| TC-CRM08-11 | E2E | Chuyển giao: người nhận không có trong danh sách chọn | Danh sách không có chính người đó và người không đang làm việc |
| TC-CRM08-12 | E2E | Đánh dấu đang làm việc cho người đã nghỉ | Trở lại ô chọn owner, có hạng |
| TC-CRM08-13 | E2E | Menu Thao tác của nhân viên còn bản ghi | Không có mục Xoá |
| TC-CRM08-14 | Quyền | Người không có `record.export` trên `NhanVien` | Không có nút Xuất CSV |
| TC-CRM08-15 | Quyền | Người chỉ đọc `NhanVien` | Card Thông tin sale chỉ đọc; không có "Thêm sale", "Chuyển giao" |
| TC-CRM08-16 | E2E | Màn 390 px | Bảng cuộn ngang, cột Sale dính trái; trang chi tiết một cột |
| TC-CRM08-17 | Hiệu năng | 30 sale, kỳ Năm nay | Bảng hiện xong < 2 giây |
| TC-CRM08-18 | E2E | Tìm "tran" | Ra các sale họ Trần |
| TC-CRM08-19 | Unit | Tab có 2 sale có chỉ tiêu (thắng 300 tr / chỉ tiêu 200 tr, thắng 0 / chỉ tiêu 100 tr) và 1 sale chưa đặt chỉ tiêu thắng 500 tr | Đạt chỉ tiêu 100% |

---

## 13. Prototype giả lập gì

| Trong prototype | Bản thật |
|---|---|
| Danh sách sale riêng trong trình duyệt (`db.sales`) | Collection `NhanVien` có `is_sales` (§3.1) |
| Owner nối theo tên sale | Liên kết tới id nhân viên (§3.2) |
| Đổi tên chạy cập nhật owner ở mọi bản ghi theo tên | Không cần; chỉ đồng bộ trường văn bản cũ khi còn chuyển tiếp (§7.2) |
| Chỉ số tính ở trình duyệt từ toàn bộ dữ liệu | `sales_scorecard` ở máy chủ (F14-S1 §5.2) |
| Doanh số thắng theo Ngày dự kiến chốt | Theo `closed_at` (§6) |
| Kỳ, tab, sắp xếp nhớ `localStorage` | Nhớ theo người dùng (F03-S4) |
| Xuất CSV dựng ở trình duyệt | Máy chủ xuất, kiểm quyền và ghi nhật ký (§4.6) |
| Chuyển giao đổi owner mọi deal kể cả đã đóng, ở trình duyệt | Job máy chủ, deal đã đóng giữ nguyên, có task chưa xong (§8, F03-S5 §5) |
| Thêm sale chỉ tạo mới | Thêm từ nhân viên có sẵn hoặc tạo mới (§5) |
| Đánh dấu đã nghỉ không nhắc chuyển giao | Hỏi khi còn bản ghi (§9) |

---

## 14. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai | Ảnh hưởng |
|---|---|---|---|
| Q1 | Ai xem được trang Sales: mọi sale hay chỉ quản lý? Nếu mọi sale, vai trò Sales có được đọc mọi Contact, Company, Deal không (để số liệu của người khác đúng)? | Khách | §6, §10 |
| Q2 | Thêm cờ `is_sales` vào `NhanVien` có ảnh hưởng phần khác của ERP đang dùng `NhanVien` không? | BE / khách | §3.1 |
| Q3 | Chỉ tiêu kỳ có cần trừ phần trước ngày vào làm hoặc thời gian tạm nghỉ không? | Khách | §6 |
| Q4 | Dự báo chỉ theo Tỷ lệ thành công của từng deal (như prototype) đã đủ chưa, hay cần dự báo theo giai đoạn? | Khách | §6 |

---

## Liên kết

- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` §5.6, §6.2, §8.1
- Spec nền: `ERPMini/features/features/F14-S1-api-tong-hop-bao-cao.md` §5.2 · `F03-S5-thao-tac-hang-loat.md` §5 · `F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md` §3.3
- Báo cáo: `CRM-07-bao-cao.md`
- Design system: `../DESIGN-SYSTEM-HUBSPOT.md` §6.6, §6.9, §6.16
- Đối chiếu: `../DOI-CHIEU-CHUC-NANG.md` §17

## Version history

| Ngày | Nội dung | Tác giả |
|---|---|---|
| 2026-10-01 | v1.0 — bản đầu | TTS (qua Claude) |
| 2026-10-01 | v1.1 — sửa theo review: Đạt chỉ tiêu chỉ lấy sale có chỉ tiêu ở cả tử và mẫu; `activities30d` theo mốc `d30`; quá hạn tính theo giờ, thêm "Hôm nay {HH:mm}"; tìm bỏ dấu ở máy chủ; hạng và số task chưa xong lấy từ API; Hoạt động gần đây qua drill F14-S1; Xuất CSV ở máy chủ; §1 thêm lệch sheet S-09, S-10, S-18, S-19 | TTS (qua Claude) |
