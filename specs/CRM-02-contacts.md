# CRM-02 — Contacts

# Product Requirement Document

| | | | |
|---|---|---|---|
| **Project Owner** | TTS | **Update at** | 02-10-2026 |
| **Created by** | TTS (qua Claude) | **Project** | CRM theo UX HubSpot — HarnexAI ERP |
| **Version** | 2.0 | **Features** | C-01, C-02, C-06, C-09, C-13, C-14, C-16, C-18, C-19, C-20, C-21 (màn Contacts) |

**CONTENT**

- USER STORIES
- OVERVIEW FLOW
- USE CASE DESCRIPTION
  - UC-1: Xem danh sách Contacts
  - UC-2: Xem board theo Lifecycle stage
  - UC-3: Tạo contact
  - UC-4: Xem thẻ định danh và đổi tên contact
  - UC-5: Xem và sửa Thông tin chính
  - UC-6: Xem tab Tổng quan và mục Sức khoẻ
  - UC-7: Quản lý công ty của contact
  - UC-8: Quản lý deal của contact
- BUSINESS RULE
- ACCEPTANCE CRITERIA
- PHỤ LỤC

**VERSION HISTORY**

| **Ver** | **Author** | **Description** | **Updated at** |
|---|---|---|---|
| 2.0 | TTS (qua Claude) | Viết lại theo mẫu PRD: user story, use case, business rule, acceptance criteria. Nội dung giữ như bản 1.x | 02-10-2026 |
| 1.x | TTS (qua Claude) | Các bản trước 02-10-2026 | 30-09-2026 |

---

# USER STORIES

US-CONTACT-01: Là sale, tôi muốn xem danh sách contact theo tab "Tất cả", "Của tôi", "Chưa có owner" với các cột email, số điện thoại, owner, công ty chính để tìm nhanh người cần liên hệ. (C-01, C-02, C-06)

US-CONTACT-02: Là sale, tôi muốn xem contact trên board theo Lifecycle stage và kéo thẻ sang cột khác để cập nhật giai đoạn của contact. (C-09)

US-CONTACT-03: Là sale, tôi muốn tạo contact mới kèm công ty và deal liên quan ngay trong một panel. (C-13)

US-CONTACT-04: Là sale, tôi muốn mở trang chi tiết để thấy contact là ai, làm ở đâu, email nào, và sửa nhanh các thông tin chính. (C-14, C-16)

US-CONTACT-05: Là sale, tôi muốn đọc phần tóm tắt, việc sắp tới và tương tác gần đây của contact để nắm tình hình trước khi liên hệ. (C-18)

US-CONTACT-06: Là sale, tôi muốn gắn contact với nhiều công ty và chọn một công ty chính để biết contact làm ở đâu. (C-20)

US-CONTACT-07: Là sale, tôi muốn xem các deal contact tham gia và tạo deal mới từ contact với thông tin điền sẵn. (C-21)

US-CONTACT-08: Là quản lý kinh doanh, tôi muốn bố cục trang contact giống HubSpot, kể cả chỗ dành cho mục Sức khoẻ, để đội quen cách dùng. (C-19)

# OVERVIEW FLOW

| **Bước** | **Tác nhân** | **Mô tả** |
|---|---|---|
| 1 | Người dùng | Mở màn Contacts. |
| 2 | Hệ thống | Hiện header, ba tab hệ thống và bảng contact theo khung danh sách của CRM-01. |
| 3 | Người dùng | Tìm, lọc, thêm cột, mở rộng dòng hoặc chuyển sang chế độ Board. |
| 4 | Hệ thống | Ở Board, hiện 7 cột Lifecycle stage; người dùng kéo thẻ thì hệ thống đổi Lifecycle stage và ghi sự kiện lên timeline. |
| 5 | Người dùng | Bấm "Thêm contacts" để tạo contact, có thể gắn luôn Company và Deal. |
| 6 | Hệ thống | Tạo contact, hiện toast, đưa contact mới lên đầu danh sách. |
| 7 | Người dùng | Bấm tên contact để mở trang chi tiết. |
| 8 | Hệ thống | Hiện ba cột: thẻ định danh và Thông tin chính (trái), tab Tổng quan và Hoạt động (giữa), card Companies, Deals và Tệp đính kèm (phải). |
| 9 | Người dùng | Sửa tại chỗ các trường, đổi tên, thêm hoặc gỡ công ty và deal, đặt công ty chính. |
| 10 | Hệ thống | Lưu thay đổi, ghi sự kiện lên timeline khi đổi Lifecycle stage, Lead status hoặc owner. |

# USE CASE DESCRIPTION

File này chỉ mô tả phần riêng của Contacts. Tìm, lọc, bảng, board, xem trước, thao tác hàng loạt, menu Thao tác, card liên kết và panel tạo là cơ chế dùng chung, mô tả ở CRM-01.

## UC-1: Xem danh sách Contacts (C-01, C-02, C-06)

| | |
|---|---|
| **Actor** | Người dùng đọc được collection `crm_contacts` |
| **Trigger** | Mở màn Contacts |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống hiện header theo khung danh sách của CRM-01: tiêu đề "Contacts ⌄" kèm số bản ghi, menu ⋮ và nút split "Thêm contacts ▾".<br>2. Hệ thống hiện hàng tab theo thứ tự: "Tất cả contacts", "Contacts của tôi", "Contacts chưa có owner", rồi các view người dùng tự tạo, rồi nút "+".<br>3. Hệ thống mở tab "Tất cả contacts". Nếu người dùng đã từng mở màn này, hệ thống mở lại tab người dùng đang ở lần trước.<br>4. Hệ thống hiện bảng ở chế độ bảng, cột theo Phụ lục A, sắp theo Ngày tạo giảm dần.<br>5. Người dùng tìm theo họ tên, email, số điện thoại, hoặc dùng bộ lọc nhanh (Contact owner, Ngày tạo, Ngày hoạt động gần nhất, Lead status), theo khung danh sách của CRM-01.<br>6. Người dùng bấm "+" cuối hàng tiêu đề để thêm cột (danh sách cột thêm được ở Phụ lục A).<br>7. Người dùng bấm nút mở rộng trên một dòng để xem bảng con Companies và Deals của contact đó.<br>8. Người dùng bấm tiêu đề "Contacts ⌄" để chuyển sang đối tượng khác.<br>9. Người dùng mở menu ⋮ để chọn Import, Export, Kết nối Google Sheet, Ghim vào sidebar hoặc "Chỉnh sửa thuộc tính".<br>10. Người dùng bấm tên contact để mở trang chi tiết, hoặc bấm "Xem trước". |
| **Post-condition** | Tab đang mở được lưu theo người dùng. Thứ tự cột lưu theo view. |
| **Exception Flow** | 1a. Bấm phần chữ của nút "Thêm contacts ▾" → mở panel tạo (UC-3). Bấm ▾ → hiện hai lựa chọn "Tạo mới" và "Import".<br>4a. Trường tính "Ngày hoạt động gần nhất" chưa có (BR-08) → bảng không có cột này, bộ lọc nhanh tương ứng ẩn, các cột khác giữ thứ tự.<br>4b. Ô trống → hiện "--". Contact chưa có owner → hiện "Chưa có owner" màu nhạt.<br>6a. Thêm cột "Số deal" hoặc "Công ty chính" → tiêu đề cột không có mũi tên sắp xếp (BR-07).<br>9a. Chọn "Chỉnh sửa thuộc tính" → mở Quản lý trường của `crm_contacts`. |

