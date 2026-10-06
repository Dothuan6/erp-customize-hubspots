# CRM-09 — Trường bổ sung

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | TB-01 → TB-07 (card "Trường bổ sung") |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem card "Trường bổ sung"
  - UC-2: Sửa giá trị tại chỗ
  - UC-3: Tạo trường mới
  - UC-4: Chọn trường hiển thị bằng nút ⚙
  - UC-5: Dùng trường mới ở danh sách
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 (v1.0 ngày 30-09-2026, bản đầu) | 30-09-2026 |

---

# USER STORIES

US-FIELD-01: Là sale, tôi muốn thấy các trường bổ sung của contact, công ty, deal ngay trên trang chi tiết để đọc thông tin mà bộ trường gốc không có. (TB-01, TB-07)

US-FIELD-02: Là sale, tôi muốn sửa giá trị trường bổ sung ngay tại chỗ để không phải mở form khác. (TB-02)

US-FIELD-03: Là quản lý kinh doanh, tôi muốn tạo một trường mới (ví dụ Mã số thuế, Hạng khách hàng, Đối thủ cạnh tranh) ngay trên trang chi tiết để không phải nhờ quản trị vào Quản lý trường. (TB-03)

US-FIELD-04: Là sale, tôi muốn nhận ra trường nào do công ty tự tạo và đọc được mô tả của trường đó. (TB-04)

US-FIELD-05: Là quản lý kinh doanh, tôi muốn chọn trường nào hiện trong card "Trường bổ sung" cho mọi bản ghi cùng loại. (TB-05)

US-FIELD-06: Là sale, tôi muốn dùng trường mới làm cột và bộ lọc ở danh sách mà không cần cấu hình thêm. (TB-06)

US-FIELD-07: Là quản lý kinh doanh, tôi muốn card của Deal có sẵn các trường phí hay dùng và trường mới của Deal dùng được trong workflow, bảng và báo cáo. (TB-07)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Mở trang chi tiết một Contact, Company hoặc Deal. |
| 2 | Hệ thống | Hiện card "Trường bổ sung ({n})" ở cột trái, ngay dưới card thuộc tính chính. |
| 3 | Người dùng | Bấm một giá trị để sửa tại chỗ. |
| 4 | Hệ thống | Lưu giá trị và hiện toast "Đã lưu “{tên trường}”". |
| 5 | Người dùng | Bấm "+ Thêm", điền tên và loại trường, bấm "Tạo trường". |
| 6 | Máy chủ | Thêm trường vào collection. Trường có hiệu lực cho mọi bản ghi cùng loại. |
| 7 | Hệ thống | Hiện trường mới trong card với nhãn "Mới" và mở luôn trình sửa giá trị. |
| 8 | Người dùng | Bấm ⚙ để tick hoặc bỏ tick trường hiện trong card. |
| 9 | Hệ thống | Ghi cấu hình dùng chung và vẽ lại card cho mọi bản ghi cùng loại. |
| 10 | Người dùng | Ở danh sách, thêm trường mới làm cột hoặc bộ lọc. |

# USE CASE DESCRIPTION

## UC-1: Xem card "Trường bổ sung" (TB-01, TB-04, TB-07)

| | |
|---|---|
| **Actor** | Người dùng đọc được bản ghi |
| **Trigger** | Mở trang chi tiết Contact, Company hoặc Deal |
| **Pre-condition** | Bản ghi thuộc một trong ba đối tượng CRM: Contact, Company, Deal |
| **Main Flow** | 1. Hệ thống hiện card thứ ba ở cột trái, ngay dưới card thuộc tính chính ("Thông tin chính" hoặc "Về Deal này").<br>2. Hệ thống hiện header card: nút ▾ thu gọn, tiêu đề "Trường bổ sung ({n})", bên phải là nút "+ Thêm" và nút ⚙.<br>3. Hệ thống hiện danh sách trường theo thứ tự ở BR-02: trường ghim trước, rồi trường tuỳ chỉnh chưa bị tắt.<br>4. Trường tự tạo có nhãn "Mới" cạnh tên.<br>5. Người dùng rê chuột vào nhãn hoặc tên trường để đọc mô tả.<br>6. Người dùng bấm ▾ để thu gọn hoặc mở card. |
| **Post-condition** | Trạng thái thu gọn được nhớ theo người dùng và theo đối tượng. Không thay đổi dữ liệu bản ghi. |
| **Exception Flow** | 2a. Người dùng không có quyền sửa cấu trúc collection → không có "+ Thêm" và ⚙.<br>3a. Chưa có trường nào → biểu tượng, câu "Chưa có trường bổ sung. Tạo trường mới để lưu thêm thông tin cho mọi {contact / công ty / deal}, hoặc bấm ⚙ để ghim trường có sẵn." và nút "Tạo trường mới".<br>3b. Chưa có trường nào và người dùng không có quyền sửa cấu trúc → chỉ hiện "Chưa có trường bổ sung."<br>3c. Đang tải → skeleton 3 dòng.<br>3d. Lỗi tải cấu hình → card hiện "Không tải được Trường bổ sung." và nút "Thử lại"; các card khác vẫn hoạt động.<br>5a. Trường không có mô tả → hiện "Trường mới tạo ngày {dd/mm/yyyy} bởi {tên người tạo}".<br>1a. Collection không thuộc CRM → không có card này; trang chi tiết mặc định của ERP hiện đủ trường như hiện nay. |

