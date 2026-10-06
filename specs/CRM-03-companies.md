# CRM-03 — Companies

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | CO-01 → CO-10 (màn Companies) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem danh sách Companies
  - UC-2: Mở rộng dòng và xem Board
  - UC-3: Tạo company
  - UC-4: Xem trang chi tiết company
  - UC-5: Xem tab Tổng quan
  - UC-6: Quản lý contact của công ty
  - UC-7: Quản lý deal và tệp đính kèm của công ty
  - UC-8: Xoá và khôi phục company
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (1.0 bản đầu; 1.1 sửa "tự gắn" thành "gợi ý gắn" hoạt động vào Công ty chính) | 01-10-2026 |

---

# USER STORIES

US-COMPANY-01: Là sale, tôi muốn xem danh sách công ty theo view "Tất cả companies" và "Companies của tôi" để biết mình đang phụ trách công ty nào. (CO-01)

US-COMPANY-02: Là sale, tôi muốn lọc nhanh và chọn cột của bảng Companies để tìm đúng nhóm công ty cần xem. (CO-02, CO-03)

US-COMPANY-03: Là sale, tôi muốn ghi Quốc gia/Khu vực và Lead status cho công ty để phân loại khách hàng. (CO-04)

US-COMPANY-04: Là sale, tôi muốn mở rộng một dòng hoặc chuyển sang Board để xem contact, deal và Lifecycle stage của công ty mà không rời danh sách. (CO-05)

US-COMPANY-05: Là sale, tôi muốn mở trang chi tiết công ty để xem tên, domain và các thông tin chính, sửa ngay tại chỗ. (CO-06, CO-07)

US-COMPANY-06: Là sale, tôi muốn đọc phần tóm tắt, việc sắp tới và tương tác gần đây của công ty để nắm tình hình trước khi liên hệ. (CO-08)

US-COMPANY-07: Là sale, tôi muốn xem và quản lý các contact thuộc công ty, biết ai có công ty này là công ty chính. (CO-09)

US-COMPANY-08: Là sale, tôi muốn xem, tạo, gắn và gỡ deal của công ty, và lưu tệp đính kèm ở công ty. (CO-10)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Mở màn Companies. |
| 2 | Hệ thống | Hiện header, tab view, bộ lọc nhanh và bảng công ty theo khung chung của CRM-01. |
| 3 | Người dùng | Đổi view, lọc, mở rộng dòng hoặc chuyển sang Board. |
| 4 | Người dùng | Bấm "Thêm companies ▾" để tạo công ty, kèm contact và deal liên kết nếu cần. |
| 5 | Hệ thống | Chuẩn hoá domain, kiểm tra trùng, lưu công ty và các liên kết trong một request. |
| 6 | Người dùng | Bấm tên công ty để mở trang chi tiết. |
| 7 | Hệ thống | Hiện thẻ định danh, card "Thông tin chính", tab Tổng quan, card Contacts, card Deals và card Tệp đính kèm. |
| 8 | Người dùng | Sửa thông tin tại chỗ, thêm hoặc gỡ contact, deal, tải tệp lên. |
| 9 | Hệ thống | Lưu thay đổi và cập nhật các card, timeline của công ty. |

# USE CASE DESCRIPTION

Companies dùng cùng khung với Contacts (CRM-01). Các UC dưới đây chỉ nêu phần riêng của Companies. Chỗ nào ghi "như Contacts" thì hành vi giống hệt CRM-02, chỉ thay tên đối tượng.

## UC-1: Xem danh sách Companies (CO-01, CO-02, CO-03)

| | |
|---|---|
| **Actor** | Người dùng có quyền xem Companies (quyền theo CRM-01, phần quyền) |
| **Trigger** | Mở màn Companies |
| **Pre-condition** | Collection `crm_companies` đã khởi tạo |
| **Main Flow** | 1. Hệ thống hiện header như danh sách Contacts (CRM-02, phần header), với tiêu đề "Companies ⌄" và nút "Thêm companies ▾".<br>2. Hệ thống hiện hàng tab view: "Tất cả companies", "Companies của tôi", các view người dùng tạo, và nút "+".<br>3. Hệ thống hiện bốn nút bộ lọc nhanh mặc định: Company owner, Ngày tạo, Ngày hoạt động gần nhất, Lead status.<br>4. Hệ thống hiện bảng với cột chính là tên công ty và các cột mặc định theo Phụ lục A, sắp theo Ngày tạo giảm dần.<br>5. Người dùng đổi tab view, tìm kiếm, sắp xếp, lọc nâng cao, xem trước hoặc thao tác hàng loạt. Hành vi như màn Contacts (theo CRM-01).<br>6. Người dùng bấm ⊕ để thêm bộ lọc nhanh: Ngành, Lifecycle stage, Thành phố, Quốc gia/Khu vực hoặc trường tự tạo.<br>7. Hệ thống lọc lại bảng theo lựa chọn.<br>8. Người dùng bấm tên công ty để mở trang chi tiết (UC-4). |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 2a. Không có tab "chưa có owner" (khác Contacts, xem BR-02).<br>3a. F03-S2 chưa xong → không có nút "Ngày hoạt động gần nhất", còn ba nút.<br>4a. F03-S2 chưa xong → không có cột "Ngày hoạt động gần nhất".<br>4b. Ô không có giá trị → hiện "--".<br>6a. Chọn "Quốc gia/Khu vực" hoặc "Thành phố" → popover có ô nhập và lựa chọn "Chứa" / "Bằng", không có danh sách checkbox (BR-03). |

## UC-2: Mở rộng dòng và xem Board (CO-05)

