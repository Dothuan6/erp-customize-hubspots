# CRM-08 — Sales

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | S-01 → S-19 (trang Sales) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem danh sách và bảng xếp hạng sale
  - UC-2: Xuất CSV bảng xếp hạng
  - UC-3: Thêm sale
  - UC-4: Xem trang chi tiết sale
  - UC-5: Sửa thông tin sale
  - UC-6: Chuyển giao bản ghi
  - UC-7: Đánh dấu đã nghỉ / đang làm việc
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.1 | 02-10-2026 |
| 1.1 | TTS (qua Claude) | Sửa theo review đợt 4 | 01-10-2026 |
| 1.0 | TTS (qua Claude) | Bản đầu | 01-10-2026 |

---

# USER STORIES

US-SALES-01: Là quản lý kinh doanh, tôi muốn xem bảng xếp hạng sale theo tháng, quý, năm để biết ai đang đạt chỉ tiêu. (S-01, S-04 → S-08)

US-SALES-02: Là quản lý kinh doanh, tôi muốn xuất bảng xếp hạng ra CSV để đưa vào báo cáo riêng. (S-09)

US-SALES-03: Là quản lý kinh doanh, tôi muốn thêm một sale mới để người đó nhận được contact, công ty và deal. (S-02, S-03, S-10)

US-SALES-04: Là quản lý kinh doanh, tôi muốn mở trang của một sale để xem hiệu suất, pipeline, việc cần làm và các bản ghi người đó phụ trách. (S-11, S-13 → S-17)

US-SALES-05: Là quản lý kinh doanh, tôi muốn sửa thông tin và chỉ tiêu của sale ngay trên trang chi tiết. (S-12)

US-SALES-06: Là quản lý kinh doanh, tôi muốn chuyển toàn bộ bản ghi của một sale sang người khác khi người đó nghỉ hoặc đổi việc. (S-18)

US-SALES-07: Là quản lý kinh doanh, tôi muốn đánh dấu một sale đã nghỉ để không ai giao thêm khách cho người đó. (S-19)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Bấm "Sales" trên sidebar. |
| 2 | Hệ thống | Hiện danh sách sale: tab theo team, ô tìm, nút chọn kỳ, dải KPI và bảng xếp hạng. |
| 3 | Người dùng | Chọn kỳ (Tháng này, Quý này, Năm nay), lọc theo tab hoặc ô tìm. |
| 4 | Hệ thống | Tính lại chỉ số của từng sale trên máy chủ và cập nhật dải KPI, bảng. |
| 5 | Người dùng | Bấm một dòng để mở trang chi tiết sale. |
| 6 | Hệ thống | Hiện thông tin sale, hiệu suất, pipeline, việc cần làm, hoạt động gần đây và bản ghi sở hữu. |
| 7 | Người dùng | Khi cần: thêm sale, sửa thông tin, chuyển giao bản ghi, đánh dấu đã nghỉ. |
| 8 | Hệ thống | Lưu thay đổi. Sale mới hiện ngay trong ô chọn owner. Sale đã nghỉ biến khỏi ô chọn owner. |

# USE CASE DESCRIPTION

## UC-1: Xem danh sách và bảng xếp hạng sale (S-01, S-04, S-05, S-06, S-07, S-08)

| | |
|---|---|
| **Actor** | Người dùng đọc được collection `NhanVien` |
| **Trigger** | Bấm mục "Sales" trên sidebar (ngay sau "Deals", biểu tượng `badge`) |
| **Pre-condition** | Có ít nhất một nhân viên được đánh dấu "Thuộc đội kinh doanh" (`is_sales = true`) |
| **Main Flow** | 1. Hệ thống mở `/crm/sales?view=all&period=month`.<br>2. Hệ thống hiện header: tiêu đề "Sales", số sale trong tab đang mở ("12 sale"), nút "Xuất CSV" và nút chính "Thêm sale".<br>3. Hệ thống hiện hàng tab: "Tất cả sales", "Của tôi", và một tab cho mỗi Team đang có sale.<br>4. Hệ thống hiện ô "Tìm tên, email, team" và nút chọn kỳ "Tháng này · Quý này · Năm nay", cạnh đó ghi khoảng ngày, ví dụ "01/10 – 31/10/2026".<br>5. Hệ thống gọi báo cáo `sales_scorecard` cho các sale đang hiện và kỳ đang chọn.<br>6. Hệ thống hiện dải 5 thẻ KPI tổng và bảng xếp hạng (cột theo Phụ lục A), mặc định sắp theo Doanh số thắng giảm dần.<br>7. Người dùng đổi tab, gõ ô tìm, đổi kỳ hoặc bấm tiêu đề cột để sắp xếp.<br>8. Hệ thống tải lại dải KPI và bảng theo lựa chọn mới.<br>9. Người dùng bấm một dòng để mở trang chi tiết (UC-4). |
| **Post-condition** | Kỳ, tab và cột sắp xếp được nhớ theo người dùng, đổi máy vẫn giữ. Ô tìm không nhớ. |
| **Exception Flow** | 3a. Tài khoản chưa gắn với nhân viên nào → không có tab "Của tôi".<br>3b. Team không có sale nào → không có tab của team đó.<br>6a. Không có sale nào khớp → bảng ghi "Không có sale phù hợp."<br>6b. Đang tải → skeleton 8 dòng.<br>6c. Lỗi tải → "Không tải được bảng xếp hạng." và nút "Thử lại".<br>2a. Người không có quyền tạo `NhanVien` → không thấy nút "Thêm sale". |