## UC-2: Xem board theo Lifecycle stage (C-09)

| | |
|---|---|
| **Actor** | Người dùng đọc được `crm_contacts`; kéo thẻ cần quyền sửa |
| **Trigger** | Chuyển danh sách Contacts sang chế độ Board |
| **Pre-condition** | Đang ở màn Contacts |
| **Main Flow** | 1. Hệ thống hiện 7 cột theo đúng thứ tự danh mục Lifecycle stage: Subscriber, Lead, Marketing Qualified Lead, Sales Qualified Lead, Opportunity, Customer, Evangelist.<br>2. Hệ thống hiện mỗi contact là một thẻ: tên dạng link, email, công ty chính, owner, và nút "Xem trước" ở chân thẻ.<br>3. Người dùng kéo một thẻ sang cột khác.<br>4. Hệ thống đổi `lifecycle_stage` của contact theo cột mới.<br>5. Máy chủ ghi sự kiện "Lifecycle stage: A → B" lên timeline của contact.<br>6. Hệ thống hiện toast, ví dụ "Lifecycle stage: Customer". |
| **Post-condition** | Contact có Lifecycle stage mới. Timeline có một sự kiện do người kéo thực hiện. |
| **Exception Flow** | 2a. Contact không có email hoặc không có công ty chính → thẻ không hiện dòng đó.<br>2b. Contact chưa có owner → thẻ ghi "Chưa có owner".<br>2c. Contact chưa có Lifecycle stage → không hiện trên board (theo khung board của CRM-01).<br>1a. Người dùng đổi "Cột theo" sang trường Lựa chọn đơn khác, ví dụ Lead status → board dựng cột theo danh mục của trường đó (Lead status có 8 cột). |

## UC-3: Tạo contact (C-13)

| | |
|---|---|
| **Actor** | Người dùng có quyền tạo contact |
| **Trigger** | Bấm "Thêm contacts" ở header danh sách, hoặc bấm "+ Thêm" rồi chọn tab Tạo mới ở card Contacts của một Company (CRM-03) hay một Deal (CRM-04) |
| **Pre-condition** | Không có |
| **Main Flow** | 1. Hệ thống mở panel phải "Tạo contact" theo khung panel tạo của CRM-01.<br>2. Hệ thống hiện 9 ô theo thứ tự: Email, Tên, Họ và tên đệm, Contact owner, Chức danh, Số điện thoại, Lifecycle stage, Lead status, Nguồn (chi tiết ở Phụ lục A).<br>3. Hệ thống điền sẵn: Contact owner là nhân viên gắn với tài khoản đang đăng nhập, Lifecycle stage là "Lead", Nguồn là "Nhập tay".<br>4. Người dùng nhập ít nhất một trong ba ô Email, Tên, Họ và tên đệm.<br>5. Ở mục "Liên kết Contact với", người dùng có thể chọn một Company và một Deal (kèm ô Vai trò, không bắt buộc).<br>6. Người dùng bấm "Tạo".<br>7. Máy chủ chuẩn hoá email, kiểm trùng, tạo contact và các liên kết trong một giao dịch.<br>8. Hệ thống đóng panel và hiện toast "Đã tạo contact “Nguyễn Thị Hạnh”". |
| **Post-condition** | Contact mới tồn tại. Company đã chọn là công ty Primary của contact. Tạo từ header: người dùng ở lại danh sách, contact mới hiện ở đầu. Tạo từ card: card cập nhật. |
| **Exception Flow** | 3a. Tài khoản chưa gắn nhân viên → ô Contact owner để trống.<br>4a. Cả ba ô Email, Tên, Họ và tên đệm đều trống → nút "Tạo" vô hiệu, cạnh nút ghi "Nhập email hoặc họ tên của contact".<br>4b. Email sai định dạng (ví dụ "an@cty") → báo sai định dạng, không gửi.<br>5a. Danh mục nhãn liên kết Contact – Company trống → không hiện ô nhãn liên kết của Company.<br>5b. Mở panel từ card Contacts của Company → ô Company điền sẵn và khoá.<br>5c. Mở panel từ card Contacts của Deal → ô Deal điền sẵn và khoá; ô Company điền sẵn bằng Company của Deal (nếu có) nhưng vẫn sửa được.<br>6a. Người dùng bấm "Tạo và thêm tiếp" → contact được tạo, form trống lại, các ô đã khoá giữ nguyên giá trị.<br>7a. Email trùng contact khác (lỗi 409) → không tạo; dưới ô Email báo email đã có ở contact khác, kèm link nếu người dùng xem được contact đó. |

## UC-4: Xem thẻ định danh và đổi tên contact (C-14)

| | |
|---|---|
| **Actor** | Người dùng đọc được contact; đổi tên cần quyền sửa |
| **Trigger** | Mở trang chi tiết contact |
| **Pre-condition** | Contact tồn tại |
| **Main Flow** | 1. Hệ thống hiện trang chi tiết theo bố cục trang chi tiết của CRM-01.<br>2. Ở cột trái, hệ thống hiện thẻ định danh: avatar tròn chữ cái đầu và tên (`full_name`).<br>3. Hệ thống hiện dòng phụ 1: "{job_title} tại {Công ty chính}", tên công ty là link.<br>4. Hệ thống hiện dòng phụ 2: email dạng link `mailto:`, nút ↗ (mở ứng dụng thư) và nút ⧉ (sao chép).<br>5. Hệ thống hiện sáu nút hành động nhanh và menu Thao tác theo trang chi tiết của CRM-01.<br>6. Người dùng rê chuột vào tên và bấm ✎.<br>7. Hệ thống mở popover có hai ô "Họ và tên đệm" và "Tên", nút Lưu và Huỷ.<br>8. Người dùng sửa và bấm Lưu.<br>9. Hệ thống lưu. Tên mới hiện ở tiêu đề, danh sách và các card liên kết. |
| **Post-condition** | Lịch sử thuộc tính có dòng đổi `first_name` hoặc `last_name`. |
| **Exception Flow** | 3a. Chỉ có chức danh → chỉ hiện chức danh. Chỉ có công ty chính → chỉ hiện tên công ty. Không có cả hai → không hiện dòng phụ 1.<br>4a. Không có email → không hiện dòng phụ 2.<br>4b. Bấm ⧉ → toast "Đã sao chép".<br>5a. Chọn "Tìm trên Google" trong menu Thao tác → tìm theo "{full_name} {tên Công ty chính}".<br>8a. Cả hai ô đều trống và contact không có email → nút Lưu vô hiệu. |

## UC-5: Xem và sửa Thông tin chính (C-16)

| | |
|---|---|
| **Actor** | Người dùng đọc được contact; sửa cần quyền sửa |
| **Trigger** | Bấm vào một giá trị trong card "Thông tin chính" |
| **Pre-condition** | Đang ở trang chi tiết contact |
| **Main Flow** | 1. Hệ thống hiện card "Thông tin chính" ở cột trái với 6 trường theo thứ tự: Contact owner, Số điện thoại, Thành phố, Lifecycle stage, Lead status, Liên hệ gần nhất.<br>2. Người dùng bấm vào một trong năm trường đầu và sửa tại chỗ.<br>3. Hệ thống lưu giá trị mới.<br>4. Nếu trường vừa đổi là Lifecycle stage, Lead status hoặc Contact owner: máy chủ ghi sự kiện lên timeline.<br>5. Nếu trường vừa đổi là Contact owner: máy chủ đổi người theo dõi tự động theo owner mới. |
| **Post-condition** | Giá trị mới được lưu và hiện ở mọi nơi dùng trường đó. |
| **Exception Flow** | 1a. Trường tính "Liên hệ gần nhất" chưa có (BR-08) → card chỉ có 5 trường.<br>1b. "Liên hệ gần nhất" trống → hiện "--".<br>2a. Bấm vào "Liên hệ gần nhất" → không mở ô sửa.<br>2b. Sửa Contact owner → danh sách chọn chỉ có nhân viên đang làm việc. |