| | |
|---|---|
| **Actor** | Người dùng có quyền xem Companies |
| **Trigger** | Bấm nút mở rộng "›" trên một dòng, hoặc chuyển bảng sang chế độ Board |
| **Pre-condition** | Đang ở danh sách Companies |
| **Main Flow** | 1. Trường hợp mở rộng dòng:<br>1.1. Người dùng bấm "›" trên dòng công ty và chọn kênh "Contacts" hoặc "Deals".<br>1.2. Hệ thống hiện bảng con với các cột theo Phụ lục A.<br>2. Trường hợp Board:<br>2.1. Người dùng chuyển sang Board.<br>2.2. Hệ thống hiện 7 cột theo Lifecycle stage như Contacts, mỗi công ty một thẻ (nội dung thẻ ở BR-09).<br>2.3. Người dùng kéo thẻ sang cột khác.<br>2.4. Hệ thống đổi `lifecycle_stage` của công ty. Máy chủ ghi sự kiện vào timeline. |
| **Post-condition** | Nếu kéo thẻ: công ty có Lifecycle stage mới và timeline có sự kiện đổi giai đoạn. |
| **Exception Flow** | 2.2a. Công ty không có domain → thẻ không có dòng domain.<br>2.2b. Công ty chưa có owner → thẻ ghi "Chưa có owner". |

## UC-3: Tạo company (CO-04)

| | |
|---|---|
| **Actor** | Người dùng có quyền tạo Companies |
| **Trigger** | Bấm "Thêm companies ▾" ở header danh sách |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống mở panel tạo company với 10 trường theo Phụ lục A. Domain đứng đầu như HubSpot. Quốc gia/Khu vực điền sẵn "Việt Nam". Company owner điền sẵn nhân viên gắn với tài khoản đang đăng nhập.<br>2. Người dùng nhập Domain rồi rời ô.<br>3. Nếu Tên công ty còn trống, hệ thống gợi ý Tên công ty từ domain (BR-06). Người dùng sửa được.<br>4. Người dùng điền các trường còn lại, gồm hai trường mới Quốc gia/Khu vực và Lead status.<br>5. Ở mục "Liên kết Company với", người dùng chọn nhiều Contact và nhiều Deal nếu cần.<br>6. Người dùng bấm "Tạo".<br>7. FE đọc công ty hiện tại của các deal đã chọn.<br>8. FE gửi công ty, contact và deal trong một request.<br>9. Máy chủ chuẩn hoá domain, kiểm tra trùng và lưu. |
| **Post-condition** | Công ty mới được tạo. Contact chưa có công ty nào nhận công ty mới làm công ty chính (Primary). Deal đã chọn có `company_id` là công ty mới. |
| **Exception Flow** | 2a. Domain đã tồn tại → báo ngay dưới ô, không đợi bấm "Tạo": "Domain này đã có ở công ty {tên}", kèm link nếu người dùng xem được công ty đó.<br>6a. Tên công ty trống → nút "Tạo" vô hiệu.<br>4a. Số nhân sự âm hoặc không phải số nguyên → báo lỗi, không lưu.<br>7a. Có deal đang thuộc công ty khác → hỏi một lần cho cả nhóm: "{n} deal đang thuộc công ty khác ({danh sách}). Chuyển sang công ty mới?". Chọn "Chuyển" thì các deal đó gửi kèm `replace: true`. Chọn "Bỏ qua các deal này" thì gỡ chúng khỏi danh sách.<br>9a. Domain trùng công ty khác → máy chủ trả 409. |

## UC-4: Xem trang chi tiết company (CO-06, CO-07)

| | |
|---|---|
| **Actor** | Người dùng có quyền xem Companies |
| **Trigger** | Bấm tên công ty ở danh sách, hoặc mở trực tiếp trang chi tiết |
| **Pre-condition** | Công ty tồn tại |
| **Main Flow** | 1. Hệ thống hiện trang chi tiết theo bố cục của CRM-01.<br>2. Thẻ định danh hiện avatar ô vuông chứa chữ cái đầu của tên, tên công ty và nút ✎.<br>3. Dưới tên là dòng phụ: domain dạng link mở `https://{domain}` trong tab mới, kèm nút ↗ và ⧉.<br>4. Thẻ định danh có sáu nút nhanh và menu Thao tác theo CRM-01. Mục "Tìm trên Google" tìm theo "{name} {domain}".<br>5. Người dùng bấm ✎ để mở popover một ô "Tên công ty", sửa và lưu.<br>6. Card "Thông tin chính" hiện 6 trường: Company owner, Thành phố, Lifecycle stage, Lead status, Ngành, Liên hệ gần nhất.<br>7. Người dùng bấm một giá trị để sửa tại chỗ. Riêng "Liên hệ gần nhất" là trường tính, không sửa được.<br>8. Người dùng mở menu "Thao tác" của card (các mục ở Phụ lục A). |
| **Post-condition** | Giá trị đã sửa được lưu. |
| **Exception Flow** | 3a. Công ty không có domain → không có dòng phụ.<br>5a. Tên công ty để trống → không lưu được.<br>6a. F03-S2 chưa xong → không có dòng "Liên hệ gần nhất", card còn 5 trường.<br>8a. Hai mục "Làm giàu dữ liệu bản ghi" và "Điền thuộc tính thông minh" bị khoá, ghi "Ngoài phạm vi". |

## UC-5: Xem tab Tổng quan (CO-08)