## UC-2: Xuất CSV bảng xếp hạng (S-09)

| | |
|---|---|
| **Actor** | Người dùng có quyền `record.export` trên `NhanVien` |
| **Trigger** | Bấm "Xuất CSV" ở header danh sách |
| **Pre-condition** | Bảng xếp hạng đã tải xong |
| **Main Flow** | 1. Người dùng bấm "Xuất CSV".<br>2. FE gọi `POST /api/v1/reports/named/sales_scorecard/export.csv` với đúng danh sách sale và kỳ đang hiện.<br>3. Máy chủ tạo tệp, ghi nhật ký xuất dữ liệu.<br>4. Trình duyệt tải tệp `sales-{month/quarter/year}-{dd-mm-yyyy}.csv`. |
| **Post-condition** | Tệp có các cột của bảng theo thứ tự đang hiện, thêm cột Email. Số tiền là số nguyên không có dấu ngăn cách, phần trăm là số. Mở bằng Excel đọc đúng tiếng Việt. |
| **Exception Flow** | 1a. Không có quyền `record.export` → không có nút "Xuất CSV". |

## UC-3: Thêm sale (S-02, S-03, S-10)

| | |
|---|---|
| **Actor** | Người dùng có quyền tạo và sửa bản ghi `NhanVien` |
| **Trigger** | Bấm "Thêm sale" ở header danh sách |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống mở panel phải "Thêm sale" có hai tab: "Chọn nhân viên có sẵn" và "Tạo nhân viên mới".<br>2. Trường hợp chọn nhân viên có sẵn:<br>2.1. Người dùng tìm và chọn một nhân viên đang làm việc chưa thuộc đội kinh doanh.<br>2.2. Hệ thống hiện thêm các ô Team, Vai trò, Chỉ tiêu tháng.<br>2.3. Người dùng điền và bấm "Thêm".<br>2.4. Hệ thống đặt `is_sales = true` và lưu các ô vừa điền.<br>3. Trường hợp tạo nhân viên mới:<br>3.1. Người dùng điền form (các ô theo Phụ lục A) và bấm "Tạo".<br>3.2. Hệ thống tạo bản ghi `NhanVien` với `is_sales = true`.<br>4. Hệ thống đóng panel, hiện toast "Đã thêm sale “{tên}”" và tải lại bảng. |
| **Post-condition** | Sale mới có trong danh sách Sales. Nếu đang làm việc, sale hiện ngay trong ô chọn Contact owner, Company owner và Sale phụ trách của Deal. |
| **Exception Flow** | 3.1a. Thiếu họ tên hoặc email → "Nhập họ tên và email của sale".<br>3.1b. Trùng tên với nhân viên đang làm việc khác → "Đã có nhân viên đang làm việc tên “{tên}”", không tạo.<br>3.1c. Trùng email hoặc tài khoản đăng nhập đã gắn nhân viên khác → hiện lỗi của máy chủ dưới ô tương ứng. |

## UC-4: Xem trang chi tiết sale (S-11, S-13, S-14, S-15, S-16, S-17)

| | |
|---|---|
| **Actor** | Người dùng đọc được `NhanVien` |
| **Trigger** | Bấm một dòng trong bảng xếp hạng, hoặc mở `/crm/sales/<id nhân viên>?period=month` |
| **Pre-condition** | Nhân viên tồn tại |
| **Main Flow** | 1. Hệ thống hiện trang ba cột (trái, giữa, phải).<br>2. Cột trái, thẻ định danh: link "‹ Sales", nút "Thao tác ▾", avatar chữ cái, họ tên, dòng "{Vai trò} · {Team}", email, số điện thoại và bốn nút nhanh Email, Gọi, Deals, Báo cáo.<br>3. Cột trái, card "Thông tin sale" (UC-5).<br>4. Cột giữa, card "Hiệu suất": nút chọn kỳ và 6 thẻ chỉ số (Phụ lục A).<br>5. Cột giữa, card "Pipeline theo giai đoạn": mỗi giai đoạn một dòng gồm tên giai đoạn, thanh so sánh, "{số deal} · {tổng Amount}".<br>6. Cột giữa, card "Việc cần làm ({n})": task chưa xong của sale và cuộc họp sắp tới do sale tạo, tối đa 8 mục.<br>7. Cột giữa, card "Hoạt động gần đây": 6 hoạt động đã diễn ra mới nhất của sale.<br>8. Cột phải, ba card "Deals", "Companies", "Contacts": mỗi card tối đa 6 dòng và link "Xem tất cả".<br>9. Người dùng bấm số ở thẻ Doanh số thắng, Pipeline đang mở hoặc Task quá hạn để xem danh sách bản ghi tạo nên con số đó. |
| **Post-condition** | Không thay đổi dữ liệu. Kỳ đang chọn dùng chung với danh sách Sales. |
| **Exception Flow** | 2a. Sale không có email → nút Email vô hiệu. Không có số điện thoại → nút Gọi vô hiệu.<br>6a. Không có việc → "Không có việc cần làm."<br>6b. Hơn 8 mục → nút "Xem thêm {n}" mở rộng ngay trong card.<br>7a. Chưa có hoạt động → "Chưa có hoạt động nào."<br>8a. Card không có bản ghi → "Chưa sở hữu {deal / công ty / contact} nào."<br>8b. Hơn 6 bản ghi → dòng "+{n} bản ghi khác". |