## UC-2: Sửa giá trị tại chỗ (TB-02)

| | |
|---|---|
| **Actor** | Người dùng ghi được bản ghi |
| **Trigger** | Bấm vào một giá trị trong card "Trường bổ sung" |
| **Pre-condition** | Card đang mở và có ít nhất một trường |
| **Main Flow** | 1. Người dùng bấm giá trị của một trường. Giá trị trống hiện "--".<br>2. Hệ thống mở trình sửa theo loại trường (Phụ lục A).<br>3. Người dùng nhập giá trị mới.<br>4. Người dùng lưu bằng Enter hoặc bấm ra ngoài. Huỷ bằng Esc.<br>5. FE kiểm tra giá trị theo loại trường rồi gửi lên máy chủ.<br>6. Hệ thống lưu và hiện toast "Đã lưu “{tên trường}”". |
| **Post-condition** | Giá trị mới được lưu trên bản ghi đang xem. |
| **Exception Flow** | 1a. Trường tính, trường hệ thống → chỉ đọc, không có hiệu ứng rê chuột.<br>1b. Người dùng chỉ đọc được bản ghi → mọi giá trị chỉ đọc, bấm không mở trình sửa.<br>4a. Trường Văn bản dài → Enter xuống dòng, không lưu; lưu bằng Ctrl+Enter.<br>4b. Trường Hộp kiểm → bấm là đổi và lưu luôn, có toast.<br>5a. Trường Đường dẫn thiếu `http://` hoặc `https://` → FE tự thêm `https://` rồi lưu.<br>6a. Máy chủ báo lỗi (ví dụ sai định dạng đường dẫn, trùng giá trị với trường Duy nhất) → giá trị trở về cũ, hiện lỗi tiếng Việt dưới trường. |

## UC-3: Tạo trường mới (TB-03, TB-04)

| | |
|---|---|
| **Actor** | Người dùng có quyền `collection.update_schema` trên collection |
| **Trigger** | Bấm "+ Thêm" trên header card, hoặc nút "Tạo trường mới" ở trạng thái rỗng, hoặc mục "Tạo trường mới" cuối popover ⚙ |
| **Pre-condition** | Đang ở trang chi tiết Contact, Company hoặc Deal |
| **Main Flow** | 1. Hệ thống mở hộp thoại "Tạo trường mới cho {Contact / Company / Deal}" (các ô theo Phụ lục A).<br>2. Người dùng nhập Tên trường.<br>3. Người dùng chọn Loại trường trong 10 loại; mặc định là Văn bản.<br>4. Nếu chọn Lựa chọn đơn: hệ thống hiện ô "Các lựa chọn", người dùng nhập mỗi dòng một lựa chọn.<br>5. Người dùng nhập Mô tả nếu cần.<br>6. Người dùng giữ hoặc bỏ tick "Hiện ở vùng "Trường bổ sung" trên mọi {contact / công ty / deal}" (mặc định tick).<br>7. Người dùng bấm "Tạo trường", hoặc nhấn Enter trong ô Tên.<br>8. FE kiểm tra; máy chủ kiểm lại và tạo trường.<br>9. Hệ thống đóng hộp thoại, hiện toast "Đã tạo trường “{tên}”. Nhập giá trị ngay trong Trường bổ sung."<br>10. Hệ thống mở card nếu đang thu gọn, cuộn tới trường mới và mở luôn trình sửa giá trị của trường đó trên bản ghi đang xem. |
| **Post-condition** | Trường mới có hiệu lực ngay cho mọi bản ghi cùng loại; bản ghi khác có giá trị trống. Trường có nhãn "Mới". |
| **Exception Flow** | 7a. Tên trống → "Nhập tên trường".<br>7b. Trùng tên (không phân biệt hoa thường, bỏ dấu) → "Đã có trường “{tên đang có}” trên {Contact}", không tạo.<br>7c. Lựa chọn đơn chưa có lựa chọn → "Nhập ít nhất một lựa chọn".<br>7d. Lựa chọn trùng nhau → "Lựa chọn “{x}” bị lặp".<br>8a. Lỗi khác từ máy chủ → hiện câu lỗi tiếng Việt từ API.<br>8b. Mạng lỗi → hộp thoại còn, nội dung đã nhập còn, hiện lỗi.<br>Mọi lỗi hiện ở dòng báo lỗi cuối hộp thoại; con trỏ về ô có lỗi.<br>10a. Người dùng đã bỏ tick "Hiện ở vùng Trường bổ sung" → không mở card, không mở trình sửa; toast thêm "Trường không hiện ở đây; bật lại bằng ⚙."<br>7e. Người dùng bấm "Huỷ" → đóng hộp thoại, không tạo. |

## UC-4: Chọn trường hiển thị bằng nút ⚙ (TB-05)