## UC-6: Xem tab Tổng quan và mục Sức khoẻ (C-18, C-19)

| | |
|---|---|
| **Actor** | Người dùng đọc được contact |
| **Trigger** | Mở trang chi tiết contact (tab Tổng quan mở mặc định) |
| **Pre-condition** | Contact tồn tại |
| **Main Flow** | 1. Ở cột giữa, hệ thống hiện hai tab: "Tổng quan" (mặc định) và "Hoạt động" (CRM-05).<br>2. Tab Tổng quan có hai mục xếp dọc: "Tổng quan" và "Sức khoẻ". Bấm tiêu đề mục để thu gọn hoặc mở.<br>3. Trong mục "Tổng quan", hệ thống hiện card "Tóm tắt từ dữ liệu": ba câu dựng từ dữ liệu theo mẫu ở Phụ lục A, có nút ⧉ để sao chép.<br>4. Hệ thống hiện card "Việc sắp tới (n)": task chưa xong và cuộc họp sắp tới của contact, tối đa 5 dòng.<br>5. Hệ thống hiện card "Tương tác gần đây": ba hoạt động gần nhất đã xảy ra.<br>6. Người dùng bấm "Tạo hoạt động ▾" ở góc card Tương tác gần đây và chọn Ghi chú, Cuộc gọi, Task hoặc Cuộc họp.<br>7. Hệ thống mở cửa sổ soạn của CRM-05.<br>8. Người dùng bấm "Xem tất cả hoạt động" ở cuối card để chuyển sang tab Hoạt động.<br>9. Người dùng mở mục "Sức khoẻ".<br>10. Hệ thống hiện một dòng "Chưa có trong giai đoạn này." |
| **Post-condition** | Không thay đổi dữ liệu contact. Trạng thái thu gọn của từng mục được nhớ theo người dùng. |
| **Exception Flow** | 3a. Thiếu dữ liệu cho một câu tóm tắt → bỏ cụm thiếu hoặc dùng câu thay thế theo Phụ lục A.<br>4a. Không có việc nào → "Không có task hay cuộc họp sắp tới."<br>4b. Task quá hạn → dòng có nhãn "Quá hạn".<br>5a. Không có hoạt động nào → "Chưa có hoạt động nào trên contact này." và nút "Tạo hoạt động ▾".<br>9a. Mục "Sức khoẻ" thu gọn mặc định và không gọi API nào khi mở. |

## UC-7: Quản lý công ty của contact (C-20)

| | |
|---|---|
| **Actor** | Người dùng đọc được contact; thêm, gỡ, sửa liên kết cần quyền sửa |
| **Trigger** | Xem card "Companies" ở cột phải trang chi tiết contact |
| **Pre-condition** | Đang ở trang chi tiết contact |
| **Main Flow** | 1. Hệ thống hiện card theo khung card liên kết của CRM-01, header "Companies (n)", nút "+ Thêm" và ⚙.<br>2. Hệ thống hiện mỗi công ty là một thẻ: tên công ty dạng link, tag "Primary" nếu là công ty chính, Domain (có ↗ và ⧉), Số điện thoại, nhãn liên kết.<br>3. Người dùng bấm "+ Thêm".<br>4. Hệ thống mở panel hai tab: "Tạo mới" và "Thêm có sẵn".<br>5. Trường hợp Tạo mới: hệ thống mở panel tạo Company của CRM-03, liên kết với contact này đã điền sẵn.<br>6. Trường hợp Thêm có sẵn: người dùng chọn một hoặc nhiều công ty rồi lưu.<br>7. Hệ thống thêm liên kết và cập nhật card.<br>8. Người dùng mở menu ⋯ trên một thẻ để chọn: Đặt làm Primary hoặc Bỏ Primary, Sửa nhãn liên kết, Gỡ liên kết.<br>9. Hệ thống lưu và cập nhật card, cột Công ty chính ở danh sách và dòng phụ ở thẻ định danh. |
| **Post-condition** | Contact có danh sách công ty mới. Công ty Primary (nếu có) đứng đầu card. |
| **Exception Flow** | 1a. Chưa có công ty nào → "Chưa gắn công ty nào. Thêm công ty để biết contact này làm ở đâu." và nút "Thêm".<br>2a. Dòng chưa có nhãn liên kết → hiện link "Thêm nhãn liên kết"; link này chỉ hiện khi danh mục nhãn liên kết Contact – Company có ít nhất một giá trị.<br>6a. Contact chưa có công ty nào và người dùng chọn một công ty → công ty đó tự là Primary.<br>6b. Contact chưa có công ty nào và người dùng chọn nhiều công ty → panel hiện thêm ô "Công ty chính", mặc định là công ty chọn đầu tiên, người dùng chọn lại được trước khi lưu.<br>6c. Contact đã có công ty → công ty mới không phải Primary, trừ khi người dùng tick "Đặt làm công ty chính"; ô tick chỉ bật được khi chọn đúng một công ty.<br>7a. Thêm nhiều công ty mà một công ty bị lỗi → hệ thống dừng, giữ lại trong panel các công ty chưa gửi và báo "Đã thêm {n} công ty. Không thêm được {tên}: {lỗi từ API}".<br>8a. Gỡ công ty Primary khi contact còn công ty khác → không công ty nào có tag Primary; cột Công ty chính hiện "--". |

## UC-8: Quản lý deal của contact (C-21)

| | |
|---|---|
| **Actor** | Người dùng đọc được contact; thêm, gỡ, sửa liên kết cần quyền sửa |
| **Trigger** | Xem card "Deals" ở cột phải trang chi tiết contact |
| **Pre-condition** | Đang ở trang chi tiết contact |
| **Main Flow** | 1. Hệ thống hiện card theo khung card liên kết của CRM-01, header "Deals (n)", nút "+ Thêm" và ⚙.<br>2. Hệ thống hiện mỗi deal là một thẻ: Mã Deal dạng link, Tên Deal chữ nhạt ngay dưới, "Amount: …", "Ngày chốt: …", "Giai đoạn:" kèm pill, và vai trò dạng tag.<br>3. Hệ thống xếp thẻ theo Giai đoạn Pipeline tăng dần, cùng giai đoạn thì theo Ngày dự kiến chốt tăng dần (BR-12).<br>4. Người dùng bấm "+ Thêm".<br>5. Hệ thống mở panel hai tab: "Tạo mới" và "Thêm có sẵn".<br>6. Trường hợp Tạo mới: hệ thống mở panel tạo Deal của CRM-04 với Tên Deal, Company, Contact và Sale phụ trách điền sẵn (BR-13).<br>7. Trường hợp Thêm có sẵn: người dùng chọn nhiều deal; ô Vai trò áp cho mọi deal đã chọn.<br>8. Hệ thống thêm liên kết và cập nhật card.<br>9. Người dùng mở menu ⋯ trên một thẻ để chọn Sửa vai trò hoặc Gỡ liên kết. |
| **Post-condition** | Deal mới tạo hiện trong card Deals của contact và card Deals của công ty chính. |
| **Exception Flow** | 1a. Chưa có deal nào → "Contact này chưa tham gia deal nào." và nút "Thêm".<br>2a. Dòng chưa có vai trò → hiện link "Thêm nhãn liên kết".<br>6a. Contact không có công ty chính → Tên Deal điền sẵn là "{full_name} - Deal mới", ô Company để trống. |