## UC-5: Sửa thông tin sale (S-12)

| | |
|---|---|
| **Actor** | Người dùng có quyền sửa `NhanVien` |
| **Trigger** | Bấm vào một giá trị trong card "Thông tin sale" |
| **Pre-condition** | Đang ở trang chi tiết sale |
| **Main Flow** | 1. Hệ thống cho sửa tại chỗ các trường: Họ và tên, Email, Số điện thoại, Team, Vai trò, Chỉ tiêu tháng, Trạng thái, Ngày vào làm, Tài khoản đăng nhập, Thuộc đội kinh doanh.<br>2. Người dùng sửa một giá trị và lưu.<br>3. Hệ thống kiểm tra và lưu.<br>4. Nếu đổi Họ và tên: hệ thống hiện toast "Đã đổi tên. Mọi bản ghi do {tên mới} phụ trách hiện tên mới."<br>5. Nếu đổi Trạng thái sang "Đã nghỉ": chạy UC-7.<br>6. Nếu bỏ tick "Thuộc đội kinh doanh": hệ thống hỏi "{Tên} sẽ không còn trong danh sách Sales và ô chọn owner. Bản ghi đang sở hữu giữ nguyên." Người dùng đồng ý thì lưu và quay về danh sách. |
| **Post-condition** | Thông tin mới được lưu. Mọi nơi hiển thị owner tự hiện tên mới vì owner là liên kết tới nhân viên, không phải chữ. |
| **Exception Flow** | 2a. Họ và tên để trống → "Tên không được để trống".<br>2b. Trùng tên nhân viên đang làm việc khác → "Đã có nhân viên đang làm việc tên “{tên}”", giữ giá trị cũ.<br>1a. Không có quyền sửa → card chỉ đọc. |

## UC-6: Chuyển giao bản ghi (S-18)

| | |
|---|---|
| **Actor** | Người dùng có quyền ghi trên các collection được chuyển |
| **Trigger** | Chọn "Thao tác ▾ → Chuyển giao bản ghi" ở trang chi tiết sale |
| **Pre-condition** | Sale đang phụ trách ít nhất một bản ghi |
| **Main Flow** | 1. Hệ thống mở hộp thoại "Chuyển giao bản ghi của {tên}".<br>2. Hệ thống hiện bốn mục có ô tick, mặc định tick hết, kèm số lượng: Contacts ({n}), Companies ({n}), Deals đang mở ({n}), Task chưa xong ({n}).<br>3. Hệ thống ghi chú: "Deal đã đóng giữ nguyên Sale phụ trách để không đổi doanh số đã ghi nhận."<br>4. Người dùng chọn người nhận ở ô "Chuyển cho" (chỉ sale đang làm việc, không gồm chính người này).<br>5. Người dùng bấm "Chuyển giao".<br>6. Máy chủ tạo một job chạy nền đổi owner hàng loạt. Hộp thoại đóng, thanh tiến độ hiện ở góc màn hình.<br>7. Job xong: hệ thống hiện toast và gửi thông báo "Đã chuyển {n} bản ghi của {tên cũ} cho {tên mới}", trang chi tiết tải lại. |
| **Post-condition** | Các bản ghi đã chọn có owner mới. Task có người thực hiện mới. Deal đã đóng vẫn của sale cũ. Mọi thay đổi chung một mã thao tác hàng loạt. |
| **Exception Flow** | 2a. Có bản ghi người dùng không có quyền sửa → hộp cảnh báo "{n} bản ghi bạn không có quyền sửa sẽ được giữ nguyên."<br>5a. Chưa chọn người nhận hoặc không tick mục nào → nút "Chuyển giao" vô hiệu.<br>7a. Sale cũ vẫn "Đang làm việc" → toast có thêm nút "Đánh dấu đã nghỉ".<br>6a. Số đếm lúc mở hộp thoại khác lúc chạy → kết quả cuối theo job. |

## UC-7: Đánh dấu đã nghỉ / đang làm việc (S-19)