| | |
|---|---|
| **Actor** | Người dùng có quyền `collection.update_schema` trên collection |
| **Trigger** | Bấm ⚙ trên header card |
| **Pre-condition** | Đang ở trang chi tiết Contact, Company hoặc Deal |
| **Main Flow** | 1. Hệ thống mở popover có ô "Tìm thuộc tính".<br>2. Hệ thống hiện nhóm "Trường mới / tuỳ chỉnh ({n})": mọi trường tự tạo, xếp theo ngày tạo.<br>3. Hệ thống hiện nhóm "Trường có sẵn ({n})": trường gốc, xếp theo vị trí trong collection.<br>4. Mỗi dòng gồm checkbox, tên trường (kèm nhãn "Mới" nếu có) và loại trường bằng chữ nhạt bên phải. Tick nghĩa là trường đang hiện trong card.<br>5. Cuối popover, sau vạch ngăn, có mục "Tạo trường mới" (UC-3). Riêng Deal có thêm mục "Quản lý trường dữ liệu".<br>6. Người dùng gõ vào ô tìm để lọc theo tên, bỏ dấu.<br>7. Người dùng tick hoặc bỏ tick một trường.<br>8. FE ghi ngay cấu hình lên máy chủ (theo BR-05) và vẽ lại card.<br>9. Ở lần thay đổi đầu tiên trong một lần mở popover, hệ thống hiện toast "Thay đổi áp dụng cho mọi {contact / công ty / deal}".<br>10. Người dùng nhấn Esc hoặc bấm ra ngoài để đóng popover. |
| **Post-condition** | Danh sách trường trong card thay đổi cho mọi bản ghi cùng loại và mọi người dùng. Trường bị tắt vẫn có ở "Xem tất cả thuộc tính" và ở danh sách. |
| **Exception Flow** | 2a. Chưa có trường tự tạo → nhóm hiện dòng "Chưa có".<br>5a. Bấm "Quản lý trường dữ liệu" → mở trang Quản lý trường của `Deals_Pipeline`.<br>8a. Máy chủ báo lỗi → checkbox trở về trạng thái cũ, hiện lỗi.<br>Trường không có trong popover: theo BR-04. |

## UC-5: Dùng trường mới ở danh sách (TB-06)