# BUSINESS RULE

| **BR** | **Mô tả** |
|---|---|
| BR-01 | **Phạm vi và quyền**<br>- File chỉ mô tả cấu hình và chỗ khác của Contacts. Cơ chế dùng chung theo CRM-01.<br>- C-03, C-04, C-05, C-07, C-08, C-10, C-11, C-12, C-15, C-17, C-22 nằm trong sheet dưới phân hệ Contacts nhưng thuộc CRM-01, vì cả ba đối tượng dùng chung.<br>- Quyền theo phần quyền của CRM-01. Contacts không có quy tắc riêng. |
| BR-02 | **Định danh contact**<br>- Contact phải có ít nhất một trong ba: Email, Tên, Họ và tên đệm (theo CRM-00, phần trường của Contacts).<br>- Không ô nào bắt buộc riêng lẻ nên panel tạo không đánh dấu *.<br>- Contact chỉ có Họ và tên đệm: tên hiển thị là họ và tên đệm. Contact chỉ có email: tên hiển thị là email.<br>- Avatar là chữ cái đầu của hai từ cuối trong `full_name`, viết hoa ("Nguyễn Thị Hạnh" → "TH"). Tên một từ thì một chữ ("Hạnh" → "H"). Contact không có họ tên thì lấy chữ cái đầu của email ("an@cty.vn" → "A"). |
| BR-03 | **Email**<br>- Email được chuẩn hoá trước khi lưu và trước khi kiểm trùng: đổi sang chữ thường, bỏ khoảng trắng hai đầu.<br>- FE kiểm định dạng: có đúng một `@`, phần sau `@` có ít nhất một dấu chấm, không có khoảng trắng.<br>- Email không được trùng contact khác. Trùng thì máy chủ trả lỗi 409. |
| BR-04 | **Contact owner**<br>- Ô chọn owner chỉ liệt kê nhân viên đang làm việc.<br>- Khi tạo, owner mặc định là nhân viên gắn với tài khoản đang đăng nhập; không có thì để trống.<br>- Ở bảng, owner là nhân viên "Tạm nghỉ" hoặc "Đã nghỉ" có nhãn nhỏ bên cạnh tên.<br>- Đổi owner thì đổi người theo dõi tự động (theo F03-S3, phần người theo dõi). |
| BR-05 | **Lifecycle stage và Lead status**<br>- Hai trường này chỉ đổi khi người dùng đổi. Hệ thống không tự đổi khi tạo deal, khi deal thắng hay khi có hoạt động.<br>- HubSpot có thể tự chuyển lifecycle sang "Opportunity" khi tạo deal; ERP không làm theo.<br>- Đổi Lifecycle stage, Lead status hoặc owner sinh sự kiện trên timeline (F03-S3). `lifecycle_stage` nằm trong danh sách trường ghi timeline của Contacts.<br>- Khi kéo thẻ trên board, máy chủ ghi sự kiện, không phải FE.<br>- Trang chi tiết không có thanh bước Lifecycle (Subscriber → … → Evangelist). |
| BR-06 | **Công ty chính (Primary)**<br>- Một contact gắn được nhiều công ty, tối đa một công ty là Primary.<br>- Công ty đầu tiên gắn với contact tự là Primary (theo CRM-00, phần liên kết Contact – Company).<br>- Tag "Primary" chỉ hiện ở dòng có `is_primary`.<br>- Gỡ công ty Primary thì không công ty nào tự lên thay.<br>- Sửa nhãn liên kết không tính là thêm hay gỡ liên kết, nên lịch sử liên kết không đổi.<br>- Khi thêm nhiều công ty: API thêm liên kết (F03-S1) nhận một công ty mỗi lần gọi.<br>- FE gửi tuần tự: công ty được chọn làm Primary trước (kèm `isPrimary: true`), các công ty còn lại sau (`isPrimary: false`).<br>- Không gửi song song, để tránh hai request cùng muốn làm Primary.<br>- Có lỗi ở giữa thì dừng (UC-7, 7a). |
| BR-07 | **Hai cột không phải trường của Contacts**<br>- "Công ty chính": lấy từ dòng Primary của liên kết Contact – Company.<br>- "Số deal": lấy từ tổng số liên kết Deal – Contact.<br>- Cả hai cột không sắp xếp được và không lọc được. Lọc theo liên kết cần bộ lọc nâng cao, hiện chưa có. |
| BR-08 | **Trường tính phụ thuộc F03-S2**<br>- `last_activity_at` và `last_contacted_at` là trường tính của F03-S2 (đợt 3).<br>- Khi chưa có: bộ lọc nhanh và cột "Ngày hoạt động gần nhất" ẩn; dòng "Liên hệ gần nhất" trong card Thông tin chính không hiện.<br>- "Liên hệ gần nhất" chỉ đọc. Ghi chú không tính là liên hệ. |
| BR-09 | **Tóm tắt từ dữ liệu**<br>- Ba câu dựng theo mẫu ở Phụ lục A. Không dùng AI.<br>- Tiêu đề card là "Tóm tắt từ dữ liệu", không gắn nhãn "AI". Không có ô "Đặt câu hỏi…", không có nút đánh giá hữu ích / không hữu ích. Giữ nút ⧉ sao chép.<br>- "Deal đang mở" theo định nghĩa ở CRM-00.<br>- Câu 2 liệt kê tối đa 3 mã deal có Ngày dự kiến chốt sớm nhất; deal không có ngày chốt xếp sau.<br>- "Tương tác gần nhất" là hoạt động mới nhất đã xảy ra: Ghi chú, Cuộc gọi, Cuộc họp xét theo `occurred_at`; Task đã xong xét theo `completed_at`.<br>- Cuộc họp có kết quả "Huỷ", "Đổi lịch" hoặc "Không đến" không tính, vì không diễn ra. |
| BR-10 | **Việc sắp tới và Tương tác gần đây**<br>- Việc sắp tới gồm task chưa xong (kể cả quá hạn) và cuộc họp "sắp tới" theo định nghĩa của CRM-00 (trường `next_activity_at`), gắn với contact này.<br>- Sắp theo hạn hoặc giờ bắt đầu tăng dần, hiện tối đa 5. Số `n` ở tiêu đề là tổng số việc.<br>- Mỗi dòng: biểu tượng loại, tiêu đề, "Hạn dd/mm" (task) hoặc "dd/mm HH:mm" (họp), người thực hiện.<br>- Tương tác gần đây là ba hoạt động gần nhất đã xảy ra, không tính việc sắp tới, cùng định dạng dòng. |
| BR-11 | **Mục Sức khoẻ**<br>- HubSpot có mục "Health" gồm Cảm xúc, Thách thức, Phản hồi tích cực, sinh bằng AI từ email và cuộc gọi. ERP chưa có module AI và email nên không làm nội dung này.<br>- Giai đoạn này chỉ giữ tiêu đề mục "Sức khoẻ" dưới mục Tổng quan, thu gọn mặc định, mở ra có một dòng "Chưa có trong giai đoạn này."<br>- Giữ tiêu đề để bố cục giống HubSpot và giống trang Company (CO-08 yêu cầu hai mục xếp dọc).<br>- Nếu khách thấy dòng này gây hiểu nhầm thì ẩn hẳn (câu hỏi Q2). |
| BR-12 | **Thứ tự thẻ trong card Deals**<br>- Theo Giai đoạn Pipeline tăng dần; cùng giai đoạn thì theo Ngày dự kiến chốt tăng dần; deal không có ngày chốt xếp cuối nhóm.<br>- Won và Lost là hai giai đoạn cuối của danh mục giai đoạn (5 và 6), nên deal đã đóng tự nằm dưới deal đang mở.<br>- Đây là thứ tự riêng của card này, khác thứ tự mặc định của API danh sách liên kết (F03-S1).<br>- Nếu sau này thêm giai đoạn mở đứng sau Won/Lost trong danh mục thì phải xem lại quy tắc này. |
| BR-13 | **Điền sẵn khi tạo deal từ contact**<br>- Tên Deal: "{tên Công ty chính} - Deal mới"; không có công ty thì "{full_name} - Deal mới".<br>- Company: công ty chính của contact.<br>- Contact: contact này, vai trò để trống.<br>- Sale phụ trách: owner của contact. |
| BR-14 | **Xoá, khôi phục, nhân bản**<br>- Xoá contact là xoá mềm. Các dòng nối Contact – Company, Deal – Contact và Activity – Contact bị xoá theo (F03-S1, phần xoá liên kết theo bản ghi).<br>- Hoạt động từng gắn với contact vẫn còn trên timeline của Company và Deal.<br>- Khôi phục contact thì khôi phục các liên kết đó.<br>- Nhân bản contact theo menu Thao tác của CRM-01. |
| BR-15 | **Tạo contact kèm liên kết**<br>- Tạo contact kèm Company và Deal chạy trong một request, một giao dịch.<br>- Timeline của Deal có sự kiện "Đã liên kết với Contact …". Contacts không lan sự kiện "Đã tạo" sang bản ghi liên kết, nên Deal chỉ có dòng liên kết (F03-S3, phần lan sự kiện). |