| | |
|---|---|
| **Actor** | Người dùng có quyền xem Companies |
| **Trigger** | Mở tab Tổng quan ở trang chi tiết công ty |
| **Pre-condition** | Đang ở trang chi tiết công ty |
| **Main Flow** | 1. Hệ thống hiện ở cột giữa hai mục xếp dọc, giống Contacts: "Tổng quan" (mở) và "Sức khoẻ" (thu gọn).<br>2. Người dùng bấm tiêu đề để thu gọn hoặc mở từng mục.<br>3. Trong mục "Tổng quan", card "Tóm tắt từ dữ liệu" hiện ba câu. Câu 1 riêng cho công ty, theo mẫu ở Phụ lục A. Câu 2 và câu 3 như Contacts, câu 2 tính trên deal có `company_id` là công ty này.<br>4. Card "Việc sắp tới" và card "Tương tác gần đây" hiện như Contacts, với các hoạt động gắn với công ty này.<br>5. Mục "Sức khoẻ" hiện như Contacts (CRM-02, mục Sức khoẻ). |
| **Post-condition** | Không thay đổi dữ liệu. |
| **Exception Flow** | 3a. Thiếu ngành, thành phố hoặc Lifecycle stage → bỏ cụm thiếu khỏi câu 1.<br>3b. Công ty không có contact → câu 1 ghi "chưa có contact liên kết".<br>3c. Công ty có hơn 3 contact → câu 1 liệt kê 3 người và thêm ", và {k} người khác".<br>4a. Hoạt động tạo trên một Contact chỉ hiện ở công ty khi người tạo giữ gợi ý gắn Công ty chính (BR-10). |

## UC-6: Quản lý contact của công ty (CO-09)

| | |
|---|---|
| **Actor** | Người dùng có quyền sửa Companies và Contacts |
| **Trigger** | Xem card "Contacts" ở cột phải trang chi tiết công ty |
| **Pre-condition** | Đang ở trang chi tiết công ty |
| **Main Flow** | 1. Hệ thống hiện card với header "Contacts (n)", nút "+ Thêm" và nút ⚙.<br>2. Hệ thống hiện mỗi contact một thẻ: tên (link), tên Công ty chính của contact (chữ nhạt), "Email: {email}" kèm ⧉, "Số điện thoại: {phone}", tag "Contact với công ty chính" và nhãn liên kết nếu có.<br>3. Hệ thống xếp contact có công ty này là Primary lên trước, sau đó theo ngày liên kết giảm dần.<br>4. Người dùng bấm "+ Thêm":<br>4.1. "Tạo mới": mở panel tạo Contact của CRM-02, ô Company điền sẵn công ty này và khoá.<br>4.2. "Thêm có sẵn": chọn nhiều contact đã có.<br>5. Người dùng mở menu ⋯ trên một thẻ và chọn: "Đặt công ty này làm công ty chính của contact", "Sửa nhãn liên kết" hoặc "Gỡ liên kết".<br>6. Hệ thống lưu và cập nhật card. |
| **Post-condition** | Danh sách contact của công ty, công ty chính của contact hoặc nhãn liên kết được cập nhật. |
| **Exception Flow** | 2a. Công ty đang xem không phải Primary của contact → thẻ không có tag "Contact với công ty chính"; dòng chữ nhạt hiện tên công ty chính của contact đó (có thể là công ty khác).<br>2b. Có hơn 5 contact → card hiện 5 và link "Xem tất cả Contacts liên kết".<br>2c. Chưa có contact → "Chưa có contact nào thuộc công ty này." và nút "Thêm".<br>5a. Công ty này đã là Primary của contact → menu không có mục "Đặt công ty này làm công ty chính của contact". |

## UC-7: Quản lý deal và tệp đính kèm của công ty (CO-10)

| | |
|---|---|
| **Actor** | Người dùng có quyền sửa Companies và Deals |
| **Trigger** | Xem card "Deals" hoặc card Tệp đính kèm ở cột phải trang chi tiết công ty |
| **Pre-condition** | Đang ở trang chi tiết công ty |
| **Main Flow** | 1. Hệ thống hiện card Deals. Thẻ deal giống card Deals của Contact (CRM-02, card Deals) nhưng không có vai trò.<br>2. Người dùng bấm "+ Thêm" và chọn "Tạo mới".<br>2.1. Hệ thống mở panel tạo Deal (CRM-04, phần tạo deal) điền sẵn: Tên Deal "{name} - Deal mới", Company là công ty này (khoá), Contacts là contact của công ty, Sale phụ trách là owner của công ty.<br>2.2. Contact được tick sẵn tối đa 20, theo quy tắc điền sẵn của CRM-04. Người dùng bỏ tick được.<br>2.3. Người dùng bấm "Tạo".<br>3. Hoặc người dùng chọn "Thêm có sẵn" và chọn nhiều deal.<br>4. Người dùng mở menu ⋯ trên một deal, chọn "Gỡ liên kết" và xác nhận.<br>5. Hệ thống đặt `company_id` của deal về rỗng.<br>6. Người dùng tải tệp lên ở card Tệp đính kèm. Card này luôn nằm cuối cột phải và chạy theo CRM-01, phần card Tệp đính kèm. |
| **Post-condition** | Deal mới hoặc deal được thêm có `company_id` là công ty này. Deal bị gỡ vẫn tồn tại, trường Công ty trống. Tệp tải lên hiện trong card Tệp đính kèm. |
| **Exception Flow** | 2.1a. Công ty chưa có contact nào → danh sách Contacts trong panel trống, vẫn tạo được deal.<br>3a. Deal đang thuộc công ty khác → hỏi trước khi chuyển (CRM-01, phần card liên kết). |

## UC-8: Xoá và khôi phục company