| | |
|---|---|
| **Actor** | Người dùng xem được danh sách Contacts, Companies hoặc Deals |
| **Trigger** | Bấm "+" cuối hàng tiêu đề bảng, mở hộp "Chỉnh sửa cột", bấm ⊕ thêm bộ lọc nhanh, mở bộ lọc nâng cao hoặc menu "Sắp xếp" |
| **Pre-condition** | Đối tượng có ít nhất một trường tuỳ chỉnh |
| **Main Flow** | 1. Người dùng bấm "+" hoặc mở hộp "Chỉnh sửa cột".<br>2. Hệ thống hiện nhóm "Trường tuỳ chỉnh" ở đầu danh sách trường chưa hiện.<br>3. Người dùng chọn một trường để thêm cột.<br>4. Người dùng bấm ⊕ để thêm bộ lọc nhanh; hệ thống cũng hiện nhóm "Trường tuỳ chỉnh" ở đầu.<br>5. Hệ thống mở popover lọc theo loại trường (Phụ lục A).<br>6. Trong bộ lọc nâng cao và menu "Sắp xếp", hệ thống liệt kê đủ trường tuỳ chỉnh. |
| **Post-condition** | Trường tuỳ chỉnh dùng được làm cột, bộ lọc và tiêu chí sắp xếp mà không cần cấu hình. |
| **Exception Flow** | 3a. Bảng Deals → cột mới đứng sau các cột có sẵn và trước cột Ngày tạo; đổi vị trí ở Quản lý trường. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Vị trí và phạm vi của card**<br>- Card "Trường bổ sung" là card thứ ba ở cột trái trang chi tiết Contact, Company, Deal, ngay dưới card thuộc tính chính.<br>- Collection không thuộc CRM không có card này.<br>- `n` trên tiêu đề là số trường đang hiện trong card.<br>- Trạng thái thu gọn nhớ theo người dùng, theo đối tượng (khoá `crm.record.{c}.cards`, mục `extraFields`; xem F03-S4, trạng thái giao diện theo người dùng). |
| BR-02 | **Trường nào hiện trong card, theo thứ tự nào**<br>- Bước 1: lấy danh sách `resolved` của F03-S4 (phần cấu hình Trường bổ sung): trường ghim trước, rồi trường tuỳ chỉnh chưa bị tắt.<br>- Bước 2: bỏ trường đã có trong card thuộc tính chính (`keyProps`) và trên thẻ định danh của đối tượng.<br>- Bước 3: bỏ trường ngừng dùng của Deal: `sale_ph_tr_ch`, `lead_id`, `test` (xem CRM-00, trường ngừng dùng của Deal).<br>- Trường tuỳ chỉnh đồng thời được ghim chỉ hiện một lần, theo vị trí ghim.<br>- Trường đang ghim bị xoá ở Quản lý trường thì card không còn trường đó, không lỗi. |
| BR-03 | **Nhãn "Mới"**<br>- Trường có `origin = custom` có nhãn "Mới" cạnh tên. Trường gốc không có nhãn.<br>- Rê chuột vào nhãn hoặc tên: hiện mô tả của trường; không có mô tả thì hiện "Trường mới tạo ngày {dd/mm/yyyy} bởi {tên người tạo}".<br>- Nhãn hiện ở: card Trường bổ sung, panel "Xem tất cả thuộc tính", popover ⚙. Không hiện ở tiêu đề cột bảng.<br>- Theo sheet, nhãn hiện vô thời hạn với mọi trường tuỳ chỉnh (xem câu hỏi Q1). |
| BR-04 | **Trường không có trong popover ⚙**<br>- Trường trên thẻ định danh và trong card thuộc tính chính.<br>- Trường hệ thống.<br>- Trường ngừng dùng của Deal.<br>- Danh sách key cụ thể theo đối tượng ở Phụ lục B. |
| BR-05 | **Tick, bỏ tick trong popover ⚙**<br>- Tick trường tuỳ chỉnh: bỏ khỏi `hidden`.<br>- Bỏ tick trường tuỳ chỉnh: bỏ khỏi `pinned` nếu đang được ghim, rồi thêm vào `hidden`.<br>- Tick trường có sẵn: thêm vào cuối `pinned`.<br>- Bỏ tick trường có sẵn: bỏ khỏi `pinned`.<br>- Mỗi lần tick gửi PUT với cả hai mảng; card vẽ lại ngay.<br>- Cấu hình dùng chung cho mọi bản ghi cùng loại, không phải cài đặt riêng của người dùng. |
| BR-06 | **Tạo trường**<br>- Có 10 loại: Văn bản, Văn bản dài, Số, Tiền tệ, Ngày, Ngày giờ, Lựa chọn đơn, Hộp kiểm, Người dùng, Đường dẫn. Không có "Lựa chọn nhiều" (xem câu hỏi Q3).<br>- Tên trường tối đa 60 ký tự. Mô tả tối đa 500 ký tự.<br>- Trùng tên được so không phân biệt hoa thường và bỏ dấu.<br>- Ô "Các lựa chọn": dòng trống bị bỏ; phải có ít nhất một lựa chọn; không được lặp.<br>- FE kiểm trước, máy chủ kiểm lại (xem F03-S4, phần tạo trường tuỳ chỉnh).<br>- Trường mới áp dụng ngay cho mọi bản ghi cùng loại; bản ghi khác có giá trị trống. |
| BR-07 | **Sửa giá trị**<br>- Lưu bằng Enter (trừ Văn bản dài) hoặc bấm ra ngoài; huỷ bằng Esc.<br>- Văn bản tối đa 255 ký tự; Văn bản dài tối đa 5.000 ký tự.<br>- Số, Tiền tệ phải là số; tiền tệ hiển thị dạng `1.240.000 ₫`.<br>- Đường dẫn phải bắt đầu bằng `http://` hoặc `https://`; thiếu thì FE tự thêm `https://`. Hiển thị dạng link mở tab mới.<br>- Trường tính, trường hệ thống chỉ đọc. |
| BR-08 | **Trường mới ở danh sách**<br>- Trường tuỳ chỉnh tự có ở nút "+", hộp "Chỉnh sửa cột", nút ⊕, bộ lọc nâng cao, menu "Sắp xếp".<br>- Ở nút "+", hộp "Chỉnh sửa cột" và nút ⊕, nhóm "Trường tuỳ chỉnh" đứng đầu danh sách trường chưa hiện.<br>- Deal dùng `columnOrder: field` (xem CRM-04, thứ tự cột của bảng Deals): trường mới nằm cuối danh sách trường, nên cột bật lên đứng sau các cột có sẵn và trước cột Ngày tạo. |
| BR-09 | **Trường bổ sung cho Deal**<br>- Trường tạo mới cho Deal (từ card, từ Quản lý trường, hoặc qua API) là trường của `Deals_Pipeline`, `origin = custom`, nên tự hiện trong card như Contact, Company.<br>- Script CRM-00 ghi cấu hình mặc định, ghim sẵn ba trường: Phí thuê trả trước (`ph_thu_tr_tr_c`), Phí khởi tạo (Setup) (`ph_kh_i_t_o_setup`), Số tiền giảm giá (`s_ti_n_gi_m_gi`).<br>- Không ghim Lead Id: `lead_id` đã ngừng dùng và được thay bằng liên kết Deal–Contact; ghim lại sẽ làm người dùng tiếp tục nhập vào trường cũ (xem câu hỏi Q4).<br>- Trường mới của Deal dùng được ngay trong workflow (danh sách trường của collection), trong bảng Deals và trong báo cáo khi CRM-07 có. |
| BR-10 | **Quyền**<br>- Xem card, xem giá trị: đọc được bản ghi.<br>- Sửa giá trị: ghi được bản ghi. Không đủ quyền thì giá trị chỉ đọc.<br>- Tạo trường: `collection.update_schema` trên collection. Không đủ quyền thì không có "+ Thêm", không có nút tạo ở trạng thái rỗng, không có mục tạo trong ⚙.<br>- Đổi trường hiển thị bằng ⚙: `collection.update_schema` (xem câu hỏi Q2). Không đủ quyền thì không có ⚙. |