# ACCEPTANCE CRITERIA

AC-1: Header danh sách (C-01)

- Người dùng có quyền tạo và nhập contact mở màn Contacts thấy tiêu đề "Contacts ⌄" kèm số bản ghi.
- Menu ⋮ có Import, Export, Chỉnh sửa thuộc tính.
- Nút "Thêm contacts ▾" có hai lựa chọn Tạo mới, Import.
- Bấm "Contacts ⌄" và chọn Deals thì chuyển sang màn Deals.

AC-2: Ba tab hệ thống (C-02)

- Có 3 contact chưa có owner và 5 contact của nhân viên gắn với tài khoản đang đăng nhập.
- "Contacts chưa có owner" có đúng 3 contact.
- "Contacts của tôi" có đúng 5 contact.
- "Tất cả contacts" có mọi contact.

AC-3: Cột bảng (C-06)

- View "Tất cả contacts" chưa chỉnh có cột theo thứ tự: Tên, Email, Số điện thoại, Contact owner, Công ty chính, Ngày hoạt động gần nhất, Lead status, Ngày tạo, rồi cột "+".
- Khi F03-S2 chưa xong, không có cột Ngày hoạt động gần nhất, các cột khác giữ thứ tự.
- Contact Hạnh liên kết 2 công ty, Thiên Phúc là Primary → cột Công ty chính hiện "Dược phẩm Thiên Phúc" dạng link.
- Bấm "+" và chọn "Số deal" → cột Số deal xuất hiện, hiện đúng số deal của mỗi contact, tiêu đề cột không có mũi tên sắp xếp.

AC-4: Board theo Lifecycle (C-09)

- Board có 7 cột theo đúng thứ tự Subscriber, Lead, Marketing Qualified Lead, Sales Qualified Lead, Opportunity, Customer, Evangelist.
- Mỗi thẻ có tên, email, công ty chính, owner.
- Kéo Hạnh từ cột Opportunity sang Customer → Lifecycle stage của Hạnh là Customer; timeline của Hạnh có sự kiện "Lifecycle stage: Opportunity → Customer" do người kéo thực hiện.
- Đổi "Cột theo" sang Lead status → board có 8 cột theo danh mục Lead status.

AC-5: Tạo contact (C-13)

- Nhập email hanh@thienphuc.vn, Tên "Hạnh", chọn Company "Dược phẩm Thiên Phúc", bấm Tạo → contact có Lifecycle stage "Lead", Nguồn "Nhập tay", owner là nhân viên của người tạo; Thiên Phúc là công ty Primary.
- Tạo contact chỉ có Họ và tên đệm → tạo được, tên hiển thị là họ và tên đệm.
- Tạo contact chỉ có email → tạo được, tên hiển thị là email.
- Tài khoản chưa gắn nhân viên mở panel → ô owner trống.
- Nhân viên "Đã nghỉ" không có trong danh sách chọn owner.

AC-6: Kiểm tra khi tạo contact (C-13)

- Để trống Email, Tên và Họ và tên đệm → nút Tạo vô hiệu, cạnh nút ghi "Nhập email hoặc họ tên của contact".
- Nhập email "an@cty" → báo sai định dạng, không gửi.
- Đã có contact email hanh@thienphuc.vn, tạo contact mới với "Hanh@ThienPhuc.vn" → không tạo được; dưới ô Email báo email đã có ở contact khác, kèm link nếu người dùng xem được contact đó.

AC-7: Tạo contact từ card và tạo kèm liên kết (C-13)

- Mở panel từ card Contacts của Company Thiên Phúc, nhập một contact rồi bấm "Tạo và thêm tiếp" → contact được tạo và liên kết Thiên Phúc; form trống lại, ô Company vẫn là Thiên Phúc và bị khoá.
- Tạo contact kèm Company và Deal gửi trong một request, chạy một giao dịch.
- Timeline của Deal có sự kiện "Đã liên kết với Contact …" và không có dòng "Đã tạo" của contact.

AC-8: Thẻ định danh (C-14)

- Contact có chức danh "Giám đốc vận hành", công ty chính Thiên Phúc, email hanh@thienphuc.vn → dòng phụ là "Giám đốc vận hành tại Dược phẩm Thiên Phúc" (tên công ty là link); dòng email có nút mở và nút sao chép.
- Contact không có chức danh, không có công ty → không hiện dòng phụ 1.
- Bấm ✎, sửa Tên từ "Hạnh" thành "Hằng" và lưu → tiêu đề, danh sách và card liên kết ở Deal đều hiện "Nguyễn Thị Hằng"; lịch sử thuộc tính có dòng đổi `first_name`.
- Đổi tên để trống cả họ và tên, contact không có email → nút Lưu vô hiệu.

AC-9: Thông tin chính (C-16)

- Card "Thông tin chính" có đúng 6 trường theo thứ tự Contact owner, Số điện thoại, Thành phố, Lifecycle stage, Lead status, Liên hệ gần nhất.
- F03-S2 chưa xong → card có 5 trường, thiếu Liên hệ gần nhất.
- Cột trái không có thanh bước Lifecycle.
- F03-S2 đã xong; contact có một cuộc gọi ngày 25/09 và một ghi chú ngày 28/09 → "Liên hệ gần nhất" hiện 25/09 (ghi chú không tính); bấm vào không mở ô sửa.