| | |
|---|---|
| **Actor** | Người dùng có quyền sửa `NhanVien` |
| **Trigger** | Chọn "Thao tác ▾ → Đánh dấu đã nghỉ" (hoặc "Đánh dấu đang làm việc"), hoặc đổi Trạng thái trong card "Thông tin sale" |
| **Pre-condition** | Đang ở trang chi tiết sale |
| **Main Flow** | 1. Hệ thống đếm bản ghi sale còn phụ trách: contact, công ty, deal đang mở, task chưa xong.<br>2. Nếu còn bản ghi: hệ thống hỏi "{Tên} còn phụ trách {a} contact, {b} công ty, {c} deal đang mở, {d} task chưa xong. Nên chuyển giao trước khi đánh dấu đã nghỉ." với ba nút "Chuyển giao trước", "Vẫn đánh dấu đã nghỉ", "Huỷ".<br>3. Nếu không còn bản ghi: hệ thống hỏi "Đánh dấu {tên} đã nghỉ?".<br>4. Người dùng xác nhận.<br>5. Hệ thống đặt Trạng thái thành "Đã nghỉ". |
| **Post-condition** | Sale biến khỏi ô chọn owner. Dòng của sale trong danh sách mờ đi, có nhãn "Đã nghỉ", không có hạng. Bản ghi vẫn thuộc sale hiện tên kèm nhãn trạng thái. Tài khoản đăng nhập không bị khoá. |
| **Exception Flow** | 2a. Chọn "Chuyển giao trước" → mở UC-6.<br>Đánh dấu đang làm việc: hộp xác nhận ngắn, đặt Trạng thái "Đang làm việc"; sale trở lại ô chọn owner và có hạng.<br>Tạm nghỉ: đặt bằng cách sửa Trạng thái ở UC-5, không hỏi gì; sale tạm nghỉ không có trong ô chọn owner nhưng vẫn giữ bản ghi. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Sale là nhân viên, không phải collection mới**<br>- Sale là bản ghi của collection `NhanVien` đang có, có `is_sales = true` ("Thuộc đội kinh doanh").<br>- `NhanVien` dùng chung cho cả ERP (có kế toán, kỹ thuật), nên cần cờ này để tách đội kinh doanh.<br>- Khi chuyển dữ liệu, script đặt `is_sales = true` cho nhân viên khớp với Sale phụ trách của deal cũ và nhân viên có Team hoặc Vai trò; còn lại quản trị đánh dấu tay. |
| BR-02 | **Ô chọn owner**<br>- Ô chọn Contact owner, Company owner, Sale phụ trách chỉ liệt kê nhân viên `is_sales = true` và đang làm việc.<br>- Ô chọn Người thực hiện của task liệt kê mọi nhân viên đang làm việc, không cần `is_sales`.<br>- Sale vừa thêm hiện ngay trong các ô này. |
| BR-03 | **Tab và tìm kiếm**<br>- Sale "Tạm nghỉ", "Đã nghỉ" có trong mọi tab, dòng mờ, có nhãn trạng thái cạnh tên.<br>- Tab đang chọn ghi vào URL (`view=all`, `me` hoặc tên team).<br>- Ô tìm lọc theo Họ và tên, Email, Team; gửi sau khi ngừng gõ 300 ms; máy chủ so khớp không phân biệt hoa thường và bỏ dấu (gõ "tran" ra "Trần"). |
| BR-04 | **Kỳ**<br>- Ba kỳ: Tháng này, Quý này, Năm nay, theo giờ Việt Nam.<br>- Chỉ tiêu kỳ = chỉ tiêu tháng × số tháng của kỳ (1, 3, 12). Chưa đặt chỉ tiêu tháng thì không có chỉ tiêu kỳ.<br>- Chỉ tiêu kỳ không trừ phần tháng trước ngày vào làm (xem câu hỏi Q3). |
| BR-05 | **Chỉ số tính ở máy chủ**<br>- Mọi chỉ số tính theo owner hiện tại của bản ghi, công thức ở Phụ lục A.<br>- Doanh số thắng, số deal thắng, thua, tỷ lệ thắng tính theo ngày đóng (`closed_at`) trong kỳ.<br>- Số contact, công ty, deal đang mở, pipeline, dự báo không theo kỳ.<br>- Hoạt động 30 ngày luôn tính 29 ngày trước tới hết hôm nay; chỉ đếm ghi chú, cuộc gọi, cuộc họp đã diễn ra.<br>- Task quá hạn là task chưa xong đã qua giờ hạn (tính theo giờ, không theo ngày).<br>- Số liệu chỉ tính trên bản ghi người xem đọc được (xem câu hỏi Q1). |
| BR-06 | **Dải KPI tổng**<br>- Tính trên các sale đang hiện sau khi lọc tab và ô tìm.<br>- Thẻ "Đạt chỉ tiêu" = tổng doanh số thắng ÷ tổng chỉ tiêu kỳ, cả tử số và mẫu số chỉ lấy sale có chỉ tiêu. Không ai có chỉ tiêu thì hiện "—".<br>- Thẻ "Task quá hạn" đổi sang kiểu cảnh báo khi lớn hơn 0.<br>- Số tiền dạng rút gọn ("1,2 tỷ ₫", "610 tr ₫"), rê chuột hiện số đầy đủ. |
| BR-07 | **Hạng**<br>- Máy chủ xếp các sale đang làm việc theo Doanh số thắng giảm dần; bằng nhau thì theo giá trị pipeline giảm dần.<br>- Hạng tính trên toàn bộ sale đang làm việc, không đổi khi lọc tab, tìm kiếm hay sắp xếp cột.<br>- Sale tạm nghỉ, đã nghỉ không có hạng ("—").<br>- Hạng 1 có huy hiệu nổi bật khi Doanh số thắng lớn hơn 0. |
| BR-08 | **Pipeline theo giai đoạn (trang chi tiết)**<br>- Bốn giai đoạn đang mở tính deal hiện đang ở giai đoạn đó.<br>- Closed Won, Closed Lost chỉ tính deal có ngày đóng trong kỳ đang chọn.<br>- Thanh dài theo tổng Amount, so với dòng lớn nhất.<br>- Bấm một dòng mở danh sách Deals lọc Sale phụ trách và giai đoạn đó (Won, Lost thêm bộ lọc ngày đóng trong kỳ). |
| BR-09 | **Việc cần làm (trang chi tiết)**<br>- Thứ tự: task quá hạn trước (hạn cũ nhất trước), rồi các mục còn lại theo hạn hoặc giờ bắt đầu tăng dần.<br>- Task đã qua giờ hạn: "Hạn {dd/mm HH:mm} · Quá hạn" màu lỗi, kể cả khi hạn là đầu giờ hôm nay.<br>- Task hạn trong hôm nay, chưa tới giờ: "Hôm nay {HH:mm}" đậm.<br>- Task hạn từ ngày mai: "Hạn {dd/mm}". Sau đó "· Ưu tiên {mức}".<br>- Cuộc họp ghi "{dd/mm HH:mm}". |
| BR-10 | **Card bản ghi sở hữu (trang chi tiết)**<br>- Thứ tự card: Deals, Companies, Contacts. Header "{Đối tượng} ({tổng})".<br>- Deals: deal đang mở trước (Ngày dự kiến chốt tăng dần), rồi deal đóng gần nhất. Dòng: "{Mã Deal} — {Tên Deal}" và "{Amount} · {giai đoạn}".<br>- Companies: tên và Lifecycle stage. Contacts: họ tên và chức danh (không có thì Lifecycle stage).<br>- "Xem tất cả" mở danh sách lọc owner là sale này. |
| BR-11 | **Đổi tên sale**<br>- Không cập nhật hàng loạt owner: owner là liên kết nên mọi nơi tự hiện tên mới.<br>- Riêng trường chữ cũ `sale_ph_tr_ch` của Deals, trong thời gian chuyển tiếp, được máy chủ đồng bộ theo tên mới (xem F03-S5, phần đổi tên ở trường văn bản cũ). |
| BR-12 | **Chuyển giao**<br>- Chuyển được bốn loại: contact, công ty, deal đang mở, task chưa xong.<br>- Deal đã đóng không đổi owner, để doanh số và tỷ lệ thắng trong quá khứ vẫn tính cho đúng người.<br>- Người nhận phải là sale đang làm việc và khác người chuyển.<br>- Bản ghi người thực hiện không có quyền sửa bị bỏ qua. |
| BR-13 | **Xoá nhân viên**<br>- Mục "Xoá" trong "Thao tác ▾" chỉ hiện khi không còn bản ghi nào trỏ tới nhân viên.<br>- Nhân viên nghỉ việc thì đánh dấu "Đã nghỉ", không xoá. |
| BR-14 | **Quyền**<br>- Xem danh sách, chi tiết: đọc được `NhanVien`.<br>- Thêm sale, sửa thông tin, đổi trạng thái: quyền tạo, sửa `NhanVien`.<br>- Xuất CSV: `record.export` trên `NhanVien`.<br>- Chuyển giao: quyền ghi trên các collection được chuyển.<br>- Xoá nhân viên: `record.delete` trên `NhanVien` và không còn bản ghi trỏ tới. |