# ACCEPTANCE CRITERIA

AC-1: Card hiện dưới Thông tin chính (TB-01)

- Company Thiên Phúc, collection có trường tuỳ chỉnh "Mã số thuế" và "Hạng khách hàng".
- Mở trang chi tiết: cột trái có card "Trường bổ sung (2)" ngay dưới "Thông tin chính".
- Hai trường xếp theo thứ tự ngày tạo.

AC-2: Thu gọn nhớ theo người dùng (TB-01)

- Bấm ▾ thu gọn card rồi mở một company khác: card ở company đó cũng đang thu gọn.
- Người dùng khác vẫn thấy card mở.

AC-3: Trạng thái rỗng, đang tải, lỗi (TB-01)

- Contact chưa có trường tuỳ chỉnh, chưa ghim trường nào, người dùng có quyền sửa cấu trúc: card ghi "Trường bổ sung (0)" với câu hướng dẫn và nút "Tạo trường mới".
- Người không có quyền sửa cấu trúc chỉ thấy "Chưa có trường bổ sung."
- Lỗi tải cấu hình: card hiện "Không tải được Trường bổ sung." và nút "Thử lại"; các card khác vẫn dùng được.

AC-4: Sửa tại chỗ (TB-02)

- Thiên Phúc có "Mã số thuế" trống. Bấm "--", nhập 0312345678, Enter: giá trị lưu, toast "Đã lưu “Mã số thuế”".
- Trường "Website tuyển dụng" loại Đường dẫn, nhập "thienphuc.vn/tuyen-dung": lưu thành "https://thienphuc.vn/tuyen-dung" và hiện dạng link.
- Sửa Văn bản dài, nhấn Enter: xuống dòng, không lưu; Ctrl+Enter mới lưu.
- Hộp kiểm: bấm là đổi và lưu ngay, có toast.

AC-5: Giá trị chỉ đọc (TB-02)

- Trường tính trong card: chỉ đọc, không có hiệu ứng rê chuột.
- Người chỉ đọc được bản ghi bấm vào giá trị: không mở trình sửa.

AC-6: Tạo trường và nhập ngay (TB-03, TB-04)

- Ở trang chi tiết DEAL-013, người dùng có quyền bấm "+ Thêm", nhập "Đối thủ cạnh tranh", loại Lựa chọn đơn, lựa chọn "Base.vn" và "Misa AMIS", bấm "Tạo trường".
- Toast "Đã tạo trường “Đối thủ cạnh tranh”…".
- Card có trường mới với nhãn "Mới", trình sửa đang mở trên DEAL-013.
- Các deal khác có trường này để trống.
- Nhấn Enter trong ô Tên cũng là bấm "Tạo trường".

AC-7: Kiểm tra khi tạo trường (TB-03)

- Company đã có "Mã số thuế", tạo trường "ma so thue": dòng lỗi "Đã có trường “Mã số thuế” trên Company"; không tạo.
- Tạo Lựa chọn đơn với hai dòng "A" và "A": báo "Lựa chọn “A” bị lặp".
- Mở ô Loại trường: có đúng 10 loại, không có "Lựa chọn nhiều".
- Tạo trường khi mạng lỗi: hộp thoại còn, nội dung còn, hiện lỗi.

AC-8: Tạo trường nhưng không hiện trong card (TB-03)

- Bỏ tick "Hiện ở vùng Trường bổ sung" rồi tạo: không mở trình sửa.
- Toast có thêm câu "Trường không hiện ở đây; bật lại bằng ⚙."

AC-9: Nhãn "Mới" và mô tả (TB-04)

- Trường "Mã số thuế" có mô tả "Mã số doanh nghiệp in trên hoá đơn". Rê chuột vào nhãn "Mới": hiện mô tả đó.
- Trường gốc "Ngành" không có nhãn.

AC-10: Ghim trường có sẵn áp cho mọi bản ghi (TB-05)

- Card Trường bổ sung của Company đang có 2 trường. Mở ⚙, tick "Số nhân sự" ở nhóm Trường có sẵn.
- Card có 3 trường, "Số nhân sự" đứng đầu (trường ghim đứng trước trường tuỳ chỉnh).
- Toast "Thay đổi áp dụng cho mọi công ty".
- Mở company khác cũng thấy "Số nhân sự".
- Trường tuỳ chỉnh đồng thời được ghim chỉ hiện một lần trong card, theo vị trí ghim.

AC-11: Tắt một trường tuỳ chỉnh (TB-05)

- Card đang hiện "Hạng khách hàng". Bỏ tick "Hạng khách hàng" trong ⚙: trường biến khỏi card ở mọi company.
- Trường vẫn có ở "Xem tất cả thuộc tính" và ở danh sách.
- Tick trong ⚙ khi API lỗi: checkbox trở lại trạng thái cũ, hiện lỗi.

AC-12: Nội dung popover ⚙ (TB-05)

- Ở trang chi tiết Deal, popover không có Mã Deal, Tên Deal, Giai đoạn, Ngày dự kiến chốt, Amount, Sale phụ trách (cũ), Lead Id, Test.
- Tìm "so" hiện "Số nhân sự", "Mã số thuế" (bỏ dấu).
- Mở ⚙, tick, đóng bằng bàn phím đều làm được; checkbox có nhãn là tên trường.