AC-10: Tóm tắt từ dữ liệu (C-18)

- Hạnh là Giám đốc vận hành tại Thiên Phúc, có 1 deal mở DEAL-013 giá trị 210.000.000 ₫, hoạt động gần nhất là cuộc họp "Demo ERP cho BGĐ Thiên Phúc" ngày 15/09 của Minh Trần.
- Card "Tóm tắt từ dữ liệu" có ba câu đúng mẫu ở Phụ lục A với các giá trị trên.
- Card không có nhãn "AI", không có ô đặt câu hỏi.
- Contact có 4 deal đang mở → câu 2 liệt kê 3 mã deal có ngày chốt sớm nhất, kèm ", và 1 deal khác".

AC-11: Việc sắp tới và Tương tác gần đây (C-18)

- Hạnh có 1 task chưa xong hạn 30/09 và 1 cuộc họp 02/10 → card ghi "Việc sắp tới (2)", task đứng trước cuộc họp.
- Contact mới tạo, chưa có hoạt động → card Tương tác gần đây hiện "Chưa có hoạt động nào trên contact này." và nút "Tạo hoạt động ▾".
- Thu gọn mục Tổng quan rồi tải lại trang → mục vẫn thu gọn.

AC-12: Mục Sức khoẻ (C-19)

- Mở mục Sức khoẻ chỉ thấy dòng "Chưa có trong giai đoạn này."
- Hệ thống không gọi API nào cho mục này.

AC-13: Card Companies (C-20)

- Hạnh liên kết Thiên Phúc (Primary) và Titan Bases → header ghi "Companies (2)", Thiên Phúc đứng đầu có tag Primary, mỗi thẻ có Domain (mở được, sao chép được) và Số điện thoại.
- Chọn ⋯ → Đặt làm Primary trên Titan Bases → Titan Bases có tag Primary và lên đầu; cột Công ty chính ở danh sách và dòng phụ ở thẻ định danh đổi thành Titan Bases.
- Danh mục nhãn liên kết Contact – Company có "Nhân viên"; bấm "Thêm nhãn liên kết" trên Thiên Phúc và chọn "Nhân viên" → thẻ hiện tag "Nhân viên"; lịch sử liên kết của Hạnh không đổi.
- Contact chưa có công ty nào, thêm có sẵn công ty Thiên Phúc → Thiên Phúc là Primary.
- Gỡ công ty Primary, contact còn 1 công ty → không công ty nào có tag Primary; cột Công ty chính hiện "--".

AC-14: Card Deals (C-21)

- Hạnh liên kết DEAL-013 (vai trò Người quyết định, đang mở) và DEAL-002 (đã thắng) → DEAL-013 đứng trước.
- Mỗi thẻ có Amount, Ngày chốt, Giai đoạn dạng pill; DEAL-013 có tag "Người quyết định".
- Hạnh có công ty chính Thiên Phúc, owner Minh Trần; bấm "+ Thêm", tab Tạo mới → panel tạo Deal có Tên Deal "Dược phẩm Thiên Phúc - Deal mới", Company Thiên Phúc, Contact Hạnh, Sale phụ trách Minh Trần.
- Tạo xong, deal hiện trong card Deals của Hạnh và card Deals của Thiên Phúc.

AC-15: Xoá và khôi phục contact

- Xoá contact có 2 liên kết công ty, 1 deal, 3 hoạt động → contact vào thùng rác; card Contacts ở công ty và deal không còn contact; 3 hoạt động vẫn hiện trên timeline deal.
- Khôi phục contact vừa xoá → liên kết công ty, deal trở lại.

AC-16: Màn hẹp

- Mở trang chi tiết ở 390 px → tab Tổng quan nằm dưới thẻ định danh và Thông tin chính; card Companies, Deals ở cuối.

# PHỤ LỤC

## A. Màn hình và dữ liệu hiển thị

**Danh sách tính năng**

| Mã | Tính năng | Ưu tiên | Phạm vi theo sheet | Use case |
|---|---|---|---|---|
| C-01 | Header danh sách | P0 | Chỉ FE | UC-1 |
| C-02 | Tab view | P0 | Chỉ FE | UC-1 |
| C-06 | Cột bảng | P0 | Chỉ FE | UC-1 |
| C-09 | Board theo Lifecycle | P1 | Chỉ FE | UC-2 |
| C-13 | Panel Tạo contact | P0 | Chỉ FE | UC-3 |
| C-14 | Thẻ định danh | P0 | Chỉ FE | UC-4 |
| C-16 | Thông tin chính | P0 | Chỉ FE | UC-5 |
| C-18 | Tab Tổng quan (Catch-up) | P2 | FE + BE | UC-6 |
| C-19 | Mục Sức khoẻ (AI) | P2 | Ngoài phạm vi | UC-6 |
| C-20 | Card Companies | P0 | FE + BE | UC-7 |
| C-21 | Card Deals | P0 | Chỉ FE | UC-8 |

**Header danh sách**

- Tiêu đề "Contacts ⌄" mở menu chuyển đối tượng (theo CRM-01).
- Menu ⋮: Import · Export · Kết nối Google Sheet · Ghim vào sidebar · Chỉnh sửa thuộc tính (mở Quản lý trường của `crm_contacts`).
- Nút split "Thêm contacts ▾": bấm chữ mở panel tạo; ▾ có "Tạo mới" và "Import".
- Điều kiện lọc của từng tab hệ thống theo CRM-01, phần tab view.

**Cột bảng**

Cột chính: avatar, `full_name` dạng link, nút mở rộng và nút "Xem trước" (theo CRM-01).

| Cột | Hiển thị |
|---|---|
| Email | Link `mailto:` kèm biểu tượng ↗. Trống: "--" |
| Số điện thoại | Chữ thường. Trống: "--" |
| Contact owner | Avatar nhỏ và tên nhân viên. Nhân viên "Tạm nghỉ" / "Đã nghỉ" có nhãn nhỏ bên cạnh. Trống: "Chưa có owner" màu nhạt |
| Công ty chính | Ô vuông chữ cái đầu tên công ty và tên công ty dạng link. Không có Primary: "--" |
| Ngày hoạt động gần nhất | `dd/mm/yyyy HH:mm`. Trống: "--" |
| Lead status | Pill màu (`OptionPill`) |
| Ngày tạo | `dd/mm/yyyy HH:mm` |

Cột thêm được bằng nút "+": Chức danh, Lifecycle stage, Nguồn, Thành phố, Số deal, trường tự tạo.

**Hai cột không phải trường của Contacts**

| Cột | Lấy từ | Sắp xếp được | Lọc được |
|---|---|---|---|
| Công ty chính | Dòng Primary của `jn:crm_contact_companies`, API thống kê liên kết của F03-S1 với `primaryOnly=true` | Không | Không (dùng bộ lọc nâng cao theo liên kết khi có; hiện chưa có) |
| Số deal | `total` của API thống kê liên kết F03-S1, kênh `jn:crm_deal_contacts` | Không | Không |

**Bảng con khi mở rộng dòng** (theo CRM-01, phần mở rộng dòng)