# ACCEPTANCE CRITERIA

AC-1: Menu và header (S-01, S-04)

- Người đọc được `NhanVien` thấy "Sales" ngay sau "Deals" trên sidebar.
- Tab Tất cả có 12 sale thì header ghi "Sales", "12 sale", có nút "Xuất CSV" và "Thêm sale".

AC-2: Chỉ nhân viên kinh doanh (S-02, S-03)

- `NhanVien` có 15 người, 12 người `is_sales = true` → danh sách Sales có 12 sale.
- Ô chọn Contact owner chỉ có những người đang làm việc trong 12 người đó.
- Ô Người thực hiện của task có cả 3 người còn lại nếu họ đang làm việc.
- Vừa thêm sale "Võ Thị Hoa" đang làm việc → mở panel tạo Contact thấy "Võ Thị Hoa" trong ô Contact owner.

AC-3: Tab theo team (S-05)

- Có sale ở "Sales HCM" và "Key Account", không ai ở "Sales HN" → hàng tab là "Tất cả sales · Của tôi · Sales HCM · Key Account".
- Tài khoản chưa gắn nhân viên → không có tab "Của tôi".

AC-4: Tìm kiếm và chọn kỳ (S-06)

- Gõ "tran" ra các sale họ Trần; gõ "hcm" ra sale thuộc Team Sales HCM.
- Ngày 01/10/2026 chọn "Quý này" → cạnh nút ghi "01/10 – 31/12/2026".
- Mở danh sách trên máy khác vẫn là "Quý này".

AC-5: Dải KPI theo danh sách đang lọc (S-07)

- Tab "Sales HCM" có Minh (thắng 610 tr, chỉ tiêu 500 tr) và Lan (thắng 240 tr, chưa đặt chỉ tiêu), kỳ Tháng này.
- Doanh số thắng hiện 850 tr ₫.
- Đạt chỉ tiêu hiện 122%, dòng phụ "Chỉ tiêu kỳ: 500 tr ₫" (Lan không có chỉ tiêu nên không tính vào cả tử và mẫu).

AC-6: Bảng xếp hạng (S-08)