AC-13: Trường mới dùng được ở danh sách (TB-06)

- Contact có trường tuỳ chỉnh "Kênh liên hệ ưa thích" (Lựa chọn đơn). Ở danh sách Contacts bấm "+" và ⊕: cả hai danh sách có nhóm "Trường tuỳ chỉnh" chứa trường đó.
- Thêm bộ lọc nhanh cho trường đó: popover dạng checkbox các lựa chọn.
- Bộ lọc nhanh trường Hộp kiểm chọn "Có": danh sách chỉ còn bản ghi có giá trị Có.
- Vừa tạo trường Deal "Đối thủ cạnh tranh", mở bảng Deals và bật cột bằng "+": cột đứng sau các cột có sẵn và trước cột Ngày tạo.

AC-14: Ghim mặc định của Deal (TB-07)

- `Deals_Pipeline` sau khi chạy script CRM-00, chưa có trường tuỳ chỉnh. Mở trang chi tiết DEAL-013.
- Card Trường bổ sung có Phí thuê trả trước, Phí khởi tạo (Setup), Số tiền giảm giá.
- Không có Lead Id.

AC-15: Quyền, xoá trường, màn hẹp

- Người không có `collection.update_schema` mở trang chi tiết: không có "+ Thêm", không có ⚙.
- Xoá trường đang ghim ở Quản lý trường: card không còn trường đó, không lỗi.
- Màn 390 px: card nằm trong cột duy nhất, sau Thông tin chính.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Bảng tính năng**

| ID | Tính năng | Ưu tiên | Phạm vi sheet | Use case |
|---|---|---|---|---|
| TB-01 | Card "Trường bổ sung" | P0 | Chỉ FE | UC-1 |
| TB-02 | Sửa giá trị tại chỗ | P0 | Chỉ FE | UC-2 |
| TB-03 | Tạo trường mới | P0 | FE + BE | UC-3 |
| TB-04 | Nhãn "Mới" cho trường tự tạo | P2 | FE + BE | UC-1, UC-3 |
| TB-05 | Chọn trường hiển thị (⚙) | P1 | FE + BE | UC-4 |
| TB-06 | Trường mới dùng ở danh sách | P1 | Chỉ FE | UC-5 |
| TB-07 | Trường bổ sung cho Deal | P0 | FE + BE | UC-1 |

**Card "Trường bổ sung"**

- Style theo `DESIGN-SYSTEM-HUBSPOT.md`, dòng "Card Trường bổ sung" trong phần card trang chi tiết.
- Thân card là `PropertyList` (xem CRM-01, phần sửa thuộc tính tại chỗ, và `DESIGN-SYSTEM-HUBSPOT.md`, phần PropertyList).
- Nhãn "Mới": chữ 10/700, nền `#E3F2FD`, chữ `#0B5CAD`.

**Trình sửa theo loại trường** (trình sửa theo loại trường của ERP, `FieldValueEditor`)

| Loại | Trình sửa | Kiểm tra ở FE trước khi gửi |
|---|---|---|
| Văn bản | Ô một dòng | Tối đa 255 ký tự |
| Văn bản dài | Ô nhiều dòng, Ctrl+Enter để lưu | Tối đa 5.000 ký tự |
| Số, Tiền tệ | Ô số | Là số; tiền tệ hiển thị `1.240.000 ₫` |
| Ngày, Ngày giờ | Chọn ngày (và giờ) | — |
| Lựa chọn đơn | Popover chọn có tìm, giá trị hiện dạng pill | — |
| Hộp kiểm | Bấm là đổi và lưu luôn | — |
| Người dùng | Chọn tài khoản có tìm | — |
| Đường dẫn | Ô một dòng; hiển thị dạng link mở tab mới | Bắt đầu bằng `http://` hoặc `https://`; thiếu thì FE tự thêm `https://` |

**Hộp thoại "Tạo trường mới cho {Contact / Company / Deal}"** (modal rộng 480 px, theo `DESIGN-SYSTEM-HUBSPOT.md`, phần modal)

| # | Ô | Ghi chú |
|---|---|---|
| 1 | Tên trường * | Tối đa 60 ký tự. Chữ gợi ý theo đối tượng: "VD: Kênh liên hệ ưa thích" (Contact), "VD: Mã số thuế" (Company), "VD: Đối thủ cạnh tranh" (Deal) |
| 2 | Loại trường | 10 loại: Văn bản (mặc định) · Văn bản dài · Số · Tiền tệ · Ngày · Ngày giờ · Lựa chọn đơn · Hộp kiểm · Người dùng · Đường dẫn |
| 3 | Các lựa chọn | Chỉ hiện với Lựa chọn đơn. Ô nhiều dòng, gợi ý "Mỗi dòng một lựa chọn". Dòng trống bị bỏ |
| 4 | Mô tả | Không bắt buộc. Gợi ý "Hiện khi rê chuột vào tên trường". Tối đa 500 ký tự |
| 5 | Ô tick "Hiện ở vùng "Trường bổ sung" trên mọi {contact / công ty / deal}" | Mặc định tick |