| Kênh | Cột của bảng con |
|---|---|
| Companies | Tên công ty (link) và tag "Primary" nếu có · Domain · Số điện thoại · Nhãn liên kết |
| Deals | Mã Deal (link) và Tên Deal nhạt bên cạnh · Giai đoạn (pill) · Amount · Vai trò |

**Thẻ contact trên board**

- Tên dạng link (mở trang chi tiết).
- Email (biểu tượng thư), nếu có.
- Công ty chính (biểu tượng toà nhà), nếu có.
- Owner (biểu tượng người), hoặc "Chưa có owner".
- Chân thẻ: nút "Xem trước".

**Panel Tạo contact**

| # | Trường | Key | Kiểu ô | Mặc định | Ràng buộc |
|---|---|---|---|---|---|
| 1 | Email | `email` | Ô nhập email | — | Đúng định dạng email; không trùng contact khác (409) |
| 2 | Tên | `first_name` | Ô nhập | — | |
| 3 | Họ và tên đệm | `last_name` | Ô nhập | — | |
| 4 | Contact owner | `owner_id` | Chọn nhân viên có tìm | Nhân viên gắn với tài khoản đang đăng nhập; không có thì trống | Chỉ nhân viên đang làm việc |
| 5 | Chức danh | `job_title` | Ô nhập | — | |
| 6 | Số điện thoại | `phone` | Ô nhập | — | |
| 7 | Lifecycle stage | `lifecycle_stage` | Chọn | Lead | |
| 8 | Lead status | `lead_status` | Chọn | — | |
| 9 | Nguồn | `source` | Chọn | Nhập tay | |

Mục "Liên kết Contact với":

- Company: chọn một công ty có tìm. Dòng nối tạo ra là Primary. Ô nhãn liên kết chỉ hiện khi danh mục D-LABEL-CC có giá trị.
- Deal: chọn một deal có tìm, kèm ô Vai trò (danh mục D-LABEL-DC, không bắt buộc).

**Card Thông tin chính**

| Trường | Key | Sửa tại chỗ |
|---|---|---|
| Contact owner | `owner_id` | Có (chọn nhân viên đang làm việc) |
| Số điện thoại | `phone` | Có |
| Thành phố | `city` | Có |
| Lifecycle stage | `lifecycle_stage` | Có, hiển thị pill |
| Lead status | `lead_status` | Có, hiển thị pill |
| Liên hệ gần nhất | `last_contacted_at` | Không (trường tính của F03-S2; chỉ hiện khi F03-S2 đã xong). Trống: "--" |

**Mẫu ba câu của card "Tóm tắt từ dữ liệu"**

| Câu | Mẫu | Khi thiếu dữ liệu |
|---|---|---|
| 1 | "{full_name} là {job_title} tại {Công ty chính}, lifecycle stage {lifecycle_stage}, lead status {lead_status}; owner {owner}." | Bỏ từng cụm thiếu. Không có owner: "chưa có owner" |
| 2 | "Có {n} deal đang mở với tổng giá trị {tổng Amount} ({mã deal})." Phần mã deal liệt kê tối đa 3 deal có Ngày dự kiến chốt sớm nhất (deal không có ngày chốt xếp sau); còn nữa thì thêm ", và {k} deal khác" | Không có deal mở: "Chưa có deal đang mở." Có deal đã đóng thì thêm "({m} deal đã đóng)" |
| 3 | "Tương tác gần nhất: {loại} “{tiêu đề hoặc 80 ký tự đầu nội dung}” ngày {dd/mm/yyyy} bởi {người tạo}." | "Chưa có hoạt động nào được ghi nhận." |

**Thẻ trong card Companies**

- Tên công ty (link) và tag "Primary" nếu là công ty chính.
- "Domain: {domain}" kèm ↗ (mở website trong tab mới) và ⧉ (sao chép).
- "Số điện thoại: {phone}".
- Nhãn liên kết dạng tag, hoặc link "Thêm nhãn liên kết" khi dòng chưa có nhãn.

**Thẻ trong card Deals**

- Mã Deal (link) và Tên Deal chữ nhạt ngay dưới.
- "Amount: {t_ng_cash_in_d_ki_n}".
- "Ngày chốt: {ng_y_d_ki_n_ch_t}".
- "Giai đoạn:" và pill giai đoạn.
- Vai trò dạng tag, hoặc link "Thêm nhãn liên kết".

**Câu chữ trạng thái rỗng và thông báo**

| Chỗ | Câu chữ |
|---|---|
| Panel tạo, thiếu định danh | "Nhập email hoặc họ tên của contact" |
| Tạo xong | Toast "Đã tạo contact “Nguyễn Thị Hạnh”" |
| Kéo thẻ board | Toast "Lifecycle stage: Customer" |
| Sao chép email | Toast "Đã sao chép" |
| Việc sắp tới rỗng | "Không có task hay cuộc họp sắp tới." |
| Tương tác gần đây rỗng | "Chưa có hoạt động nào trên contact này." |
| Mục Sức khoẻ | "Chưa có trong giai đoạn này." |
| Card Companies rỗng | "Chưa gắn công ty nào. Thêm công ty để biết contact này làm ở đâu." |
| Thêm nhiều công ty, có lỗi | "Đã thêm {n} công ty. Không thêm được {tên}: {lỗi từ API}" |
| Card Deals rỗng | "Contact này chưa tham gia deal nào." |

## B. Dữ liệu

Cấu hình đối tượng Contacts, là giá trị cho `CrmObjectConfig` (CRM-01, phần cấu hình đối tượng). Key trường theo CRM-00, phần trường của Contacts.

| Thuộc tính | Giá trị |
|---|---|
| `collection` | `crm_contacts` |
| `label` | Contact / Contacts |
| `icon` | `person` |
| `displayField` | `full_name` |
| `avatar` | `initials` (quy tắc ở BR-02) |
| `views` | `all` "Tất cả contacts" · `mine` "Contacts của tôi" · `unassigned` "Contacts chưa có owner" |
| `searchFields` | `full_name`, `email`, `phone` |
| `quickFilters` | `owner_id` · `_createdAt` (Ngày tạo) · `last_activity_at` · `lead_status` |
| `quickFiltersMore` | `lifecycle_stage` · `source` · `city` · `job_title` · trường tự tạo (CRM-09) |
| `columns` | `email` · `phone` · `owner_id` · Công ty chính · `last_activity_at` · `lead_status` · `_createdAt` |
| `columnsMore` | `job_title` · `lifecycle_stage` · `source` · `city` · Số deal · trường tự tạo |
| `columnOrder` | `view` (người dùng sắp xếp được, theo CRM-01) |
| `defaultSort` | `_createdAt`, giảm dần |
| `expand` | `jn:crm_contact_companies` "Companies" · `jn:crm_deal_contacts` "Deals" |
| `board` | Cột theo `lifecycle_stage`; nội dung thẻ ở Phụ lục A |
| `defaultMode` | `table` |
| `createFields` | Bảng Panel Tạo contact ở Phụ lục A |
| `createAssociations` | `jn:crm_contact_companies` (Company) · `jn:crm_deal_contacts` (Deal) |
| `identity.subtitle` | Dòng phụ ở UC-4 |
| `keyProps` | "Thông tin chính": bảng ở Phụ lục A |
| `rightCards` | `jn:crm_contact_companies` · `jn:crm_deal_contacts`. Card Tệp đính kèm luôn nằm cuối, do `attachmentField` bật |
| `overviewTab` | `true` (UC-6) |
| `actions` | Theo dõi · Xem tất cả thuộc tính · Xem lịch sử thuộc tính · Xem lịch sử liên kết · Tìm trên Google · Nhân bản · Gộp · Xoá |
| `attachmentField` | `attachments` |