- Ba sale đang làm việc thắng 610 tr, 240 tr, 0 → thứ tự theo Doanh số thắng giảm dần, hạng 1 · 2 · 3, hạng 1 có huy hiệu nổi bật.
- Bấm tiêu đề "Tỷ lệ thắng" thì bảng sắp lại, hạng không đổi.
- Minh có chỉ tiêu tháng 500.000.000 ₫, chọn "Quý này" → cột Chỉ tiêu là 1,5 tỷ ₫.
- Sale chưa có deal đóng trong kỳ → Tỷ lệ thắng "—". Chỉ tiêu tháng bằng 0 hoặc trống → "Chưa đặt chỉ tiêu".

AC-7: Xuất CSV (S-09)

- Tab Sales HCM, kỳ Tháng này, ngày 01/10/2026 → tải `sales-month-01-10-2026.csv` chỉ gồm sale của Sales HCM.
- Mở bằng Excel đúng tiếng Việt.
- Không có `record.export` trên `NhanVien` → không có nút.

AC-8: Thêm sale (S-10)

- Chọn "Trần Thị Mai" (đang làm việc, chưa thuộc đội kinh doanh), Team Sales HN, bấm "Thêm" → Mai có trong danh sách Sales, không có bản ghi nhân viên mới.
- Tạo nhân viên mới tên "Minh Trần" khi đã có nhân viên đang làm việc cùng tên → báo "Đã có nhân viên đang làm việc tên “Minh Trần”", không tạo.

AC-9: Thẻ định danh và nút nhanh (S-11)

- Bấm "Deals" → mở danh sách Deals lọc Sale phụ trách là sale này.
- Bấm "Báo cáo" → mở dashboard "Tổng quan pipeline" lọc Sale phụ trách là sale này.
- Nhân viên còn bản ghi → menu "Thao tác ▾" không có mục Xoá.

AC-10: Sửa thông tin và đổi tên (S-12)

- Đổi "Minh Trần" thành "Trần Văn Minh" → toast "Đã đổi tên. Mọi bản ghi do Trần Văn Minh phụ trách hiện tên mới."; mở một contact của Minh thấy owner "Trần Văn Minh".
- Khi còn đồng bộ `sale_ph_tr_ch`, các deal của Minh có `sale_ph_tr_ch` mới.
- Bỏ tick "Thuộc đội kinh doanh" → hỏi xác nhận; lưu thì về danh sách và người đó không còn trong danh sách.
- Người chỉ đọc `NhanVien` → card chỉ đọc, không có "Thêm sale", "Chuyển giao".

AC-11: KPI hiệu suất (S-13)

- Minh có 4 deal thắng 610 tr và 2 deal thua có ngày đóng trong tháng, 9 deal đang mở tổng 1,24 tỷ, dự báo 412 tr.
- Doanh số thắng 610 tr ₫ "4 deal Closed Won".
- Tỷ lệ thắng 67% "4 thắng · 2 thua trong kỳ".
- Pipeline đang mở 1,24 tỷ ₫ "9 deal · dự báo 412 tr ₫".

AC-12: Pipeline theo giai đoạn (S-14)

- Minh có 3 deal ở "2. Discovery Call" tổng 300 tr → bấm dòng đó mở danh sách Deals lọc Sale phụ trách Minh và giai đoạn đó, có 3 deal.

AC-13: Việc cần làm (S-15)

- Minh có task hạn 25/09 17:00, task hạn 01/10 08:00, task hạn 01/10 17:00, cuộc họp 02/10 10:00; xem lúc 09:00 ngày 01/10/2026.
- Thứ tự: task 25/09 ("Quá hạn") · task 01/10 08:00 ("Quá hạn") · task 01/10 17:00 ("Hôm nay 17:00") · cuộc họp 02/10 10:00.
- Thẻ Task quá hạn ở card Hiệu suất là 2.

AC-14: Hoạt động gần đây (S-16)

- Minh có 10 hoạt động đã diễn ra và 1 cuộc họp hẹn tuần sau → card có 6 hoạt động mới nhất đã diễn ra, không có cuộc họp tuần sau.

AC-15: Card bản ghi sở hữu (S-17)

- Minh sở hữu 42 contact → header "Contacts (42)", 6 dòng và "+36 bản ghi khác".
- "Xem tất cả" mở danh sách Contacts lọc owner Minh.

AC-16: Chuyển giao (S-18)

- Minh có 42 contact, 17 company, 9 deal đang mở, 6 task chưa xong → hộp thoại hiện đúng bốn số đó.
- Chuyển cả bốn mục cho Lan Lê → sau khi job xong, Minh còn 0 contact, 0 company và chỉ còn deal đã đóng.
- Bỏ tick "Task chưa xong" → task giữ người thực hiện cũ.
- Danh sách người nhận không có chính Minh và không có người không đang làm việc.
- Toast có nút "Đánh dấu đã nghỉ".

AC-17: Đánh dấu đã nghỉ (S-19)

- Minh còn 9 deal đang mở → hộp thoại nêu số bản ghi còn phụ trách với ba nút.
- Chọn "Vẫn đánh dấu đã nghỉ" → dòng Minh mờ, nhãn "Đã nghỉ", không có hạng, không còn trong ô chọn owner.
- Đánh dấu đang làm việc cho người đã nghỉ → trở lại ô chọn owner, có hạng.

AC-18: Màn hẹp và tốc độ