Dòng giải thích dưới các ô:

- Contact, Company: "Trường áp dụng cho mọi {contact / công ty}; dùng được làm cột và bộ lọc ở danh sách."
- Deal: "Trường được thêm vào collection Deals_Pipeline của ERP, như khi thêm ở Quản lý trường; dùng được ở bảng, bộ lọc, báo cáo và workflow."

Nút: "Huỷ" · "Tạo trường". Enter trong ô Tên bấm "Tạo trường".

**Thông báo lỗi khi tạo trường**

| Lỗi | Thông báo |
|---|---|
| Tên trống | "Nhập tên trường" |
| Trùng tên (không phân biệt hoa thường, bỏ dấu) | "Đã có trường “{tên đang có}” trên {Contact}" |
| Lựa chọn đơn chưa có lựa chọn | "Nhập ít nhất một lựa chọn" |
| Lựa chọn trùng nhau | "Lựa chọn “{x}” bị lặp" |
| Lỗi từ máy chủ khác | Câu lỗi tiếng Việt từ API |

**Popover ⚙** (rộng 300 px, theo `DESIGN-SYSTEM-HUBSPOT.md`, phần popover)

- Ô "Tìm thuộc tính", lọc theo tên, bỏ dấu.
- Nhóm "Trường mới / tuỳ chỉnh ({n})": mọi trường `origin = custom`, xếp theo ngày tạo. Không có thì dòng "Chưa có".
- Nhóm "Trường có sẵn ({n})": trường `origin = base`, xếp theo vị trí trong collection.
- Mỗi dòng: checkbox · tên (kèm nhãn "Mới" nếu có) · loại trường chữ nhạt bên phải.
- Vạch ngăn, rồi mục "Tạo trường mới". Riêng Deal thêm mục "Quản lý trường dữ liệu".

**Bộ lọc nhanh cho các loại trường chưa có trong bảng popover của CRM-01 (phần bộ lọc nhanh)**

| Loại | Popover | Giá trị lọc |
|---|---|---|
| Hộp kiểm | Hai lựa chọn "Có" · "Không" | Một giá trị |
| Người dùng | Ô tìm + danh sách tài khoản có checkbox, mục đầu "(Trống)" | Nhiều giá trị, nối HOẶC |
| Tiền tệ | Như Số | Một điều kiện |
| Văn bản dài, Đường dẫn | Như Văn bản | Một điều kiện |

**Câu chữ trạng thái**

| Trạng thái | Câu chữ |
|---|---|
| Rỗng, có quyền sửa cấu trúc | "Chưa có trường bổ sung. Tạo trường mới để lưu thêm thông tin cho mọi {contact / công ty / deal}, hoặc bấm ⚙ để ghim trường có sẵn." + nút "Tạo trường mới" |
| Rỗng, không có quyền | "Chưa có trường bổ sung." |
| Đang tải | Skeleton 3 dòng |
| Lỗi tải cấu hình | "Không tải được Trường bổ sung." + nút "Thử lại" |
| Lưu giá trị xong | Toast "Đã lưu “{tên trường}”" |
| Tạo trường xong | Toast "Đã tạo trường “{tên}”. Nhập giá trị ngay trong Trường bổ sung." |
| Tạo trường, bỏ tick hiện trong card | Toast thêm "Trường không hiện ở đây; bật lại bằng ⚙." |
| Đổi trường hiển thị lần đầu trong một lần mở popover | Toast "Thay đổi áp dụng cho mọi {contact / công ty / deal}" |
| Trường không có mô tả, rê chuột vào nhãn hoặc tên | "Trường mới tạo ngày {dd/mm/yyyy} bởi {tên người tạo}" |

## B. Dữ liệu

**Nguồn dữ liệu của card**

| Thứ | Ở đâu |
|---|---|
| Trường tự tạo | Trường thật của collection, có cờ `origin = custom`; trường gốc có `origin = base` (xem F03-S4, cờ nguồn gốc của trường) |
| Trường ghim, trường tắt | `display_config.extraFields` dùng chung, gồm hai mảng `pinned` và `hidden` (xem F03-S4, phần cấu hình Trường bổ sung) |
| Danh sách trường của card | `resolved` do F03-S4 trả, rồi lọc tiếp theo BR-02 |
| Trạng thái thu gọn | Khoá `crm.record.{c}.cards`, mục `extraFields`, theo người dùng (xem F03-S4, trạng thái giao diện theo người dùng) |
| Trường của card thuộc tính chính | `keyProps` (xem CRM-01, bố cục trang chi tiết) |

**Trường không có trong popover ⚙, theo đối tượng**

| Đối tượng | Bỏ thêm |
|---|---|
| Contact | `email`, `first_name`, `last_name`, `full_name` |
| Company | `name`, `domain` |
| Deal | `m_deal`, `t_n_deal`, `giai_o_n_pipeline`, `ng_y_d_ki_n_ch_t`, `t_ng_cash_in_d_ki_n`, `sale_ph_tr_ch`, `lead_id`, `test` |