| | |
|---|---|
| **Actor** | Người dùng có quyền xoá Companies |
| **Trigger** | Chọn xoá công ty từ menu Thao tác hoặc thao tác hàng loạt (theo CRM-01) |
| **Pre-condition** | Công ty tồn tại |
| **Main Flow** | 1. Hệ thống mở hộp xác nhận xoá, ghi rõ: "{n} deal đang thuộc công ty này sẽ vẫn giữ tên công ty ở trạng thái đã xoá."<br>2. Người dùng xác nhận.<br>3. Hệ thống xoá mềm công ty.<br>4. Hệ thống xoá theo các dòng nối Contact – Company và Activity – Company.<br>5. Deal có `company_id` là công ty này giữ nguyên. Trường Công ty của deal hiện "(Đã xoá) {tên}". |
| **Post-condition** | Công ty ở trạng thái đã xoá. Card Deals của công ty không còn truy cập được. Contact mất công ty Primary thì không tự chọn Primary mới. |
| **Exception Flow** | 3a. Người dùng khôi phục công ty vừa xoá → liên kết contact trở lại; trường Công ty của các deal hiện bình thường. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Dùng chung khung với Contacts**<br>- Companies dùng khung danh sách và trang chi tiết của CRM-01. Cấu hình đối tượng ở Phụ lục B.<br>- Tìm kiếm, sắp xếp, bộ lọc nâng cao, xem trước, thao tác hàng loạt chạy như màn Contacts.<br>- Menu ⋮ ở header có "Chỉnh sửa thuộc tính", mở Quản lý trường của `crm_companies`.<br>- Menu thao tác của bản ghi như Contacts (CRM-02, phần cấu hình đối tượng). |
| BR-02 | **View và tìm kiếm**<br>- Hai view có sẵn: "Tất cả companies" và "Companies của tôi". Không có view "chưa có owner", theo sheet CO-01 (xem câu hỏi Q3).<br>- Điều kiện lọc của view theo CRM-01, phần tab view.<br>- Ô tìm kiếm tìm theo `name`, `domain`, `phone`.<br>- Sắp xếp mặc định: Ngày tạo (`_createdAt`) giảm dần. Chế độ mặc định: bảng. |
| BR-03 | **Bộ lọc nhanh**<br>- Mặc định bốn nút: Company owner, Ngày tạo, Ngày hoạt động gần nhất, Lead status.<br>- Nút ⊕ thêm được: Ngành, Lifecycle stage, Thành phố, Quốc gia/Khu vực, trường tự tạo.<br>- "Quốc gia/Khu vực" và "Thành phố" là trường Văn bản nên popover có ô nhập và chọn "Chứa" / "Bằng" (CRM-01, phần bộ lọc nhanh).<br>- Lọc hai trường này theo danh sách giá trị có sẵn (checkbox) chưa làm, vì chúng không có danh mục cố định. |
| BR-04 | **Trường tính và cột ảo**<br>- `_createdAt` là trường hệ thống Ngày tạo của F03.<br>- `last_activity_at` và `last_contacted_at` cần F03-S2 (đợt 3). Khi chưa có: bộ lọc nhanh và cột "Ngày hoạt động gần nhất" ẩn, dòng "Liên hệ gần nhất" trong card "Thông tin chính" không hiện.<br>- Cột ảo "Số contact" là tổng của kênh `jn:crm_contact_companies`. Cột ảo "Số deal" là tổng của kênh `ref:deals_pipeline.company_id`.<br>- Hai cột ảo lấy bằng F03-S1, API lấy liên kết cho nhiều bản ghi một lượt. Không sắp xếp, không lọc được theo hai cột này. |
| BR-05 | **Hai trường mới và trạng thái của Company**<br>- Thêm `country` (Quốc gia/Khu vực, Văn bản) và `lead_status` (Lead status, Lựa chọn đơn, danh mục D-LEADSTATUS) vào `crm_companies`. Định nghĩa ở CRM-00, phần `crm_companies`.<br>- `crm_companies` là collection mới nên hai trường được tạo cùng lúc với collection bằng script khởi tạo, không phải sửa collection đang chạy.<br>- `country` mặc định "Việt Nam" khi tạo từ giao diện. Tạo bằng API hoặc nhập file không có mặc định.<br>- Hai trường dùng được ở cột bảng, panel xem trước, bộ lọc nhanh và "Xem tất cả thuộc tính".<br>- Lifecycle stage và Lead status của Company chỉ đổi khi người dùng đổi. Không đồng bộ với Lifecycle stage của các Contact trong công ty. |
| BR-06 | **Domain và Tên công ty**<br>- Domain được chuẩn hoá trước khi lưu theo CRM-00, phần `crm_companies` (ví dụ `https://www.abc.vn/` lưu thành `abc.vn`).<br>- Domain không được trùng công ty khác. Trùng thì máy chủ trả 409.<br>- Tên công ty bắt buộc. Nút "Tạo" vô hiệu khi Tên công ty trống.<br>- Nếu người dùng chỉ nhập Domain và để trống Tên công ty, khi rời ô Domain hệ thống gợi ý Tên công ty bằng phần trước dấu chấm đầu tiên của domain, viết hoa chữ đầu (`thienphucpharma.vn` → "Thienphucpharma"). Người dùng sửa được.<br>- Company owner chỉ chọn được nhân viên đang làm việc.<br>- Số nhân sự là số nguyên, từ 0 trở lên. |
| BR-07 | **Liên kết Contact khi tạo company**<br>- Contact chưa có công ty nào: công ty mới là Primary của contact đó (quy tắc công ty đầu tiên, CRM-00, phần bảng nối Contact – Company).<br>- Contact đã có công ty khác: không đổi Primary. |
| BR-08 | **Liên kết Deal khi tạo company**<br>- Một deal chỉ thuộc một công ty (`company_id`).<br>- Trước khi gửi, FE đọc công ty hiện tại của các deal đã chọn (F03-S1, API lấy liên kết cho nhiều bản ghi một lượt, kênh `field:company_id`).<br>- Deal đang thuộc công ty khác thì hỏi một lần cho cả nhóm. "Chuyển" gửi kèm `replace: true`; "Bỏ qua các deal này" gỡ chúng khỏi danh sách.<br>- Công ty, contact và deal ghi trong một request (F03-S1, tạo bản ghi kèm liên kết). |
| BR-09 | **Board**<br>- Cột theo `lifecycle_stage`, 7 cột như Contacts.<br>- Thẻ công ty gồm: tên dạng link; domain (biểu tượng địa cầu) nếu có; "{n} contact · {m} deal" (biểu tượng người); owner hoặc "Chưa có owner"; chân thẻ có nút "Xem trước".<br>- Kéo thẻ đổi `lifecycle_stage`. Máy chủ ghi sự kiện (F03-S3; `lifecycle_stage` có trong `timelineFields` của Companies).<br>- Số contact và số deal trên thẻ lấy bằng F03-S1, API lấy liên kết cho nhiều bản ghi một lượt, gọi chung cho các thẻ đang hiện, không gọi từng thẻ. |
| BR-10 | **Hoạt động của contact hiện ở công ty**<br>- Hoạt động tạo trên một Contact được gợi ý gắn kèm Công ty chính của Contact đó. Người tạo bỏ chọn được (quy tắc gợi ý A-03, CRM-00, phần ba bảng nối của Activities).<br>- Máy chủ không tự gắn thêm công ty lúc lưu.<br>- Nhờ vậy timeline công ty có hoạt động của người trong công ty mà không cần gộp timeline của mọi contact lúc đọc.<br>- Người tạo bỏ chọn công ty thì hoạt động đó không hiện ở công ty.<br>- Hoạt động tạo trên Contact trước khi Contact thuộc công ty này thì không hiện ở công ty.<br>- Quy tắc này thay cho ý "timeline gộp hoạt động của mọi Contact thuộc công ty" của bản kế hoạch giai đoạn 2 (xem câu hỏi Q2). |
| BR-11 | **Tóm tắt từ dữ liệu**<br>- Tiêu đề card: "Tóm tắt từ dữ liệu". Ba câu, mẫu ở Phụ lục A.<br>- Câu 1 liệt kê tối đa 3 contact: contact có công ty này là công ty chính trước, sau đó theo thời điểm liên kết mới nhất. Còn nữa thì thêm ", và {k} người khác".<br>- Thiếu dữ liệu thì bỏ cụm thiếu. Không có contact thì ghi "chưa có contact liên kết".<br>- Câu 2 như Contacts, tính trên deal có `company_id` là công ty này. Câu 3 như Contacts. |
| BR-12 | **Mục Sức khoẻ**<br>- Hiện như Contacts (CRM-02, mục Sức khoẻ).<br>- Sheet ghi CO-08 gồm cả Sức khoẻ. Nội dung AI của mục này ngoài phạm vi, như C-19. |
| BR-13 | **Card Contacts**<br>- Card của kênh `jn:crm_contact_companies`.<br>- Tag "Contact với công ty chính" chỉ hiện khi công ty đang xem là Primary của contact.<br>- Dòng chữ nhạt là tên Công ty chính của contact, có thể khác công ty đang xem.<br>- Nhãn liên kết lấy từ danh mục D-LABEL-CC.<br>- Thứ tự: contact có công ty này là Primary trước, sau đó theo ngày liên kết giảm dần.<br>- Card hiện tối đa 5 contact; nhiều hơn thì có "Xem tất cả Contacts liên kết".<br>- Đặt công ty này làm công ty chính của một contact thì công ty chính cũ của contact đó không còn là Primary. |
| BR-14 | **Card Deals**<br>- Card của kênh `ref:deals_pipeline.company_id`.<br>- Thẻ deal không có vai trò, vì vai trò chỉ có giữa Deal và Contact.<br>- Gỡ liên kết nghĩa là đặt `company_id` của deal về rỗng; deal vẫn còn.<br>- Tạo deal từ công ty: tên mặc định "{name} - Deal mới", Company khoá, contact của công ty tick sẵn tối đa 20 và bỏ tick được, Sale phụ trách là owner của công ty.<br>- Thêm deal có sẵn đang thuộc công ty khác thì hỏi trước khi chuyển. |
| BR-15 | **Xoá company và quyền**<br>- Xoá company là xoá mềm.<br>- Dòng nối Contact – Company và Activity – Company bị xoá theo. Contact mất công ty Primary thì không tự chọn Primary mới (CRM-00, phần bảng nối Contact – Company).<br>- Deal có `company_id` là công ty này giữ nguyên; trường công ty hiện "(Đã xoá) {tên}" (CRM-00, quan hệ R5 Company → Deal). Card Deals của công ty không còn truy cập được vì công ty đã xoá.<br>- Khôi phục công ty thì liên kết trở lại bình thường.<br>- Quyền trên màn Companies theo CRM-01, phần quyền. |