- Màn 390 px: bảng cuộn ngang, cột Sale dính trái; trang chi tiết một cột.
- 30 sale, kỳ Năm nay: bảng hiện xong dưới 2 giây.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Dải KPI tổng (5 thẻ)**

| Thẻ | Giá trị | Dòng phụ |
|---|---|---|
| Doanh số thắng | Tổng `wonAmount` | "Deal Closed Won có ngày đóng trong kỳ" |
| Đạt chỉ tiêu | Theo BR-06 | "Chỉ tiêu kỳ: {tổng chỉ tiêu}" |
| Pipeline đang mở | Tổng `pipeline` | "{tổng openDeals} deal · dự báo {tổng forecast}" |
| Hoạt động 30 ngày | Tổng `activities30d` | "Ghi chú · cuộc gọi · cuộc họp" |
| Task quá hạn | Tổng `overdueTasks` | "Chưa hoàn thành, đã quá hạn" |

**Cột bảng xếp hạng**

| Cột | Ghi chú |
|---|---|
| Sale | Dính trái. Huy hiệu hạng, avatar chữ cái, họ tên, nhãn trạng thái nếu không phải Đang làm việc |
| Team · Vai trò | |
| Contacts · Companies · Deal đang mở | Số, canh phải |
| Giá trị pipeline · Dự báo (theo tỷ lệ) | Tiền rút gọn |
| Doanh số thắng | In đậm |
| Chỉ tiêu | "—" khi chưa đặt |
| % đạt chỉ tiêu | Thanh tiến độ và phần trăm. Từ 100%: màu thành công; 50–99%: cảnh báo; dưới 50%: lỗi; chưa đặt: chữ "Chưa đặt chỉ tiêu" |
| Tỷ lệ thắng | Phần trăm; "—" khi kỳ chưa có deal đóng |
| Hoạt động 30 ngày | |
| Task quá hạn | Số khác 0 hiện nhãn màu lỗi |

Footer bảng: "{n} sale" và chữ nhỏ "Chỉ tiêu kỳ = chỉ tiêu tháng × số tháng của kỳ. Bấm tên cột để sắp xếp, bấm dòng để xem chi tiết."

**Card Hiệu suất (6 thẻ, trang chi tiết)**

| Thẻ | Giá trị | Dòng phụ |
|---|---|---|
| Doanh số thắng | `wonAmount` | "{wonCount} deal Closed Won" |
| Chỉ tiêu kỳ | `quota` hoặc "—" | Thanh % đạt như bảng xếp hạng |
| Pipeline đang mở | `pipeline` | "{openDeals} deal · dự báo {forecast}" |
| Tỷ lệ thắng | `winRate` hoặc "—" | "{wonCount} thắng · {lostCount} thua trong kỳ" |
| Hoạt động 30 ngày | `activities30d` | "Ghi chú · cuộc gọi · cuộc họp" |
| Task quá hạn | `overdueTasks` | "{openTasks} task chưa xong"; kiểu cảnh báo khi lớn hơn 0 |

**Bốn nút nhanh ở thẻ định danh**

| Nút | Hành vi |
|---|---|
| Email | Mở ứng dụng thư của máy (`mailto:`) |
| Gọi | Mở `tel:` |
| Deals | Mở danh sách Deals lọc Sale phụ trách là sale này |
| Báo cáo | Mở dashboard "Tổng quan pipeline" (CRM-07) lọc Sale phụ trách là sale này |

**Form "Tạo nhân viên mới"**

| # | Ô | Ràng buộc |
|---|---|---|
| 1 | Họ và tên * | Không trùng tên nhân viên đang làm việc khác |
| 2 | Email * | Đúng định dạng, duy nhất |
| 3 | Số điện thoại | |
| 4 | Team | Danh mục D-TEAM |
| 5 | Vai trò | Danh mục D-ROLE |
| 6 | Chỉ tiêu tháng | Tiền, từ 0 trở lên, gợi ý "VD: 100000000" |
| 7 | Trạng thái | Danh mục D-WORKSTATUS, mặc định Đang làm việc |
| 8 | Ngày vào làm | Mặc định hôm nay |
| 9 | Tài khoản đăng nhập | Chọn tài khoản ERP, không bắt buộc; mỗi tài khoản gắn tối đa một nhân viên |

Chú thích dưới form: "Sale mới hiện ngay trong ô chọn Contact owner, Company owner và Sale phụ trách của Deal."

**Công thức chỉ số**

"Deal đang mở", Won, Lost theo CRM-00. Amount là `t_ng_cash_in_d_ki_n`, trống tính 0.

| Chỉ số | Công thức | Theo kỳ |
|---|---|---|
| `contacts`, `companies` | Số contact, công ty có `owner_id` là nhân viên | Không |
| `openDeals` | Số deal đang mở của nhân viên | Không |
| `pipeline` | Tổng Amount của deal đang mở | Không |
| `forecast` | Tổng (Amount × Tỷ lệ thành công ÷ 100) của deal đang mở; tỷ lệ trống tính 0 | Không |
| `wonAmount`, `wonCount` | Tổng Amount, số deal Won có `closed_at` trong kỳ | Có |
| `lostCount` | Số deal Lost có `closed_at` trong kỳ | Có |
| `winRate` | `wonCount` ÷ (`wonCount` + `lostCount`) × 100, làm tròn; trống khi mẫu bằng 0 | Có |
| `quota` | `monthly_quota` × số tháng của kỳ; trống khi chưa đặt chỉ tiêu tháng | Có |
| `quotaPct` | `wonAmount` ÷ `quota` × 100, làm tròn; trống khi `quota` trống hoặc bằng 0 | Có |
| `activities30d` | Số ghi chú, cuộc gọi, cuộc họp đã diễn ra trong 30 ngày qua do nhân viên thực hiện | Không |
| `openTasks` | Số task chưa xong có người thực hiện là nhân viên | Không |
| `overdueTasks` | Số task chưa xong đã qua giờ hạn | Không |