Ghi chú:

- `_createdAt` là trường hệ thống Ngày tạo của F03.
- `last_activity_at`, `last_contacted_at` là trường tính của F03-S2 (đợt 3), xem BR-08.
- Danh mục dùng trong spec: D-LIFECYCLE (7 giá trị Lifecycle stage), D-LEADSTATUS (8 giá trị Lead status), D-LABEL-CC (nhãn liên kết Contact – Company), D-LABEL-DC (vai trò Deal – Contact), D-STAGE (giai đoạn deal). Đặc tả ở CRM-00, phần danh mục.
- Tab đang mở và trạng thái thu gọn của các mục trong tab Tổng quan lưu theo người dùng (F03-S4, trạng thái giao diện theo người dùng).

## C. API

Contacts không có API riêng. Các màn dùng API của spec nền:

| Việc | API |
|---|---|
| Cột Công ty chính | API thống kê liên kết của F03-S1, kênh `jn:crm_contact_companies`, `primaryOnly=true` |
| Cột Số deal | `total` của API thống kê liên kết F03-S1, kênh `jn:crm_deal_contacts` |
| Card Việc sắp tới | API timeline của F03-S6 với `section=upcoming&limit=5`; số `n` là `meta.total` |
| Card Tương tác gần đây và câu 3 của Tóm tắt | API timeline của F03-S6 với `happened=true&limit=3`, để đúng tiêu chí "đã xảy ra" của F03-S2 |
| Card Tóm tắt | FE dựng từ dữ liệu bản ghi, card liên kết và API hoạt động; không cần API riêng |
| Thứ tự card Deals | FE gửi `sort=giai_o_n_pipeline:asc,ng_y_d_ki_n_ch_t:asc` cho API danh sách liên kết của F03-S1 |
| Thêm công ty | API thêm liên kết của F03-S1, một công ty mỗi lần gọi, gửi tuần tự (BR-06) |
| Sửa nhãn liên kết | API sửa nhãn liên kết của F03-S1 |
| Sự kiện Lifecycle stage, Lead status, owner | Máy chủ ghi theo F03-S3 |

Mã lỗi:

| Mã | Khi nào | Hiển thị |
|---|---|---|
| 409 | Email trùng contact khác | Dưới ô Email: email đã có ở contact khác, kèm link nếu người dùng xem được contact đó |

## D. Lệch so với sheet / prototype

Lệch so với sheet và kế hoạch:

- C-03, C-04, C-05, C-07, C-08, C-10, C-11, C-12, C-15, C-17, C-22 nằm trong sheet dưới phân hệ Contacts nhưng được đặc tả ở CRM-01.
- Không có thanh bước Lifecycle ở card Thông tin chính. Bản kế hoạch giai đoạn 2 ban đầu có thanh này; khảo sát lại HubSpot ngày 29/09 cho thấy HubSpot không có nên đã bỏ (`DOI-CHIEU-CHUC-NANG.md`, phần Contacts).
- C-18: sheet ghi "FE + BE" vì phụ thuộc F03-S6; spec này không cần API riêng.
- C-19: sheet ghi "Ngoài phạm vi". Spec chỉ giữ tiêu đề mục và một dòng chữ (BR-11).
- Lifecycle stage không tự chuyển sang "Opportunity" khi tạo deal như HubSpot (BR-05).

Lệch so với prototype:

| Trong prototype | Bản thật |
|---|---|
| Owner là tên; danh sách owner cố định 3 người | Liên kết tới NhanVien, danh sách lấy từ API |
| Mỗi contact có đúng một `company` | Nhiều công ty, một Primary |
| Tag "Primary" luôn hiện trên card Companies của contact (vì chỉ có một công ty) | Chỉ hiện ở dòng có `is_primary` |
| "Thêm nhãn liên kết" Contact – Company chỉ hiện toast | Sửa nhãn thật (API sửa nhãn liên kết của F03-S1) |
| Tóm tắt gắn nhãn "AI · demo", có ô đặt câu hỏi và nút đánh giá | Tóm tắt từ dữ liệu, không nhãn AI, không ô hỏi, không nút đánh giá |
| Mục Sức khoẻ có 3 card "AI · sắp ra mắt" | Một dòng "Chưa có trong giai đoạn này.", thu gọn mặc định |
| Deal tạo từ contact tự gán vai trò "Người quyết định" | Vai trò để trống, người dùng tự chọn |
| Board ghi sự kiện "Lifecycle stage" ở FE | Máy chủ ghi (F03-S3) |
| Key trường `firstname`, `lastname`, `jobtitle`, `lifecycle`, `leadstatus` | `first_name`, `last_name`, `job_title`, `lifecycle_stage`, `lead_status` (CRM-00) |

## E. Câu hỏi còn mở

| # | Câu hỏi | Hỏi ai |
|---|---|---|
| Q1 | Danh mục nhãn liên kết Contact – Company (D-LABEL-CC) gồm những giá trị nào? Đề xuất: Nhân viên · Người quyết định · Cựu nhân viên · Đối tác tư vấn. Khi danh mục trống, link "Thêm nhãn liên kết" ở card Companies không hiện. | Khách |
| Q2 | Giữ tiêu đề mục "Sức khoẻ" với dòng "Chưa có trong giai đoạn này" hay ẩn hẳn? | Khách |
| Q3 | Tóm tắt có cần làm lại bằng AI ở giai đoạn sau không? Nếu có, giữ chỗ cho nút "Tạo lại". | PO |
| Q4 | API danh sách liên kết của F03-S1 có nhận `sort` nhiều khoá (`giai_o_n_pipeline:asc,ng_y_d_ki_n_ch_t:asc`) không, và giá trị rỗng có nằm cuối khi sắp tăng dần không? Trường Lựa chọn đơn sắp theo thứ tự danh mục hay theo chuỗi? Nếu không, FE sắp lại 5 deal đầu ở phía trình duyệt và ghi rõ giới hạn (ảnh hưởng card Deals, BR-12). | BE |

## F. Tài liệu liên quan

- Prototype: `crm-contacts-hubspot.html` (danh sách), `crm-record-hubspot.html?type=contact&id=ct01` (trang chi tiết), `crm-list.js`, `crm-objects.js`
- Nguồn HubSpot: portal 247428660, màn Contacts, khảo sát 29/09/2026 (`DOI-CHIEU-CHUC-NANG.md`, phần Contacts)
- Plan: `00-PLAN-viet-spec.md`
- Dữ liệu: `CRM-00-mo-hinh-du-lieu-chuyen-doi.md`
- Khung: `CRM-01-khung-danh-sach-trang-chi-tiet.md`
- Màn liên quan: `CRM-03-companies.md`, `CRM-04-deals.md` (panel tạo Deal), `CRM-05` (hoạt động), `CRM-09` (trường tự tạo)
- Spec nền: `F03-S1-lien-ket-ban-ghi.md` (liên kết), `F03-S2` (trường tính), `F03-S3-nhat-ky-thay-doi-su-kien.md` (sự kiện, người theo dõi), `F03-S4` (trạng thái giao diện theo người dùng), `F03-S6` (hoạt động, cho tab Tổng quan)