# ACCEPTANCE CRITERIA

AC-1: Danh sách và view (CO-01)

- Người dùng gắn với nhân viên Lan Lê, Lan Lê sở hữu 4 công ty.
- Tab "Tất cả companies" có mọi công ty.
- Tab "Companies của tôi" có đúng 4 công ty.
- Không có tab "chưa có owner".

AC-2: Dùng chung khung (CO-01)

- Tìm kiếm, sắp xếp, bộ lọc nâng cao, xem trước, thao tác hàng loạt trên màn Companies chạy giống màn Contacts (theo các tiêu chí nghiệm thu của CRM-01).

AC-3: Bộ lọc nhanh (CO-02)

- View "Tất cả companies" chưa chỉnh có đúng bốn nút: Company owner, Ngày tạo, Ngày hoạt động gần nhất, Lead status.
- Khi F03-S2 chưa xong: còn ba nút, thiếu Ngày hoạt động gần nhất.
- Bấm ⊕ → Quốc gia/Khu vực, chọn "Bằng", nhập "Việt Nam", Áp dụng → chỉ còn công ty có Quốc gia/Khu vực là "Việt Nam".

AC-4: Cột mặc định (CO-03)

- View chưa chỉnh có cột theo thứ tự: Tên công ty, Company owner, Ngày tạo, Số điện thoại, Ngày hoạt động gần nhất, Thành phố, Quốc gia/Khu vực, Ngành.
- Khi F03-S2 chưa xong: không có cột Ngày hoạt động gần nhất.