## B. Dữ liệu

Collection `NhanVien` (đặc tả ở CRM-00) dùng các trường: Họ và tên, Email, Số điện thoại, Tài khoản đăng nhập (`tai_khoan`), Team (`sales_team`), Vai trò (`sales_role`), Chỉ tiêu tháng (`monthly_quota`), Trạng thái (`work_status`), Ngày vào làm.

Trường thêm cho spec này:

| Key | Tên hiển thị | Kiểu | Ghi chú |
|---|---|---|---|
| `is_sales` | Thuộc đội kinh doanh | Hộp kiểm | Mặc định `false` |

Lựa chọn kỳ, tab, cột sắp xếp nhớ theo người dùng ở khoá `crm.sales.list` với giá trị `{ "period", "view", "sort" }` (F03-S4, trạng thái giao diện theo người dùng).

## C. API

| Việc | API |
|---|---|
| Chỉ số của các sale | `POST /api/v1/reports/named/sales_scorecard` (F14-S1), gửi danh sách nhân viên và kỳ; trả các chỉ số ở Phụ lục A, `rank` và mã drill |
| Xuất CSV | `POST /api/v1/reports/named/sales_scorecard/export.csv` (F14-S1) |
| Tìm sale | API danh sách `NhanVien`, lấy id khớp rồi gửi vào `sales_scorecard` |
| Việc cần làm | API danh sách `crm_activities` lọc theo người thực hiện, loại, trạng thái (API "Việc của tôi" chỉ dùng cho chính mình nên không dùng ở đây) |
| Hoạt động gần đây | Truy vấn F14-S1 trên `crm_activities` (đếm, lọc người thực hiện là sale, theo thời điểm đã diễn ra, mọi thời gian), lấy mã drill rồi gọi drill với `sort=$happenedAt:desc&limit=6` |
| Xem danh sách bản ghi của một con số | Drill của F14-S1 bằng mã `drill` trong `sales_scorecard` |
| Chuyển giao | Xem trước số lượng và thực hiện theo F03-S5, phần chuyển giao bản ghi |
| Card bản ghi sở hữu | API liên kết của F03-S1 theo trường `owner_id` |

## D. Lệch so với sheet / prototype

- S-02 không tạo collection "Sale" mới; sale là `NhanVien` có `is_sales` (BR-01).
- S-12 "đổi tên thì cập nhật owner ở mọi bản ghi": không cần, vì owner là liên kết (BR-11).
- S-06 "nhớ lựa chọn trong trình duyệt": đổi thành nhớ theo người dùng.
- S-09, S-10, S-14 → S-17, S-19 sheet ghi "Chỉ FE" nhưng cần máy chủ (xuất tệp có kiểm quyền, ghi cờ `is_sales`, đọc theo nhân viên, đếm bản ghi còn phụ trách). Đề nghị sửa cột Phạm vi thành "FE + BE".
- S-18 chuyển giao thêm task chưa xong, vì task giao cho người đã nghỉ sẽ không ai làm.
- Prototype tính doanh số theo Ngày dự kiến chốt; bản thật tính theo ngày đóng. Prototype chuyển cả deal đã đóng; bản thật giữ nguyên.

**Ngoài phạm vi:** dự báo doanh số theo phương pháp khác; chỉ tiêu khác nhau theo từng tháng; hoa hồng; quản lý team (team là danh mục).

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Ai xem được trang Sales: mọi sale hay chỉ quản lý? Nếu mọi sale, vai trò Sales có được đọc mọi Contact, Company, Deal không (để số liệu của người khác đúng)? | Khách |
| Q2 | Thêm cờ `is_sales` vào `NhanVien` có ảnh hưởng phần khác của ERP đang dùng `NhanVien` không? | BE / khách |
| Q3 | Chỉ tiêu kỳ có cần trừ phần trước ngày vào làm hoặc thời gian tạm nghỉ không? | Khách |
| Q4 | Dự báo chỉ theo Tỷ lệ thành công của từng deal đã đủ chưa, hay cần dự báo theo giai đoạn? | Khách |

## F. Tài liệu liên quan

- Prototype: `crm-sales-hubspot.html` (danh sách), `crm-sales-hubspot.html?id=s1` (chi tiết)
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Spec nền: `F14-S1-api-tong-hop-bao-cao.md`, `F03-S5-thao-tac-hang-loat.md`, `F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md`, `F03-S1-lien-ket-ban-ghi.md`
- Màn liên quan: `CRM-01-khung-danh-sach-trang-chi-tiet.md`, `CRM-07-bao-cao.md`
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (bảng dữ liệu, trang chi tiết, thẻ số liệu)
- Đối chiếu HubSpot: `DOI-CHIEU-CHUC-NANG.md` phần Sales