**Cấu hình mặc định của Deal** (do script CRM-00 ghi; xem F03-S4, phần cấu hình mặc định)

| Trường ghim sẵn | Key |
|---|---|
| Phí thuê trả trước | `ph_thu_tr_tr_c` |
| Phí khởi tạo (Setup) | `ph_kh_i_t_o_setup` |
| Số tiền giảm giá | `s_ti_n_gi_m_gi` |

Trường ngừng dùng của Deal: `sale_ph_tr_ch`, `lead_id`, `test` (xem CRM-00, trường ngừng dùng của Deal và liên kết Deal–Contact).

## C. API

Spec này không thêm API riêng; dùng API của F03-S4.

| Việc | API |
|---|---|
| Tạo trường | API sửa schema của collection (xem F03-S4, phần tạo trường tuỳ chỉnh). Máy chủ kiểm lại tên, loại, lựa chọn |
| Đọc danh sách trường của card | Cấu hình Trường bổ sung của F03-S4, trả `resolved` |
| Tick, bỏ tick trong ⚙ | PUT cấu hình Trường bổ sung, mỗi lần gửi cả hai mảng `pinned` và `hidden` |
| Nhớ trạng thái thu gọn | Trạng thái giao diện theo người dùng của F03-S4 |
| Sửa giá trị | API sửa bản ghi của ERP; lỗi trả câu tiếng Việt |

Tên hàm trong prototype để dev đối chiếu: `crm-record-hubspot.html` (`drawExtra`, `extraCfg`, `newFieldDlg`, `badgeNew`), `crm-objects.js` (`extraKeys`, `setExtra`, `addCustomField`).

## D. Lệch so với sheet / prototype

**Lệch so với sheet**

- Sheet ghi tên phân hệ là "dynamic fieds" (gõ sai). Tài liệu dùng tên "Trường bổ sung" (theo `00-PLAN-viet-spec.md`).
- Sheet TB-07 ghi ghim thêm Lead Id. Spec không ghim trường này (BR-09, câu hỏi Q4).
- Hộp tạo trường có 10 loại, không có "Lựa chọn nhiều" (câu hỏi Q3).

**Lệch so với prototype**

| Trong prototype | Bản thật |
|---|---|
| Trường tự tạo lưu trong trình duyệt (`db.cf`) | Trường thật của collection qua API sửa schema của F03-S4 |
| 11 loại, có Lựa chọn nhiều | 10 loại |
| Trường "Mới" của Deal suy ra từ danh sách key cứng | Cờ `origin` |
| Danh sách trường ghim, trường tắt lưu trong trình duyệt | `display_config.extraFields` dùng chung |
| Ai cũng tạo trường, đổi ghim được | Cần `collection.update_schema` (BR-10) |
| TB-07 có Lead Id | Không ghim Lead Id (BR-09) |
| Trạng thái thu gọn không lưu | Lưu theo người dùng (BR-01) |

**Ngoài phạm vi:** trang Quản lý trường (giữ nguyên, chỉ thêm mô tả và nhãn theo F03-S4, phần Quản lý trường); thuộc tính line item (xem CRM-06, thuộc tính line item); sắp xếp lại thứ tự trường ghim bằng kéo thả (chưa có trong sheet).

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Nhãn "Mới" hiện vô thời hạn (theo sheet) hay chỉ trong 30 ngày đầu? | PO / khách |
| Q2 | Ai được đổi trường hiển thị bằng ⚙: chỉ người quản lý trường, hay mọi người dùng? (cùng câu hỏi Q2 của F03-S4) | Khách |
| Q3 | Bỏ "Lựa chọn nhiều" khỏi hộp tạo trường (cùng câu hỏi Q3 của F03-S4). Khách có cần không? | PO |
| Q4 | Bỏ Lead Id khỏi danh sách ghim mặc định (lệch sheet TB-07). Đồng ý? | PO |
| Q5 | Sales có được tạo trường không, hay chỉ quản lý? Nếu chỉ quản lý thì sale thường không thấy "+ Thêm" | Khách |

## F. Tài liệu liên quan

- Prototype: `crm-record-hubspot.html?type=contact|company|deal&id=` (card "Trường bổ sung" ở cột trái)
- Plan: `00-PLAN-viet-spec.md`
- Spec nền: `ERPMini/features/features/F03-S4-truong-tuy-chinh-cau-hinh-hien-thi.md` (tạo trường tuỳ chỉnh, cấu hình Trường bổ sung, trạng thái giao diện)
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md` (bố cục trang chi tiết, sửa thuộc tính tại chỗ, "Xem tất cả thuộc tính", bộ lọc nhanh, bộ lọc nâng cao, sắp xếp, chỉnh sửa cột)
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md` (bộ trường gốc, trường ngừng dùng của Deal)
- Màn liên quan: `CRM-04` (bảng Deals), `CRM-06` (line item), `CRM-07-bao-cao.md`
- Design system: `DESIGN-SYSTEM-HUBSPOT.md` (card trang chi tiết, PropertyList, modal, popover)
- Đối chiếu HubSpot: `DOI-CHIEU-CHUC-NANG.md`, card thuộc tính tuỳ chỉnh ở cột trái trang chi tiết và "Create property"