AC-5: Trường mới dùng được ở mọi nơi (CO-04)

- Tạo công ty có Quốc gia "Singapore" và Lead status "Mới".
- Hai giá trị hiện ở cột bảng và ở panel xem trước.
- Lọc được bằng bộ lọc nhanh.
- Có trong "Xem tất cả thuộc tính".
- Tạo công ty qua API không gửi `country` → `country` rỗng (mặc định chỉ áp ở giao diện).

AC-6: Tạo company (CO-04)

- Tạo công ty chỉ nhập Domain `https://www.abc.vn/` → domain lưu `abc.vn`; Tên gợi ý "Abc", sửa được.
- Nhập domain đã có rồi rời ô → báo trùng ngay dưới ô, không đợi bấm "Tạo".
- Số nhân sự nhập -5 → báo lỗi, không lưu.
- Tạo công ty kèm 2 contact, trong đó 1 contact chưa có công ty → contact chưa có công ty nhận công ty mới làm Primary; contact kia giữ Primary cũ.
- Tạo công ty kèm deal đang thuộc công ty khác → hỏi trước khi chuyển.

AC-7: Mở rộng dòng và Board (CO-05)

- Logistics Tân Cảng Xanh có 1 deal: bấm › và chọn Deals → bảng con có 1 dòng với Mã Deal, Giai đoạn, Amount, Ngày dự kiến chốt.
- Ở Board, thẻ công ty Thiên Phúc (2 contact, 1 deal) có tên, domain, "2 contact · 1 deal", owner.
- Kéo thẻ sang cột khác → Lifecycle stage đổi và timeline có sự kiện.
- Thẻ công ty không có domain → không có dòng domain.

AC-8: Thẻ định danh (CO-06)

- Công ty có domain thienphucpharma.vn: dưới tên có domain dạng link mở `https://thienphucpharma.vn` ở tab mới, có nút mở và nút sao chép.
- Không có dòng ngành, thành phố dưới domain.

AC-9: Thông tin chính (CO-07)

- Card có đúng 6 trường: Company owner, Thành phố, Lifecycle stage, Lead status, Ngành, Liên hệ gần nhất.
- Khi F03-S2 chưa xong: 5 trường.
- Menu Thao tác của card có hai mục khoá ghi "Ngoài phạm vi".

AC-10: Tab Tổng quan (CO-08)

- Cột giữa có mục "Tổng quan" (mở) và mục "Sức khoẻ" (thu gọn) xếp dọc; bấm tiêu đề thu gọn hoặc mở được từng mục.
- Thiên Phúc ngành "Y tế – Dược", TP. Hồ Chí Minh, lifecycle Opportunity, 2 contact (Hạnh – Giám đốc vận hành, Bảo – Trưởng phòng IT) → câu 1 là "Dược phẩm Thiên Phúc (ngành Y tế – Dược, TP. Hồ Chí Minh), lifecycle stage Opportunity; 2 contact liên kết: Nguyễn Thị Hạnh (Giám đốc vận hành), Trần Quốc Bảo (Trưởng phòng IT)."
- Công ty có 5 contact → câu 1 liệt kê 3 người theo thứ tự quy định, kèm ", và 2 người khác".

AC-11: Hoạt động của contact hiện ở công ty (CO-08)

- Hạnh có công ty chính Thiên Phúc.
- Tạo một ghi chú trên trang Hạnh, không bỏ chọn Thiên Phúc → ghi chú hiện trong "Tương tác gần đây" của Thiên Phúc.

AC-12: Card Contacts (CO-09)

- Thiên Phúc là Primary của Hạnh, còn Bảo có Primary là công ty khác.
- Hạnh đứng trước và có tag "Contact với công ty chính".
- Bảo không có tag này và hiện tên công ty chính của Bảo ở dòng nhạt.
- Chọn ⋯ → "Đặt công ty này làm công ty chính của contact" trên Bảo → Thiên Phúc thành Primary của Bảo; công ty chính cũ của Bảo không còn là Primary.
- Công ty có 7 contact → card hiện 5 và "Xem tất cả Contacts liên kết".

AC-13: Tạo deal từ công ty (CO-10)

- Thiên Phúc có 2 contact, owner Minh Trần.
- "+ Thêm" ở card Deals, tab Tạo mới, bỏ tick Bảo, bấm Tạo.
- Deal mới có Company Thiên Phúc, chỉ có Contact Hạnh, Sale phụ trách Minh Trần, tên mặc định "Dược phẩm Thiên Phúc - Deal mới".
- Tạo deal từ công ty chưa có contact nào → danh sách Contacts trong panel trống, vẫn tạo được.

AC-14: Gỡ deal và tệp đính kèm (CO-10)

- DEAL-013 thuộc Thiên Phúc. Chọn ⋯ → Gỡ liên kết trên DEAL-013 và xác nhận → DEAL-013 không còn trong card; DEAL-013 vẫn tồn tại và trường Công ty của nó trống.
- Tải lên một tệp ở trang chi tiết công ty → tệp hiện trong card Tệp đính kèm, theo CRM-01, phần card Tệp đính kèm.

AC-15: Xoá và khôi phục company

- Xoá công ty có 2 deal → hộp xác nhận nêu 2 deal; sau khi xoá, 2 deal hiện "(Đã xoá) {tên}" ở trường Công ty.
- Khôi phục công ty vừa xoá → liên kết contact trở lại; trường Công ty của 2 deal hiện bình thường.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Cột bảng danh sách**

Cột chính: ô vuông chữ cái, `name` dạng link, nút mở rộng, nút "Xem trước".

| Cột | Hiển thị |
|---|---|
| Company owner | Như Contact owner ở CRM-02, phần cột bảng |
| Ngày tạo | `dd/mm/yyyy HH:mm` |
| Số điện thoại | Chữ thường |
| Ngày hoạt động gần nhất | `dd/mm/yyyy HH:mm` |
| Thành phố | Chữ thường |
| Quốc gia/Khu vực | Chữ thường |
| Ngành | Pill màu |

Ô trống hiện "--". Cột thêm được: Domain, Lifecycle stage, Lead status, Số nhân sự, Số contact, Số deal, trường tự tạo.

**Bảng con khi mở rộng dòng**

| Kênh | Cột của bảng con |
|---|---|
| Contacts | Tên (link) · Email · Chức danh · tag "Công ty chính" nếu công ty này là Primary của contact |
| Deals | Mã Deal (link) kèm Tên Deal nhạt · Giai đoạn (pill) · Amount · Ngày dự kiến chốt |

**Panel tạo company**

| # | Trường | Key | Kiểu ô | Mặc định | Ràng buộc |
|---|---|---|---|---|---|
| 1 | Domain | `domain` | Ô nhập | — | Chuẩn hoá trước khi lưu; không trùng công ty khác (409) |
| 2 | Tên công ty | `name` | Ô nhập | — | Bắt buộc (BR-06) |
| 3 | Company owner | `owner_id` | Chọn nhân viên | Nhân viên gắn với tài khoản đang đăng nhập | Chỉ nhân viên đang làm việc |
| 4 | Ngành | `industry` | Chọn | — | |
| 5 | Thành phố | `city` | Ô nhập | — | |
| 6 | Quốc gia/Khu vực | `country` | Ô nhập | Việt Nam | |
| 7 | Số điện thoại | `phone` | Ô nhập | — | |
| 8 | Lifecycle stage | `lifecycle_stage` | Chọn | — | |
| 9 | Lead status | `lead_status` | Chọn | — | |
| 10 | Số nhân sự | `employees` | Ô số | — | Từ 0 trở lên, số nguyên |

Mục "Liên kết Company với": Contact (chọn nhiều, có tìm) và Deal (chọn nhiều). Quy tắc ở BR-07, BR-08.

**Card "Thông tin chính"**

| Trường | Key | Sửa tại chỗ |
|---|---|---|
| Company owner | `owner_id` | Có |
| Thành phố | `city` | Có |
| Lifecycle stage | `lifecycle_stage` | Có, pill |
| Lead status | `lead_status` | Có, pill |
| Ngành | `industry` | Có, pill |
| Liên hệ gần nhất | `last_contacted_at` | Không (trường tính) |

Menu "Thao tác" của card (CRM-01, phần card thuộc tính chính): Tuỳ chỉnh thuộc tính (mở ⚙ của card Trường bổ sung, CRM-09) · Xem tất cả thuộc tính · Xem lịch sử thuộc tính · vạch ngăn · Làm giàu dữ liệu bản ghi (khoá, "Ngoài phạm vi") · Điền thuộc tính thông minh (khoá, "Ngoài phạm vi").

**Card "Tóm tắt từ dữ liệu"**

| Câu | Mẫu | Khi thiếu dữ liệu |
|---|---|---|
| 1 | "{name} (ngành {industry}, {city}), lifecycle stage {lifecycle_stage}; {n} contact liên kết: {tên kèm chức danh trong ngoặc}." Liệt kê tối đa 3 contact theo BR-11; còn nữa thì thêm ", và {k} người khác" | Bỏ cụm thiếu. Không có contact: "chưa có contact liên kết" |
| 2 | Như câu 2 của Contacts, tính trên deal có `company_id` là công ty này | Như Contacts |
| 3 | Như câu 3 của Contacts | Như Contacts |

**Câu chữ trạng thái và hộp thoại**

| Nơi | Câu chữ |
|---|---|
| Ô Domain khi trùng | "Domain này đã có ở công ty {tên}" |
| Hỏi chuyển deal khi tạo company | "{n} deal đang thuộc công ty khác ({danh sách}). Chuyển sang công ty mới?" với hai lựa chọn "Chuyển" và "Bỏ qua các deal này" |
| Card Contacts rỗng | "Chưa có contact nào thuộc công ty này." và nút "Thêm" |
| Card Contacts hơn 5 | "Xem tất cả Contacts liên kết" |
| Hộp xác nhận xoá | "{n} deal đang thuộc công ty này sẽ vẫn giữ tên công ty ở trạng thái đã xoá." |
| Trường Công ty của deal sau khi xoá công ty | "(Đã xoá) {tên}" |

## B. Dữ liệu

**Cấu hình đối tượng Companies (theo khung CRM-01)**

| Thuộc tính | Giá trị |
|---|---|
| `collection` | `crm_companies` |
| `label` | Company / Companies |
| `icon` | `domain` |
| `displayField` | `name` |
| `avatar` | `logo`: ô vuông bo góc chứa chữ cái đầu của tên. Không tải logo từ internet trong giai đoạn này |
| `views` | `all` "Tất cả companies" · `mine` "Companies của tôi" (không có view "chưa có owner", theo sheet CO-01) |
| `searchFields` | `name`, `domain`, `phone` |
| `quickFilters` | `owner_id` · `_createdAt` (Ngày tạo) · `last_activity_at` · `lead_status` |
| `quickFiltersMore` | `industry` · `lifecycle_stage` · `city` · `country` · trường tự tạo |
| `columns` | `owner_id` · `_createdAt` · `phone` · `last_activity_at` · `city` · `country` · `industry` |
| `columnsMore` | `domain` · `lifecycle_stage` · `lead_status` · `employees` · Số contact · Số deal · trường tự tạo |
| `columnOrder` | `view` |
| `defaultSort` | `_createdAt`, giảm dần |
| `expand` | `jn:crm_contact_companies` "Contacts" · `ref:deals_pipeline.company_id` "Deals" |
| `board` | Cột theo `lifecycle_stage`; thẻ theo BR-09 |
| `defaultMode` | `table` |
| `createFields` | Panel tạo company ở Phụ lục A |
| `createAssociations` | `jn:crm_contact_companies` (Contact) · `ref:deals_pipeline.company_id` (Deal) |
| `identity.subtitle` | `domain` |
| `keyProps` | "Thông tin chính" ở Phụ lục A |
| `rightCards` | `jn:crm_contact_companies` · `ref:deals_pipeline.company_id`. Card Tệp đính kèm luôn nằm cuối, do `attachmentField` bật |
| `overviewTab` | `true` |
| `actions` | Như Contacts (CRM-02, phần cấu hình đối tượng) |
| `attachmentField` | `attachments` |

**Trường thêm cho spec này (CO-04)**

| Key | Tên hiển thị | Kiểu | Ghi chú |
|---|---|---|---|
| `country` | Quốc gia/Khu vực | Văn bản | Mặc định "Việt Nam" chỉ khi tạo từ giao diện |
| `lead_status` | Lead status | Lựa chọn đơn | Danh mục D-LEADSTATUS |

Định nghĩa đầy đủ của `crm_companies` ở CRM-00. Hai trường tính `last_activity_at`, `last_contacted_at` do F03-S2 cung cấp.

## C. API

| Việc | API |
|---|---|
| Số contact, số deal (cột ảo, thẻ Board) | F03-S1, API lấy liên kết cho nhiều bản ghi một lượt, lấy tổng của kênh `jn:crm_contact_companies` và `ref:deals_pipeline.company_id` |
| Đọc công ty hiện tại của các deal đã chọn | F03-S1, API lấy liên kết cho nhiều bản ghi một lượt, kênh `field:company_id` |
| Tạo công ty kèm contact và deal | F03-S1, tạo bản ghi kèm liên kết, một request; deal chuyển công ty gửi `replace: true` |
| Ghi sự kiện đổi Lifecycle stage | F03-S3 (`lifecycle_stage` trong `timelineFields`) |
| Hoạt động, timeline, gợi ý gắn Công ty chính | F03-S6 |

Mã lỗi: 409 khi domain trùng công ty khác.

## D. Lệch so với sheet / prototype

- Thẻ định danh: prototype trước đây có thêm ngành và thành phố dưới domain. Đã bỏ để giống HubSpot (`DOI-CHIEU-CHUC-NANG.md`, phần Companies).
- Bản kế hoạch giai đoạn 2 ghi "timeline gộp hoạt động của mọi Contact thuộc công ty". Spec này thay bằng quy tắc gợi ý gắn hoạt động vào Công ty chính (BR-10, câu hỏi Q2).
- Sheet ghi CO-08 gồm cả Sức khoẻ. Nội dung AI của mục này ngoài phạm vi, như C-19.
- Sheet CO-01 chỉ ghi hai view Tất cả / Của tôi, nên không có view "chưa có owner" như Contacts (câu hỏi Q3).

Prototype giả lập khác bản thật ở các điểm:

| Trong prototype | Bản thật |
|---|---|
| Owner là tên | Liên kết tới NhanVien |
| Contact thuộc công ty qua `contact.company` | Bảng nối có Primary |
| Tạo deal từ công ty tự gắn mọi contact, không bỏ chọn được | Mọi contact được tick sẵn, bỏ tick được |
| Thiếu Tên công ty thì lấy nguyên domain làm tên, không báo | Gợi ý tên từ domain, người dùng xác nhận |
| Thẻ board đếm contact, deal ở FE trên dữ liệu đã tải | F03-S1, API lấy liên kết cho nhiều bản ghi một lượt |
| Mục Sức khoẻ có 3 card "AI · sắp ra mắt" | Như CRM-02, mục Sức khoẻ |

**Phạm vi theo sheet**

| ID | Tính năng | Ưu tiên | Phạm vi sheet |
|---|---|---|---|
| CO-01 | Danh sách Companies | P0 | Chỉ FE |
| CO-02 | Bộ lọc nhanh | P0 | Chỉ FE |
| CO-03 | Cột bảng | P0 | Chỉ FE |
| CO-04 | Trường mới cho Company | P0 | FE + BE |
| CO-05 | Mở rộng dòng và Board | P1 | Chỉ FE |
| CO-06 | Thẻ định danh | P0 | Chỉ FE |
| CO-07 | Thông tin chính | P0 | Chỉ FE |
| CO-08 | Tab Tổng quan | P2 | FE + BE |
| CO-09 | Card Contacts | P0 | Chỉ FE |
| CO-10 | Card Deals và Tệp đính kèm | P1 | Chỉ FE |

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Có cần tự lấy logo công ty theo domain (dịch vụ ngoài) không? Hiện avatar chỉ là ô vuông chữ cái. | Khách |
| Q2 | Chấp nhận thay "gộp timeline mọi contact" bằng quy tắc gợi ý gắn hoạt động vào Công ty chính (BR-10)? Ảnh hưởng timeline và tab Tổng quan của công ty. | PO / khách |
| Q3 | Có cần view "Companies chưa có owner" như Contacts không? Sheet CO-01 chỉ ghi Tất cả / Của tôi. | Khách |

## F. Tài liệu liên quan

- Prototype: `crm-companies-hubspot.html` (danh sách), `crm-record-hubspot.html?type=company&id=co13` (trang chi tiết)
- Nguồn HubSpot: portal 247428660, màn Companies, khảo sát 29/09/2026 (`DOI-CHIEU-CHUC-NANG.md`, phần Companies)
- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Màn liên quan: `CRM-02-contacts.md` (panel tạo Contact, tab Tổng quan), `CRM-04-deals.md` (panel tạo Deal), `CRM-09-truong-bo-sung.md`
- Spec nền: `F03-S1-lien-ket-ban-ghi.md`, `F03-S2-truong-tinh-rollup.md`, `F03-S3-nhat-ky-thay-doi-su-kien.md`, `F03-S6-activities-timeline.md`
